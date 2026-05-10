# k10_camera_final2.py
# FIX: initialise screen + camera BEFORE WiFi.
# Starting WiFi after screen.init() avoids the memory/peripheral clash
# that hard-crashes the ESP32-S3 and disconnects Thonny.

from unihiker_k10 import screen
from k10_base import Camera
import time

# --- EcoScore palette (matches main UI style) ---
SKY_TOP = 0xD9F8FF
SKY_MID = 0xC8F7E7
SKY_BOTTOM = 0xF2FFF7

EMERALD = 0x22C55E
DEEP_GREEN = 0x16A34A
LIME = 0x86EFAC
TEAL = 0x14B8A6
WHITE = 0xFFFFFF

CARD_BG = 0xF7FFFB
CARD_EDGE = 0xE8FFF2

LABEL_CLR = 0x3D8F75
VALUE_CLR = 0x2D6E5A

# Menu selection label (PAGE2). Update this based on the item that opened the camera.
MENU_LABEL = "Calidad Aire"

PAGE2_ENDPOINTS = {
    "Calidad Aire": "http://192.168.80.13:8000/calidadaire", #calidadaire
    "Riesgo Biologico": "http://192.168.80.13:8000/riesgobiologico",
    "Mat. Peligrosos": "http://192.168.80.13:8000/materialespeligrosos",
    "Gestion Residuos": "http://192.168.80.13:8000/gestionresiduos",
    "Cons. Energetico": "http://192.168.80.13:8000/consumoenergetico",
    "Biodiversidad": "http://192.168.80.13:8000/biodiversidad",
    "Gestion Agua": "http://192.168.80.13:8000/gestionagua",
    "Contam. Auditiva": "http://192.168.80.13:8000/contaminacionauditiva",
}

SERVER_URL = "http://192.168.80.13:8000/calidadaire"
if not SERVER_URL:
    raise ValueError("Unknown MENU_LABEL: " + MENU_LABEL)

# ── Step 1: Hardware first ─────────────────────────────────────────────────
print("Init screen...")
screen.init(dir=2)          # powers IO expander → camera VCC + RESET

SKY_TOP = 0xD9F8FF
SKY_MID = 0xC8F7E7
SKY_BOTTOM = 0xF2FFF7

EMERALD = 0x22C55E
DEEP_GREEN = 0x16A34A
LIME = 0x86EFAC
TEAL = 0x14B8A6
WHITE = 0xFFFFFF


def draw_gradient_background():
	# Soft layered background bands
	screen.show_bg(color=SKY_TOP)
	screen.draw_rect(x=0, y=80, w=240, h=120, bcolor=SKY_MID, fcolor=SKY_MID)
	screen.draw_rect(x=0, y=150, w=240, h=170, bcolor=SKY_BOTTOM, fcolor=SKY_BOTTOM)

	# Ambient glow bubbles
	screen.draw_circle(x=40, y=40, r=28, bcolor=0xB8F5D1, fcolor=0xB8F5D1)
	screen.draw_circle(x=210, y=55, r=35, bcolor=0xB8ECFF, fcolor=0xB8ECFF)
	screen.draw_circle(x=205, y=260, r=32, bcolor=0xD6FBE7, fcolor=0xD6FBE7)


def draw_glass_card():
	# Main translucent card look (simulated with soft fills)
	screen.draw_rect(x=18, y=36, w=204, h=240, bcolor=0xE8FFF2, fcolor=0xE8FFF2)
	screen.draw_rect(x=22, y=40, w=196, h=232, bcolor=0xF7FFFB, fcolor=0xF7FFFB)


def draw_score_ring(cx, cy):
	# Outer ring
	screen.set_width(width=4)
	screen.draw_circle(x=cx, y=cy, r=52, bcolor=EMERALD)
	# Inner glow
	screen.draw_circle(x=cx, y=cy, r=45, bcolor=LIME, fcolor=LIME)
	screen.draw_circle(x=cx, y=cy, r=36, bcolor=WHITE, fcolor=WHITE)


