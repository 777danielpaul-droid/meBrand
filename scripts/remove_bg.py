#!/usr/bin/env python3
"""
Union mask: combine all robot pixels across all frames.

Method:
1. For each frame, create a per-frame mask (grayscale > 3 = robot)
2. Union all masks → any pixel that was EVER robot in ANY frame is robot
3. Apply the union mask to all frames

This ensures NO parts are cut off, regardless of robot movement.
"""
import sys
sys.path.insert(0, '/Users/danielpaul/Desktop/businesscard/.venv-seg/lib/python3.11/site-packages')

import numpy as np
import cv2
from pathlib import Path
import subprocess, time

PROJECT_ROOT = Path(__file__).parent.parent
INPUT_DIR = PROJECT_ROOT / "public/anim/robot-teardown"
OUTPUT_DIR = PROJECT_ROOT / "public/anim/robot-teardown-transparent"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

frames = sorted(INPUT_DIR.glob("frame_*.png"))
print(f"Found {len(frames)} frames")

# Step 1: Build union mask from ALL frames
print("\nBuilding union mask from all frames...")
union_mask = None

for i, frame in enumerate(frames):
    img = cv2.imread(str(frame))
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    _, mask = cv2.threshold(gray, 3, 255, cv2.THRESH_BINARY)
    
    if union_mask is None:
        union_mask = mask
    else:
        union_mask = cv2.bitwise_or(union_mask, mask)
    
    if (i + 1) % 50 == 0:
        print(f"  Processed {i+1}/{len(frames)}")

# Step 2: Morphological cleanup on union
kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
union_mask = cv2.morphologyEx(union_mask, cv2.MORPH_CLOSE, kernel, iterations=1)
union_mask = cv2.dilate(union_mask, kernel, iterations=3)  # conservative boundary

print(f"Union mask: {np.sum(union_mask > 127)} robot pixels ({100*np.sum(union_mask > 127)/(1920*1080):.1f}%)")

# Step 3: Apply union mask to all frames
print("\nApplying union mask to all frames...")
start = time.time()

for i, frame in enumerate(frames):
    img = cv2.imread(str(frame))
    bgra = cv2.cvtColor(img, cv2.COLOR_BGR2BGRA)
    bgra[:, :, 3] = union_mask
    output_path = OUTPUT_DIR / f"frame_{i+1:04d}.png"
    cv2.imwrite(str(output_path), bgra, [cv2.IMWRITE_PNG_COMPRESSION, 9])
    if (i + 1) % 25 == 0:
        print(f"  Processed {i+1}/{len(frames)} ({time.time()-start:.1f}s)")

print(f"\n✅ Done in {time.time()-start:.1f}s")

# Verify
print("\nVerification:")
r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "stream=pix_fmt", "-of", "default=noprint_wrappers=1", str(OUTPUT_DIR / "frame_0001.png")], capture_output=True, text=True)
print(f"  Format: {r.stdout.strip()}")

for label, x, y, exp in [("BG (0,0)", 0, 0, "transparent"), ("CENTER (959,539)", 959, 539, "opaque"), ("DARK ROBOT (400,300)", 400, 300, "opaque"), ("FLOOR/LEG AREA (500,900)", 500, 900, "opaque")]:
    r = subprocess.run(["ffmpeg", "-hide_banner", "-i", str(OUTPUT_DIR / "frame_0001.png"), "-vf", f"crop=1:1:{x}:{y}", "-frames:v", "1", "-f", "rawvideo", "-"], capture_output=True)
    d = r.stdout
    if len(d) >= 4:
        ok = (d[3] < 128 and exp == "transparent") or (d[3] > 128 and exp == "opaque")
        print(f"  {label}: alpha={d[3]:02x} → {'✓' if ok else '✗'} {exp}")
