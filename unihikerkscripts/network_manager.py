import network
import time


class NetworkManager:
    def __init__(self):
        self._wlan = network.WLAN(network.STA_IF)
        self._wlan.active(True)
        self._connected_ssid = None

    def is_connected(self):
        return self._wlan.isconnected()

    def connect(self, ssid, password, timeout_s=10):
        if self.is_connected() and self._connected_ssid == ssid:
            return True
        if self.is_connected():
            try:
                self._wlan.disconnect()
            except Exception:
                pass
        try:
            self._wlan.connect(ssid, password)
        except Exception:
            return False
        start = time.time()
        while not self.is_connected():
            if time.time() - start > timeout_s:
                return False
            time.sleep(0.2)
        self._connected_ssid = ssid
        return True

    def ip(self):
        if not self.is_connected():
            return None
        return self._wlan.ifconfig()[0]
