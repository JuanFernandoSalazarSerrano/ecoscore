from unihiker_k10 import screen, temp_humi
import time
from core import utils
from core.input import btn_a

SKY_TOP = 0xD9F8FF
SKY_MID = 0xC8F7E7
SKY_BOTTOM = 0xF2FFF7

EMERALD = 0x22C55E
DEEP_GREEN = 0x16A34A
LIME = 0x86EFAC
TEAL = 0x14B8A6
WHITE = 0xFFFFFF


def draw_background():
	screen.show_bg(color=SKY_TOP)
	screen.draw_rect(x=0, y=90, w=240, h=100, bcolor=SKY_MID, fcolor=SKY_MID)
	screen.draw_rect(x=0, y=170, w=240, h=150, bcolor=SKY_BOTTOM, fcolor=SKY_BOTTOM)
	screen.draw_circle(x=30, y=40, r=24, bcolor=0xB8F5D1, fcolor=0xB8F5D1)
	screen.draw_circle(x=210, y=55, r=30, bcolor=0xB8ECFF, fcolor=0xB8ECFF)


def draw_card():
	screen.draw_rect(x=18, y=30, w=204, h=240, bcolor=0xE8FFF2, fcolor=0xE8FFF2)
	screen.draw_rect(x=22, y=34, w=196, h=232, bcolor=0xF7FFFB, fcolor=0xF7FFFB)


def draw_header():
	screen.draw_circle(x=55, y=70, r=18, bcolor=TEAL, fcolor=TEAL)
	screen.draw_circle(x=55, y=70, r=12, bcolor=LIME, fcolor=LIME)
	screen.draw_circle(x=55, y=70, r=5, bcolor=WHITE, fcolor=WHITE)

	screen.draw_text(text="EcoScore", x=82, y=58, font_size=22, color=DEEP_GREEN)
	screen.draw_text(text="HUMIDITY", x=82, y=84, font_size=10, color=TEAL)


def draw_value_box():
	screen.draw_rect(x=40, y=145, w=160, h=42, bcolor=0xDDF8EA, fcolor=0xDDF8EA)


def run():
	draw_background()
	draw_card()
	draw_header()
	draw_value_box()
	while True:
		if utils.pressed(btn_a):
			return
		humi = temp_humi.read_humi()
		draw_value_box()
		screen.draw_text(text="H: " + str(humi) + " %RH", x=55, y=152, font_size=18, color=DEEP_GREEN)
		screen.show_draw()
		for _ in range(10):
			if utils.pressed(btn_a):
				return
			time.sleep(0.1)
