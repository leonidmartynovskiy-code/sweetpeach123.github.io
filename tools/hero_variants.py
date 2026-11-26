"""Create WebP copies of blog hero images for mobile and desktop delivery.

Names carry the SHA-256 prefix of the source file, so a replaced source image
never reuses an old copy: the template only finds copies that match the bytes.
Run after adding or replacing a blog hero image, then commit public/images/_hero.
"""
import hashlib
import pathlib
import re
import subprocess

ROOT = pathlib.Path(__file__).resolve().parents[1]
OUT = ROOT / 'public/images/_hero'
WIDTHS = (720, 1200)

OUT.mkdir(parents=True, exist_ok=True)
wanted = set()
for post in sorted((ROOT / 'src/content/blog').glob('*.md')):
    m = re.search(r'^heroImage:\s*"?([^"\n]+)"?', post.read_text(), re.M)
    if not m:
        continue
    src = ROOT / 'public' / m.group(1).lstrip('/')
    digest = hashlib.sha256(src.read_bytes()).hexdigest()[:12]
    for w in WIDTHS:
        dst = OUT / f'{digest}-{w}.webp'
        wanted.add(dst.name)
        if not dst.exists():
            subprocess.run(['cwebp', '-quiet', '-q', '78', '-resize', str(w), '0',
                            str(src), '-o', str(dst)], check=True)
for old in OUT.glob('*.webp'):
    if old.name not in wanted:
        old.unlink()
print(len(wanted), 'variants')
