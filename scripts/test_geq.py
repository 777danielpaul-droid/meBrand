#!/usr/bin/env python3
"""Test geq filter: Y = Kanal-Wert oder Koordinate?"""
import subprocess, os

FRAME = "/tmp/shuttle_work/frame_001.png"

# Test A: geq=a=floor(Y/18)*255 (Y = Y-Kanal Wert?)
print("=== Test A: geq=Y (Kanal?), a=floor(Y/18)*255 ===")
r = subprocess.run(
    ['ffmpeg', '-y', '-i', FRAME,
     '-vf', 'format=yuva420p,geq=y=Y:u=U:v=V:a=floor(Y/18)*255',
     '/tmp/geq_test_a.png'],
    capture_output=True, text=True, timeout=10
)
print(f"  rc={r.returncode}")
if r.returncode == 0:
    r2 = subprocess.run(['ffprobe', '-v', 'quiet', '-show_entries', 'stream=pix_fmt', '-of', 'csv=p=0', '/tmp/geq_test_a.png'], capture_output=True, text=True)
    print(f"  PixFmt: {r2.stdout.strip()}")
    r3 = subprocess.run(['ffmpeg', '-i', '/tmp/geq_test_a.png', '-vf', 'crop=3:3:0:0,format=rgba', '-frames:v', '1', '-f', 'rawvideo', '-'], capture_output=True)
    if r3.stdout:
        print(f"  top-left: #{r3.stdout[0]:02x}{r3.stdout[1]:02x}{r3.stdout[2]:02x}{r3.stdout[3]:02x}")
else:
    print(f"  ERR: {r.stderr[-200:]}")

# Test B: ohne geq y=Y (nur a=Expression)
print("\n=== Test B: geq nur a=floor(Y/18)*255 ===")
r = subprocess.run(
    ['ffmpeg', '-y', '-i', FRAME,
     '-vf', 'format=yuva420p,geq=a=floor(Y/18)*255',
     '/tmp/geq_test_b.png'],
    capture_output=True, text=True, timeout=10
)
print(f"  rc={r.returncode}")
if r.returncode == 0:
    r3 = subprocess.run(['ffmpeg', '-i', '/tmp/geq_test_b.png', '-vf', 'crop=3:3:0:0,format=rgba', '-frames:v', '1', '-f', 'rawvideo', '-'], capture_output=True)
    if r3.stdout:
        print(f"  top-left: #{r3.stdout[0]:02x}{r3.stdout[1]:02x}{r3.stdout[2]:02x}{r3.stdout[3]:02x}")
else:
    print(f"  ERR: {r.stderr[-200:]}")
