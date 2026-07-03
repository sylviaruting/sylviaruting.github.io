"""Generate gallery thumbnails from assets/images into assets/thumbs.

Usage:
    pip install pillow
    python scripts/generate_thumbs.py

Re-run after adding or updating source images.
"""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageOps

MAX_SIZE = 480
JPEG_QUALITY = 80
HERO_MAX_WIDTH = 1600
SUPPORTED = {".jpg", ".jpeg", ".png", ".webp"}


def resize_image(img: Image.Image, max_size: int) -> Image.Image:
    img = ImageOps.exif_transpose(img)
    if img.mode not in ("RGB", "L"):
        img = img.convert("RGB")
    img.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)
    return img


def save_jpeg(img: Image.Image, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    img.save(path, "JPEG", quality=JPEG_QUALITY, optimize=True)


def main() -> None:
    root = Path(__file__).resolve().parents[1]
    images_dir = root / "assets" / "images"
    thumbs_dir = root / "assets" / "thumbs"
    hero_path = root / "assets" / "images" / "hero.jpg"

    if not images_dir.is_dir():
        raise SystemExit(f"Missing images directory: {images_dir}")

    count = 0
    for src in sorted(images_dir.iterdir()):
        if not src.is_file() or src.suffix.lower() not in SUPPORTED:
            continue
        if src.name == "hero.jpg":
            continue

        with Image.open(src) as img:
            thumb = resize_image(img.copy(), MAX_SIZE)
            out = thumbs_dir / f"{src.stem}.jpg"
            save_jpeg(thumb, out)
            count += 1
            print(f"thumb: {src.name} -> {out.relative_to(root)}")

    hero_src = images_dir / "image1.jpeg"
    if hero_src.is_file():
        with Image.open(hero_src) as img:
            hero = ImageOps.exif_transpose(img.copy())
            if hero.mode not in ("RGB", "L"):
                hero = hero.convert("RGB")
            if hero.width > HERO_MAX_WIDTH:
                ratio = HERO_MAX_WIDTH / hero.width
                hero = hero.resize(
                    (HERO_MAX_WIDTH, round(hero.height * ratio)),
                    Image.Resampling.LANCZOS,
                )
            save_jpeg(hero, hero_path)
            print(f"hero: {hero_src.name} -> {hero_path.relative_to(root)}")

    print(f"Generated {count} thumbnails in {thumbs_dir.relative_to(root)}")


if __name__ == "__main__":
    main()
