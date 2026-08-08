#!/usr/bin/env python3
"""Debug: warum schlägt alphamerge+crop im filter_complex fehl?"""
import subprocess, os

SRC = "/tmp/shuttle_final2/src/frame_0001.png"
MASK = "/tmp/shuttle_final2/masks/mask_frame_0001.png"

# TEST 1: alphamerge OHNE crop (funktioniert laut test_2input.py)
print("=== Test 1: alphamerge ohne crop ===")
r = subprocess.run(
    ['ffmpeg', '-y', '-i', SRC, '-i', MASK,
     '-filter_complex', '[0:v]format=yuva420p[c];[1:v]format=gray[m];[c][m]alphamerge',
     '-frames:v', '1',
     '/tmp/dbg_nomask.png'],
    capture_output=True, text=True, timeout=5
)
print(f"  rc={r.returncode}, exists={os.path.exists('/tmp/dbg_nomask.png')}")
if r.returncode != 0:
    print(f"  ERR: {r.stderr[-200:]}")

# TEST 2: alphamerge MIT crop im filter_complex
print("=== Test 2: alphamerge mit crop in filter_complex ===")
r = subprocess.run(
    ['ffmpeg', '-y', '-i', SRC, '-i', MASK,
     '-filter_complex',
     '[0:v]format=yuva420p,crop=2020:1025:495:350[c];[1:v]format=gray,crop=2020:1025:495:350[m];[c][m]alphamerge',
     '-frames:v', '1',
     '/tmp/dbg_withcrop.png'],
    capture_output=True, text=True, timeout=5
)
print(f"  rc={r.returncode}, exists={os.path.exists('/tmp/dbg_withcrop.png')}")
if r.returncode != 0:
    print(f"  ERR: {r.stderr[-300:]}")

# TEST 3: crop als separater -vf (nach filter_complex alphamerge)
print("=== Test 3: alphamerge (filter_complex) + crop (-vf) ===")
r = subprocess.run(
    ['ffmpeg', '-y', '-i', SRC, '-i', MASK,
     '-filter_complex', '[0:v]format=yuva420p[c];[1:v]format=gray[m];[c][m]alphamerge[out]',
     '-map', '[out]',
     '-vf', 'crop=2020:1025:495:350',
     '-frames:v', '1',
     '/tmp/dbg_vfcrop.png'],
    capture_output=True, text=True, timeout=5
)
print(f"  rc={r.returncode}, exists={os.path.exists('/tmp/dbg_vfcrop.png')}")
if r.returncode == 0:
    r2 = subprocess.run(['ffprobe','-v','quiet','-show_entries','stream=pix_fmt','-of','csv=p=0','/tmp/dbg_vfcrop.png'], capture_output=True, text=True)
    print(f"  PixFmt: {r2.stdout.strip()}")
else:
    print(f"  ERR: {r.stderr[-200:]}")

# TEST 4: crop via '-vf' on BOTH inputs separately, then alphamerge
print("=== Test 4: crop on both inputs, then alphamerge ===")
r = subprocess.run(
    ['ffmpeg', '-y',
     '-i', SRC, '-i', MASK,
     '-filter_complex',
     '[0:v]crop=2020:1025:495:350,format=yuva420p[c];[1:v]crop=2020:1025:495:350,format=gray[m];[c][m]alphamerge[out]',
     '-map', '[out]',
     '-frames:v', '1',
     '/tmp/dbg_cropboth.png'],
    capture_output=True, text=True, timeout=5
)
print(f"  rc={r.returncode}, exists={os.path.exists('/tmp/dbg_cropboth.png')}")
if r.returncode == 0:
    r2 = subprocess.run(['ffprobe','-v','quiet','-show_entries','stream=pix_fmt','-of','csv=p=0','/tmp/dbg_cropboth.png'], capture_output=True, text=True)
    print(f"  PixFmt: {r2.stdout.strip()}")
    r3 = subprocess.run(['ffmpeg','-i','/tmp/dbg_cropboth.png','-vf','crop=3:3:0:0,format=rgba','-frames:v','1','-f','rawvideo','-'], capture_output=True)
    if r3.stdout:
        print(f"  top-left: alpha={r3.stdout[3]:02x}")
else:
    print(f"  ERR: {r.stderr[-300:]}")
