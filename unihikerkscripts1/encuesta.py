from unihiker_k10 import button
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


bt_a=button(button.a)
bt_b=button(button.b)

ENDPOINT_URL = 'http://192.168.80.16:8080/api/sensor-readings/interview-answer'

a_was_pressed = False
b_was_pressed = False

def send_button_value(value):
    try:
        payload = {
            'value': value
        }
        response = requests.post(ENDPOINT_URL, json=payload)
        print('Sent:', payload, 'Response:', response.text)
        response.close()  # ✅ VERY IMPORTANT
    except Exception as e:
        print('HTTP Error:', e)

def button_a_pressed():
    global a_was_pressed
    a_was_pressed = True
    print("button_a_pressed")

def button_a_released():
    global a_was_pressed
    print("button_a_released")
    if a_was_pressed:
        send_button_value(1)
    a_was_pressed = False

def button_b_pressed():
    global b_was_pressed
    b_was_pressed = True
    print("button_b_pressed")

def button_b_released():
    global b_was_pressed
    print("button_b_released")
    if b_was_pressed:
        send_button_value(0)
    b_was_pressed = False

bt_a.event_pressed = button_a_pressed
bt_a.event_released = button_a_released
bt_b.event_pressed = button_b_pressed
bt_b.event_released = button_b_released

time.sleep(5)

while True:
    print("button_a.status=",bt_a.status())
    print("button_b.status=",bt_b.status())
    time.sleep(0.1)