#!/usr/bin/env python3
"""
DEFINITIVE Space Shuttle Isolation — Split + alphamerge (komma-frei).
1. split=2[a][b]
2. [a]format=yuva420p[a]  (Farbbild mit Alpha)
3. [b]format=gray,lut=gray:y=gte(val,18)*255[c3] 
   --> PROBLEM: gte() braucht Komma
   --> Lösung: benutze 'y = val' und lass den Schwellwert via 'threshold'-Filter
   ODER: benutze 'lut=gray' mit 'y=... ' OHNE gte/if
   Einfachste komma-freie Expression: y = (val/18) * 255
   --> val=0: 0/18=0 -> 0
   --> val=18: 18/18=1 -> 255
   --> val=17: 17/18=0.94 -> 244 (fast 255, aber nicht 0)
   PROBLEM: Werte zwischen 1 und 17 werden nicht zu 0!
   
   RICHTIGE Lösung: 'y = floor(val/18)*255'
   --> val=0-17: floor(0.94)=0 -> 0
   --> val=18+: floor(1.0+)=1 -> 255
   --> KEIN Komma! floor() braucht ein Argument ohne Trenn-Komma!
   
   Wait: floor(val/18) -- val/18 ist eine Expression, floor() nimmt das als Argument
   floor() in ffmpeg: floor(X) -- das ist eine Funktion mit Paren, kein Komma!
"""
import subprocess, os, sys

VIDEO = "/Users/danielpaul/Downloads/11111111.mp4"
OUTPUT = "/Users/danielpaul/Downloads/shuttle_isolated.webm"

print("=== Split + floor(val/18)*255 + alphamerge ===")

filter_graph = (
    "[0:v]split=2[a][b];"
    "[a]format=yuva420p[a];"
    "[b]format=gray,lut=gray:y=floor(val/18)*255[c3];"
    "[c3]format=gray[c3];"
    "[a][c3]alphamerge[out]"
)

# Test zuerst auf einem Frame (PNG)
print("--- Test auf Frame 001 ---")
r = subprocess.run(
    ['ffmpeg', '-y', '-i', '/tmp/shuttle_work/frame_001.png',
     '-filter_complex', filter_graph, '-map', '[out]',
     '/tmp/shuttle_alpha_frame.png'],
    capture_output=True, text=True, timeout=10
)
print(f"rc={r.returncode}")
print(f"stderr: {r.stderr[-300:]}")
if os.path.exists('/tmp/shuttle_alpha_frame.png'):
    size = os.path.getsize('/tmp/shuttle_alpha_frame.png')
    print(f"Frame size: {size:,} Bytes")
    # Check alpha
    r2 = subprocess.run(
        ['ffmpeg', '-i', '/tmp/shuttle_alpha_frame.png',
         '-vf', 'crop=3:3:0:0,format=rgba', '-frames:v', '1', '-f', 'rawvideo', '-'],
        capture_output=True
    )
    if r2.stdout:
        a = r2.stdout[3]
        print(f"  top-left alpha: {a:02x} ({'transparent' if a < 128 else 'opaque'})")
    r3 = subprocess.run(
        ['ffmpeg', '-i', '/tmp/shuttle_alpha_frame.png',
         '-vf', 'crop=3:3:1278:718,format=rgba', '-frames:v', '1', '-f', 'rawvideo', '-'],
        capture_output=True
    )
    if r3.stdout:
        a = r3.stdout[3]
        print(f"  center alpha: {a:02x} ({'transparent' if a < 128 else 'opaque'})")
