#!/usr/bin/env python3
"""Stamp the stylesheet link with a hash of the stylesheet itself.

The pages reference `styles.css?v=...` with a hand-written version string. If
that string is not bumped when the CSS changes, browsers keep serving the copy
they cached under the old URL — the change is live but nobody sees it.

Deriving the value from the file's contents removes the manual step: it changes
exactly when the CSS changes, and not otherwise, so caches stay warm between
deploys that do not touch it.

Scripts and content files are already loaded with a timestamp by the inline
loader in each page, so they do not need this.

Usage:  python3 scripts/bust-cache.py <site-directory>
"""

import hashlib
import os
import re
import sys

STYLESHEET = "styles.css"


def main():
    if len(sys.argv) != 2:
        print(__doc__)
        return 1

    site = sys.argv[1]
    stylesheet = os.path.join(site, STYLESHEET)
    if not os.path.exists(stylesheet):
        print(f"::error::{STYLESHEET} not found in {site}")
        return 1

    with open(stylesheet, "rb") as handle:
        digest = hashlib.sha256(handle.read()).hexdigest()[:12]

    pattern = re.compile(r'(%s)\?v=[^"\']*' % re.escape(STYLESHEET))
    stamped = []

    for name in sorted(os.listdir(site)):
        if not name.endswith(".html"):
            continue
        path = os.path.join(site, name)
        with open(path, encoding="utf-8") as handle:
            source = handle.read()
        updated, count = pattern.subn(r"\1?v=%s" % digest, source)
        if count:
            with open(path, "w", encoding="utf-8") as handle:
                handle.write(updated)
            stamped.append(f"{name} ({count})")

    if not stamped:
        print(f"::warning::no {STYLESHEET}?v= references found to stamp")
    else:
        print(f"Stylesheet stamped v={digest} in: {', '.join(stamped)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
