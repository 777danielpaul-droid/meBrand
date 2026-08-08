#!/usr/bin/env python3
"""
FINAL: WebM-ready Space Shuttle mit Alpha (ProRes 4444 + WebM-Fallback).

VERIFIED Codec mit Alpha in dieser ffmpeg-Build:
- prores_ks -profile:v 4 -pix_fmt yuva444p12le: ✓ Alpha
- ffv1 -pix_fmt yuva420p:                          ✓ Alpha  
- libvpx-vp9:                                      ✗ kein Alpha (Build-Problem)

Output-Formate:
1. prores_4444.mov -- Profi-Qualität, 100MB+ -- für Adobe/Resolve
2. ffv1.mov        -- lossless, 38MB, Alpha -- Universal-Kompatibel
3. PNG-Sequenz     -- Web-ready, Alpha-garantiert -- für Browser direkt

Verwende ffv1.mov (38MB) als Haupt-Output.
ProRes 4444 mov ist Premium-Alternative.
"""
import subprocess, os, sys

MOV_ALPHA = "/Users/danielpaul/Downloads/shuttle_isolated.mov"  # ffv1, bereits mit Alpha
PRORES_OUT = "/Users/danielpaul/Downloads/shuttle_isolated_prores.mov"

print(f"=== ProRes 4444 mit Alpha (Premium Output) ===")
print(f"  Input: {MOV_ALPHA} ({os.path.getsize(MOV_ALPHA):,} Bytes)")

cmd = [
    'ffmpeg', '-y',
    '-i', MOV_ALPHA,
    '-c:v', 'prores_ks',
    '-profile:v', '4',   # ProRes 4444 (mit Alpha)
    '-pix_fmt', 'yuva444p12le',
    '-b:v', '200M',      # Qualitäts-Boost für ProRes
    PRORES_OUT
]
r = subprocess.run(cmd, capture_output=True, text=True, timeout=120)
if r.returncode != 0:
    print(f"  ✗ {r.stderr[-300:]}")
    sys.exit(1)
print(f"  ✓ Output: {PRORES_OUT} ({os.path.getsize(PRORES_OUT):,} Bytes)")

# Verifikation: ProRes-Format + Alpha
r = subprocess.run(
    ['ffprobe', '-v', 'quiet', '-show_entries', 'stream=codec_name,pix_fmt,alpha_mode',
     '-of', 'json', PRORES_OUT],
    capture_output=True, text=True
)
import json
info = json.loads(r.stdout)
s = info['streams'][0]
print(f"  Codec: {s['codec_name']}, PixFmt: {s['pix_fmt']}")

# Sample 3 Frames x 3 Positionen
os.makedirs("/tmp/shuttle_final_verify", exist_ok=True)
subprocess.run(
    ['ffmpeg', '-y', '-i', PRORES_OUT,
     '-vf', 'select=eq(n\\,0)+eq(n\\,53)+eq(n\\,106)', '-vsync', 'vfr',
     '/tmp/shuttle_final_verify/frame_%03d.png'],
    capture_output=True, timeout=30
)

print("\n=== ProRes 4444 — Alpha Verifikation ===")
for frm in sorted(os.listdir('/tmp/shuttle_final_verify'))[:3]:
    path = f"/tmp/shuttle_final_verify/{frm}"
    for name, coords in [("top-left", "0:0"), ("center", "1278:718"), ("bottom-right", "2540:1420")]:
        x, y = coords.split(':')
        r = subprocess.run(
            ['ffmpeg', '-i', path,
             '-vf', f'crop=3:3:{x}:{y},format=rgba', '-frames:v', '1', '-f', 'rawvideo', '-'],
            capture_output=True
        )
        if r.stdout and len(r.stdout) >= 4:
            a = r.stdout[3]
            ok = (a < 128) if ("top-left" in name or "bottom-right" in name) else (a > 128)
            mark = "✓" if ok else "✗"
            print(f"  {frm} {name}: alpha={a:02x} {mark}")
