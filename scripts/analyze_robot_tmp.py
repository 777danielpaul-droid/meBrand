import cv2
import numpy as np

img = cv2.imread('/Users/danielpaul/Desktop/businesscard/public/anim/robot-teardown/frame_0001.png')
print('Shape:', img.shape)

print('BG corners:')
print('  TL (0,0):', img[0,0])
print('  TR (1909,0):', img[0,1909])
print('  BL (0,1079):', img[1079,0])
print('  BR (1919,1079):', img[1079,1919])

print('Center (960,540):', img[540,960])

gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
print('Gray stats: min={}, max={}, mean={:.1f}'.format(gray.min(), gray.max(), gray.mean()))

for t in [0, 5, 10, 15, 20, 30, 50, 100, 200]:
    count = np.sum(gray <= t)
    print(f'  Pixels <= {t}: {count} ({100*count/(1920*1080):.1f}%)')
