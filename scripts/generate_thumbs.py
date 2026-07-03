"""Generate gallery thumbnails from assets/images into assets/thumbs.

Usage:
    pip install pillow
    python scripts/generate_thumbs.py

Re-run after adding or updating source images.
"""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageOps

MAX_SIZE = 960
TALL_ASPECT = 0.4
WIDE_ASPECT = 2.5
TALL_MAX_BOX = (720, 2400)
WIDE_MAX_BOX = (2400, 400)
JPEG_QUALITY = 80
HERO_MAX_WIDTH = 1600
SUPPORTED = {".jpg", ".jpeg", ".png", ".webp"}


def get_max_box(width: int, height: int) -> tuple[int, int]:
    aspect = width / height
    if aspect < TALL_ASPECT:
        return TALL_MAX_BOX
    if aspect > WIDE_ASPECT:
        return WIDE_MAX_BOX
    return (MAX_SIZE, MAX_SIZE)


def resize_image(img: Image.Image, max_box: int | tuple[int, int]) -> Image.Image:
    img = ImageOps.exif_transpose(img)
    if img.mode not in ("RGB", "L"):
        img = img.convert("RGB")
    if isinstance(max_box, int):
        max_box = (max_box, max_box)
    img.thumbnail(max_box, Image.Resampling.LANCZOS)
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
            img = ImageOps.exif_transpose(img)
            max_box = get_max_box(img.width, img.height)
            thumb = resize_image(img.copy(), max_box)
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
