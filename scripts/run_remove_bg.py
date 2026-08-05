#!/usr/bin/env python3
"""Wrapper script to run frame processing from project root."""
import os, sys

# Change to project root
os.chdir('/Users/danielpaul/Desktop/businesscard')

# Add venv site-packages to path
sys.path.insert(0, '/Users/danielpaul/Desktop/businesscard/.venv-seg/lib/python3.11/site-packages')

# Import and run
sys.path.insert(0, '/Users/danielpaul/Desktop/businesscard/scripts')
from process_all_frames import main

if __name__ == "__main__":
    main()
