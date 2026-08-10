#!/usr/bin/env python3
"""Inject imprint details from the environment into the built site.

The repository only ever holds placeholders. The real address and email come
from GitHub Secrets and are written in during the Pages build, so they never
enter the repository or its git history.

Two things matter about how this writes them:

* The values go into the HTML itself, not just content/content.js. § 5 DDG
  requires the imprint to be "leicht erkennbar, unmittelbar erreichbar und
  ständig verfügbar" — filling it in with client-side JavaScript would leave a
  visitor with scripting disabled looking at placeholder text.

* The email is written as HTML character references. Browsers decode those
  without any JavaScript, so the address still renders, still works as a
  mailto: link and can still be copied — but the literal string never appears
  in the source, which defeats regex-based address harvesters. It is kept out
  of content.js entirely for the same reason. This stops naive scrapers only;
  anything that renders the page can still read it.

Usage:  python3 scripts/inject-legal.py <site-directory>
"""

import os
import re
import sys

# Environment variable -> key in the `legal` object of content/content.js
CONTENT_FIELDS = {
    "LEGAL_STREET": "street",
    "LEGAL_POSTAL_CITY": "postalCity",
    "LEGAL_VAT_ID": "vatId",
    "LEGAL_FULL_NAME": "fullName",
    "LEGAL_EDITORIAL_RESPONSIBLE": "editorialResponsible",
}

# Placeholder text in the HTML -> environment variable holding the real value
HTML_PLACEHOLDERS = {
    "[Enter street and house number]": "LEGAL_STREET",
    "[Enter postcode and city]": "LEGAL_POSTAL_CITY",
    "[Straße und Hausnummer eintragen]": "LEGAL_STREET",
    "[PLZ und Ort eintragen]": "LEGAL_POSTAL_CITY",
}

PLACEHOLDER_EMAIL = "hello@example.com"

# Placeholder profile URL in content.js -> environment variable with the real one
SOCIAL_PLACEHOLDERS = {
    "https://www.linkedin.com/": "SITE_LINKEDIN_URL",
    "https://www.instagram.com/": "SITE_INSTAGRAM_URL",
}


def js_string(value):
    """Escape a value for use inside a double-quoted JS string literal."""
    return (
        value.replace("\\", "\\\\")
        .replace('"', '\\"')
        .replace("\n", "\\n")
        .replace("\r", "")
    )


def entities(value):
    """Encode every character as a decimal HTML character reference."""
    return "".join(f"&#{ord(char)};" for char in value)


def inject_content_js(path, env):
    """Write the address fields into the content table."""
    with open(path, encoding="utf-8") as handle:
        source = handle.read()

    legal_start = source.index("legal: {")
    applied = []

    for env_name, key in CONTENT_FIELDS.items():
        value = env.get(env_name, "").strip()
        if not value:
            continue
        pattern = re.compile(r'(\b%s:\s*)"(?:[^"\\]|\\.)*"' % re.escape(key))
        head, tail = source[:legal_start], source[legal_start:]
        tail, count = pattern.subn(r'\1"%s"' % js_string(value), tail, count=1)
        if count:
            source = head + tail
            applied.append(key)
        else:
            print(f"::warning::no `{key}` field found in content.js")

    for placeholder, env_name in SOCIAL_PLACEHOLDERS.items():
        value = env.get(env_name, "").strip()
        if value and f'"{placeholder}"' in source:
            source = source.replace(f'"{placeholder}"', '"%s"' % js_string(value), 1)
            applied.append(env_name)

    with open(path, "w", encoding="utf-8") as handle:
        handle.write(source)
    return applied


def inject_html(path, env):
    """Write address and email straight into the markup."""
    with open(path, encoding="utf-8") as handle:
        source = handle.read()

    original = source
    applied = []

    for placeholder, env_name in HTML_PLACEHOLDERS.items():
        value = env.get(env_name, "").strip()
        if value and placeholder in source:
            source = source.replace(placeholder, value)
            applied.append(env_name)

    email = env.get("SITE_EMAIL", "").strip()
    if email and PLACEHOLDER_EMAIL in source:
        # Both the visible text and the href, so neither holds the plain string.
        source = source.replace(f"mailto:{PLACEHOLDER_EMAIL}", entities(f"mailto:{email}"))
        source = source.replace(PLACEHOLDER_EMAIL, entities(email))
        applied.append("SITE_EMAIL")

    if source != original:
        with open(path, "w", encoding="utf-8") as handle:
            handle.write(source)
    return applied


def main():
    if len(sys.argv) != 2:
        print(__doc__)
        return 1

    site = sys.argv[1]
    env = os.environ

    applied = set(inject_content_js(os.path.join(site, "content", "content.js"), env))

    for name in sorted(os.listdir(site)):
        if name.endswith(".html"):
            applied.update(inject_html(os.path.join(site, name), env))

    expected = set(CONTENT_FIELDS) | set(SOCIAL_PLACEHOLDERS.values()) | {"SITE_EMAIL"}
    print(f"Injected: {', '.join(sorted(applied)) if applied else 'nothing'}")

    missing = sorted(name for name in expected if not env.get(name, "").strip())
    if missing:
        # Not fatal: the site still deploys, showing the placeholder text.
        print(f"::warning::Missing secrets, left as placeholders: {', '.join(missing)}")

    if env.get("SITE_EMAIL", "").strip():
        leaked = []
        for root, _dirs, files in os.walk(site):
            for name in files:
                if not name.endswith((".html", ".js")):
                    continue
                full = os.path.join(root, name)
                with open(full, encoding="utf-8", errors="ignore") as handle:
                    if env["SITE_EMAIL"].strip() in handle.read():
                        leaked.append(os.path.relpath(full, site))
        if leaked:
            print(f"::error::email appears in plain text in: {', '.join(leaked)}")
            return 1
        print("Verified: email appears nowhere in plain text.")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
