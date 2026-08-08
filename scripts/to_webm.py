#!/usr/bin/env python3
"""
FINAL OUTPUT: shuttle_isolated_tracked.webm (VP9 mit Alpha).

Input: /Users/danielpaul/Downloads/shuttle_isolated_tracked.mov (ffv1, yuva420p, 38MB)
Problem: libvpx-vp9 in ffmpeg 8 verliert Alpha.

Strategie:
1. Input ist ffv1.mov mit Alpha (yuva420p)
2. Re-encode als VP9 mit -pix_fmt yuva420p
3. Teste verschiedene Flags:
   -crf 30 --standard
   -crf 30 + -alpha 1 (falls unterstuetzt)
   -crf 30 + -row-mt 1 -tile-columns 2 (Thread-Optimierung)

Falls VP9 fehlschlaegt: 
- PNG-Sequenz als ZIP (rgba, browser-ready)
- ProRes .mov (108MB, Alpha)
"""
import subprocess, os, sys, json

INPUT = "/Users/danielpaul/Downloads/shuttle_isolated_tracked.mov"
OUTPUT_WEBM = "/Users/danielpaul/Downloads/shuttle_isolated_tracked.webm"

if not os.path.exists(INPUT):
    print(f"✗ Input nicht gefunden: {INPUT}")
    sys.exit(1)

print(f"=== Input verifizieren ===")
r = subprocess.run(
    ['ffprobe', '-v', 'quiet', '-show_entries', 'stream=pix_fmt,codec_name,width,height',
     '-of', 'json', INPUT],
    capture_output=True, text=True
)
info = json.loads(r.stdout)
s = info['streams'][0]
print(f"  {s['codec_name']} / {s['pix_fmt']} / {s['width']}x{s['height']}")

# Test: VP9 mit yuva420p
print(f"\n=== Encode: VP9/yuva420p ===")
r = subprocess.run(
    ['ffmpeg', '-y',
     '-i', INPUT,
     '-c:v', 'libvpx-vp9',
     '-crf', '20',
     '-b:v', '0',
     '-pix_fmt', 'yuva420p',
     '-auto-alt-ref', '1',
     OUTPUT_WEBM],
    capture_output=True, text=True, timeout=120
)
if r.returncode != 0:
    print(f"  ✗ rc={r.returncode}: {r.stderr[-300:]}")
else:
    print(f"  ✓ ({os.path.getsize(OUTPUT_WEBM):,} Bytes)")

# Verify
if os.path.exists(OUTPUT_WEBM):
    r2 = subprocess.run(
        ['ffprobe', '-v', 'quiet', '-show_entries', 'stream=pix_fmt,alpha_mode,codec_name',
         '-of', 'json', OUTPUT_WEBM],
        capture_output=True, text=True
    )
    info2 = json.loads(r2.stdout)
    s2 = info2['streams'][0]
    print(f"\n=== Verifikation ===")
    print(f"  Codec: {s2['codec_name']}, PixFmt: {s2['pix_fmt']}, AlphaMode: {s2.get('alpha_mode','n/a')}")

    # Sample Alpha
    subprocess.run(
        ['ffmpeg', '-y', '-i', OUTPUT_WEBM, '-vf', 'select=eq(n\\,0)', '-vsync', 'vfr',
         '/tmp/webm_v0.png'],
        capture_output=True
    )
    if os.path.exists('/tmp/webm_v0.png'):
        r3 = subprocess.run(
            ['ffprobe', '-v', 'quiet', '-show_entries', 'stream=pix_fmt', '-of', 'csv=p=0',
             '/tmp/webm_v0.png'],
            capture_output=True, text=True
        )
        print(f"  Extracted Frame PixFmt: {r3.stdout.strip()}")
        for name, coords in [("bg", "5:5"), ("shuttle", "1000:510")]:
            x, y = coords.split(':')
            r4 = subprocess.run(
                ['ffmpeg', '-i', '/tmp/webm_v0.png',
                 '-vf', f'crop=3:3:{x}:{y},format=rgba', '-frames:v', '1', '-f', 'rawvideo', '-'],
                capture_output=True
            )
            if r4.stdout and len(r4.stdout) >= 4:
                a = r4.stdout[3]
                status = "transparent" if a < 128 else "OPAQUE"
                print(f"  {name}: alpha={a:02x} -> {status}")
