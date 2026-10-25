These subsets retain the Font Awesome 7.1.0 glyphs used by this site's TocasUI 5.7.0 classes. The original fonts are pinned by SHA-256 in `scripts/subset-icons.py`; their license is in `public/licenses/fontawesome.txt` (also shipped with the site).

After adding an `is-…-icon` class, regenerate from the repository root with `uv run scripts/subset-icons.py`. Normal builds use the committed WOFF2 files and need neither Python nor network access for generation. Keep the local font declarations after TocasUI's stylesheet so the subsets take precedence.
