#!/usr/bin/env python3
"""
WebM mit Alpha — letzte Versuche.

VP9 verliert Alpha (bekanntes Bug in dieser ffmpeg 8 Build).

Alternativen:
1. libaom-av1 (AV1) mit yuva420p -- AV1 unterstuetzt Alpha
2. qtrle.mov als .mov im WebM-Format? Nein, qtrle ist QuickTime.
3. WebM mit 'alpha' extension via 'mkvmerge' (extern)
4. PNG-Sequenz als .zip (browser-ready, rgba)

Wenn libaom nicht verfuegbar: nutze 'qtrle.mov' (funktioniert, Alpha-garantiert, aber groß)
"""
import subprocess, os, sys

INPUT = "/Users/danielpaul/Downloads/shuttle_isolated_tracked.mov"

# Test: libaom-av1 (AV1 mit Alpha)
print("=== Test 1: libaom-av1 (AV1 + Alpha) ===")
r = subprocess.run(
    ['ffmpeg', '-y', '-i', INPUT,
     '-c:v', 'libaom-av1',
     '-crf', '25', '-b:v', '0',
     '-pix_fmt', 'yuva420p',
     '/Users/danielpaul/Downloads/shuttle_isolated_tracked.av1.webm'],
    capture_output=True, text=True, timeout=120
)
print(f"  rc={r.returncode}")
if r.returncode == 0:
    print(f"  ✓ ({os.path.getsize('/Users/danielpaul/Downloads/shuttle_isolated_tracked.av1.webm'):,} Bytes)")
    r2 = subprocess.run(['ffprobe','-v','quiet','-show_entries','stream=pix_fmt,alpha_mode,codec_name','-of','csv=p=0',
                         '/Users/danielpaul/Downloads/shuttle_isolated_tracked.av1.webm'],
                        capture_output=True, text=True)
    print(f"  PixFmt: {r2.stdout.strip()}")
else:
    err = r.stderr.decode()[-300:] if r.stderr else "unknown"
    print(f"  ✗ {err}")

# Test: libaom-av1 mit -strict experimental
if r.returncode != 0:
    print("\n=== Test 2: libaom-av1 + experimental ===")
    r = subprocess.run(
        ['ffmpeg', '-y', '-i', INPUT,
         '-c:v', 'libaom-av1', '-strict', 'experimental',
         '-crf', '25', '-b:v', '0',
         '-pix_fmt', 'yuva420p',
         '/Users/danielpaul/Downloads/shuttle_isolated_tracked.av1.webm'],
        capture_output=True, text=True, timeout=120
    )
    if r.returncode == 0:
        print(f"  ✓ ({os.path.getsize('/Users/danielpaul/Downloads/shuttle_isolated_tracked.av1.webm'):,} Bytes)")
        r2 = subprocess.run(['ffprobe','-v','quiet','-show_entries','stream=pix_fmt','-of','csv=p=0',
                             '/Users/danielpaul/Downloads/shuttle_isolated_tracked.av1.webm'],
                            capture_output=True, text=True)
        print(f"  PixFmt: {r2.stdout.strip()}")
    else:
        err = r.stderr.decode()[-200:] if r.stderr else "unknown"
        print(f"  ✗ {err}")

# Fallback: list available encoders
if r.returncode != 0:
    print("\n=== Available encoders with Alpha support ===")
    r = subprocess.run(['ffmpeg', '-hide_banner', '-encoders'], capture_output=True, text=True)
    for line in r.stdout.split('\n'):
        if 'vp9' in line.lower() or 'av1' in line.lower() or 'prores' in line.lower() or 'qtrle' in line.lower():
            print(f"  {line.strip()}")
