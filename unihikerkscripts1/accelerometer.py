from unihiker_k10 import acce, screen
import time

# --- EcoScore palette ---
SKY_TOP = 0xD9F8FF
SKY_MID = 0xC8F7E7
SKY_BOTTOM = 0xF2FFF7

EMERALD = 0x22C55E
DEEP_GREEN = 0x16A34A
LIME = 0x86EFAC
TEAL = 0x14B8A6
WHITE = 0xFFFFFF


# -------------------------
# Background
# -------------------------

def draw_background():
    screen.show_bg(color=SKY_TOP)

    screen.draw_rect(
        x=0, y=90, w=240, h=100,
        bcolor=SKY_MID,
        fcolor=SKY_MID
    )

    screen.draw_rect(
        x=0, y=170, w=240, h=150,
        bcolor=SKY_BOTTOM,
        fcolor=SKY_BOTTOM
    )

    # Ambient bubbles
    screen.draw_circle(
        x=30, y=40, r=24,
        bcolor=0xB8F5D1,
        fcolor=0xB8F5D1
    )

    screen.draw_circle(
        x=210, y=55, r=30,
        bcolor=0xB8ECFF,
        fcolor=0xB8ECFF
    )


# -------------------------
# Glass card
# -------------------------

def draw_card():
    screen.draw_rect(
        x=18, y=30, w=204, h=240,
        bcolor=0xE8FFF2,
        fcolor=0xE8FFF2
    )

    screen.draw_rect(
        x=22, y=34, w=196, h=232,
        bcolor=0xF7FFFB,
        fcolor=0xF7FFFB
    )


# -------------------------
# Header
# -------------------------

def draw_header():
    # Mini eco icon
    screen.draw_circle(
        x=55, y=70, r=18,
        bcolor=EMERALD,
        fcolor=EMERALD
    )

    screen.draw_circle(
        x=55, y=70, r=12,
        bcolor=LIME,
        fcolor=LIME
    )

    screen.draw_circle(
        x=55, y=70, r=5,
        bcolor=WHITE,
        fcolor=WHITE
    )

    screen.draw_text(
        text="EcoScore",
        x=82,
        y=58,
        font_size=22,
        color=DEEP_GREEN
    )

    screen.draw_text(
        text="ACCELEROMETER",
        x=82,
        y=84,
        font_size=10,
        color=TEAL
    )


# -------------------------
# Sensor panels
# -------------------------

def draw_sensor_boxes():
    # X
    screen.draw_rect(
        x=40, y=120, w=160, h=32,
        bcolor=0xDDF8EA,
        fcolor=0xDDF8EA
    )

    # Y
    screen.draw_rect(
        x=40, y=165, w=160, h=32,
        bcolor=0xDDF8EA,
        fcolor=0xDDF8EA
    )

    # Z
    screen.draw_rect(
        x=40, y=210, w=160, h=32,
        bcolor=0xDDF8EA,
        fcolor=0xDDF8EA
    )


# -------------------------
# Main UI
# -------------------------

screen.init(dir=2)

draw_background()
draw_card()
draw_header()
draw_sensor_boxes()

while True:
    x = round(acce.read_x(), 2)
    y = round(acce.read_y(), 2)
    z = round(acce.read_z(), 2)

    print("x=", x)
    print("y=", y)
    print("z=", z)

    screen.draw_text(
        text="X: " + str(x),
        x=55,
        y=126,
        font_size=18,
        color=DEEP_GREEN
    )

    screen.draw_text(
        text="Y: " + str(y),
        x=55,
        y=171,
        font_size=18,
        color=TEAL
    )

    screen.draw_text(
        text="Z: " + str(z),
        x=55,
        y=216,
        font_size=18,
        color=DEEP_GREEN
    )

    screen.show_draw()
    time.sleep(0.1)

# x= 0.02539063
# y= 0.125
# z= -1.048828

# POST /api/sensor-readings/accelerometer
# {
#   "values": [0.02539063, 0.125, -1.048828]
# }