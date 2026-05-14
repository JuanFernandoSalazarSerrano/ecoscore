from unihiker_k10 import screen
import time
from core import utils
from core.input import btn_a, btn_b

# --- EcoScore palette (shared camera prompt) ---
SKY_TOP = 0xD9F8FF
SKY_MID = 0xC8F7E7
SKY_BOTTOM = 0xF2FFF7

EMERALD = 0x22C55E
DEEP_GREEN = 0x16A34A
LIME = 0x86EFAC
TEAL = 0x14B8A6
WHITE = 0xFFFFFF

TEXT_COLOR = 0x3D8F75


def draw_gradient_background():
    screen.show_bg(color=SKY_TOP)
    screen.draw_rect(x=0, y=80, w=240, h=120, bcolor=SKY_MID, fcolor=SKY_MID)
    screen.draw_rect(x=0, y=150, w=240, h=170, bcolor=SKY_BOTTOM, fcolor=SKY_BOTTOM)

    screen.draw_circle(x=40, y=40, r=28, bcolor=0xB8F5D1, fcolor=0xB8F5D1)
    screen.draw_circle(x=204, y=55, r=32, bcolor=0xB8ECFF, fcolor=0xB8ECFF)
    screen.draw_circle(x=205, y=260, r=32, bcolor=0xD6FBE7, fcolor=0xD6FBE7)


def draw_glass_card():
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


def draw_prompt_text(purpose):
    line1 = "Apunta la camara"
    line2 = "tu objetivo de " + str(purpose)
    screen.draw_text(text=line1, x=46, y=200, font_size=14, color=TEXT_COLOR)
    screen.draw_text(text=line2, x=28, y=218, font_size=11, color=TEXT_COLOR)


def draw_camera_prompt(purpose):
    draw_gradient_background()
    draw_glass_card()
    draw_score_ring(120, 115)
    draw_leaf_icon(120, 115)
    draw_prompt_text(purpose)
    screen.show_draw()


def _noop(*_args, **_kwargs):
    return None


def _ensure_handlers():
    if btn_a.event_pressed is None:
        btn_a.event_pressed = _noop
    if btn_b.event_pressed is None:
        btn_b.event_pressed = _noop


def should_exit():
    _ensure_handlers()
    return utils.pressed(btn_a) or utils.pressed(btn_b)


def wait_to_aim(seconds=5):
    steps = int(seconds * 10)
    for _ in range(steps):
        if should_exit():
            return False
        time.sleep(0.1)
    return True


def force_reset(delay_s=0.2):
    print("Force reset")
    if delay_s:
        time.sleep(delay_s)
    try:
        import machine
        machine.reset()
    except Exception:
        pass
