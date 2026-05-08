from unihiker_k10 import screen
import time

from core import utils
from core.input import btn_a, btn_b

# --- EcoScore palette ---
SKY_TOP = 0xD9F8FF
SKY_MID = 0xC8F7E7
SKY_BOTTOM = 0xF2FFF7

EMERALD = 0x22C55E
DEEP_GREEN = 0x16A34A
LIME = 0x86EFAC
TEAL = 0x14B8A6
WHITE = 0xFFFFFF


# ---------------------------------------------------------------------------
# Background
# ---------------------------------------------------------------------------
def draw_gradient_background():
	screen.show_bg(color=SKY_TOP)
	screen.draw_rect(x=0, y=80,  w=240, h=120, bcolor=SKY_MID,    fcolor=SKY_MID)
	screen.draw_rect(x=0, y=160, w=240, h=160, bcolor=SKY_BOTTOM, fcolor=SKY_BOTTOM)

	# Ambient glow bubbles
	screen.draw_circle(x=30,  y=30,  r=24, bcolor=0xB8F5D1, fcolor=0xB8F5D1)
	screen.draw_circle(x=215, y=50,  r=30, bcolor=0xB8ECFF, fcolor=0xB8ECFF)
	screen.draw_circle(x=210, y=270, r=28, bcolor=0xD6FBE7, fcolor=0xD6FBE7)
	screen.draw_circle(x=20,  y=290, r=20, bcolor=0xC8F7E7, fcolor=0xC8F7E7)


# ---------------------------------------------------------------------------
# Header strip
# ---------------------------------------------------------------------------
def draw_header():
	screen.draw_rect(x=0,  y=0, w=240, h=38, bcolor=0xE8FFF2, fcolor=0xE8FFF2)
	screen.draw_rect(x=0,  y=0, w=240, h=34, bcolor=0xF7FFFB, fcolor=0xF7FFFB)

	cx, cy = 18, 17
	screen.set_width(width=2)
	screen.draw_circle(x=cx, y=cy, r=13, bcolor=EMERALD)
	screen.draw_circle(x=cx, y=cy, r=10, bcolor=LIME, fcolor=LIME)
	screen.draw_circle(x=cx, y=cy, r=6,  bcolor=WHITE, fcolor=WHITE)
	screen.draw_circle(x=cx-2, y=cy+1, r=3, bcolor=EMERALD,    fcolor=EMERALD)
	screen.draw_circle(x=cx+2, y=cy-2, r=3, bcolor=DEEP_GREEN, fcolor=DEEP_GREEN)
	screen.set_width(width=1)
	screen.draw_line(x0=cx-4, y0=cy+5, x1=cx+4, y1=cy-4, color=WHITE)

	screen.draw_text(text="Eco",   x=36,  y=3,  font_size=18, color=DEEP_GREEN)
	screen.draw_text(text="Score",  x=72,  y=3,  font_size=18, color=TEAL)
	screen.draw_text(text="MENU",   x=140, y=7,  font_size=13, color=0x3D8F75)

	screen.set_width(width=1)
	screen.draw_line(x0=0, y0=37, x1=240, y1=37, color=LIME)


# ---------------------------------------------------------------------------
# Glass card
# ---------------------------------------------------------------------------
def draw_question_card():
	screen.draw_rect(x=10, y=48, w=220, h=176, bcolor=0xE8FFF2, fcolor=0xE8FFF2)
	screen.draw_rect(x=14, y=52, w=212, h=168, bcolor=0xF7FFFB, fcolor=0xF7FFFB)

	# small accent line
	screen.draw_rect(x=18, y=60, w=8, h=54, bcolor=EMERALD, fcolor=EMERALD)


QUESTIONS = [
	("Siente que la", "universidad", "implementa medidas", "de control ecologico?"),
	("Considera que", "los residuos se", "gestionan bien", "en el campus?"),
	("Percibe buena", "calidad de aire", "en las aulas?"),
	("La energia se", "usa de forma", "responsable?"),
	("Hay acciones", "para proteger la", "biodiversidad?"),
	("El agua se usa", "con cuidado y", "sin desperdicio?"),
	("Se reduce el", "ruido en zonas", "de estudio?"),
	("Se informa sobre", "practicas", "ecologicas?"),
	("Participa en", "campanas de", "reciclaje?"),
	("Las areas verdes", "estan limpias", "y cuidadas?"),
]

LINE_Y = (68, 92, 116, 140)


def draw_question(lines, index, total):
	draw_gradient_background()
	draw_header()
	draw_question_card()

	for i, text in enumerate(lines):
		color = DEEP_GREEN if i % 2 == 0 else TEAL
		screen.draw_text(text=text, x=34, y=LINE_Y[i], font_size=16, color=color)

	screen.draw_text(
		text="Pregunta " + str(index + 1) + "/" + str(total),
		x=34, y=184,
		font_size=11,
		color=0x3D8F75
	)

	screen.show_draw()


def run():
	count = len(QUESTIONS)
	idx = 0

	draw_question(QUESTIONS[idx], idx, count)

	while True:
		if utils.pressed(btn_a):
			return
		if utils.pressed(btn_b):
			idx = (idx + 1) % count
			draw_question(QUESTIONS[idx], idx, count)
		time.sleep(0.05)