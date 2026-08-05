#!/usr/bin/env python3
"""Remove black background from robot teardown PNG frames using Euclidean RGB distance.

Background color: RGB(0,2,0) — near-black.
Pixels within Euclidean distance 12 from (0,2,0) → transparent.
Everything else → opaque (preserves dark robot metal parts RGB(20+,20+,20+)).

Usage: python3 scripts/process_all_frames.py
"""
import struct, zlib

# Key color (background) — exactly what pixel analysis showed
KEY_R, KEY_G, KEY_B = 0, 2, 0
DISTANCE_THRESHOLD = 12.0  # max distance from (0,2,0) to be background

def read_png(path):
    """Read PNG file, return (pixels, width, height, channels, bit_depth)."""
    with open(path, 'rb') as f:
        data = f.read()
    
    if data[:8] != b'\x89PNG\r\n\x1a\n':
        raise ValueError("Not a PNG file")
    
    pos = 8
    width = height = bit_depth = color_type = None
    idat_data = b''
    
    while pos < len(data):
        length = struct.unpack('>I', data[pos:pos+4])[0]
        chunk_type = data[pos+4:pos+8].decode('ascii')
        chunk_data = data[pos+8:pos+8+length]
        
        if chunk_type == 'IHDR':
            width, height, bit_depth, color_type = struct.unpack('>IIBB', chunk_data[:10])
        elif chunk_type == 'IDAT':
            idat_data += chunk_data
        elif chunk_type == 'IEND':
            break
        
        pos += 12 + length
    
    if width is None:
        raise ValueError("Could not parse PNG")
    
    raw = zlib.decompress(idat_data)
    channels = {0: 1, 2: 3, 3: 1, 4: 2, 6: 4}[color_type]
    bpp = channels * (bit_depth // 8)
    stride = width * bpp
    
    pixels = bytearray(stride * height)
    prev_row = bytearray(stride)
    
    for y in range(height):
        filter_type = raw[y * (stride + 1)]
        row_start = y * stride
        row = bytearray(raw[y * (stride + 1) + 1: y * (stride + 1) + 1 + stride])
        
        if filter_type == 0:
            pass
        elif filter_type == 1:
            for i in range(bpp, stride):
                row[i] = (row[i] + row[i - bpp]) & 0xFF
        elif filter_type == 2:
            for i in range(stride):
                row[i] = (row[i] + prev_row[i]) & 0xFF
        elif filter_type == 3:
            for i in range(stride):
                left = row[i - bpp] if i >= bpp else 0
                up = prev_row[i]
                row[i] = (row[i] + (left + up) // 2) & 0xFF
        elif filter_type == 4:
            for i in range(stride):
                left = row[i - bpp] if i >= bpp else 0
                up = prev_row[i]
                up_left = prev_row[i - bpp] if i >= bpp else 0
                p = left + up - up_left
                pa, pb, pc = abs(p - left), abs(p - up), abs(p - up_left)
                pr = left if pa <= pb and pa <= pc else (up if pb <= pc else up_left)
                row[i] = (row[i] + pr) & 0xFF
        
        pixels[row_start:row_start + stride] = row
        prev_row = row
    
    return pixels, width, height, channels, bit_depth

def write_png(path, pixels, width, height):
    """Write RGBA PNG."""
    def make_chunk(chunk_type, chunk_data):
        crc = struct.pack('>I', zlib.crc32(chunk_type + chunk_data) & 0xFFFFFFFF)
        return struct.pack('>I', len(chunk_data)) + chunk_type + chunk_data + crc
    
    with open(path, 'wb') as f:
        f.write(b'\x89PNG\r\n\x1a\n')
        f.write(make_chunk(b'IHDR', struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0)))
        raw = bytearray()
        for y in range(height):
            raw.append(0)  # filter: None
            raw.extend(pixels[y * width * 4: (y + 1) * width * 4])
        f.write(make_chunk(b'IDAT', zlib.compress(bytes(raw), 9)))
        f.write(make_chunk(b'IEND', b''))

def process_frame(input_path, output_path):
    """Process a single frame: read PNG, key background, write RGBA PNG."""
    pixels, width, height, src_channels, _ = read_png(input_path)
    
    rgba = bytearray(width * height * 4)
    
    for i in range(width * height):
        r = pixels[i * src_channels]
        g = pixels[i * src_channels + 1]
        b = pixels[i * src_channels + 2]
        
        dist = ((r - KEY_R) ** 2 + (g - KEY_G) ** 2 + (b - KEY_B) ** 2) ** 0.5
        
        rgba[i * 4] = r
        rgba[i * 4 + 1] = g
        rgba[i * 4 + 2] = b
        rgba[i * 4 + 3] = 0 if dist < DISTANCE_THRESHOLD else 255
    
    write_png(output_path, rgba, width, height)
