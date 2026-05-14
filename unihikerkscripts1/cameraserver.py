#!/usr/bin/env python3
"""
server.py — run on the PC at 192.168.80.13:8000

Receives frames from the UniHiker K10 and saves:
- raw payload to ./frames/raw/ (or per-sensor subfolders)
- decoded image to ./frames/decoded/ (or per-sensor subfolders)

Endpoints:
- POST /upload (default)
- POST /<sensor> or /upload/<sensor> for sensor-specific folders

Install:
    pip install pillow numpy
"""

import cgi
import json
import os
import sys
import time
import threading
import urllib.error
import urllib.request
from urllib.parse import urlparse
from http.server import BaseHTTPRequestHandler, HTTPServer

import numpy as np
from PIL import Image, ImageEnhance

SAVE_DIR = "frames"
RAW_DIR = os.path.join(SAVE_DIR, "raw")
DEC_DIR = os.path.join(SAVE_DIR, "decoded")

os.makedirs(RAW_DIR, exist_ok=True)
os.makedirs(DEC_DIR, exist_ok=True)

MAX_FRAMES = 500

AUDIT_URL = os.environ.get("AUDIT_URL", "http://localhost:8080/api/audit")
DEVICE_ID = os.environ.get("K10_DEVICE_ID", "k10-01")
AUDIT_TIMEOUT_S = float(os.environ.get("AUDIT_TIMEOUT_S", "2"))

SENSOR_ENDPOINTS = {
    "calidadaire",
    "riesgobiologico",
    "materialespeligrosos",
    "gestionresiduos",
    "consumoenergetico",
    "biodiversidad",
    "gestionagua",
    "contaminacionauditiva",
}

OFFSET_CACHE = {}

# The frame from your K10 sample decodes correctly with this geometry.
WIDTH = 240
HEIGHT = 320
BPP = 2
FRAME_BYTES = WIDTH * HEIGHT * BPP

# If you already know the correct offset set this; None = auto-detect.
FORCE_SKIP = None

# Set to 0 to keep portrait.
# Set to 90 or 270 if you want a landscape output file too.
ROTATE_DEG = 0

WB_SCALE = np.array([1.15, 1.00, 0.80], dtype=np.float32)
SATURATION = 1.15
CONTRAST = 1.05


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


def rgb565_to_rgb888(data, offset):
    chunk = data[offset : offset + FRAME_BYTES]
    arr = np.frombuffer(chunk, dtype="<u2").reshape((HEIGHT, WIDTH))
    r = ((arr >> 11) & 0x1F) * (255 / 31)
    g = ((arr >> 5) & 0x3F) * (255 / 63)
    b = (arr & 0x1F) * (255 / 31)
    rgb = np.dstack((r, g, b)).astype(np.float32)
    return rgb


def colour_correct(rgb):
    rgb = rgb * WB_SCALE
    rgb = np.clip(rgb, 0, 255).astype(np.uint8)
    return rgb


def wrap_score(rgb):
    top = rgb[0, :, :].astype(np.float32)
    bottom = rgb[-1, :, :].astype(np.float32)
    return float(np.mean(np.abs(top - bottom)))


def find_best_offset(data):
    best_offset = 0
    best_score = float("inf")

    max_start = len(data) - FRAME_BYTES
    candidates = list(range(0, min(513, max_start + 1), BPP))

    for off in candidates:
        rgb = rgb565_to_rgb888(data, off)
        score = wrap_score(rgb)
        if score < best_score:
            best_score = score
            best_offset = off

    return best_offset


def make_image(rgb_raw, rotate):
    img = Image.fromarray(rgb_raw, mode="RGB")
    if rotate:
        img = img.rotate(rotate, expand=True)
    img = ImageEnhance.Color(img).enhance(SATURATION)
    img = ImageEnhance.Contrast(img).enhance(CONTRAST)
    return img


def ensure_dirs(sensor):
    if sensor:
        raw_dir = os.path.join(RAW_DIR, sensor)
        dec_dir = os.path.join(DEC_DIR, sensor)
    else:
        raw_dir = RAW_DIR
        dec_dir = DEC_DIR
    os.makedirs(raw_dir, exist_ok=True)
    os.makedirs(dec_dir, exist_ok=True)
    return raw_dir, dec_dir


