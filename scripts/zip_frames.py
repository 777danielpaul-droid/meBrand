#!/usr/bin/env python3
"""
Packt die Web-ready PNG-Sequenz (rgba, Alpha) in ein ZIP in Downloads/.
"""
import subprocess, os

PNG_DIR = "/tmp/shuttle_pngs_full"
OUTPUT_ZIP = "/Users/danielpaul/Downloads/shuttle_frames_alpha.zip"

print("=== PNG-Sequenz packen (107 Frames, rgba, Alpha) ===")
r = subprocess.run(
    ['python3', '-c', 
     f"import shutil; shutil.make_archive('{OUTPUT_ZIP[:-4]}', 'zip', '{PNG_DIR}')"],
    capture_output=True, text=True, timeout=30
)
if r.returncode == 0 and os.path.exists(OUTPUT_ZIP):
    sz = os.path.getsize(OUTPUT_ZIP)
    print(f"✓ {OUTPUT_ZIP} ({sz:,} Bytes)")
    print(f"  (komprimiert von ~{sum(os.path.getsize(f'{PNG_DIR}/{f}') for f in os.listdir(PNG_DIR)):,} Bytes PNGs)")
else:
    print(f"✗ {r.stderr[-200:]}")
