#!/usr/bin/env python3
"""
Generate a single static alpha mask of the robot from frame_0050 (best visibility).
The robot has multiple parts (assembly pieces) on a near-black background.
Background: Y=0-2. Robot: Y=3-255. Watermark: bright text in top-left (x=44-288, y=43-96).

Strategy:
1. Use Y > 8 threshold for clean bright robot parts
2. Find connected components, keep large ones (> 500px)
3. Dilate to reach dark robot parts (Y=3-7, up to 50px from bright parts)
4. Intersect with Y > 2 to exclude pure background
5. Exclude watermark region (top-left: x<350, y<150)
6. Remove small noise
7. Final cleanup
"""
import sys
sys.path.insert(0, '/Users/danielpaul/Desktop/businesscard/.venv-seg/lib/python3.11/site-packages')

import numpy as np
import cv2
from pathlib import Path

PROJECT_ROOT = Path('/Users/danielpaul/Desktop/businesscard')
INPUT_DIR = PROJECT_ROOT / "public/anim/robot-teardown"
OUTPUT_DIR = PROJECT_ROOT / "public/anim/robot-teardown-transparent"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Load the best reference frame
ref_frame = INPUT_DIR / "frame_0050.png"
img = cv2.imread(str(ref_frame))
print(f"Loaded {ref_frame}, shape: {img.shape}")

# Convert to grayscale
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

# Step 1: Create mask with Y > 8 threshold (clean bright robot parts)
THRESHOLD_BASE = 8
_, mask_base = cv2.threshold(gray, THRESHOLD_BASE, 255, cv2.THRESH_BINARY)
print(f"Base mask (Y>{THRESHOLD_BASE}): {np.sum(mask_base > 127)} pixels ({100*np.sum(mask_base > 127)/(1920*1080):.1f}%)")

# Step 2: Exclude watermark region in top-left
# Watermark is at approximately x=44-288, y=43-96
# Exclude x<350, y<150 to be safe
watermark_mask = np.zeros((1080, 1920), dtype=np.uint8)
watermark_mask[0:150, 0:350] = 255
mask_base = cv2.bitwise_and(mask_base, cv2.bitwise_not(watermark_mask))
print(f"After watermark exclusion: {np.sum(mask_base > 127)} pixels ({100*np.sum(mask_base > 127)/(1920*1080):.1f}%)")

# Step 3: Find connected components, keep large ones
num_labels, labels, stats, centroids = cv2.connectedComponentsWithStats(mask_base, connectivity=8)

robot_mask = np.zeros_like(mask_base)
total_kept = 0
for label_id in range(1, num_labels):
    area = stats[label_id, cv2.CC_STAT_AREA]
    if area > 500:
        robot_mask[labels == label_id] = 255
        total_kept += area

print(f"Components > 500px: {len([s for s in stats[1:] if s[cv2.CC_STAT_AREA] > 500])}, kept {total_kept} pixels ({100*total_kept/(1920*1080):.1f}%)")

# Step 4: Dilate to reach dark robot parts (Y=3-7)
# Dark robot parts can be up to 50px from bright parts
kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
dilated = cv2.dilate(robot_mask, kernel, iterations=25)
print(f"After dilation: {np.sum(dilated > 127)} pixels ({100*np.sum(dilated > 127)/(1920*1080):.1f}%)")

# Step 5: Intersect with Y > 2 to exclude pure background (Y=0-1)
bg_mask = (gray > 2).astype(np.uint8) * 255
robot_mask = cv2.bitwise_and(dilated, bg_mask)
print(f"After Y>2 intersection: {np.sum(robot_mask > 127)} pixels ({100*np.sum(robot_mask > 127)/(1920*1080):.1f}%)")

# Step 6: Re-exclude watermark (dilation may have brought it back)
robot_mask = cv2.bitwise_and(robot_mask, cv2.bitwise_not(watermark_mask))
print(f"After re-excluding watermark: {np.sum(robot_mask > 127)} pixels ({100*np.sum(robot_mask > 127)/(1920*1080):.1f}%)")

# Step 7: Remove small noise
num_labels2, labels2, stats2, _ = cv2.connectedComponentsWithStats(robot_mask, connectivity=8)
robot_mask2 = np.zeros_like(robot_mask)
for label_id in range(1, num_labels2):
    area = stats2[label_id, cv2.CC_STAT_AREA]
    if area > 1000:
        robot_mask2[labels2 == label_id] = 255

robot_mask = robot_mask2
robot_pixels = np.sum(robot_mask > 127)
print(f"Final mask: {robot_pixels} pixels ({100*robot_pixels/(1920*1080):.1f}%)")

# Step 8: Save the mask
mask_path = str(PROJECT_ROOT / "scripts/robot_mask_static.png")
cv2.imwrite(mask_path, robot_mask, [cv2.IMWRITE_PNG_COMPRESSION, 9])
print(f"Static mask saved to {mask_path}")

# Save preview
mask_color = cv2.cvtColor(robot_mask, cv2.COLOR_GRAY2BGR)
overlay = cv2.addWeighted(img, 0.7, mask_color, 0.3, 0)
cv2.imwrite(str(PROJECT_ROOT / "scripts/robot_mask_overlay.png"), overlay, [cv2.IMWRITE_PNG_COMPRESSION, 9])
print(f"Mask overlay saved")

# Verify key points
test_points = [
    (0, 0, "BG TL", False),
    (1919, 0, "BG TR", False),
    (0, 1079, "BG BL", False),
    (1919, 1079, "BG BR", False),
    (960, 540, "Robot center", True),
    (600, 600, "Robot body", True),
    (1200, 1000, "Robot leg (dark)", True),
    (300, 400, "BG (not robot)", False),
    (1700, 600, "Robot right edge", True),
]
print("\nVerification:")
all_ok = True
for x, y, label, should_be_robot in test_points:
    val = robot_mask[y, x]
    is_robot = val > 127
    ok = (is_robot == should_be_robot)
    if not ok:
        all_ok = False
    print(f"  {label} ({x},{y}): mask={val} -> {'OK' if ok else 'MISMATCH'}")

print(f"\nAll checks passed: {all_ok}")
