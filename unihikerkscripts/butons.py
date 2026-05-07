from unihiker_k10 import button
import time
bt_a=button(button.a)
bt_b=button(button.b)

def button_a_pressed():
    print("button_a_pressed")

def button_a_released():
    print("button_a_released")

def button_b_pressed():
    print("button_b_pressed")

def button_b_released():
    print("button_b_released")

bt_a.event_pressed = button_a_pressed
bt_a.event_released = button_a_released
bt_b.event_pressed = button_b_pressed
bt_b.event_released = button_b_released

while True:
    print("button_a.status=",bt_a.status())
    print("button_b.status=",bt_b.status())
    time.sleep(0.1)
    pass