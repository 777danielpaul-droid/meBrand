#!/usr/bin/env python3
"""Analyze luminance distribution to find correct threshold."""
import subprocess, glob, os

frames = sorted(glob.glob("public/anim/robot-teardown/frame_*.png"))
sample_frames = [frames[0], frames[frames.index(next(f for f in frames if 'frame_0075' in f))], frames[-1]]

for frame in sample_frames:
    # Extract raw RGB data
    r = subprocess.run([
        "ffmpeg", "-hide_banner", "-i", frame,
        "-vf", "crop=400:200:0:0",  # Top-left (background) region
        "-frames:v", "1", "-f", "rawvideo", "-"
    ], capture_output=True)
    bg_data = r.stdout
    
    r2 = subprocess.run([
        "ffmpeg", "-hide_banner", "-i", frame,
        "-vf", "crop=400:200:760:340",  # Center (robot) region
        "-frames:v", "1", "-f", "rawvideo", "-"
    ], capture_output=True)
    center_data = r2.stdout
    
    # Compute luminance stats for background
    bg_lums = []
    for i in range(0, len(bg_data)-2, 3):
        r_v, g_v, b_v = bg_data[i], bg_data[i+1], bg_data[i+2]
        lum = 0.299 * r_v + 0.587 * g_v + 0.114 * b_v
        bg_lums.append(lum)
    
    # Compute luminance stats for center
    center_lums = []
    for i in range(0, len(center_data)-2, 3):
        r_v, g_v, b_v = center_data[i], center_data[i+1], center_data[i+2]
        lum = 0.299 * r_v + 0.587 * g_v + 0.114 * b_v
        center_lums.append(lum)
    
    bg_lums.sort()
    center_lums.sort()
    
    print(f"\n{frame.split('/')[-1]}:")
    print(f"  BG  top-left  (400x200): min={min(bg_lums):.0f} p25={bg_lums[len(bg_lums)//4]:.0f} median={bg_lums[len(bg_lums)//2]:.0f} p75={bg_lums[3*len(bg_lums)//4]:.0f} max={max(bg_lums):.0f}")
    print(f"  CENTER(760,340): min={min(center_lums):.0f} p25={center_lums[len(center_lums)//4]:.0f} median={center_lums[len(center_lums)//2]:.0f} p75={center_lums[3*len(center_lums)//4]:.0f} max={max(center_lums):.0f}")
    
    # Count pixels below various thresholds in BG
    for t in [5, 10, 15, 25, 30, 50]:
        bg_below = sum(1 for l in bg_lums if l <= t)
        center_below = sum(1 for l in center_lums if l <= t)
        bg_pct = 100 * bg_below / len(bg_lums)
        center_pct = 100 * center_below / len(center_lums)
        print(f"  Threshold {t}: BG {bg_pct:.1f}% below, CENTER {center_pct:.1f}% below")
