from unihiker_k10 import temp_humi, screen
import time
import urequests as requests  # ✅ correct for MicroPython
import network
import time

SSID = "CELMASERRANO"
PASSWORD = "16447918"

wifi = network.WLAN(network.STA_IF)
wifi.active(True)

# Optional: disconnect first if already connected
if wifi.isconnected():
    wifi.disconnect()

print("Connecting to WiFi...")
wifi.connect(SSID, PASSWORD)

# Wait for connection
timeout = 10  # seconds
start = time.time()

while not wifi.isconnected():
    if time.time() - start > timeout:
        print("❌ Connection timeout")
        break
    print(".", end="")
    time.sleep(1)

if wifi.isconnected():
    print("\n✅ Connected!")
    print("IP:", wifi.ifconfig()[0])
else:
    print("\n❌ Failed to connect")
    

# Colors
BG_COLOR = 0x0A0A0A
TITLE_COLOR = 0x00FFAA
TEXT_COLOR = 0xFFFFFF
VALUE_COLOR = 0xFFD700

# Init screen
screen.init(dir=2)
screen.show_bg(color=BG_COLOR)

# --- DRAW UI ONCE ---
screen.draw_text(text="Environment Monitor", x=10, y=10, font_size=20, color=TITLE_COLOR)
screen.draw_line(x0=10, y0=35, x1=230, y1=35, color=TITLE_COLOR)

screen.draw_text(text="Temperature (C):", x=10, y=50, font_size=18, color=TEXT_COLOR)
screen.draw_text(text="Temperature (F):", x=10, y=105, font_size=18, color=TEXT_COLOR)
screen.draw_text(text="Humidity:", x=10, y=160, font_size=18, color=TEXT_COLOR)

screen.show_draw()

last_temp_c = None
last_temp_f = None
last_humi = None

while True:
    temp_c = round(temp_humi.read_temp(), 2)
    temp_f = round(temp_humi.read_temp_f(), 2)
    humi = round(temp_humi.read_humi(), 2)

    # UI updates (unchanged)
    if temp_c != last_temp_c:
        screen.draw_text(text="            ", x=10, y=75, font_size=22, color=BG_COLOR)
        screen.draw_text(text=str(temp_c) + " °C", x=10, y=75, font_size=22, color=VALUE_COLOR)
        last_temp_c = temp_c

    if temp_f != last_temp_f:
        screen.draw_text(text="            ", x=10, y=130, font_size=22, color=BG_COLOR)
        screen.draw_text(text=str(temp_f) + " °F", x=10, y=130, font_size=22, color=VALUE_COLOR)
        last_temp_f = temp_f

    if humi != last_humi:
        screen.draw_text(text="            ", x=10, y=185, font_size=22, color=BG_COLOR)
        screen.draw_text(text=str(humi) + " %", x=10, y=185, font_size=22, color=VALUE_COLOR)
        last_humi = humi

    screen.show_draw()

    print(f"Temp: {temp_c}C | {temp_f}F | Humidity: {humi}%")

    # --- HTTP REQUEST ---
    try:
        url = 'http://192.168.80.16:8080/api/sensor-readings'
        payload = {
            'temp_c': temp_c,
            'temp_f': temp_f,
            'humidity': humi
        }

        response = requests.post(url, json=payload)

        print("Response:", response.text)

        response.close()  # ✅ VERY IMPORTANT

    except Exception as e:
        print("HTTP Error:", e)

    time.sleep(5)