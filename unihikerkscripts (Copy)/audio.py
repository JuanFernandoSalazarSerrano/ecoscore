from unihiker_k10 import mic,speaker
import time
print("begin sys recode")
mic.recode_sys(name="sound.wav",time=5)
print("recode sys done")
time.sleep(1)
print("begin sys play")
speaker.play_sys_music("sound.wav")
print("end sys play")
time.sleep(1)
print("begin tf recode")
mic.recode_tf(name="sound.wav",time=5)
print("recode tf done")
time.sleep(1)
print("begin tf play")
speaker.play_tf_music("sound.wav")
print("end tf play")
while True:
    pass