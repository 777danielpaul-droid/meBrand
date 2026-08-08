#!/usr/bin/env python3
"""Check libvpx-vp9 Alpha-Support in this ffmpeg build."""
import subprocess

# Check 1: available pixel formats for libvpx-vp9
r = subprocess.run(
    ['ffmpeg', '-hide_banner', '-h', 'encoder=libvpx-vp9'],
    capture_output=True, text=True
)
print("=== libvpx-vp9 options ===")
for line in r.stdout.split('\n'):
    if any(k in line.lower() for k in ['alpha', 'profile', 'pix_fmt', 'crf', 'lossless']):
        print(f"  {line.strip()}")

# Check 2: VP9 profile 2 (hat Alpha)
print("\n=== Test: VP9 profile:v 2 (hat Alpha) ===")
r = subprocess.run(
    ['ffmpeg', '-y',
     '-i', '/Users/danielpaul/Downloads/shuttle_isolated.mov',
     '-vf', 'format=yuva420p',
     '-c:v', 'libvpx-vp9',
     '-profile:v', '2',
     '-b:v', '0', '-crf', '30',
     '-pix_fmt', 'yuva420p',
     '/tmp/test_vp9_p2.webm'],
    capture_output=True, text=True, timeout=30
)
if r.returncode == 0:
    r2 = subprocess.run(
        ['ffprobe', '-v', 'quiet', '-show_entries', 'stream=pix_fmt,profile', '-of', 'csv=p=0',
         '/tmp/test_vp9_p2.webm'],
        capture_output=True, text=True
    )
    print(f"  rc=0 PixFmt: {r2.stdout.strip()}")
else:
    print(f"  rc={r.returncode}: {r.stderr[-200:]}")
