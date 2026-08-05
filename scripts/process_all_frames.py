#!/usr/bin/env python3
"""Batch process all robot-teardown frames with Euclidean-distance background removal."""
import time, sys, subprocess
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from remove_bg import process_frame, DISTANCE_THRESHOLD

PROJECT_ROOT = Path(__file__).parent.parent
INPUT_DIR = PROJECT_ROOT / "public/anim/robot-teardown"
OUTPUT_DIR = PROJECT_ROOT / "public/anim/robot-teardown-transparent"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

frames = sorted(INPUT_DIR.glob("frame_*.png"))
print(f"Found {len(frames)} frames, threshold={DISTANCE_THRESHOLD}")
start = time.time()

for i, frame in enumerate(frames):
    output = OUTPUT_DIR / frame.name
    process_frame(frame, output)
    if (i + 1) % 25 == 0:
        elapsed = time.time() - start
        print(f"  Processed {i+1}/{len(frames)} ({elapsed:.1f}s)")

print(f"✅ Done in {time.time()-start:.1f}s")
print(f"Output frames: {len(list(OUTPUT_DIR.glob('frame_*.png')))}")

# Verify
r = subprocess.run(["ffmpeg","-hide_banner","-i",str(OUTPUT_DIR/"frame_0001.png"),"-vf","crop=1:1:0:0","-frames:v","1","-f","rawvideo","-"], capture_output=True)
d = r.stdout
r2 = subprocess.run(["ffmpeg","-hide_banner","-i",str(OUTPUT_DIR/"frame_0001.png"),"-vf","crop=1:1:959:539","-frames:v","1","-f","rawvideo","-"], capture_output=True)
d2 = r2.stdout
r3 = subprocess.run(["ffmpeg","-hide_banner","-i",str(OUTPUT_DIR/"frame_0001.png"),"-vf","crop=1:1:800:600","-frames:v","1","-f","rawvideo","-"], capture_output=True)
d3 = r3.stdout
print(f"\nVerification:")
print(f"  BG (0,0): alpha={d[3]:02x} → {'✓ TRANSPARENT' if d[3]<128 else '✗ opaque'}")
print(f"  CENTER: alpha={d2[3]:02x} → {'✓ opaque' if d2[3]>128 else '✗ transparent'}")
print(f"  DARK ROBOT: alpha={d3[3]:02x} → {'✓ opaque' if d3[3]>128 else '✗ TRANSPARENT (LOST!)'}")