def draw_leaf_icon(cx, cy):
	# Stylized leaf body (stacked circles + stem line)
	screen.draw_circle(x=cx - 12, y=cy + 2, r=11, bcolor=EMERALD, fcolor=EMERALD)
	screen.draw_circle(x=cx + 8, y=cy - 8, r=12, bcolor=DEEP_GREEN, fcolor=DEEP_GREEN)
	screen.draw_circle(x=cx + 2, y=cy + 10, r=9, bcolor=TEAL, fcolor=TEAL)

	screen.set_width(width=2)
	screen.draw_line(x0=cx - 14, y0=cy + 20, x1=cx + 16, y1=cy - 12, color=WHITE)


def draw_brand_text():
    screen.draw_text(text="Eco", x=66, y=192, font_size=24, color=DEEP_GREEN)
    screen.draw_text(text="Score", x=112, y=192, font_size=24, color=TEAL)
    screen.draw_text(text="Apunta la camara a tu objetivo", x=70, y=220, font_size=11, color=0x3D8F75)


def draw_logo_scene():
	draw_gradient_background()
	draw_glass_card()
	draw_score_ring(120, 115)
	draw_leaf_icon(120, 115)
	draw_brand_text()
	screen.show_draw()


screen.init(dir=2)
draw_logo_scene()

print("Init camera...")
camera = Camera()
camera.init()
print("Camera ready.")
time.sleep(0.5)

update_status(MENU_LABEL, "starting", 0, "init", "camera ready")

# ── Step 2: WiFi after hardware is stable ──────────────────────────────────
import network
import urequests as requests

SSID     = "CELMASERRANO"
PASSWORD = "16447918"
INTERVAL_S = 1

wifi = network.WLAN(network.STA_IF)
wifi.active(True)
if wifi.isconnected():
    wifi.disconnect()
    time.sleep(0.5)

print("Connecting to Wi-Fi...")
wifi.connect(SSID, PASSWORD)
deadline = time.time() + 15
while not wifi.isconnected():
    if time.time() > deadline:
        raise RuntimeError("Wi-Fi timeout")
    print(".", end="")
    update_status(MENU_LABEL, "connecting", 0, "wifi", "waiting")
    time.sleep(1)
print("\nConnected:", wifi.ifconfig()[0])
update_status(MENU_LABEL, wifi.ifconfig()[0], 0, "wifi", "connected")

# ── Helpers ────────────────────────────────────────────────────────────────
def build_multipart(data, boundary=b"k10boundary"):
    crlf = b"\r\n"
    body = (b"--" + boundary + crlf +
            b'Content-Disposition: form-data; name="frame"; filename="frame.jpg"' + crlf +
            b"Content-Type: image/jpeg" + crlf + crlf +
            data + crlf +
            b"--" + boundary + b"--" + crlf)
    return body, b"multipart/form-data; boundary=" + boundary

# ── Main loop ──────────────────────────────────────────────────────────────
print("Sending frames...")
count = 0
try:
    while True:
        frame = camera.camera_capture()

        if not frame or len(frame) == 0:
            print("Empty frame, retrying...")
            time.sleep(0.5)
            continue

        count += 1
        is_jpeg = len(frame) >= 2 and frame[0] == 0xFF and frame[1] == 0xD8
        print(f"Frame {count}: {len(frame):,} bytes {'JPEG ✓' if is_jpeg else '(raw)'}")
        update_status(MENU_LABEL, wifi.ifconfig()[0], count, "capture", "ok")

        try:
            body, ctype = build_multipart(bytes(frame))
            resp = requests.post(SERVER_URL, data=body,
                                 headers = {
    "Content-Type": "application/octet-stream",
    "X-Pixel-Format": "RGB565",
    "X-Width": "320",
    "X-Height": "240",
    "X-Endian": "little",
})
            print(f"  → HTTP {resp.status_code}")
            update_status(MENU_LABEL, wifi.ifconfig()[0], count, "upload", resp.status_code)
            resp.close()
        except OSError as e:
            print(f"  → Upload error: {e}")
            update_status(MENU_LABEL, wifi.ifconfig()[0], count, "error", str(e))

        time.sleep(INTERVAL_S)

except KeyboardInterrupt:
    print("\nStopped.")
    update_status(MENU_LABEL, wifi.ifconfig()[0], count, "stopped", "user")
