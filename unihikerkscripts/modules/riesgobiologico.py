# k10_camera_module.py
# Sends camera frames to the sensor endpoint matching this module name.

from unihiker_k10 import screen
from k10_base import Camera
import time
import socket
import gc
import network
import urequests as requests
from modules.camera_prompt import draw_camera_prompt, force_reset

SSID = "redmi28"
PASSWORD = "guru1234"
INTERVAL_S = 0.1
DURATION_S = 13

SENSOR_NAME = __name__.split(".")[-1]
SERVER_URL = "http://10.120.158.240:8000/" + SENSOR_NAME
PURPOSE = "riesgo biologico"


def build_multipart(data, boundary=b"k10boundary"):
    crlf = b"\r\n"
    body = (b"--" + boundary + crlf +
            b'Content-Disposition: form-data; name="frame"; filename="frame.jpg"' + crlf +
            b"Content-Type: image/jpeg" + crlf + crlf +
            data + crlf +
            b"--" + boundary + b"--" + crlf)
    return body, b"multipart/form-data; boundary=" + boundary


def run():
    print("Init screen...")
    screen.init(dir=2)
    draw_camera_prompt(PURPOSE)
    print("Init camera...")
    camera = None
    wifi = None
    camera = Camera()
    camera.init()
    print("Camera ready.")
    time.sleep(0.5)

    try:
        socket.setdefaulttimeout(2)
    except Exception:
        pass

    wifi = network.WLAN(network.STA_IF)
    wifi.active(True)

    if not wifi.isconnected():
        print("Connecting to Wi-Fi...")
        wifi.connect(SSID, PASSWORD)
        deadline = time.time() + 15
        while not wifi.isconnected():
            if time.time() > deadline:
                raise RuntimeError("Wi-Fi timeout")
            print(".", end="")
            time.sleep(1)

    print("\nConnected:", wifi.ifconfig()[0])
    time.sleep(5)

    print("Sending frames...")
    count = 0
    end_time = time.time() + DURATION_S
    try:
        while True:
            if time.time() >= end_time:
                break
            frame = camera.camera_capture()

            if not frame or len(frame) == 0:
                print("Empty frame, retrying...")
                time.sleep(0.5)
                continue

            count += 1
            is_jpeg = len(frame) >= 2 and frame[0] == 0xFF and frame[1] == 0xD8
            print(f"Frame {count}: {len(frame):,} bytes {'JPEG OK' if is_jpeg else '(raw)'}")

            try:
                body, ctype = build_multipart(bytes(frame))
                resp = requests.post(SERVER_URL, data=body,
                                     headers={
                                         "Content-Type": "application/octet-stream",
                                         "X-Pixel-Format": "RGB565",
                                         "X-Width": "320",
                                         "X-Height": "240",
                                         "X-Endian": "little",
                                     })
                print(f"  -> HTTP {resp.status_code}")
                resp.close()
            except OSError as e:
                print(f"  -> Upload error: {e}")

            time.sleep(INTERVAL_S)

    except KeyboardInterrupt:
        print("\nStopped.")
    finally:
        if camera is not None:
            try:
                if hasattr(camera, "deinit"):
                    camera.deinit()
            except Exception:
                pass
        if wifi is not None:
            try:
                wifi.active(False)
            except Exception:
                pass
        try:
            gc.collect()
        except Exception:
            pass

    print("Time window ended.")
    force_reset()
