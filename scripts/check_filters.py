#!/usr/bin/env python3
"""
Space Shuttle Isolation (Attempt 8 - definitive).
Problem: ffmpeg 8 hat neue Filter-Syntax.

Neue Strategie: Nutze ffmpeg direkt in Shell mit einfachen, getesteten Filtern.
1. chroma hold + threshold extrahiert Alpha-Maske
2. Oder: -vf "format=yuva420p, lut=..."

Lass uns den ffmpeg man pages checken fuer die richtige Syntax.
"""
import subprocess, os

VIDEO = "/Users/danielpaul/Downloads/11111111.mp4"
OUTPUT = "/Users/danielpaul/Downloads/shuttle_isolated.webm"

# Check: ffmpeg filter help for lut
r = subprocess.run(['ffmpeg', '-h', 'filter=lut'], capture_output=True, text=True)
print("=== LUT help ===")
print(r.stdout[:1000])

# Check: ffmpeg filter help for chromakey
r2 = subprocess.run(['ffmpeg', '-h', 'filter=chromakey'], capture_output=True, text=True)
print("\n=== chromakey help ===")
print(r2.stdout[:1000])
