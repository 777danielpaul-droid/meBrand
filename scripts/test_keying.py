#!/usr/bin/env python3
"""Remove black background using color-distance thresholding (not luminance).

Background is RGB(0,2,0) — nearly pure black.
We key only pixels where ALL RGB channels <= threshold.
This preserves dark robot parts (RGB 20+,20+,20+) even if they're dark.

Since ffmpeg's lutrgb/alphamerge uses luminance, we use a different approach:
Use ffmpeg's 'geq' filter which can access individual channels via p(X,Y).

In geq named mode (RGBA):
- r expr uses p(X,Y) for R channel (plane 0)
- g expr uses p(X,Y) for G channel (plane 1)
- b expr uses p(X,Y) for B channel (plane 2)
- a expr uses p(X,Y) for A channel (plane 3)

Wait — p(X,Y) always reads from the CURRENT plane in the expression context.
So in 'r' expr, p(X,Y) = R value. In 'g' expr, p(X,Y) = G value.

To check if ALL channels are dark in alpha: use geq with
a='if(and(le(p(X,Y),3),le(p(X,Y),3),le(p(X,Y),3)),0,255)'
But p(X,Y) in 'a' context reads the A channel (which is 255).

SOLUTION: Use 'geq' in YUVA mode where 'y' = luminance.
Or: use separate lutrgb passes for each channel.

Actually the REAL solution: use 'format=yuva420p' + 'lut' with c0/c1/c2/c3
where c3 (alpha) = expression using c0, c1, c2.

From the lut docs, 'c3' can reference other planes via... no, lut doesn't
support cross-plane expressions.

FINAL APPROACH: Use 'geq' with 'interp' = nearest to avoid p(X,Y) issues.
In geq, 'p(X,Y)' reads current plane value. We need to check RGB in alpha channel.
Use: a='if(le(p(X,Y),3),0,255)' — but p() in alpha reads alpha (255).

WORKING SOLUTION: Use 'split' + 'lutrgb' per channel + 'blend'
1. Split into R, G, B
2. Each R/G/B → lutrgb threshold → binary (0 or 255)
3. Multiply binary masks → dark mask (all 3 dark = 1)
4. Invert → alpha mask (dark bg = 0, everything else = 255)
5. alphamerge with original

OR: Use a simpler approach — lutrgb with 'val' for EACH channel,
then use 'blend=all_mode=multiply' to combine.

Actually simplest: use 'lutrgb' on each channel separately to create 3 binary images,
then multiply them (all channels dark = background).

Let me try the blend/multiply approach.
"""
import subprocess, os, sys, glob, time

INPUT_DIR = "public/anim/robot-teardown"
OUTPUT_DIR = "public/anim/robot-teardown-transparent"
THRESHOLD = 3  # RGB channels <= this = background

os.makedirs(OUTPUT_DIR, exist_ok=True)
frames = sorted(glob.glob(os.path.join(INPUT_DIR, "frame_*.png")))
print(f"Found {len(frames)} frames")

test_frame = frames[0]
test_output = "/tmp/test_colordist.png"

# Create a mask: if R<=3 AND G<=3 AND B<=3 → 0 (transparent bg)
# Approach: 
# 1. Split into R, G, B streams
# 2. Each → lutrgb to threshold: R<=3 → 0, else 255
# 3. Multiply all 3 → 0 if ALL channels dark, 255 if ANY channel bright
# 4. Invert mask and use as alpha

# Actually, the simplest ffmpeg approach:
# Use 'geq' which DOES support reading all planes via p(X,Y) in each channel expr.
# In named mode geq:
# r='p(X,Y)' → R value (reads from current plane which is R in 'r' context)
# g='p(X,Y)' → G value
# b='p(X,Y)' → B value
# a='...' → alpha, but we can't reference R/G/B values here

# BUT: in geq, we have the constant 'lum(X,Y)' which is the luminance.
# And we can use the expression for 'a' to check luminance.
# The issue: lum(X,Y) = 0.299R + 0.587G + 0.114B
# Background RGB(0,2,0) → lum ≈ 2.28
# Dark robot RGB(20,20,20) → lum ≈ 20
# So lum < 10 should catch only bg, not robot!

# Wait — but luminance analysis said min=0 for center region.
# Those are pure black pixels INSIDE the robot (shadows, eyes, etc.)
# Those SHOULD be transparent too — they're effectively background.

# So a luminance threshold of 8-10 should work:
# - BG pixels: lum ~0-3 → transparent
# - Dark robot parts: lum ~20+ → opaque
# - Black shadows on robot: lum 0 → transparent (OK, they blend into bg)

# Let me test with threshold=8
cmd = [
    "ffmpeg", "-y", "-hide_banner", "-loglevel", "error",
    "-i", test_frame,
    "-vf", f"format=rgba,split=2[rgb][gray];"
    f"[gray]format=gray,lutrgb=r='if(gt(val,{THRESHOLD}),255,0)':g='if(gt(val,{THRESHOLD}),255,0)':b='if(gt(val,{THRESHOLD}),255,0)',format=rgba[alpha];"
    f"[rgb][alpha]alphamerge",
    "-pix_fmt", "rgba",
    "-compression_level", "9",
    test_output
]

result = subprocess.run(cmd, capture_output=True, text=True)
if result.returncode != 0:
    print("ERROR:", result.stderr[-300:])
    sys.exit(1)

# Check many pixels
print("Testing threshold =", THRESHOLD)
checks = [(0, 0, "BG corner"), (959, 539, "CENTER"), (800, 600, "DARK ROBOT"), (400, 300, "ROBOT ARM"), (100, 100, "TOP AREA")]
for x, y, label in checks:
    r = subprocess.run(["ffmpeg", "-hide_banner", "-i", test_output, "-vf", f"crop=1:1:{x}:{y}", "-frames:v", "1", "-f", "rawvideo", "-"], capture_output=True)
    d = r.stdout
    if len(d) >= 4:
        print(f"  {label} ({x},{y}): RGBA={d[0]:02x}{d[1]:02x}{d[2]:02x}{d[3]:02x} → {'opaque' if d[3] > 128 else 'TRANSPARENT'}")
    else:
        print(f"  {label}: no data")
