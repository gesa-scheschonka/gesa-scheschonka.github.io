#!/usr/bin/env python3
"""Create source-aware card previews without re-encoding detail images.

The full-size JPEGs are the portfolio masters and remain byte-for-byte intact
for project detail views. Each image also gets a card preview in an adjacent
``previews`` directory. Small or already heavily compressed sources are copied
unchanged, avoiding a visibly damaging second JPEG pass. Larger masters are
resized to a 1600 px bounding box for sharper cards in the variable desktop
grid.
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

    for source in sorted(projects.glob("*/images/*.jpg")):
        with Image.open(source) as opened:
            icc_profile = opened.info.get("icc_profile")
            original = ImageOps.exif_transpose(opened).convert("RGB")
            preview_path = source.parent / "previews" / source.name
            width, height = original.size
            max_dimension = max(width, height)
            source_size = source.stat().st_size

            # Images that are already card-sized, and efficient web sources up
            # to 2000 px, gain too little from another JPEG generation to make
            # the added artifacts worthwhile.
            preserve_source = max_dimension <= 1600 or (
                max_dimension <= 2000 and source_size <= 400 * 1024
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
        source = preview.parent.parent / preview.name
        if not source.exists():
            preview.unlink()
            print(f"Removed stale preview {preview.relative_to(site)}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
