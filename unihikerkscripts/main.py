from unihiker_k10 import screen
import time

import config
from app_context import AppContext
from network_manager import NetworkManager
from http_client import HttpClient
from input_manager import ButtonManager
from menu import Menu
from sensors import temperature_sensor, light_sensor


def build_app():
    screen.init(dir=config.SCREEN_DIR)
    buttons = ButtonManager()
    network_manager = NetworkManager()
    http_client = HttpClient(network_manager)
    return AppContext(screen, buttons, network_manager, http_client, config)


def main():
    app = build_app()
    menu = Menu(
        app,
        [
            ("Temperature/Humidity", temperature_sensor),
            ("Ambient Light", light_sensor),
        ],
    )

    while True:
        selected = menu.run()
        if selected is None:
            time.sleep(0.1)
            continue
        module = menu.items[selected][1]
        try:
            module.run(app)
        except Exception:
            screen.show_bg(color=0x000000)
            screen.draw_text(text="Sensor error", x=10, y=120, font_size=18, color=0xFF4444)
            screen.draw_text(text="Press B", x=10, y=150, font_size=14, color=0xFFFFFF)
            screen.show_draw()
            while True:
                app.buttons.poll()
                if app.buttons.consume_b():
                    break
                time.sleep(0.1)


main()
