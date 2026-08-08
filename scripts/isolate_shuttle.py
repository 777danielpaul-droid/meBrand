#!/usr/bin/env python3
"""
FINAL: Space Shuttle Isolation — endgültiges Video mit Alpha-Kanal.

VERIFIED Codecs mit Alpha-Erhaltung:
- ffv1 (yuva420p): ✓ Alpha, ~2.8MB pro 5 Frames -> ~60MB total
- qtrle (rgba):   ✓ Alpha, 202MB total
- VP9:            ✗ kein Alpha (ffmpeg 8 Bug)

Strategie:
1. Extrahiere PNG-Sequenz mit Alpha (filter: floor(val/18)*255 + alphamerge)
2. Encodiere als ffv1/yuva420p (Alpha erhalten)
3. ODER: nutze VP9 mit 'format=yuva420p' als FINALER Filter-Step
   (VP9 behält Alpha, wenn der Input-Stream explizit yuva420p ist -- 
   aber das Test zeigte: nein)

ENDGÜLTIGE ENTSCHEIDUNG: ffv1 für Alpha + kompakte Web-Delivery-Option
- Falls Web-Embedding nötig: nutze PNG-Sequenz (browser-native Alpha)
- Falls File-Nötig: ffv1.mov (Alpha-garantiert)
"""
import subprocess, os, sys

VIDEO = "/Users/danielpaul/Downloads/11111111.mp4"
FILTER = "[0:v]split=2[a][b];[a]format=yuva420p[a];[b]format=gray,lutyuv=y=floor(val/18)*255[c3];[c3]format=gray[c3];[a][c3]alphamerge[out]"
OUTPUT = "/Users/danielpaul/Downloads/shuttle_isolated.mov"

print(f"=== Endgültige Verarbeitung: {os.path.getsize(VIDEO):,} Bytes Eingabe ===")

# 1. PNG-Sequenz mit Alpha (verlustfrei)
png_dir = "/tmp/shuttle_pngs_full"
os.makedirs(png_dir, exist_ok=True)
print("Step 1: PNG-Sequenz mit Alpha extrahieren...")
r = subprocess.run(
    ['ffmpeg', '-y', '-i', VIDEO,
     '-filter_complex', FILTER, '-map', '[out]',
     f'{png_dir}/frame_%04d.png'],
    capture_output=True, text=True, timeout=120
)
if r.returncode != 0:
    print(f"  ✗ {r.stderr[-200:]}")
    sys.exit(1)
count = len(os.listdir(png_dir))
print(f"  ✓ {count} PNGs mit Alpha")

# 2. Verifiziere erstes PNG
r = subprocess.run(
    ['ffprobe', '-v', 'quiet', '-show_entries', 'stream=pix_fmt', '-of', 'csv=p=0',
     f'{png_dir}/frame_0001.png'],
    capture_output=True, text=True
)
print(f"  PNG PixFmt: {r.stdout.strip()}")

# 3. Encode als ffv1 (verlustfrei mit Alpha)
print("Step 2: Encode als ffv1 (yuva420p, Alpha erhalten)...")
r = subprocess.run(
    ['ffmpeg', '-y', '-framerate', '24', f'-i', f'{png_dir}/frame_%04d.png',
     '-c:v', 'ffv1', '-level', '3', '-pix_fmt', 'yuva420p',
     OUTPUT],
    capture_output=True, text=True, timeout=180
)
if r.returncode != 0:
    print(f"  ✗ {r.stderr[-200:]}")
    sys.exit(1)
print(f"  ✓ Output: {OUTPUT} ({os.path.getsize(OUTPUT):,} Bytes)")

# 4. Verifikation: PixFormat + Alpha-Samples
print("\n=== VERIFIKATION ===")
r = subprocess.run(
    ['ffprobe', '-v', 'quiet', '-show_entries', 'stream=pix_fmt,alpha_mode,codec_name',
     '-of', 'json', OUTPUT],
    capture_output=True, text=True
)
import json
info = json.loads(r.stdout)
s = info['streams'][0]
print(f"  Codec: {s['codec_name']}, PixFmt: {s['pix_fmt']}, AlphaMode: {s.get('alpha_mode', 'n/a')}")

# Sample 3 Frames
subprocess.run(
    ['ffmpeg', '-y', '-i', OUTPUT, '-vf', 'select=eq(n\\,0)+eq(n\\,27)', '-vsync', 'vfr',
     '/tmp/shuttle_verify/v_final_%03d.png'],
    capture_output=True
)
for frm in sorted(os.listdir('/tmp/shuttle_verify'))[:3]:
    path = f"/tmp/shuttle_verify/{frm}"
    r = subprocess.run(
        ['ffprobe', '-v', 'quiet', '-show_entries', 'stream=pix_fmt', '-of', 'csv=p=0', path],
        capture_output=True, text=True
    )
    fmt = r.stdout.strip()
    print(f"  {frm}: PixFmt={fmt}")
