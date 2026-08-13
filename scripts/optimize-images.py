#!/usr/bin/env python3
"""Create lightweight card previews and optimize full project JPEGs.

Full-size images remain in place for project detail views. Each image also gets
a progressive 960 px preview in an adjacent ``previews`` directory, preserving
the same project-based folder structure.
"""

from __future__ import annotations

import os
import sys
from pathlib import Path

from PIL import Image, ImageOps


def save_jpeg(image: Image.Image, path: Path, *, quality: int) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    image.save(
        path,
        format="JPEG",
        quality=quality,
        optimize=True,
        progressive=True,
        subsampling="4:2:0",
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
            original = ImageOps.exif_transpose(opened).convert("RGB")
            preview = original.copy()
            preview.thumbnail((960, 960), Image.Resampling.LANCZOS)

            preview_path = source.parent / "previews" / source.name
            save_jpeg(preview, preview_path, quality=78)

            temporary = source.with_suffix(".optimized.jpg")
            save_jpeg(original, temporary, quality=84)
            if temporary.stat().st_size < source.stat().st_size:
                os.replace(temporary, source)
            else:
                temporary.unlink()

        print(f"Optimized {source.relative_to(site)}")

    for preview in sorted(projects.glob("*/images/previews/*.jpg")):
        source = preview.parent.parent / preview.name
        if not source.exists():
            preview.unlink()
            print(f"Removed stale preview {preview.relative_to(site)}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
