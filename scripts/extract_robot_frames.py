#!/usr/bin/env python3
"""Extract frames from a source video for the RobotTeardown scroll animation."""
import subprocess, sys, os

src = sys.argv[1] if len(sys.argv) > 1 else "t1armor.mp4"
out_dir = sys.argv[2] if len(sys.argv) > 2 else "./frames"
num_frames = int(sys.argv[3]) if len(sys.argv) > 3 else 150

os.makedirs(out_dir, exist_ok=True)

# Get video duration
result = subprocess.run(
    ["ffprobe", "-v", "error", "-show_entries", "format=duration",
     "-of", "default=noprint_wrappers=1:nokey=1", src],
    capture_output=True, text=True
)
duration = float(result.stdout.strip())
print(f"Source: {src}, Duration: {duration:.2f}s")

# Evenly sample frames across the video duration
for i in range(num_frames):
    t = (i / (num_frames - 1)) * duration if num_frames > 1 else 0
    frame_name = f"frame_{i+1:04d}.png"
    frame_path = os.path.join(out_dir, frame_name)
    
    cmd = [
        "ffmpeg", "-y", "-ss", str(t), "-i", src,
        "-frames:v", "1", "-q:v", "2", frame_path
    ]
    subprocess.run(cmd, capture_output=True)
    
    if i % 30 == 0:
        print(f"  Extracted frame {i+1}/{num_frames} at t={t:.2f}s")

print(f"Done! {num_frames} frames in {out_dir}")
