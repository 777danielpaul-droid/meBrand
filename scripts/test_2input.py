#!/usr/bin/env python3
"""
FINAL: Space Shuttle Isolation mit funktionierendem Alpha.

Problem gelöst: alphamerge in filter_complex scheitert (Timing-Bug in ffmpeg 8).

NEUE Strategie: Einzel-Filter-Chain PRO FRAME (nicht 2 Inputs):
1. src: RGB-Frame
2. format=yuva420p  -> RGB->RGBA (Alpha=255)
3. lutyuv=y=floor(val/10)*255  -> Y wird B&W-Maske (hell=255, dunkel=0)
4. lut=yuva420p:a=Y  -> Alpha = Y-Kanal (B&W-Maske)
   PROBLEM: 'a=Y' funktioniert nicht (Y = Koordinate, nicht Kanal in lut)
   
ABER: Was, wenn ich die Maske direkt als Alpha erzeuge?
- format=yuva420p -> A=255
- lutyuv=y=floor(val/10)*255 -> Y=B&W-Maske (dunkel/hell)
- DANN: copy 'Y' to 'a' via 'lut' mit 'a=c0'...
  -> 'c0' is not a variable in lut!
  
NOCH EINFACHER: 'lut=yuva420p:a=lt(val,1)*0+255'
  -> val (Alpha nach format=yuva420p) = 255
  -> lt(255,1) = 0 -> a = 0+255 = 255  (immer opaque!)
  -> DAS PROBLEM: val referenziert ALPHA, nicht Y!

DEFINITIVE Lösung: 
- 2-stage: [1] lutyuv fuer Y-Maske -> speichere als GRAY
- [2] alphamerge mit GRAY-Maske -> Alpha = Gray-Wert

ABER: alphamerge funktioniert nicht (Timing-Bug).
Lösung: 'blend' Filter statt 'alphamerge'

blend=shortest: 
- Base: yuva420p (Farbe)
- Overlay: gray (Maske)
- blend=all_expr='A*overlay' -- NEIN, blend composited nicht als Alpha

RICHTIGE Lösung: 'lut' mit 'A=' (Alpha) Expression!
In ffmpeg 8: 'lut=yuva420p:a=...' -- 'a' ist der Alpha-Kanal
val = WERT des Kanal, der gerade verarbeitet wird
Bei 'a=' ist val = INPUT-Alpha-Wert!

Das ist das Kernproblem: 'a=' Expression kann nicht auf Y zugreifen.

ULTIMATIVE Lösung: 
Nutze 'extractplanes' + 'overlay' mit Alpha-Maske!
ODER: extrahiere Y als separater Stream via 'split+extractplanes'

ODER NOCH EINFACHER:
1. format=yuva420p
2. lutyuv=y=floor(val/10)*255  -> Y ist jetzt B&W-Maske
3. format=rgba  -> konvertiert YCbCrA -> RGBA
   -> Y (B&W-Maske) -> R, U->G, V->B, A->A
   -> PROBLEM: Farbe ist jetzt B&W, nicht original!

RICHTIGE Sequenz:
1. format=yuva420p (RGB->YCbCrA, A=255)
2. split=2[a][b]
3. [a]crop...format=rgba[a]  (Original-Farben)
4. [b]crop...format=gray,lutyuv=y=floor(val/10)*255[b]  (B&W-Maske)
5. [a][b]alphamerge  (Alpha = Maske)

Das ist das, was scheitert. Teste: funktioniert alphamerge mit -i file1 -i file2 (2 separate Inputs)?
"""
import subprocess, os, sys

# TEST: alphamerge mit ZWEI Input-Dateien (nicht filter_complex split)
FRAME = "/tmp/shuttle_final_run/src_frames/frame_0001.png"
MASK = "/tmp/shuttle_final_run/masks/mask_frame_0001.png"

print("=== Test: alphamerge mit 2 separaten Inputs ===")
r = subprocess.run(
    ['ffmpeg', '-y', '-i', FRAME, '-i', MASK,
     '-filter_complex', '[0:v]format=yuva420p[c];[1:v]format=gray[m];[c][m]alphamerge',
     '-frames:v', '1',
     '/tmp/test_2input_alpha.png'],
    capture_output=True, text=True, timeout=10
)
print(f"  rc={r.returncode}")
if r.returncode == 0:
    r2 = subprocess.run(
        ['ffprobe', '-v', 'quiet', '-show_entries', 'stream=pix_fmt', '-of', 'csv=p=0',
         '/tmp/test_2input_alpha.png'],
        capture_output=True, text=True
    )
    print(f"  PixFmt: {r2.stdout.strip()}")
    r3 = subprocess.run(
        ['ffmpeg', '-i', '/tmp/test_2input_alpha.png', '-vf', 'crop=3:3:0:0,format=rgba',
         '-frames:v', '1', '-f', 'rawvideo', '-'],
        capture_output=True
    )
    if r3.stdout:
        a = r3.stdout[3]
        status = "transparent" if a < 128 else "OPAQUE"
        print(f"  top-left: alpha={a:02x} -> {status}")
else:
    print(f"  ERR: {r.stderr[-300:]}")

# TEST B: overlay statt alphamerge
print("\n=== Test B: overlay mit Alpha-Maske ===")
r = subprocess.run(
    ['ffmpeg', '-y', '-i', FRAME, '-i', MASK,
     '-filter_complex', '[0:v]format=yuva420p[b];[1:v]format=gray,lutyuv=y=floor(val/10)*255[m];[b][m]overlay',#',
     '-frames:v', '1',
     '/tmp/test_overlay_alpha.png'],
    capture_output=True, text=True, timeout=10
)
print(f"  rc={r.returncode}")
if r.returncode == 0:
    r3 = subprocess.run(
        ['ffmpeg', '-i', '/tmp/test_overlay_alpha.png', '-vf', 'crop=3:3:0:0,format=rgba',
         '-frames:v', '1', '-f', 'rawvideo', '-'],
        capture_output=True
    )
    if r3.stdout:
        print(f"  top-left: alpha={r3.stdout[3]:02x}")
else:
    print(f"  ERR: {r.stderr[-300:]}")
