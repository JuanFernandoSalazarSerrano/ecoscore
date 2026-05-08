from unihiker_k10 import screen
import time


# --- EcoScore palette (Frutiger Aero + eco glass style) ---
SKY_TOP = 0xD9F8FF
SKY_MID = 0xC8F7E7
SKY_BOTTOM = 0xF2FFF7

EMERALD = 0x22C55E
DEEP_GREEN = 0x16A34A
LIME = 0x86EFAC
TEAL = 0x14B8A6
WHITE = 0xFFFFFF


def draw_gradient_background():
	# Soft layered background bands
	screen.show_bg(color=SKY_TOP)
	screen.draw_rect(x=0, y=80, w=240, h=120, bcolor=SKY_MID, fcolor=SKY_MID)
	screen.draw_rect(x=0, y=150, w=240, h=170, bcolor=SKY_BOTTOM, fcolor=SKY_BOTTOM)

	# Ambient glow bubbles
	screen.draw_circle(x=40, y=40, r=28, bcolor=0xB8F5D1, fcolor=0xB8F5D1)
	screen.draw_circle(x=210, y=55, r=35, bcolor=0xB8ECFF, fcolor=0xB8ECFF)
	screen.draw_circle(x=205, y=260, r=32, bcolor=0xD6FBE7, fcolor=0xD6FBE7)


def draw_glass_card():
	# Main translucent card look (simulated with soft fills)
	screen.draw_rect(x=18, y=36, w=204, h=240, bcolor=0xE8FFF2, fcolor=0xE8FFF2)
	screen.draw_rect(x=22, y=40, w=196, h=232, bcolor=0xF7FFFB, fcolor=0xF7FFFB)


def draw_score_ring(cx, cy):
	# Outer ring
	screen.set_width(width=4)
	screen.draw_circle(x=cx, y=cy, r=52, bcolor=EMERALD)
	# Inner glow
	screen.draw_circle(x=cx, y=cy, r=45, bcolor=LIME, fcolor=LIME)
	screen.draw_circle(x=cx, y=cy, r=36, bcolor=WHITE, fcolor=WHITE)


def draw_leaf_icon(cx, cy):
	# Stylized leaf body (stacked circles + stem line)
	screen.draw_circle(x=cx - 12, y=cy + 2, r=11, bcolor=EMERALD, fcolor=EMERALD)
	screen.draw_circle(x=cx + 8, y=cy - 8, r=12, bcolor=DEEP_GREEN, fcolor=DEEP_GREEN)
	screen.draw_circle(x=cx + 2, y=cy + 10, r=9, bcolor=TEAL, fcolor=TEAL)

	screen.set_width(width=2)
	screen.draw_line(x0=cx - 14, y0=cy + 20, x1=cx + 16, y1=cy - 12, color=WHITE)


def draw_brand_text():
    screen.draw_text(text="Eco", x=66, y=192, font_size=24, color=DEEP_GREEN)
    screen.draw_text(text="Score", x=112, y=192, font_size=24, color=TEAL)
    screen.draw_text(text="MODULO PALADIN", x=70, y=220, font_size=11, color=0x3D8F75)


def draw_logo_scene():
	draw_gradient_background()
	draw_glass_card()
	draw_score_ring(120, 115)
	draw_leaf_icon(120, 115)
	draw_brand_text()
	screen.show_draw()


screen.init(dir=2)
draw_logo_scene()

while True:
	time.sleep(1)