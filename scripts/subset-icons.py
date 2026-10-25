# /// script
# requires-python = ">=3.11"
# dependencies = ["fonttools[woff]==4.67.0"]
# ///
"""Regenerate local icon fonts: uv run scripts/subset-icons.py."""
from hashlib import sha256
from io import BytesIO
from pathlib import Path
import re
from urllib.request import urlopen

from fontTools import subset
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parents[1]
BASE = "https://cdnjs.cloudflare.com/ajax/libs/tocas/5.7.0/"
SOURCES = {
    "icons": ("fa-solid-900.woff2", "0464086a7d676ece1daa42801c193f60e1fe3f67628b4181a894dea1138018f8"),
    "iconsbrands": ("fa-brands-400.woff2", "271f44526e3162155e0b369c7330586b4ca0e038ae7cfb424031f171a9fad392"),
}
css = urlopen(BASE + "tocas.min.css", timeout=30).read()
if sha256(css).hexdigest() != "31564a5acf7ce9a549cf419e2b2dc52d273ee02c44e1314d185ff302c7b702c1":
    raise ValueError("Tocas CSS changed; review source before regenerating")
css = css.decode()
used = set()
components = set()
for path in (ROOT / "src").rglob("*"):
    if path.suffix in {".vue", ".js"} and ".test." not in path.name:
        source = path.read_text()
        used.update(re.findall(r"is-[a-z0-9-]+-icon", source))
        components.update(re.findall(r"\bts-[a-z][a-z0-9-]*\b", source))
# These are Tocas layout modifiers, not glyph names.
used -= {"is-start-icon", "is-end-icon"}
codepoints = {family: set() for family in SOURCES}
# Components such as ts-loading/ts-text/ts-select generate their own glyphs.
# Scan their pseudo-element rules too; ts-icon classes are handled separately.
components.discard("ts-icon")
for selector, declarations in re.findall(r"([^{}]+)\{([^{}]+)\}", css):
    if not re.search(r"::?(before|after)\b", selector):
        continue
    if not components.intersection(re.findall(r"\.(ts-[a-z][a-z0-9-]*)", selector)):
        continue
    content = re.search(r"content:([\"'])(.*?)\1", declarations)
    if content:
        family = "iconsbrands" if "font-family:iconsbrands" in declarations else "icons"
        codepoints[family].update(
            int(value, 16) for value in re.findall(r"\\([0-9a-fA-F]{1,6})", content[2])
            if 0xE000 <= int(value, 16) <= 0xF8FF
        )
for name in sorted(used):
    rule = re.search(r"\.ts-icon\." + re.escape(name) + r"::before\{([^}]+)\}", css)
    if not rule:
        raise ValueError(f"Unknown icon: {name}")
    family = "iconsbrands" if "font-family:iconsbrands" in rule[1] else "icons"
    codepoints[family].add(int(re.search(r'content:"\\([0-9a-f]+)"', rule[1])[1], 16))
out = ROOT / "assets/fonts"
out.mkdir(parents=True, exist_ok=True)
for family, (filename, digest) in SOURCES.items():
    data = urlopen(BASE + "fonts/icons/" + filename, timeout=30).read()
    if sha256(data).hexdigest() != digest:
        raise ValueError(f"Source font changed: {filename}")
    font = TTFont(BytesIO(data), recalcTimestamp=False)
    options = subset.Options()
    options.flavor = "woff2"
    options.recalc_timestamp = False
    subsetter = subset.Subsetter(options=options)
    subsetter.populate(unicodes=codepoints[family])
    subsetter.subset(font)
    # Give modified fonts their own names; preserve copyright/license records.
    family_name = "KageRyo Website " + ("Icons" if family == "icons" else "Brands")
    postscript_name = family_name.replace(" ", "") + "-Regular"
    names = {
        1: family_name, 2: "Regular", 3: postscript_name + ";7.1.0;subset",
        4: family_name + " Regular", 6: postscript_name,
        16: family_name, 17: "Regular",
    }
    for record in font["name"].names:
        if record.nameID in names:
            record.string = names[record.nameID].encode(record.getEncoding())
    for name_id, value in names.items():
        font["name"].setName(value, name_id, 3, 1, 0x409)
    if "CFF " in font:
        cff = font["CFF "].cff
        cff.fontNames = [postscript_name]
        cff.topDictIndex[0].FamilyName = family_name
        cff.topDictIndex[0].FullName = names[4]
    font.save(out / f"{family}.woff2")
    print(f"{family}: {len(codepoints[family])} glyphs, {(out / f'{family}.woff2').stat().st_size} bytes")
