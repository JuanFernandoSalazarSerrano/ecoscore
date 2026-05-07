from unihiker_k10 import button
import time


class ButtonManager:
    def __init__(self, debounce_ms=60):
        self._a = button(button.a)
        self._b = button(button.b)
        self._debounce_ms = debounce_ms
        self._last_a = self._a.status()
        self._last_b = self._b.status()
        now = time.ticks_ms()
        self._last_change_a = now
        self._last_change_b = now
        self._pressed_a = False
        self._pressed_b = False

    def poll(self):
        now = time.ticks_ms()
        current_a = self._a.status()
        if current_a != self._last_a and time.ticks_diff(now, self._last_change_a) > self._debounce_ms:
            self._last_change_a = now
            self._last_a = current_a
            if current_a == 1:
                self._pressed_a = True

        current_b = self._b.status()
        if current_b != self._last_b and time.ticks_diff(now, self._last_change_b) > self._debounce_ms:
            self._last_change_b = now
            self._last_b = current_b
            if current_b == 1:
                self._pressed_b = True

    def consume_a(self):
        if self._pressed_a:
            self._pressed_a = False
            return True
        return False

    def consume_b(self):
        if self._pressed_b:
            self._pressed_b = False
            return True
        return False
