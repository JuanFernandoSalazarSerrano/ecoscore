from unihiker_k10 import temp_humi
import time


BG_COLOR = 0x0A0A0A
TITLE_COLOR = 0x00FFAA
TEXT_COLOR = 0xFFFFFF
VALUE_COLOR = 0xFFD700
ERROR_COLOR = 0xFF4444


def run(app):
    screen = app.screen
    screen.show_bg(color=BG_COLOR)
    screen.draw_text(text="Environment Monitor", x=10, y=10, font_size=20, color=TITLE_COLOR)
    screen.draw_line(x0=10, y0=35, x1=230, y1=35, color=TITLE_COLOR)
    screen.draw_text(text="Temperature (C):", x=10, y=50, font_size=18, color=TEXT_COLOR)
    screen.draw_text(text="Temperature (F):", x=10, y=105, font_size=18, color=TEXT_COLOR)
    screen.draw_text(text="Humidity:", x=10, y=160, font_size=18, color=TEXT_COLOR)
    screen.draw_text(text="B=Back  A=Send", x=10, y=290, font_size=12, color=TEXT_COLOR)
    screen.show_draw()

    app.ensure_wifi()

    last_temp_c = None
    last_temp_f = None
    last_humi = None
    last_post_ms = time.ticks_ms()

    while True:
        app.buttons.poll()
        if app.buttons.consume_b():
            return

        try:
            temp_c = round(temp_humi.read_temp(), 2)
            temp_f = round(temp_humi.read_temp_f(), 2)
            humi = round(temp_humi.read_humi(), 2)
        except Exception:
            _draw_error(screen, "Sensor read failed")
            time.sleep(0.2)
            continue

        changed = False
        if temp_c != last_temp_c:
            _draw_value(screen, 10, 75, temp_c, " C")
            last_temp_c = temp_c
            changed = True
        if temp_f != last_temp_f:
            _draw_value(screen, 10, 130, temp_f, " F")
            last_temp_f = temp_f
            changed = True
        if humi != last_humi:
            _draw_value(screen, 10, 185, humi, " %")
            last_humi = humi
            changed = True
        if changed:
            screen.show_draw()

        if app.buttons.consume_a():
            _post_reading(app, temp_c, temp_f, humi)
            last_post_ms = time.ticks_ms()
        else:
            if time.ticks_diff(time.ticks_ms(), last_post_ms) > app.config.TEMP_POST_INTERVAL_S * 1000:
                _post_reading(app, temp_c, temp_f, humi)
                last_post_ms = time.ticks_ms()

        time.sleep(0.2)


def _draw_value(screen, x, y, value, suffix):
    screen.draw_rect(x=x, y=y - 2, w=140, h=24, bcolor=BG_COLOR, fcolor=BG_COLOR)
    screen.draw_text(text=str(value) + suffix, x=x, y=y, font_size=22, color=VALUE_COLOR)


def _draw_error(screen, message):
    screen.draw_rect(x=10, y=220, w=220, h=24, bcolor=BG_COLOR, fcolor=BG_COLOR)
    screen.draw_text(text=message, x=10, y=220, font_size=14, color=ERROR_COLOR)
    screen.show_draw()


def _post_reading(app, temp_c, temp_f, humi):
    payload = {
        "temp_c": temp_c,
        "temp_f": temp_f,
        "humidity": humi,
    }
    app.http.post_json(app.config.TEMP_ENDPOINT_URL, payload)
