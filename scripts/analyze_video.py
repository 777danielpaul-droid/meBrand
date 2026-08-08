#!/usr/bin/env python3
"""Video-Analyse: extrahiert Metadaten und sampled Pixel-Farben."""
import json, subprocess, os

VIDEO = "/Users/danielpaul/Downloads/11111111.mp4"

# 1. Video-Info via ffprobe
result = subprocess.run(
    ["ffprobe", "-v", "quiet", "-print_format", "json", "-show_streams", "-show_format", VIDEO],
    capture_output=True, text=True, check=True
)
info = json.loads(result.stdout)
s = info["streams"][0]
f = info.get("format", {})
print(f"=== Video-Info ===")
print(f"Auflösung: {s['width']}x{s['height']}")
print(f"Codec: {s['codec_name']}")
fps = eval(s['r_frame_rate']) if s.get('r_frame_rate') != '0/1' else '?'
print(f"FPS: {fps}")
print(f"Frames: {s.get('nb_frames', '?')}")
print(f"Dauer: {f.get('duration', '?')}s")

# 2. Frame extrahieren (Frame 15)
os.makedirs("/tmp/shuttle_work", exist_ok=True)
subprocess.run(
    ["ffmpeg", "-y", "-i", VIDEO, "-vf", "select=eq(n\\,15)", "-vsync", "vfr",
     "/tmp/shuttle_work/sample.png"],
    capture_output=True
)

# 3. Pixel-Farben analysieren via ffmpeg signalstats
result = subprocess.run(
    ["ffmpeg", "-i", "/tmp/shuttle_work/sample.png", "-vf", "signalstats", "-f", "null", "-"],
    capture_output=True, text=True
)
for line in result.stderr.split("\n"):
    if "YAVG" in line or "YDIF" in line or "UDIFF" in line or "VDIFF" in line:
        print(f"signalstats: {line.strip()}")
