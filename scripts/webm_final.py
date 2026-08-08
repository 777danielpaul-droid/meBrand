#!/usr/bin/env python3
"""
LETZTE VERSUCHE: WebM mit Alpha.

Alle Tests mit libsvtav1 + -pix_fmt yuva420* haben Alpha verloren.
Problem: diese ffmpeg-8 Build hat keine Alpha-Unterstuetzung fuer VP9/AV1 in WebM.

Verbleibende Optionen:
1. libvpx-vp9 mit Input-PNGs (rgba, nicht yuva420p)
2. mkv (Matroska) Container statt webm (mkv unterstuetzt Alpha mit VP9!)
3. PNG-Sequenz (rgba) direkt im ZIP

Test 2 (mkv) ist aussichtsreich: MKV-Container mit VP9 + yuva420p kann Alpha speichern.
mkv -> .webm funktioniert, wenn .webm auch mkv-basiert ist.
"""
import subprocess, os

PNG = "/tmp/shuttle_final3/out"  # rgba PNG-Sequenz
TEST_OUT = "/tmp/shuttle_vp9_rgba.webm"

# Test: libvpx-vp9 mit RGBA-PNGs (yuva420p Input, nicht yuv420p)
print("=== Test A: libvpx-vp9 von RGBA-PNGs ===")
r = subprocess.run(
    ['ffmpeg', '-y', '-framerate', '24', '-start_number', '1',
     '-i', f'{PNG}/frame_%04d.png',
     '-c:v', 'libvpx-vp9', '-crf', '20', '-b:v', '0',
     '-pix_fmt', 'yuva420p',
     TEST_OUT],
    capture_output=True, text=True, timeout=60
)
if r.returncode == 0:
    print(f"  ✓ ({os.path.getsize(TEST_OUT):,}B)")
    r2 = subprocess.run(['ffprobe','-v','quiet','-show_entries','stream=pix_fmt','-of','csv=p=0',TEST_OUT], capture_output=True, text=True)
    print(f"  PixFmt: {r2.stdout.strip()}")
else:
    print(f"  ✗ {r.stderr[-200:]}")

# Test B: MKV container statt WebM (MKV unterstützt VP9+Alpha)
print("\n=== Test B: VP9 + Alpha -> Matroska (.mkv) ===")
r = subprocess.run(
    ['ffmpeg', '-y',
     '-i', '/Users/danielpaul/Downloads/shuttle_isolated_tracked.mov',
     '-c:v', 'libvpx-vp9', '-crf', '20', '-b:v', '0',
     '-pix_fmt', 'yuva420p',
     '/Users/danielpaul/Downloads/shuttle_isolated_tracked.mkv'],
    capture_output=True, text=True, timeout=120
)
if r.returncode == 0:
    sz = os.path.getsize('/Users/danielpaul/Downloads/shuttle_isolated_tracked.mkv')
    print(f"  ✓ ({sz:,}B)")
    r2 = subprocess.run(['ffprobe','-v','quiet','-show_entries','stream=pix_fmt,alpha_mode','-of','csv=p=0',
                         '/Users/danielpaul/Downloads/shuttle_isolated_tracked.mkv'], capture_output=True, text=True)
    print(f"  PixFmt: {r2.stdout.strip()}")
    # Alpha sample
    subprocess.run(['ffmpeg','-y','-i','/Users/danielpaul/Downloads/shuttle_isolated_tracked.mkv','-vf','select=eq(n\\,0)','-vsync','vfr','/tmp/mkv_v0.png'], capture_output=True)
    r3 = subprocess.run(['ffmpeg','-i','/tmp/mkv_v0.png','-vf','crop=3:3:0:0,format=rgba','-frames:v','1','-f','rawvideo','-'], capture_output=True)
    if r3.stdout:
        print(f"  top-left: alpha={r3.stdout[3]:02x} ({'transparent' if r3.stdout[3]<128 else 'OPAQUE'})")

# Test C: libvpx VP8 mit yuva420p in MKV
print("\n=== Test C: VP8 (libvpx) + Alpha -> MKV ===")
r = subprocess.run(
    ['ffmpeg', '-y',
     '-i', '/Users/danielpaul/Downloads/shuttle_isolated_tracked.mov',
     '-c:v', 'libvpx', '-crf', '10', '-b:v', '0',
     '-pix_fmt', 'yuva420p',
     '/tmp/shuttle_vp8_alpha.mkv'],
    capture_output=True, text=True, timeout=120
)
if r.returncode == 0:
    print(f"  ✓ ({os.path.getsize('/tmp/shuttle_vp8_alpha.mkv'):,}B)")
    r2 = subprocess.run(['ffprobe','-v','quiet','-show_entries','stream=pix_fmt','-of','csv=p=0','/tmp/shuttle_vp8_alpha.mkv'], capture_output=True, text=True)
    print(f"  PixFmt: {r2.stdout.strip()}")
    subprocess.run(['ffmpeg','-y','-i','/tmp/shuttle_vp8_alpha.mkv','-vf','select=eq(n\\,0)','-vsync','vfr','/tmp/vp8_v0.png'], capture_output=True)
    r3 = subprocess.run(['ffmpeg','-i','/tmp/vp8_v0.png','-vf','crop=3:3:0:0,format=rgba','-frames:v','1','-f','rawvideo','-'], capture_output=True)
    if r3.stdout:
        print(f"  top-left: alpha={r3.stdout[3]:02x} ({'transparent' if r3.stdout[3]<128 else 'OPAQUE'})")
else:
    print(f"  ✗ {r.stderr[-200:]}")
