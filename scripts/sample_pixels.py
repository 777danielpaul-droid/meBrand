#!/usr/bin/env python3
"""Sample center-pixel color of key frames to find background vs shuttle."""
import subprocess, os

VIDEO = "/Users/danielpaul/Downloads/11111111.mp4"
os.makedirs("/tmp/shuttle_work", exist_ok=True)

for t in [0, 3, 54, 106]:
    frame = f"/tmp/shuttle_work/t{t}.png"
    subprocess.run(
        ['ffmpeg', '-y', '-ss', f'{t/24:.2f}', '-i', VIDEO, '-frames:v', '1', frame],
        capture_output=True
    )
    # sample center pixel + 4 corners
    r = subprocess.run(
        ['ffmpeg', '-i', frame, '-vf', 'crop=5:5:1270:715,format=rgb24', '-frames:v', '1', '-f', 'rawvideo', '-'],
        capture_output=True
    )
    px = r.stdout.hex()[:12] if r.stdout else 'empty'
    print(f"t={t} ({t/24:.2f}s): center_px={px}  size={os.path.getsize(frame):,}B")
