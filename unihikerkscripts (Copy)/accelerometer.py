from unihiker_k10 import acce
import time

while True:
    print("x=",acce.read_x())
    print("y=",acce.read_y())
    print("z=",acce.read_z())
    time.sleep(0.1)


# x= 0.02539063
# y= 0.125
# z= -1.048828

POST /api/sensor-readings/accelerometer
{
  "values": [0.02539063, 0.125, -1.048828]
}