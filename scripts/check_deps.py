#!/usr/bin/env python3
"""Check available Python dependencies for video object segmentation."""
import sys

print("Python:", sys.version.split()[0])

deps = {}
try:
    import onnxruntime as ort
    deps['onnxruntime'] = ort.__version__
    print(f"onnxruntime: {deps['onnxruntime']}")
except Exception as e:
    deps['onnxruntime'] = f"NOT AVAILABLE ({e})"
    print(f"onnxruntime: NOT AVAILABLE")

try:
    import cv2
    deps['opencv'] = cv2.__version__
    print(f"opencv: {deps['opencv']}")
except Exception as e:
    deps['opencv'] = f"NOT AVAILABLE ({e})"
    print(f"opencv: NOT AVAILABLE")

try:
    import numpy as np
    deps['numpy'] = np.__version__
    print(f"numpy: {deps['numpy']}")
except Exception as e:
    deps['numpy'] = f"NOT AVAILABLE ({e})"
    print(f"numpy: NOT AVAILABLE")
