from unihiker_k10 import screen
import time

SCREEN_W = 240
SCREEN_H = 320


def clear_screen(color):
	screen.draw_rect(x=0, y=0, w=SCREEN_W, h=SCREEN_H, bcolor=color, fcolor=color)


def wait_for_release(btn, delay=0.05):
	while btn.status():
		time.sleep(delay)


def pressed(btn):
	if btn.status():
		wait_for_release(btn)
		return True
	return False


def detach_callbacks(btn_a, btn_b):
	prev_a = btn_a.event_pressed
	prev_b = btn_b.event_pressed
	btn_a.event_pressed = None
	btn_b.event_pressed = None
	return prev_a, prev_b


def restore_callbacks(btn_a, btn_b, prev_a, prev_b):
	btn_a.event_pressed = prev_a
	btn_b.event_pressed = prev_b
