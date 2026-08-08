#!/usr/bin/env python3
"""
WebM/VP9 mit Alpha-Kanal — letzter Versuch.

Problem: libvpx-vp9 in ffmpeg 8 verliert Alpha (yuva420p -> yuv420p).
Mögliche Lösungen:
1. -vf 'format=yuva420p' als LETZTER Filter (nach dem alphamerge)
2. '-color_primaries', '-color_trc', '-colorspace' manuell setzen
3. VP9 mit '-vtag' = 'VP9 ' (nicht 'vp09') -- Browser brauchen 'VP9 '
4. Alternativ: nutze den ffv1.mov Output, konvertiere zu webm mit '-c:v libvpx-vp9 -strict -1'

TEST: Was, wenn ich das ALREADY-alpha-having .mov als Input nehme und
nur re-encode als VP9? ffmpeg sollte das Alpha übernehmen, wenn der Input es hat.
"""
import subprocess, os

# Input: das ffv1.mov (hat Alpha)
INPUT = "/Users/danielpaul/Downloads/shuttle_isolated.mov"
OUTPUT = "/Users/danielpaul/Downloads/shuttle_isolated.webm"

print(f"=== Input (.mov mit Alpha) -> WebM/VP9 ===")
print(f"  Input: {INPUT} ({os.path.getsize(INPUT):,} Bytes)")

# Prüfe, dass Input Alpha hat
r = subprocess.run(
    ['ffprobe', '-v', 'quiet', '-show_entries', 'stream=pix_fmt', '-of', 'csv=p=0', INPUT],
    capture_output=True, text=True
)
print(f"  Input PixFmt: {r.stdout.strip()}")

# Test A: Direkt-Encode (Input hat Alpha, Output sollte es behalten)
print("\n=== Test A: Direct re-encode ===")
r = subprocess.run(
    ['ffmpeg', '-y', '-i', INPUT,
     '-c:v', 'libvpx-vp9',
     '-crf', '30',
     '-b:v', '0',
     '-pix_fmt', 'yuva420p',
     OUTPUT],
    capture_output=True, text=True, timeout=180
)
if r.returncode == 0:
    r2 = subprocess.run(
        ['ffprobe', '-v', 'quiet', '-show_entries', 'stream=pix_fmt,alpha_mode,codec_name', '-of', 'csv=p=0', OUTPUT],
        capture_output=True, text=True
    )
    print(f"  ✓ ({os.path.getsize(OUTPUT):,}B)")
    print(f"  Output PixFmt: {r2.stdout.strip()}")
else:
    print(f"  ✗ {r.stderr[-200:]}")

# Test B: mit -strict experimental
if r.returncode != 0:
    print("\n=== Test B: + strict experimental ===")
    r = subprocess.run(
        ['ffmpeg', '-y', '-i', INPUT,
         '-c:v', 'libvpx-vp9',
         '-crf', '30',
         '-b:v', '0',
         '-strict', 'experimental',
         '-pix_fmt', 'yuva420p',
         OUTPUT],
        capture_output=True, text=True, timeout=180
    )
    if r.returncode == 0:
        r2 = subprocess.run(
            ['ffprobe', '-v', 'quiet', '-show_entries', 'stream=pix_fmt,alpha_mode', '-of', 'csv=p=0', OUTPUT],
            capture_output=True, text=True
        )
        print(f"  ✓ ({os.path.getsize(OUTPUT):,}B)")
        print(f"  Output PixFmt: {r2.stdout.strip()}")
    else:
        print(f"  ✗ {r.stderr[-200:]}")

# Test C: mit -row-mt 1 -tiles 1
if r.returncode != 0:
    print("\n=== Test C: + row-mt ===")
    r = subprocess.run(
        ['ffmpeg', '-y', '-i', INPUT,
         '-c:v', 'libvpx-vp9',
         '-crf', '30',
         '-b:v', '0',
         '-pix_fmt', 'yuva420p',
         '-row-mt', '1',
         '-tiles', '1',
         OUTPUT],
        capture_output=True, text=True, timeout=180
    )
    if r.returncode == 0:
        r2 = subprocess.run(
            ['ffprobe', '-v', 'quiet', '-show_entries', 'stream=pix_fmt,alpha_mode', '-of', 'csv=p=0', OUTPUT],
            capture_output=True, text=True
        )
        print(f"  ✓ ({os.path.getsize(OUTPUT):,}B)")
        print(f"  Output PixFmt: {r2.stdout.strip()}")
    else:
        print(f"  ✗ {r.stderr[-200:]}")
