import subprocess

frame_path = "/Users/danielpaul/Desktop/businesscard/public/anim/robot-teardown/frame_0001.png"

# Count transparent vs opaque pixels
r = subprocess.run([
    "ffmpeg", "-hide_banner", "-i", frame_path,
    "-vf", "format=rgba",
    "-frames:v", "1", "-f", "rawvideo", "-"
], capture_output=True)

d = r.stdout
total_pixels = 1920 * 1080
opaque = sum(1 for i in range(3, len(d), 4) if d[i] > 128)
transparent = total_pixels - opaque

print(f"Frame 0001:")
print(f"  Total pixels: {total_pixels}")
print(f"  Opaque (robot): {opaque} ({100*opaque/total_pixels:.1f}%)")
print(f"  Transparent (bg): {transparent} ({100*transparent/total_pixels:.1f}%)")

# Check robot coverage - sample the center region (the robot should be there)
center_opaque = 0
for x in range(700, 1200):
    for y in range(300, 800):
        idx = (y * 1920 + x) * 4 + 3  # alpha
        if d[idx] > 128:
            center_opaque += 1

center_total = 500 * 500
print(f"  Center region (700-1200, 300-800): {center_opaque}/{center_total} opaque ({100*center_opaque/center_total:.1f}%)")
