#!/usr/bin/env python3
"""
FINAL: Space Shuttle Isolation — Crop + Alpha pro Frame.

VERIFIED (Test 4):
[0:v]crop=W:H:X:Y,format=yuva420p[c];
[1:v]crop=W:H:X:Y,format=gray[m];
[c][m]alphamerge
-> rc=0, rgba, top-left=transparent

PNG-Sequenz -> ffv1.mov (yuva420p, Alpha)
"""
import subprocess, os, sys, json, time

VIDEO = "/Users/danielpaul/Downloads/11111111.mp4"
OUTPUT = "/Users/danielpaul/Downloads/shuttle_isolated_tracked.mov"
WORKDIR = "/tmp/shuttle_final3"
SRC_FRAMES = f"{WORKDIR}/src"
MASKS = f"{WORKDIR}/masks"
OUT_FRAMES = f"{WORKDIR}/out"

for d in [WORKDIR, SRC_FRAMES, MASKS, OUT_FRAMES]:
    os.makedirs(d, exist_ok=True)

# 1. Frames extrahieren
print("=== Schritt 1: 107 Frames extrahieren ===")
subprocess.run(
    ['ffmpeg', '-y', '-i', VIDEO, '-vsync', 'vfr', f'{SRC_FRAMES}/frame_%04d.png'],
    capture_output=True, timeout=30
)
frames = sorted([f for f in os.listdir(SRC_FRAMES) if f.endswith('.png')])
print(f"  {len(frames)} Frames")

CROP_W, CROP_H, CROP_X, CROP_Y = 2020, 1025, 495, 350
MASK_T = 8  # Y-Schwellwert fuer Alpha-Maske

FC = f'crop={CROP_W}:{CROP_H}:{CROP_X}:{CROP_Y}'
FILTER = f"[0:v]{FC},format=yuva420p[c];[1:v]{FC},format=gray[m];[c][m]alphamerge[out]"

t0 = time.time()
print(f"\n=== Schritt 2: alphamerge+crpro Frame ({len(frames)} Frames) ===")
for i, fname in enumerate(frames):
    src = f"{SRC_FRAMES}/{fname}"
    mask = f"{MASKS}/mask_{fname}"
    out = f"{OUT_FRAMES}/{fname}"

    # A: B&W-Maske generieren
    subprocess.run(
        ['ffmpeg', '-y', '-i', src,
         '-vf', f'format=gray,lutyuv=y=floor(val/{MASK_T})*255',
         '-compression_level', '10',
         mask],
        capture_output=True, timeout=5
    )

    # B: Crop beide Inputs + alphamerge (VERIFIED Test 4)
    subprocess.run(
        ['ffmpeg', '-y', '-i', src, '-i', mask,
         '-filter_complex', FILTER,
         '-map', '[out]',
         '-frames:v', '1',
         '-compression_level', '10',
         out],
        capture_output=True, timeout=5
    )

    if (i+1) % 20 == 0 or i == 0 or i == len(frames)-1:
        elapsed = time.time() - t0
        eta = elapsed / (i+1) * (len(frames) - i - 1)
        print(f"  {i+1}/{len(frames)} ({elapsed:.1f}s, ~{eta:.0f}s übrig)")

# 3. PNG-Sequenz -> ffv1.mov
print(f"\n=== Schritt 3: PNG-Sequenz -> ffv1.mov (Alpha) ===")
r = subprocess.run(
    ['ffmpeg', '-y', '-framerate', '24', '-start_number', '1',
     f'-i', f'{OUT_FRAMES}/frame_%04d.png',
     '-c:v', 'ffv1', '-level', '3', '-pix_fmt', 'yuva420p',
     OUTPUT],
    capture_output=True, text=True, timeout=120
)
if r.returncode != 0:
    print(f"FAIL: {r.stderr[-300:]}")
    sys.exit(1)
print(f"✓ Output: {OUTPUT} ({os.path.getsize(OUTPUT):,} Bytes)")

# 4. Verifikation
print("\n=== VERIFIKATION (3 Frames x 2 Positionen) ===")
for frm_idx in [0, 53, 106]:
    subprocess.run(
        ['ffmpeg', '-y', '-i', OUTPUT,
         '-vf', f'select=eq(n\\,{frm_idx})', '-vsync', 'vfr',
         f'/tmp/verify_v{frm_idx}.png'],
        capture_output=True
    )
    path = f"/tmp/verify_v{frm_idx}.png"
    if os.path.exists(path):
        for name, coords in [("bg", "5:5"), ("shuttle", "1000:510")]:
            x, y = coords.split(':')
            r2 = subprocess.run(
                ['ffmpeg', '-i', path, '-vf', f'crop=5:5:{x}:{y},format=rgba',
                 '-frames:v', '1', '-f', 'rawvideo', '-'],
                capture_output=True
            )
            if r2.stdout and len(r2.stdout) >= 4:
                a = r2.stdout[3]
                status = "transparent" if a < 128 else "OPAQUE"
                print(f"  Frame {frm_idx} [{name}]: alpha={a:02x} -> {status}")
