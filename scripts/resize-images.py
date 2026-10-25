# /// script
# requires-python = ">=3.11"
# dependencies = ["pillow==13.0.0"]
# ///
"""Generate smaller WebP candidates: uv run scripts/resize-images.py."""
from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parents[1] / "assets/img"
out = root / "responsive"
out.mkdir(exist_ok=True)
for name in ["card", "ministry-of-education", "coscup-lightingtalk", "chienhsun", "kserve-merge", "tag-twin", "federated-aqi", "environmental-enforcement", "watermirror"]:
    with Image.open(root / f"{name}.webp") as image:
        for width in (400, 800):
            if width >= image.width:
                continue
            height = round(image.height * width / image.width)
            # New images contain pixels only, without copying source EXIF/XMP.
            resized = image.resize((width, height), Image.Resampling.LANCZOS)
            resized.save(out / f"{name}-{width}.webp", format="WEBP", quality=82, method=6)
