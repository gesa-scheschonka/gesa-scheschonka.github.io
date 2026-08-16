#!/usr/bin/env python3
"""Create source-aware card previews without re-encoding detail images.

The full-size JPEG and PNG files are the portfolio masters and remain
byte-for-byte intact for project detail views. Each image also gets a JPEG card
preview in an adjacent ``previews`` directory. Small or already heavily
compressed JPEG sources are copied unchanged, avoiding a visibly damaging
second pass. PNG masters and larger JPEGs are resized to a 1600 px bounding box
for sharper cards in the variable desktop grid.
"""

from __future__ import annotations

import shutil
import sys
from pathlib import Path

from PIL import Image, ImageOps


def save_jpeg(
    image: Image.Image,
    path: Path,
    *,
    quality: int,
    icc_profile: bytes | None = None,
) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    image.save(
        path,
        format="JPEG",
        quality=quality,
        optimize=True,
        progressive=True,
        subsampling="4:2:0",
        icc_profile=icc_profile,
    )


def main() -> int:
    if len(sys.argv) != 2:
        print("Usage: python3 scripts/optimize-images.py <site-directory>")
        return 1

    site = Path(sys.argv[1]).resolve()
    projects = site / "assets" / "projects"
    if not projects.is_dir():
        print(f"Project media directory not found: {projects}", file=sys.stderr)
        return 1

    sources = sorted(
        source
        for pattern in ("*.jpg", "*.jpeg", "*.png")
        for source in projects.glob(f"*/images/{pattern}")
    )

    for source in sources:
        with Image.open(source) as opened:
            icc_profile = opened.info.get("icc_profile")
            oriented = ImageOps.exif_transpose(opened)
            if oriented.mode in {"RGBA", "LA"} or "transparency" in oriented.info:
                rgba = oriented.convert("RGBA")
                background = Image.new("RGBA", rgba.size, (243, 240, 232, 255))
                original = Image.alpha_composite(background, rgba).convert("RGB")
            else:
                original = oriented.convert("RGB")
            preview_path = source.parent / "previews" / f"{source.stem}.jpg"
            width, height = original.size
            max_dimension = max(width, height)
            source_size = source.stat().st_size

            # Images that are already card-sized, and efficient web sources up
            # to 2000 px, gain too little from another JPEG generation to make
            # the added artifacts worthwhile.
            preserve_source = source.suffix.lower() in {".jpg", ".jpeg"} and (
                max_dimension <= 1600
                or (max_dimension <= 2000 and source_size <= 400 * 1024)
            )

            if preserve_source:
                preview_path.parent.mkdir(parents=True, exist_ok=True)
                shutil.copyfile(source, preview_path)
            else:
                preview = original.copy()
                preview.thumbnail((1600, 1600), Image.Resampling.LANCZOS)
                save_jpeg(preview, preview_path, quality=88, icc_profile=icc_profile)

        action = "Copied" if preserve_source else "Created"
        print(f"{action} preview for {source.relative_to(site)}")

    for preview in sorted(projects.glob("*/images/previews/*.jpg")):
        source_directory = preview.parent.parent
        source_exists = any(
            (source_directory / f"{preview.stem}{extension}").exists()
            for extension in (".jpg", ".jpeg", ".png")
        )
        if not source_exists:
            preview.unlink()
            print(f"Removed stale preview {preview.relative_to(site)}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
