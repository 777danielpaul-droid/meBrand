#!/usr/bin/env python3
"""Test verschiedene lut-Filter-Varianten."""
import subprocess, os

FRAME = "/tmp/shuttle_work/frame_001.png"

tests = [
    ("a=200 (konstant)", "format=yuva420p,lut=yuva420p:a=200"),
    ("y=floor(val/18)*255 (B&W-Maske in Y)", "format=yuva420p,luyv=y=floor(val/18)*255"),
    ("y=floor(val/18)*255 (lutyuv)", "format=yuva420p,lutyuv=y=floor(val/18)*255"),
    ("alphaextract (Y->A)", "format=yuva420p,alphaextract"),
    ("lutall:a=lt(val\,5)*0+255", "format=yuva420p,lut=yuva420p:a=lt(val\,5)*0+255"),
]

for name, vf in tests:
    out = f"/tmp/test_{name.split()[0]}.png"
    r = subprocess.run(
        ['ffmpeg', '-y', '-i', FRAME, '-vf', vf, out],
        capture_output=True, text=True, timeout=10
    )
    exists = os.path.exists(out)
    size = os.path.getsize(out) if exists else 0
    err = r.stderr[-120:] if r.returncode != 0 else "OK"
    print(f"[{'OK' if r.returncode==0 and exists else 'FAIL'}] {name}: {size:,}B | {err}")

# Check alpha der B&W-Maske (y=floor(val/18)*255)
print("\n=== Check: y-B&W-Maske alpha ===")
# Falls das y=y=floor File existiert, sample es
for test_name in ["a=200", "alphaextract"]:
    path = f"/tmp/test_{test_name.replace(' ', '_')[0]}.png"
    if os.path.exists(path):
        for name, crop in [("top-left", "crop=3:3:0:0"), ("center", "crop=3:3:1278:718")]:
            r = subprocess.run(
                ['ffmpeg', '-i', path, '-vf', f'{crop},format=rgba', '-frames:v', '1', '-f', 'rawvideo', '-'],
                capture_output=True
            )
            if r.stdout and len(r.stdout) >= 4:
                print(f"  {test_name} {name}: #{r.stdout[0]:02x}{r.stdout[1]:02x}{r.stdout[2]:02x}{r.stdout[3]:02x}")
