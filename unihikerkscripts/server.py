#!/usr/bin/env python3
"""
server.py — run on the PC at 192.168.80.13:8000

Receives frames from the UniHiker K10 and saves:
- raw payload to ./frames/raw/
- decoded image to ./frames/decoded/

Install:
    pip install pillow numpy
"""

import cgi
import os
import sys
import time
from http.server import BaseHTTPRequestHandler, HTTPServer

import numpy as np
from PIL import Image

SAVE_DIR = "frames"
RAW_DIR = os.path.join(SAVE_DIR, "raw")
DEC_DIR = os.path.join(SAVE_DIR, "decoded")

os.makedirs(RAW_DIR, exist_ok=True)
os.makedirs(DEC_DIR, exist_ok=True)

MAX_FRAMES = 500

# The frame from your K10 sample decodes correctly with this geometry.
WIDTH = 240
HEIGHT = 320

# Set to 0 to keep portrait.
# Set to 90 or 270 if you want a landscape output file too.
ROTATE_DEG = 90


def extract_frame_bytes(handler):
    content_type = handler.headers.get("Content-Type", "")
    content_len = int(handler.headers.get("Content-Length", 0))

    # Multipart upload from the K10 script
    if "multipart/form-data" in content_type:
        form = cgi.FieldStorage(
            fp=handler.rfile,
            headers=handler.headers,
            environ={
                "REQUEST_METHOD": "POST",
                "CONTENT_TYPE": content_type,
            },
        )

        if "frame" not in form:
            return None, "Missing frame field"

        item = form["frame"]
        data = item.file.read()

        return data, None

    # Raw binary fallback
    if content_len > 0:
        data = handler.rfile.read(content_len)
        return data, None

    return None, "Empty body"


def strip_trailing_crlf(data):
    if data.endswith(b"\r\n"):
        return data[:-2]
    return data


class FrameHandler(BaseHTTPRequestHandler):
    def log_message(self, fmt, *args):
        print(f"[{time.strftime('%H:%M:%S')}] {fmt % args}")

    def do_POST(self):
        if self.path != "/upload":
            self.send_response(404)
            self.end_headers()
            self.wfile.write(b"Not found")
            return

        data, err = extract_frame_bytes(self)
        if err:
            self.send_response(400)
            self.end_headers()
            self.wfile.write(err.encode())
            return

        data = strip_trailing_crlf(data)

        ts = time.strftime("%Y%m%d_%H%M%S")
        idx = int(time.time() * 1000) % 1000000
        base = f"frame_{ts}_{idx:06d}"

        raw_path = os.path.join(RAW_DIR, base + ".bin")
        with open(raw_path, "wb") as f:
            f.write(data)

        saved = [f"raw={raw_path}"]

        # If the payload is already encoded, save directly.
        if data[:2] == b"\xff\xd8":
            jpg_path = os.path.join(DEC_DIR, base + ".jpg")
            with open(jpg_path, "wb") as f:
                f.write(data)
            saved.append(f"jpg={jpg_path}")

        elif data[:8] == b"\x89PNG\r\n\x1a\n":
            png_path = os.path.join(DEC_DIR, base + ".png")
            with open(png_path, "wb") as f:
                f.write(data)
            saved.append(f"png={png_path}")

        elif data[:2] == b"BM":
            bmp_path = os.path.join(DEC_DIR, base + ".bmp")
            with open(bmp_path, "wb") as f:
                f.write(data)
            saved.append(f"bmp={bmp_path}")

        print(f"  Saved {len(data):,} bytes -> " + " | ".join(saved))

        self.send_response(200)
        self.end_headers()
        self.wfile.write(b"OK")

        # Optional cleanup
        if MAX_FRAMES > 0:
            raw_files = sorted(
                [
                    os.path.join(RAW_DIR, x)
                    for x in os.listdir(RAW_DIR)
                    if x.endswith(".bin")
                ],
                key=os.path.getctime,
            )
            while len(raw_files) > MAX_FRAMES:
                os.remove(raw_files.pop(0))


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    server = HTTPServer(("0.0.0.0", port), FrameHandler)
    print(f"Listening on 0.0.0.0:{port}")
    print(f"Raw frames:     ./{RAW_DIR}/")
    print(f"Decoded images: ./{DEC_DIR}/")
    print("Press Ctrl+C to stop.\n")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")