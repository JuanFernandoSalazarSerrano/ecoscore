from unihiker_k10 import light
import time


BG_COLOR = 0x0A0A0A
TITLE_COLOR = 0x00FFAA
TEXT_COLOR = 0xFFFFFF
VALUE_COLOR = 0xFFD700
ERROR_COLOR = 0xFF4444


def run(app):
    screen = app.screen
    screen.show_bg(color=BG_COLOR)
    screen.draw_text(text="Ambient Light", x=10, y=10, font_size=20, color=TITLE_COLOR)
    screen.draw_line(x0=10, y0=35, x1=230, y1=35, color=TITLE_COLOR)
    screen.draw_text(text="Lux:", x=10, y=70, font_size=18, color=TEXT_COLOR)
    screen.draw_text(text="B=Back  A=Send", x=10, y=290, font_size=12, color=TEXT_COLOR)
    screen.show_draw()

    app.ensure_wifi()

    last_lux = None
    last_post_ms = time.ticks_ms()

    while True:
        app.buttons.poll()
        if app.buttons.consume_b():
            return

        try:
            lux = light.read()
        except Exception:
            _draw_error(screen, "Sensor read failed")
            time.sleep(0.2)
            continue

        if lux != last_lux:
            _draw_value(screen, 10, 95, lux)
            last_lux = lux
            screen.show_draw()

        if app.buttons.consume_a():
            _post_reading(app, lux)
            last_post_ms = time.ticks_ms()
        else:
            if time.ticks_diff(time.ticks_ms(), last_post_ms) > app.config.LIGHT_POST_INTERVAL_S * 1000:
                _post_reading(app, lux)
                last_post_ms = time.ticks_ms()

        time.sleep(0.2)


def _draw_value(screen, x, y, value):
    screen.draw_rect(x=x, y=y - 2, w=140, h=24, bcolor=BG_COLOR, fcolor=BG_COLOR)
    screen.draw_text(text=str(value), x=x, y=y, font_size=22, color=VALUE_COLOR)


def _draw_error(screen, message):
    screen.draw_rect(x=10, y=220, w=220, h=24, bcolor=BG_COLOR, fcolor=BG_COLOR)
    screen.draw_text(text=message, x=10, y=220, font_size=14, color=ERROR_COLOR)
    screen.show_draw()


def _post_reading(app, lux):
    payload = {"lux": lux}
    app.http.post_json(app.config.LIGHT_ENDPOINT_URL, payload)
