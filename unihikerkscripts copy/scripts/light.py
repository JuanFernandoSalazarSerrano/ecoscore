from unihiker_k10 import light, screen
import time

# Colors from your logo
SKY_TOP = 0xD9F8FF
EMERALD = 0x22C55E
DEEP_GREEN = 0x16A34A
TEAL = 0x14B8A6

screen.init(dir=2)
screen.show_bg(color=SKY_TOP)

while True:
    value = light.read()
    print(value)

    screen.draw_text(
        text="Luz: " + str(value),
        x=10,
        y=20,
        font_size=24,
        color=DEEP_GREEN
    )

    screen.draw_text(
        text="EcoScore",
        x=10,
        y=50,
        font_size=16,
        color=TEAL
    )

    screen.show_draw()
    time.sleep(1)
# Quick reference if it is lux:

# ~0–10: very dark
# ~50–200: dim/normal indoor
# ~300–500: bright office/classroom
# 1,000+: outdoor shade/daylight
# 10,000+: direct sun

# 3.65

#POST /api/sensor-readings/light
# {
#   "values": 3.65
# }