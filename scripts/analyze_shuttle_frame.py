#!/usr/bin/env python3
"""Analysiere den Shuttle-Frame, finde Background-Schwellwert."""
from PIL import Image
import sys

img = Image.open("/tmp/shuttle_work/frame.png")
print(f"Frame: {img.size[0]}x{img.size[1]} (Mode: {img.mode})")

w, h = img.size
corners = [
    img.getpixel((0, 0)),
    img.getpixel((w-1, 0)),
    img.getpixel((0, h-1)),
    img.getpixel((w-1, h-1)),
    img.getpixel((w//2, h//2)),
]
print("Corner + center pixels (RGB):")
for c in corners:
    print(f"  {c}")

colors = img.convert("RGB").getcolors(maxcolors=1000000)
if colors:
    print(f"Total unique colors: {len(colors)}")
    colors.sort(reverse=True)
    print("Top 5 colors:")
    for count, color in colors[:5]:
        print(f"  {color} -> {count} pixels ({100*count/(w*h):.1f}%)")
