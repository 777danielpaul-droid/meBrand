import subprocess

# Check top-left 400x120 for ANY bright-ish pixels (gray or white)
# that form the "Pippit AI" watermark
r = subprocess.run([
    "ffmpeg", "-hide_banner", "-i", "/tmp/frame_50.png",
    "-vf", "crop=400:120:0:0", "-frames:v", "1", "-f", "rawvideo", "-"
], capture_output=True)
d = r.stdout
w, h = 400, 120

# Find all bright-ish pixels (R,G,B all > 100)
bright_regions = []
for y in range(h):
    row_brights = []
    for x in range(w):
        i = (y * w + x) * 3
        if i + 2 < len(d):
            r_val, g_val, b_val = d[i], d[i+1], d[i+2]
            # Bright pixel = all channels > 100 and similar (white/gray)
            if r_val > 100 and g_val > 100 and b_val > 100 and abs(r_val - g_val) < 30 and abs(g_val - b_val) < 30:
                row_brights.append(x)
    if len(row_brights) > 5:
        bright_regions.append((y, min(row_brights), max(row_brights), len(row_brights)))

if bright_regions:
    min_y = min(r[0] for r in bright_regions)
    max_y = max(r[0] for r in bright_regions)
    min_x = min(r[1] for r in bright_regions)
    max_x = max(r[2] for r in bright_regions)
    print(f"Watermark found at approximately: x={min_x}-{max_x}, y={min_y}-{max_y}")
    print(f"Size: {max_x - min_x + 1} x {max_y - min_y + 1}")
    print(f"\nDetailed rows:")
    for y, xm, xM, count in bright_regions[:20]:
        print(f"  y={y}: x={xm}-{xM} ({count} pixels)")
else:
    print("No bright regions found in top-left 400x120")
