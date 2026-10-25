Smaller WebP candidates for the homepage carousel, profile and project cards. The original WebP files stay in `assets/img/` as full-size candidates.

Regenerate from the repository root with `uv run scripts/resize-images.py`. The script pins Pillow and copies only resized pixels, without source EXIF/XMP metadata. Normal builds use these committed assets. Candidate imports and width descriptors live in `src/config/responsiveImages.js`.
