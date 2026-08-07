#!/usr/bin/env python3
"""Inject imprint details from the environment into the built site.

The repository only ever holds placeholders. The real address, phone number
and email come from GitHub Secrets and are written in during the Pages build,
so they never enter the repository or its git history.

Note this does not hide them from visitors: the published Impressum shows them,
as German law requires. It only keeps them out of the source.

Usage:  python3 scripts/inject-legal.py <site-directory>
"""

import os
import re
import sys

# Environment variable -> (object path in content/content.js)
FIELDS = {
    "SITE_EMAIL": ("email", False),
    "LEGAL_STREET": ("street", True),
    "LEGAL_POSTAL_CITY": ("postalCity", True),
    "LEGAL_PHONE": ("phone", True),
    "LEGAL_VAT_ID": ("vatId", True),
    "LEGAL_FULL_NAME": ("fullName", True),
    "LEGAL_EDITORIAL_RESPONSIBLE": ("editorialResponsible", True),
}


def js_string(value):
    """Escape a value for use inside a double-quoted JS string literal."""
    return (
        value.replace("\\", "\\\\")
        .replace('"', '\\"')
        .replace("\n", "\\n")
        .replace("\r", "")
    )


def main():
    if len(sys.argv) != 2:
        print(__doc__)
        return 1

    path = os.path.join(sys.argv[1], "content", "content.js")
    with open(path, encoding="utf-8") as handle:
        source = handle.read()

    legal_start = source.index("legal: {")
    applied, skipped = [], []

    for env_name, (key, in_legal) in FIELDS.items():
        value = os.environ.get(env_name, "").strip()
        if not value:
            skipped.append(env_name)
            continue

        # Only replace the key's own string literal, and for legal fields only
        # the occurrence inside the legal block.
        pattern = re.compile(r'(\b%s:\s*)"(?:[^"\\]|\\.)*"' % re.escape(key))
        offset = legal_start if in_legal else 0
        head, tail = source[:offset], source[offset:]
        tail, count = pattern.subn(r'\1"%s"' % js_string(value), tail, count=1)
        if count:
            source = head + tail
            applied.append(key)
        else:
            print(f"::warning::no `{key}` field found to replace")

    with open(path, "w", encoding="utf-8") as handle:
        handle.write(source)

    print(f"Injected: {', '.join(applied) if applied else 'nothing'}")
    if skipped:
        # Not fatal: the site still deploys, showing the placeholder text.
        print(f"::warning::Missing secrets, left as placeholders: {', '.join(skipped)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
