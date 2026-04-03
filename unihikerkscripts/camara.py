from unihiker_k10 import screen
import time
from k10_base import Camera

camera = Camera()
camera.init()
screen.init(dir=2)
screen.show_camera(camera)
screen.show_bg(color=0xFFFF00)
screen.set_width(width=5)
screen.draw_line(x0=0,y0=0,x1=80,y1=80,color=0x0000FF)
screen.draw_point(x=100,y=10,color=0xFF0000)
screen.draw_rect(x=120,y=100,w=80,h=120,bcolor=0xFF6666,fcolor=0x0000FF)
screen.draw_rect(x=120,y=100,w=40,h=60,bcolor=0x012345)
screen.draw_circle(x=80,y=80,r=40,bcolor=0x00FF00,fcolor=0x0000FF)
screen.draw_circle(x=80,y=80,r=20,bcolor=0xFF0000)
screen.draw_text(text="你好\n23",x=10,y=0,font_size=24,color=0xFF0000)
screen.draw_text(text="line\n456\nhgjh\n",line=2,font_size=24,color=0xFF0000)
screen.show_draw()
time.sleep(10)
screen.clear()

while True:
    time.sleep(1)