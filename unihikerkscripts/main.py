from unihiker_k10 import screen
import time

from core import utils
from core.state import state
from core.navigation import move_down, select_item
from core.input import btn_a, btn_b
from modules import (
	light_sensor,
	humidity,
	temperature,
	accelerometer,
	audio,
	encuesta,
	calidadaire,
	riesgobiologico,
	materialespeligrosos,
	gestionresiduos,
	consumoenergetico,
	biodiversidad,
	gestionagua,
	contaminacionauditiva,
)

# --- EcoScore palette (Frutiger Aero + eco glass style) ---
SKY_TOP    = 0xD9F8FF
SKY_MID    = 0xC8F7E7
SKY_BOTTOM = 0xF2FFF7

EMERALD    = 0x22C55E
DEEP_GREEN = 0x16A34A
LIME       = 0x86EFAC
TEAL       = 0x14B8A6
WHITE      = 0xFFFFFF

# --- Category accent colours (stays within palette) ---
SENSOR_CLR = EMERALD      # temperature, humidity, accel, light
SURVEY_CLR = TEAL         # question fields
ECO_CLR    = DEEP_GREEN   # air, biodiversity, water, waste
RISK_CLR   = 0xF0A500     # biological risk, hazardous materials
ENERGY_CLR = 0x06B6D4     # energy & noise


# --- Menu pages (label, dot colour) ---
PAGE1 = [
	("Temperatura °C",   SENSOR_CLR),
	("Temperatura °F",   SENSOR_CLR),
	("Humedad",          SENSOR_CLR),
	("Acelerometro",     SENSOR_CLR),
	("Luz Ambiental",    SENSOR_CLR),
	("Entrevista",       SURVEY_CLR),
]

PAGE2 = [
	("Calidad Aire",     ECO_CLR),
	("Riesgo Biologico", RISK_CLR),
	("Mat. Peligrosos",  RISK_CLR),
	("Gestion Residuos", ECO_CLR),
	("Cons. Energetico", ENERGY_CLR),
	("Biodiversidad",    ECO_CLR),
	("Gestion Agua",     TEAL),
	("Contam. Auditiva", ENERGY_CLR),
]

PAGES = [PAGE1, PAGE2]
TOTAL_PAGES = len(PAGES)


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
# Header strip  (replaces the full logo card)
# ---------------------------------------------------------------------------
def draw_header():
	# Header band
	screen.draw_rect(x=0,  y=0, w=240, h=38, bcolor=0xE8FFF2, fcolor=0xE8FFF2)
	screen.draw_rect(x=0,  y=0, w=240, h=34, bcolor=0xF7FFFB, fcolor=0xF7FFFB)

	# Tiny leaf ring icon
	cx, cy = 18, 17
	screen.set_width(width=2)
	screen.draw_circle(x=cx, y=cy, r=13, bcolor=EMERALD)
	screen.draw_circle(x=cx, y=cy, r=10, bcolor=LIME, fcolor=LIME)
	screen.draw_circle(x=cx, y=cy, r=6,  bcolor=WHITE, fcolor=WHITE)
	# Leaf blobs inside icon
	screen.draw_circle(x=cx-2, y=cy+1, r=3, bcolor=EMERALD,    fcolor=EMERALD)
	screen.draw_circle(x=cx+2, y=cy-2, r=3, bcolor=DEEP_GREEN, fcolor=DEEP_GREEN)
	screen.set_width(width=1)
	screen.draw_line(x0=cx-4, y0=cy+5, x1=cx+4, y1=cy-4, color=WHITE)

	# Brand text
	screen.draw_text(text="Eco",   x=36,  y=3,  font_size=18, color=DEEP_GREEN)
	screen.draw_text(text="Score", x=72,  y=3,  font_size=18, color=TEAL)
	screen.draw_text(text="MENU",  x=140, y=7,  font_size=13, color=0x3D8F75)

	# Thin separator line
	screen.set_width(width=1)
	screen.draw_line(x0=0, y0=37, x1=240, y1=37, color=LIME)


