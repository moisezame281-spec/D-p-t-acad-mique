"""Crée une référence de timbre « homme » synthétique à partir de la référence de la voix C (aucune vraie personne) :
hauteur abaissée et formants descendus (analyse/resynthèse WORLD)."""
import sys, numpy as np, soundfile as sf, pyworld as pw, librosa
src, dst, f0k, alpha = sys.argv[1], sys.argv[2], float(sys.argv[3]), float(sys.argv[4])
y, sr = sf.read(src, dtype='float64')
if y.ndim > 1: y = y.mean(1)
f0, t = pw.harvest(y, sr, frame_period=5.0); sp = pw.cheaptrick(y, f0, t, sr); ap = pw.d4c(y, f0, t, sr)
n = sp.shape[1]; fb = np.arange(n); src_bins = np.clip(fb / alpha, 0, n - 1)   # formants vers le bas (alpha < 1)
sp2 = np.array([np.interp(src_bins, fb, row) for row in sp]); ap2 = np.array([np.interp(src_bins, fb, row) for row in ap])
z = pw.synthesize(f0 * f0k, sp2, ap2, sr, 5.0)
z = z / (np.max(np.abs(z)) + 1e-9) * .9
sf.write(dst, z.astype(np.float32), sr)
v = f0[f0 > 0]; v2 = (f0 * f0k)[f0 > 0]
print(f'hauteur médiane : {np.median(v):.0f} Hz → {np.median(v2):.0f} Hz ; formants × {alpha}')
