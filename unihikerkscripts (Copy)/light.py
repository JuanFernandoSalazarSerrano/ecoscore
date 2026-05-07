from unihiker_k10 import light
import time
while True:
    print(light.read())
    time.sleep(0.1)

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