# ---------------------------------------------------------------------------
# Glass card that holds the menu list
# ---------------------------------------------------------------------------
def draw_menu_card():
	screen.draw_rect(x=10, y=42, w=220, h=248, bcolor=0xE8FFF2, fcolor=0xE8FFF2)
	screen.draw_rect(x=14, y=46, w=212, h=240, bcolor=0xF7FFFB, fcolor=0xF7FFFB)


# ---------------------------------------------------------------------------
# Individual menu row
# ---------------------------------------------------------------------------
ITEM_H   = 29       # row height in px
ITEM_X0  = 14       # card left edge
ITEM_W   = 212      # card width
LIST_Y0  = 47       # y of first item top


def draw_menu_item(index, label, dot_color, selected=False):
	iy = LIST_Y0 + index * ITEM_H

	# Highlight band for selected row
	if selected:
		screen.draw_rect(
			x=ITEM_X0 + 2, y=iy + 1,
			w=ITEM_W - 4,  h=ITEM_H - 2,
			bcolor=0xD1FAE5, fcolor=0xD1FAE5
		)
		# Left accent bar
		screen.draw_rect(
			x=ITEM_X0 + 2, y=iy + 1,
			w=3,            h=ITEM_H - 2,
			bcolor=EMERALD, fcolor=EMERALD
		)

	# Separator between rows (skip top of first)
	if index > 0:
		screen.set_width(width=1)
		screen.draw_line(
			x0=ITEM_X0 + 8, y0=iy,
			x1=ITEM_X0 + ITEM_W - 8, y1=iy,
			color=0xD1FAE5
		)

	# Coloured category dot
	dot_x = ITEM_X0 + 14
	dot_y = iy + ITEM_H // 2
	screen.draw_circle(x=dot_x, y=dot_y, r=5, bcolor=dot_color, fcolor=dot_color)

	# Label
	text_color = DEEP_GREEN if selected else 0x2D6E5A
	screen.draw_text(
		text=label,
		x=dot_x + 10, y=iy + 7,
		font_size=13,
		color=text_color
	)


# ---------------------------------------------------------------------------
# Footer  –  page indicator + nav hint arrows
# ---------------------------------------------------------------------------
def draw_footer(page_idx):
	fy = 294
	# Footer band
	screen.draw_rect(x=0, y=fy, w=240, h=26, bcolor=0xE8FFF2, fcolor=0xE8FFF2)
	screen.set_width(width=1)
	screen.draw_line(x0=0, y0=fy, x1=240, y1=fy, color=LIME)

	# Left arrow (prev page)  – decorative only
	screen.draw_text(text="<",      x=16,  y=fy + 5, font_size=14, color=0x3D8F75)

	# Page indicator dots
	for i in range(TOTAL_PAGES):
		dot_c = EMERALD if i == page_idx else LIME
		screen.draw_circle(x=108 + i * 16, y=fy + 12, r=5, bcolor=dot_c, fcolor=dot_c)

	# Right arrow (next page) – decorative only
	screen.draw_text(text=">",      x=218, y=fy + 5, font_size=14, color=0x3D8F75)

	# Sub-label
	screen.draw_text(
		text=str(page_idx + 1) + "/" + str(TOTAL_PAGES),
		x=148, y=fy + 7,
		font_size=11,
		color=0x3D8F75
	)


# ---------------------------------------------------------------------------
# Startup logo
# ---------------------------------------------------------------------------
def draw_logo_card():
	screen.draw_rect(x=18, y=36, w=204, h=240, bcolor=0xE8FFF2, fcolor=0xE8FFF2)
	screen.draw_rect(x=22, y=40, w=196, h=232, bcolor=0xF7FFFB, fcolor=0xF7FFFB)


def draw_score_ring(cx, cy):
	screen.set_width(width=4)
	screen.draw_circle(x=cx, y=cy, r=52, bcolor=EMERALD)
	screen.draw_circle(x=cx, y=cy, r=45, bcolor=LIME, fcolor=LIME)
	screen.draw_circle(x=cx, y=cy, r=36, bcolor=WHITE, fcolor=WHITE)
	screen.set_width(width=1)


