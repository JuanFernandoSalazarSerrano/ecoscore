#!/usr/bin/env python3
"""
decode_frames.py
Converts .bin RGB565 frames to PNG with:
  - Auto-detection of the correct header skip offset (fixes the wrap-around)
  - GC2145 white balance / colour correction
  - Optional rotation
"""
from pathlib import Path
import numpy as np
from PIL import Image, ImageEnhance

RAW_DIR = Path("frames/raw")
DEC_DIR = Path("frames/decoded")
DEBUG_DIR = Path("frames/debug")   # offset-sweep samples written here

WIDTH  = 240
HEIGHT = 320
BPP    = 2                         # bytes per pixel (RGB565)
FRAME_BYTES = WIDTH * HEIGHT * BPP # 153 600 bytes

# If you already know the correct offset set this; None = auto-detect
FORCE_SKIP: int | None = None

# Rotation to apply after decoding (0 / 90 / 180 / 270)
ROTATE = 0

RAW_DIR.mkdir(parents=True, exist_ok=True)
DEC_DIR.mkdir(parents=True, exist_ok=True)
DEBUG_DIR.mkdir(parents=True, exist_ok=True)

# ── colour-correction matrices for GC2145 ────────────────────────────────
# The sensor pushes blue; pull it back and boost red slightly.
WB_SCALE = np.array([1.15, 1.00, 0.80], dtype=np.float32)   # R, G, B gains
SATURATION = 1.15     # slight saturation boost
CONTRAST   = 1.05     # slight contrast boost


def rgb565_to_rgb888(data: bytes, offset: int) -> np.ndarray:
    """Decode WIDTH×HEIGHT RGB565 little-endian pixels starting at `offset`."""
    chunk = data[offset: offset + FRAME_BYTES]
    arr = np.frombuffer(chunk, dtype="<u2").reshape((HEIGHT, WIDTH))
    r = ((arr >> 11) & 0x1F) * (255 / 31)
    g = ((arr >>  5) & 0x3F) * (255 / 63)
    b = ( arr        & 0x1F) * (255 / 31)
    rgb = np.dstack((r, g, b)).astype(np.float32)
    return rgb


def colour_correct(rgb: np.ndarray) -> np.ndarray:
    """Apply white-balance gains and clamp to uint8."""
    rgb = rgb * WB_SCALE                     # per-channel gain
    rgb = np.clip(rgb, 0, 255).astype(np.uint8)
    return rgb


def wrap_score(rgb: np.ndarray) -> float:
    """
    Measure the colour discontinuity between the last and first row.
    A correctly-aligned frame has a low score; a wrapped frame has a high score.
    """
    top    = rgb[0 , :, :].astype(np.float32)
    bottom = rgb[-1, :, :].astype(np.float32)
    return float(np.mean(np.abs(top - bottom)))


def find_best_offset(data: bytes) -> int:
    """
    Sweep candidate offsets and pick the one with the smallest wrap discontinuity.
    Tries every 2-byte-aligned offset from 0 to 512.
    """
    best_offset = 0
    best_score  = float("inf")

    max_start = len(data) - FRAME_BYTES
    candidates = [o for o in range(0, min(513, max_start + 1), BPP)]

    scores = {}
    for off in candidates:
        rgb = rgb565_to_rgb888(data, off)
        s   = wrap_score(rgb)
        scores[off] = s
        if s < best_score:
            best_score  = s
            best_offset = off

    print(f"  Offset sweep (top 5 candidates):")
    for off, sc in sorted(scores.items(), key=lambda x: x[1])[:5]:
        marker = " ← CHOSEN" if off == best_offset else ""
        print(f"    skip={off:4d}  wrap_score={sc:7.2f}{marker}")

    return best_offset


def make_image(rgb_raw: np.ndarray, rotate: int = 0) -> Image.Image:
    img = Image.fromarray(rgb_raw, mode="RGB")
    if rotate:
        img = img.rotate(rotate, expand=True)
    img = ImageEnhance.Color(img).enhance(SATURATION)
    img = ImageEnhance.Contrast(img).enhance(CONTRAST)
    return img


def save_debug_sweep(data: bytes, stem: str):
    """Save a few offset candidates side-by-side for manual inspection."""
    strips = []
    for off in range(0, min(513, len(data) - FRAME_BYTES + 1), 64):
        rgb = colour_correct(rgb565_to_rgb888(data, off))
        img = Image.fromarray(rgb)
        # Label with the offset
        strips.append(img.crop((0, 0, WIDTH, 40)))   # top sliver only

    if not strips:
        return
    contact = Image.new("RGB", (WIDTH * len(strips), 40))
    for i, s in enumerate(strips):
        contact.paste(s, (i * WIDTH, 0))
    contact.save(DEBUG_DIR / f"{stem}_sweep.png")


def main():
    files = sorted(RAW_DIR.glob("*.bin"))
    if not files:
        print(f"No .bin files in {RAW_DIR}")
        return

    # Cache offset from first file if auto-detecting, reuse for the rest
    cached_offset: int | None = FORCE_SKIP

    for path in files:
        data = path.read_bytes()
        print(f"\n{path.name}  ({len(data):,} bytes)")

        if len(data) < FRAME_BYTES:
            print(f"  ✗ too small, skipping")
            continue

        if cached_offset is None:
            print(f"  Auto-detecting offset...")
            cached_offset = find_best_offset(data)
            save_debug_sweep(data, path.stem)
            print(f"  → Using skip={cached_offset} bytes for all frames")
            print(f"    (set FORCE_SKIP={cached_offset} to hard-code this)")
        else:
            print(f"  Using skip={cached_offset}")

        try:
            rgb_raw = colour_correct(rgb565_to_rgb888(data, cached_offset))
            img     = make_image(rgb_raw, rotate=ROTATE)
            out     = DEC_DIR / f"{path.stem}.png"
            img.save(out)
            print(f"  ✓ saved → {out}")
        except Exception as e:
            print(f"  ✗ {e}")


if __name__ == "__main__":
    main()