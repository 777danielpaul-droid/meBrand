import subprocess

r = subprocess.run([
    "ffmpeg", "-hide_banner", "-i",
    "/tmp/wm_check.png",
    "-vf", "crop=1:1:0:0", "-frames:v", "1", "-f", "rawvideo", "-"
], capture_output=True)
d = r.stdout
print(f"Size: {len(d)} bytes")
print(f"Pixel (0,0): RGBA={d[0]:02x}{d[1]:02x}{d[2]:02x}{d[3]:02x}")

# Check all pixels
if len(d) >= 4:
    # Sample several pixels
    for x in [0, 10, 50, 100, 200]:
        r2 = subprocess.run([
            "ffmpeg", "-hide_banner", "-i",
            "/tmp/wm_check.png",
            "-vf", f"crop=1:1:{x}:0", "-frames:v", "1", "-f", "rawvideo", "-"
        ], capture_output=True)
        d2 = r2.stdout
        if len(d2) >= 4:
            print(f"  ({x},0): RGBA={d2[0]:02x}{d2[1]:02x}{d2[2]:02x}{d2[3]:02x}")
