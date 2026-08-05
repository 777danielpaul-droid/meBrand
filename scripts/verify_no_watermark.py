import subprocess

# Check ALL new frames for watermark in top-left 300x100 region
frames_dir = "public/anim/robot-teardown"
import glob
frames = sorted(glob.glob(f"{frames_dir}/frame_*.png"))

# Check first frame, middle frame, last frame
test_indices = [0, 75, 149]
for idx in test_indices:
    frame = frames[idx]
    r = subprocess.run([
        "ffmpeg", "-hide_banner", "-i", frame,
        "-vf", "crop=300:100:0:0", "-frames:v", "1", "-f", "rawvideo", "-"
    ], capture_output=True)
    d = r.stdout
    if not d:
        print(f"Frame {idx+1}: no data")
        continue
    bright = sum(1 for i in range(0, len(d)-2, 3) if d[i] > 150 and d[i+1] > 150 and d[i+2] > 150)
    non_black = sum(1 for i in range(0, len(d)-2, 3) if d[i] > 10 or d[i+1] > 10 or d[i+2] > 10)
    pct = 100 * bright / (300*100)
    print(f"Frame {idx+1} ({frame.split('/')[-1]}): {bright} bright pixels ({pct:.1f}%), {non_black} non-black")

# Check watermark region (44-288, 43-96) more precisely
print("\n=== Checking watermark region (x=44-288, y=43-96) in Frame 1 ===")
r = subprocess.run([
    "ffmpeg", "-hide_banner", "-i", frames[0],
    "-vf", "crop=245:54:44:43", "-frames:v", "1", "-f", "rawvideo", "-"
], capture_output=True)
d = r.stdout
if d:
    bright = sum(1 for i in range(0, len(d)-2, 3) if d[i] > 150 and d[i+1] > 150 and d[i+2] > 150)
    non_black = sum(1 for i in range(0, len(d)-2, 3) if d[i] > 10 or d[i+1] > 10 or d[i+2] > 10)
    print(f"Watermark region: {bright} bright pixels, {non_black} non-black pixels")
    if bright == 0 and non_black < 50:
        print("✅ WATERMARK REMOVED - region is clean/empty")
    else:
        print(f"⚠️ Still has {bright} bright pixels - may need adjustment")
