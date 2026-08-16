#!/usr/bin/env python3
"""Stamp static asset URLs with content-derived hashes.

The pages reference `styles.css?v=...` with a hand-written version string. If
that string is not bumped when the CSS changes, browsers keep serving the copy
they cached under the old URL — the change is live but nobody sees it.

Deriving the values from the file contents removes the manual step: URLs change
when the files change and stay stable otherwise. That lets GitHub Pages, its CDN
and visitors' browsers reuse the files between page loads.

Usage:  python3 scripts/bust-cache.py <site-directory>
"""

import hashlib
import os
import re
import sys

STYLESHEET = "styles.css"
SCRIPT_FILES = ("content/content.js", "content/cv.js", "script.js", "legal.js")


def file_hash(paths):
    digest = hashlib.sha256()
    for path in paths:
        with open(path, "rb") as handle:
            digest.update(handle.read())
    return digest.hexdigest()[:12]


def main():
    if len(sys.argv) != 2:
        print(__doc__)
        return 1

    site = sys.argv[1]
    stylesheet = os.path.join(site, STYLESHEET)
    if not os.path.exists(stylesheet):
        print(f"::error::{STYLESHEET} not found in {site}")
        return 1

    stylesheet_digest = file_hash((stylesheet,))
    script_paths = [os.path.join(site, path) for path in SCRIPT_FILES]
    missing_scripts = [path for path in script_paths if not os.path.exists(path)]
    if missing_scripts:
        print(f"::error::missing script files: {', '.join(missing_scripts)}")
        return 1
    script_digest = file_hash(script_paths)

    stylesheet_pattern = re.compile(r'(%s)\?v=[^"\']*' % re.escape(STYLESHEET))
    script_pattern = re.compile(r'(const\s+version\s*=\s*)["\'][^"\']*["\'](\s*;)')
    stamped = []

    for name in sorted(os.listdir(site)):
        if not name.endswith(".html"):
            continue
        path = os.path.join(site, name)
        with open(path, encoding="utf-8") as handle:
            source = handle.read()
        updated, style_count = stylesheet_pattern.subn(
            r"\1?v=%s" % stylesheet_digest,
            source,
        )
        updated, script_count = script_pattern.subn(
            r'\1"%s"\2' % script_digest,
            updated,
        )
        if style_count or script_count:
            with open(path, "w", encoding="utf-8") as handle:
                handle.write(updated)
            stamped.append(f"{name} (css: {style_count}, scripts: {script_count})")

    if not stamped:
        print("::warning::no static asset references found to stamp")
    else:
        print(
            f"Assets stamped css={stylesheet_digest}, scripts={script_digest} in: "
            + ", ".join(stamped)
        )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
