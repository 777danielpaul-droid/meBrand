#!/usr/bin/env python3
"""Test: funktioniert der lut-Filter? (nur Test, kein Output)"""
import subprocess

VIDEO = "/Users/danielpaul/Downloads/11111111.mp4"

# Nur das Filter testen (rawvideo, keine Codec-Probleme)
cmd = [
    'ffmpeg', '-y',
    '-i', VIDEO,
    '-vf', 'format=yuva420p,lut=yuva420p:a=255*(val>=18)',
    '-t', '0.1',
    '-f', 'rawvideo',
    '/tmp/shuttle_test_filter.raw'
]
r = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
print(f"rc={r.returncode}")
print(f"stderr: {r.stderr[-400:]}")

# Wenn OK: size check
import os
if os.path.exists('/tmp/shuttle_test_filter.raw'):
    size = os.path.getsize('/tmp/shuttle_test_filter.raw')
    # 2560*1440*4 bytes (rgba) * ~2.4 frames (0.1s @ 24fps)
    expected = 2560 * 1440 * 4 * 3
    print(f"Raw size: {size:,} (erwartet ~{expected:,})")

# Test mit libvpx-vp9 + yuva420p als SEPARATES Argument
print("\n=== Test: VP9 mit yuva420p ===")
cmd = [
    'ffmpeg', '-y',
    '-i', VIDEO,
    '-vf', 'format=yuva420p,lut=yuva420p:a=255*(val>=18)',
    '-t', '0.1',
    '-c:v', 'libvpx-vp9',
    '-b:v', '0',
    '-cr-alpha', '10',
    '-auto-alt-ref', '1',
    '-lag-in-frames', '25',
    '-pix_fmt', 'yuva420p',
    '/tmp/shuttle_test_vp9.webm'
]
r = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
print(f"rc={r.returncode}")
print(f"stderr: {r.stderr[-400:]}")
if os.path.exists('/tmp/shuttle_test_vp9.webm'):
    print(f"Size: {os.path.getsize('/tmp/shuttle_test_vp9.webm'):,}")
