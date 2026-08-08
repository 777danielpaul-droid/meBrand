#!/usr/bin/env python3
"""Farbhistogramm-Analyse: finde Farbschwerpunkte im Frame."""
import subprocess, os

frame = "/tmp/shuttle_work/t54.png"

# Farbhistogramm via ffmpeg
r = subprocess.run(
    ['ffmpeg', '-i', frame, '-vf', 'histogram', '-frames:v', '1', '-f', 'rawvideo', '-'],
    capture_output=True
)
print(f"Frame size: {os.path.getsize(frame):,}B")

# Sample 9x9 grid of center area
result = subprocess.run(
    ['ffmpeg', '-i', frame, '-vf',
     'crop=90:90:1230:675,format=rgb24,scale=9:9',  # zoom in center, downscale to 9x9
     '-frames:v', '1', '-f', 'rawvideo', '-'],
    capture_output=True
)
if result.stdout:
    data = result.stdout
    print("=== 9x9 center-grid pixel colors (row by row) ===")
    for row in range(9):
        row_hex = []
        for col in range(9):
            off = (row * 9 + col) * 3
            r_val = data[off]
            g_val = data[off+1]
            b_val = data[off+2]
            row_hex.append(f"#{r_val:02x}{g_val:02x}{b_val:02x}")
        print("  " + " ".join(row_hex))

# Also sample corners (background)
for name, crop in [("top-left", "crop=10:10:10:10"),
                   ("top-right", "crop=10:10:2540:10"),
                   ("bottom-left", "crop=10:10:10:1420"),
                   ("bottom-right", "crop=10:10:2540:1420")]:
    r = subprocess.run(
        ['ffmpeg', '-i', frame, '-vf', f'{crop},format=rgb24', '-frames:v', '1', '-f', 'rawvideo', '-'],
        capture_output=True
    )
    if r.stdout and len(r.stdout) >= 3:
        px = f"#{r.stdout[0]:02x}{r.stdout[1]:02x}{r.stdout[2]:02x}"
        print(f"{name} corner: {px}")
