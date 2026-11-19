"""Découpe le logo GEXAA en calques transparents pour l'animation.
Usage : python3 tools/logo_layers.py assets/logo-source.png assets/logo
"""
import sys
import numpy as np
from PIL import Image
from scipy import ndimage

src, out = sys.argv[1], sys.argv[2]
im = np.asarray(Image.open(src).convert('RGB')).astype(float)
H, W, _ = im.shape

# 1) "Color to alpha" contre le blanc : le logo se pose sur n'importe quel fond
a = np.max((255 - im) / 255, axis=2)
a = np.clip((a - 0.035) / 0.965, 0, 1)
safe = np.where(a > 1e-3, a, 1)
rgb = np.clip((im - 255 * (1 - a[..., None])) / safe[..., None], 0, 255)

# 2) Composantes connexes -> chaque pixel (même flou) rattaché à la plus proche
core = a > 0.25
lab, n = ndimage.label(core)
_, (iy, ix) = ndimage.distance_transform_edt(lab == 0, return_indices=True)
near = lab[iy, ix]

# 3) Regroupement en calques (indices issus de l'analyse du logo)
objs = ndimage.find_objects(lab)
def comps(pred):
    ids = []
    for i, s in enumerate(objs):
        if s is None:
            continue
        y0, y1, x0, x1 = s[0].start, s[0].stop, s[1].start, s[1].stop
        if pred(y0, y1, x0, x1, (lab[s] == i + 1).sum()):
            ids.append(i + 1)
    return ids

emblem = lambda y0, y1, x0, x1, n: y1 <= 390
layers = {
    'laurel-left':  comps(lambda y0, y1, x0, x1, n: emblem(y0, y1, x0, x1, n) and x1 <= 405 and y1 <= 330),
    'laurel-right': comps(lambda y0, y1, x0, x1, n: emblem(y0, y1, x0, x1, n) and x0 >= 678 and y1 <= 330),
    'cap':          comps(lambda y0, y1, x0, x1, n: y1 <= 182 and 405 < x0 and x1 < 680),
    'pen':          comps(lambda y0, y1, x0, x1, n: y0 >= 172 and y1 <= 305 and x0 >= 505 and x1 <= 580),
    'pages':        comps(lambda y0, y1, x0, x1, n: y0 >= 218 and y1 <= 340 and x0 >= 345 and x1 <= 730 and not (x0 >= 505 and x1 <= 580)),
    'cover':        comps(lambda y0, y1, x0, x1, n: y0 >= 300 and y1 <= 390),
}
bands = {'wordmark': (390, 572), 'tagline': (575, 628), 'rule': (628, 690)}

used = np.zeros((H, W), bool)
def save(name, m):
    rgba = np.zeros((H, W, 4), np.uint8)
    rgba[..., :3] = rgb.astype(np.uint8)
    rgba[..., 3] = (a * m * 255).astype(np.uint8)
    rgba[rgba[..., 3] == 0, :3] = 0
    Image.fromarray(rgba, 'RGBA').save(f'{out}/{name}.png', optimize=True)

yy = np.arange(H)[:, None].repeat(W, 1)
for name, ids in layers.items():
    m = np.isin(near, ids) & (yy < 392)
    used |= m
    save(name, m)
    print(name, ids)
for name, (y0, y1) in bands.items():
    m = (yy >= y0) & (yy < y1)
    used |= m
    save(name, m)
# Résidus éventuels de l'emblème (sécurité : rien ne doit disparaître)
rest = (~used) & (a > 0.02)
print('pixels non assignés :', int(rest.sum()))
save('rest', rest)
save('full', np.ones((H, W)))

# Couleurs de marque mesurées
def med(mask):
    return '#%02x%02x%02x' % tuple(np.median(im[mask], axis=0).astype(int))
navy = core & (im[..., 2] > im[..., 0] + 30) & (im[..., 0] < 60)
gold = core & (im[..., 0] > 180) & (im[..., 2] < 90)
green = core & (im[..., 1] > im[..., 0] + 60) & (im[..., 1] > im[..., 2])
print('navy', med(navy), 'gold', med(gold), 'green', med(green))