def to_public_path(file_path):
    rel = os.path.relpath(file_path, start=SAVE_DIR)
    rel = rel.replace(os.sep, "/")
    return "/" + SAVE_DIR + "/" + rel


def send_audit_update(sensor, image_path):
    if not sensor or not image_path:
        return
    payload = {
        "device_id": DEVICE_ID,
        sensor: image_path,
    }
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        AUDIT_URL,
        data=data,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=AUDIT_TIMEOUT_S) as resp:
            resp.read()
    except urllib.error.URLError as exc:
        print(f"  Audit POST failed: {exc}")


def send_audit_update_async(sensor, image_path):
    thread = threading.Thread(
        target=send_audit_update,
        args=(sensor, image_path),
        daemon=True,
    )
    thread.start()


def resolve_endpoint(path):
    route = urlparse(path).path.strip("/")
    if route == "upload":
        return None, True
    if route.startswith("upload/"):
        route = route[len("upload/") :]
    if route in SENSOR_ENDPOINTS:
        return route, True
    return None, False


def save_decoded_rgb565(data, dec_dir, base, cache_key):
    if len(data) < FRAME_BYTES:
        return None, "too small for RGB565"

    if FORCE_SKIP is not None:
        offset = FORCE_SKIP
    else:
        offset = OFFSET_CACHE.get(cache_key)
        if offset is None:
            offset = find_best_offset(data)
            OFFSET_CACHE[cache_key] = offset

    rgb_raw = colour_correct(rgb565_to_rgb888(data, offset))
    img = make_image(rgb_raw, rotate=ROTATE_DEG)
    out_path = os.path.join(dec_dir, base + ".png")
    img.save(out_path)
    return out_path, None


def cleanup_raw_dir(raw_dir):
    if MAX_FRAMES <= 0:
        return
    raw_files = sorted(
        [
            os.path.join(raw_dir, x)
            for x in os.listdir(raw_dir)
            if x.endswith(".bin")
        ],
        key=os.path.getctime,
    )
    while len(raw_files) > MAX_FRAMES:
        os.remove(raw_files.pop(0))


class FrameHandler(BaseHTTPRequestHandler):
    def log_message(self, fmt, *args):
        print(f"[{time.strftime('%H:%M:%S')}] {fmt % args}")

    def do_POST(self):
        sensor, ok = resolve_endpoint(self.path)
        if not ok:
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

        raw_dir, dec_dir = ensure_dirs(sensor)

        raw_path = os.path.join(raw_dir, base + ".bin")
        with open(raw_path, "wb") as f:
            f.write(data)

        saved = [f"raw={raw_path}"]
        image_path = None

        # If the payload is already encoded, save directly.
        if data[:2] == b"\xff\xd8":
            jpg_path = os.path.join(dec_dir, base + ".jpg")
            with open(jpg_path, "wb") as f:
                f.write(data)
            saved.append(f"jpg={jpg_path}")
            image_path = jpg_path

        elif data[:8] == b"\x89PNG\r\n\x1a\n":
            png_path = os.path.join(dec_dir, base + ".png")
            with open(png_path, "wb") as f:
                f.write(data)
            saved.append(f"png={png_path}")
            image_path = png_path

        elif data[:2] == b"BM":
            bmp_path = os.path.join(dec_dir, base + ".bmp")
            with open(bmp_path, "wb") as f:
                f.write(data)
            saved.append(f"bmp={bmp_path}")
            image_path = bmp_path

        else:
            cache_key = sensor or "__default__"
            decoded_path, decode_err = save_decoded_rgb565(
                data, dec_dir, base, cache_key
            )
            if decoded_path:
                saved.append(f"png={decoded_path}")
                image_path = decoded_path
            else:
                saved.append(f"decode_error={decode_err}")

        print(f"  Saved {len(data):,} bytes -> " + " | ".join(saved))

        self.send_response(200)
        self.end_headers()
        self.wfile.write(b"OK")

        if sensor and image_path:
            send_audit_update_async(sensor, to_public_path(image_path))

        cleanup_raw_dir(raw_dir)


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