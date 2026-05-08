from unihiker_k10 import screen, light
import time
from core import utils
from core.input import btn_a

SKY_TOP = 0xD9F8FF
DEEP_GREEN = 0x16A34A
TEAL = 0x14B8A6


def run():
	label_prefix = "Luz: "
	while True:
		if utils.pressed(btn_a):
			return
		value = light.read()
		utils.clear_screen(SKY_TOP)
		screen.draw_text(text=label_prefix + str(value), x=10, y=20, font_size=24, color=DEEP_GREEN)
		screen.draw_text(text="EcoScore", x=10, y=50, font_size=16, color=TEAL)
		screen.show_draw()
		for _ in range(10):
			if utils.pressed(btn_a):
				return
			time.sleep(0.1)
