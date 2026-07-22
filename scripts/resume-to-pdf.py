#!/usr/bin/env python3
"""Convert a Jekyll-flavored Markdown resume into a clean, print-ready PDF.

Usage:
    python scripts/resume-to-pdf.py resume/index.md
    python scripts/resume-to-pdf.py resume/index.md -o resume/Dan-Kimball-Resume.pdf

Requires:
    pip install markdown playwright
    playwright install chromium   # one-time browser download

This intentionally does NOT depend on Jekyll being built/served. It strips
the Jekyll front matter, renders the remaining Markdown body with a
resume-oriented print stylesheet, and exports it to PDF with Playwright's
headless Chromium (matches what "Print to PDF" in a real browser produces).
"""

from __future__ import annotations

import argparse
import re
import sys
import tempfile
from pathlib import Path

import markdown
from playwright.sync_api import sync_playwright

FRONT_MATTER_RE = re.compile(r"^---\s*\n.*?\n---\s*\n", re.DOTALL)

PRINT_CSS = """
@page { size: Letter; margin: 0.55in 0.65in; }
* { box-sizing: border-box; }
body {
    font-family: "Segoe UI", Calibri, Helvetica, Arial, sans-serif;
    font-size: 10.3pt;
    line-height: 1.42;
    color: #1a1a1a;
    max-width: 100%;
}
h1 { font-size: 18pt; margin: 0 0 4pt 0; }
h2 {
    font-size: 12.5pt;
    margin: 14pt 0 6pt 0;
    padding-bottom: 2pt;
    border-bottom: 1.25pt solid #333;
    page-break-after: avoid;
}
h3 {
    font-size: 10.8pt;
    margin: 8pt 0 3pt 0;
    page-break-after: avoid;
}
p { margin: 4pt 0; }
ul { margin: 4pt 0 8pt 0; padding-left: 16pt; }
li { margin: 2pt 0; }
strong { color: #000; }
a { color: #0645ad; text-decoration: none; }
table { border-collapse: collapse; width: 100%; margin: 6pt 0; font-size: 9.6pt; }
th, td { border: 0.5pt solid #999; padding: 3pt 6pt; text-align: left; }
blockquote {
    margin: 6pt 0; padding: 4pt 10pt;
    border-left: 3pt solid #999; color: #444; font-size: 9.6pt;
}
hr { border: none; border-top: 0.5pt solid #ccc; margin: 8pt 0; }
"""

HTML_TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>{title}</title>
<style>{css}</style>
</head>
<body>
{body}
</body>
</html>
"""


def strip_front_matter(text: str) -> str:
    return FRONT_MATTER_RE.sub("", text, count=1)


def extract_title(text: str) -> str:
    match = re.search(r'^title:\s*"?([^"\n]+)"?', text, re.MULTILINE)
    return match.group(1).strip() if match else "Resume"


def convert(md_path: Path, pdf_path: Path) -> None:
    raw = md_path.read_text(encoding="utf-8")
    title = extract_title(raw)
    body_md = strip_front_matter(raw)

    pdf_path.parent.mkdir(parents=True, exist_ok=True)
    body_html = markdown.markdown(
        body_md,
        extensions=["extra", "tables", "sane_lists"],
    )

    html = HTML_TEMPLATE.format(title=title, css=PRINT_CSS, body=body_html)

    with tempfile.NamedTemporaryFile(
        "w", suffix=".html", delete=False, encoding="utf-8"
    ) as tmp:
        tmp.write(html)
        tmp_path = Path(tmp.name)

    try:
        with sync_playwright() as p:
            browser = p.chromium.launch()
            try:
                page = browser.new_page()
                page.goto(tmp_path.as_uri())
                page.pdf(
                    path=str(pdf_path),
                    format="Letter",
                    print_background=True,
                    margin={"top": "0in", "bottom": "0in", "left": "0in", "right": "0in"},
                )
            finally:
                browser.close()
    finally:
        tmp_path.unlink(missing_ok=True)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("markdown_file", type=Path, help="Path to the source .md file")
    parser.add_argument(
        "-o",
        "--output",
        type=Path,
        default=None,
        help="Output PDF path (default: same name as input, .pdf extension)",
    )
    args = parser.parse_args()

    md_path: Path = args.markdown_file
    if not md_path.exists():
        print(f"error: markdown file not found: {md_path}", file=sys.stderr)
        return 1

    pdf_path: Path = args.output or md_path.with_suffix(".pdf")
    convert(md_path, pdf_path)
    print(f"Wrote {pdf_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
