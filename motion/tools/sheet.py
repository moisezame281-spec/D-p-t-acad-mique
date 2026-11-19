"""Planche contact : python3 tools/sheet.py <dossier> <sortie.png> [colonnes] [largeur]"""
import sys, glob, os
from PIL import Image, ImageDraw
d, out = sys.argv[1], sys.argv[2]
cols = int(sys.argv[3]) if len(sys.argv) > 3 else 6
w = int(sys.argv[4]) if len(sys.argv) > 4 else 300
files = sorted(glob.glob(os.path.join(d, 't*.png')))
h = int(w * 1920 / 1080)
rows = (len(files) + cols - 1) // cols
sheet = Image.new('RGB', (cols * w, rows * (h + 24)), (30, 30, 30))
dr = ImageDraw.Draw(sheet)
for i, f in enumerate(files):
    im = Image.open(f).convert('RGB').resize((w, h), Image.LANCZOS)
    x, y = (i % cols) * w, (i // cols) * (h + 24)
    sheet.paste(im, (x, y + 24))
    dr.text((x + 6, y + 6), os.path.basename(f)[1:-4] + 's', fill=(255, 220, 120))
sheet.save(out)