def draw_leaf_icon(cx, cy):
	screen.draw_circle(x=cx - 12, y=cy + 2, r=11, bcolor=EMERALD, fcolor=EMERALD)
	screen.draw_circle(x=cx + 8, y=cy - 8, r=12, bcolor=DEEP_GREEN, fcolor=DEEP_GREEN)
	screen.draw_circle(x=cx + 2, y=cy + 10, r=9, bcolor=TEAL, fcolor=TEAL)

	screen.set_width(width=2)
	screen.draw_line(x0=cx - 14, y0=cy + 20, x1=cx + 16, y1=cy - 12, color=WHITE)
	screen.set_width(width=1)


def draw_brand_text():
	screen.draw_text(text="Eco", x=66, y=192, font_size=24, color=DEEP_GREEN)
	screen.draw_text(text="Score", x=112, y=192, font_size=24, color=TEAL)
	screen.draw_text(text="MODULO PALADIN", x=70, y=220, font_size=11, color=0x3D8F75)


def draw_logo_scene():
	draw_gradient_background()
	draw_logo_card()
	draw_score_ring(120, 115)
	draw_leaf_icon(120, 115)
	draw_brand_text()
	screen.show_draw()


def show_startup_logo(duration_s=2.0):
	draw_logo_scene()
	time.sleep(duration_s)


# ---------------------------------------------------------------------------
# Full scene render
# ---------------------------------------------------------------------------
def draw_menu_scene(page_idx=0, selected=0):
	items = PAGES[page_idx]

	draw_gradient_background()
	draw_menu_card()
	draw_header()

	for i, (label, dot_color) in enumerate(items):
		draw_menu_item(i, label, dot_color, selected=(i == selected))

	draw_footer(page_idx)
	screen.show_draw()


def run():
	def _noop(*_args, **_kwargs):
		return None

	btn_a.event_pressed = _noop
	btn_b.event_pressed = _noop

	screen.init(dir=2)
	show_startup_logo(2.0)
	state["needs_redraw"] = True

	def run_module(fn):
		try:
			fn()
		finally:
			screen.init(dir=2)
			utils.clear_screen(SKY_TOP)
			draw_menu_scene(page_idx=state["page"], selected=state["selected"])
			state["needs_redraw"] = False

	def show_not_ready(label):
		utils.clear_screen(SKY_TOP)
		screen.draw_text(text="Sin script", x=10, y=20, font_size=18, color=DEEP_GREEN)
		screen.draw_text(text=label, x=10, y=45, font_size=12, color=TEAL)
		screen.show_draw()
		for _ in range(10):
			if utils.pressed(btn_a):
				return
			time.sleep(0.1)

	while True:
		if state["pending_action"]:
			label = state["pending_action"]
			state["pending_action"] = None

			if label == "Temperatura °C":
				state["temp_unit"] = "C"
				run_module(temperature.run)
			elif label == "Temperatura °F":
				state["temp_unit"] = "F"
				run_module(temperature.run)
			elif label == "Humedad":
				run_module(humidity.run)
			elif label == "Acelerometro":
				run_module(accelerometer.run)
			elif label == "Luz Ambiental":
				run_module(light_sensor.run)
			elif label == "Entrevista":
				run_module(encuesta.run)
			elif label == "Audio":
				run_module(audio.run)
			elif label == "Calidad Aire":
				run_module(calidadaire.run)
			elif label == "Riesgo Biologico":
				run_module(riesgobiologico.run)
			elif label == "Mat. Peligrosos":
				run_module(materialespeligrosos.run)
			elif label == "Gestion Residuos":
				run_module(gestionresiduos.run)
			elif label == "Cons. Energetico":
				run_module(consumoenergetico.run)
			elif label == "Biodiversidad":
				run_module(biodiversidad.run)
			elif label == "Gestion Agua":
				run_module(gestionagua.run)
			elif label == "Contam. Auditiva":
				run_module(contaminacionauditiva.run)
			else:
				run_module(lambda: show_not_ready(label))

		if utils.pressed(btn_a):
			move_down(state, PAGES)
		if utils.pressed(btn_b):
			select_item(state, PAGES)

		if state["needs_redraw"]:
			draw_menu_scene(page_idx=state["page"], selected=state["selected"])
			state["needs_redraw"] = False

		time.sleep(0.05)


if __name__ == "__main__":
	run()

