# k10_camera_final2.py
# FIX: initialise screen + camera BEFORE WiFi.
# Starting WiFi after screen.init() avoids the memory/peripheral clash
# that hard-crashes the ESP32-S3 and disconnects Thonny.

from unihiker_k10 import screen
from k10_base import Camera
import time

# ── Step 1: Hardware first ─────────────────────────────────────────────────
print("Init screen...")
screen.init(dir=2)          # powers IO expander → camera VCC + RESET
print("Init camera...")
camera = Camera()
camera.init()
print("Camera ready.")
time.sleep(0.5)

# ── Step 2: WiFi after hardware is stable ──────────────────────────────────
import network
import urequests as requests

SSID     = "CELMASERRANO"
PASSWORD = "16447918"
INTERVAL_S = 1

# Menu selection label (PAGE2). Update this based on the item that opened the camera.
MENU_LABEL = "Calidad Aire"

PAGE2_ENDPOINTS = {
    "Calidad Aire": "http://192.168.80.13:8000/calidadaire",
    "Riesgo Biologico": "http://192.168.80.13:8000/riesgobiologico",
    "Mat. Peligrosos": "http://192.168.80.13:8000/materialespeligrosos",
    "Gestion Residuos": "http://192.168.80.13:8000/gestionresiduos",
    "Cons. Energetico": "http://192.168.80.13:8000/consumoenergetico",
    "Biodiversidad": "http://192.168.80.13:8000/biodiversidad",
    "Gestion Agua": "http://192.168.80.13:8000/gestionagua",
    "Contam. Auditiva": "http://192.168.80.13:8000/contaminacionauditiva",
}

SERVER_URL = PAGE2_ENDPOINTS.get(MENU_LABEL)
if not SERVER_URL:
    raise ValueError("Unknown MENU_LABEL: " + MENU_LABEL)

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
    time.sleep(1)
print("\nConnected:", wifi.ifconfig()[0])

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
            resp.close()
        except OSError as e:
            print(f"  → Upload error: {e}")

        time.sleep(INTERVAL_S)

except KeyboardInterrupt:
    print("\nStopped.")