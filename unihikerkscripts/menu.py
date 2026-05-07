import time


class Menu:
    BG_COLOR = 0x0A0A0A
    TITLE_COLOR = 0x00FFAA
    TEXT_COLOR = 0xFFFFFF
    SELECTED_BG = 0x1F3B3B
    SELECTED_TEXT = 0x00FFAA

    def __init__(self, app, items):
        self._app = app
        self.items = items
        self._selected = 0
        self._last_selected = None

    def run(self):
        self._draw_static()
        self._draw_items(force=True)
        while True:
            self._app.buttons.poll()
            if self._app.buttons.consume_b():
                self._selected = (self._selected + 1) % len(self.items)
                self._draw_items()
            if self._app.buttons.consume_a():
                return self._selected
            time.sleep(0.05)

    def _draw_static(self):
        screen = self._app.screen
        screen.show_bg(color=self.BG_COLOR)
        screen.draw_text(text="Sensor Dashboard", x=10, y=10, font_size=20, color=self.TITLE_COLOR)
        screen.draw_line(x0=10, y0=35, x1=230, y1=35, color=self.TITLE_COLOR)
        screen.draw_text(text="A=Select  B=Next", x=10, y=290, font_size=12, color=self.TEXT_COLOR)
        screen.show_draw()

    def _draw_items(self, force=False):
        screen = self._app.screen
        items = self.items
        if force:
            self._last_selected = None
        for index, item in enumerate(items):
            y = 55 + index * 32
            is_selected = index == self._selected
            bg = self.SELECTED_BG if is_selected else self.BG_COLOR
            fg = self.SELECTED_TEXT if is_selected else self.TEXT_COLOR
            if force or is_selected or index == self._last_selected:
                screen.draw_rect(x=10, y=y - 2, w=220, h=28, bcolor=bg, fcolor=bg)
                screen.draw_text(text=item[0], x=16, y=y, font_size=18, color=fg)
        screen.show_draw()
        self._last_selected = self._selected
