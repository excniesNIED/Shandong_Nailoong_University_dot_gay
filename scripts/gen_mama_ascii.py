#!/usr/bin/env python3
"""Render stacked 「妈妈」 blocks as 妈-filled ASCII art.

Uses TrueType CJK rasterization + optional morphology cleanup so the
four large 妈 shapes stay legible in a fixed-width terminal.
"""

from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageOps

FONT_CANDIDATES = [
    "/usr/share/fonts/windows/simhei.ttf",  # 黑体 — clean strokes
    "/usr/share/fonts/windows/msyhbd.ttc",
    "/usr/share/fonts/windows/msyh.ttc",
    "/usr/share/fonts/windows/simsun.ttc",
]


def pick_font(size: int) -> ImageFont.FreeTypeFont:
    last_err: Exception | None = None
    for path in FONT_CANDIDATES:
        if not Path(path).exists():
            continue
        try:
            return ImageFont.truetype(path, size=size, index=0)
        except OSError as exc:
            last_err = exc
    raise SystemExit(f"No usable CJK font found: {last_err}")


def render_text_mask(text: str, font: ImageFont.FreeTypeFont, pad: int = 8) -> Image.Image:
    """Rasterize full text (e.g. 妈妈) to a tight binary L mask."""
    # Measure with a temp draw.
    probe = Image.new("L", (1, 1), 0)
    d = ImageDraw.Draw(probe)
    left, top, right, bottom = d.textbbox((0, 0), text, font=font)
    w = right - left + pad * 2
    h = bottom - top + pad * 2
    img = Image.new("L", (max(w, 1), max(h, 1)), 0)
    draw = ImageDraw.Draw(img)
    draw.text((pad - left, pad - top), text, font=font, fill=255)
    # Slight blur then re-threshold for smoother edges before downscale.
    img = img.filter(ImageFilter.GaussianBlur(radius=0.6))
    return img


def to_grid(
    mask: Image.Image,
    cols: int,
    rows: int,
    threshold: int,
    clean: bool,
) -> list[list[bool]]:
    # High-quality downscale; ImageOps.autocontrast keeps thin strokes.
    small = ImageOps.autocontrast(mask).resize((cols, rows), Image.Resampling.LANCZOS)
    if clean:
        # Soft close: expand thin strokes then shrink — reduces broken bars.
        small = small.filter(ImageFilter.MaxFilter(3))
        small = small.filter(ImageFilter.MinFilter(3))
    px = small.load()
    grid = [[px[x, y] >= threshold for x in range(cols)] for y in range(rows)]
    return trim_grid(grid)


def trim_grid(grid: list[list[bool]]) -> list[list[bool]]:
    if not grid:
        return grid
    while grid and not any(grid[0]):
        grid.pop(0)
    while grid and not any(grid[-1]):
        grid.pop()
    if not grid:
        return grid
    w = len(grid[0])
    left = 0
    while left < w and all(not row[left] for row in grid):
        left += 1
    right = w - 1
    while right >= left and all(not row[right] for row in grid):
        right -= 1
    return [row[left : right + 1] for row in grid]


def remove_isolated(grid: list[list[bool]], min_neighbors: int = 1) -> list[list[bool]]:
    """Drop ink cells with fewer than min_neighbors (4-connected)."""
    h, w = len(grid), len(grid[0])
    out = [row[:] for row in grid]
    for y in range(h):
        for x in range(w):
            if not grid[y][x]:
                continue
            n = 0
            for dy, dx in ((-1, 0), (1, 0), (0, -1), (0, 1)):
                yy, xx = y + dy, x + dx
                if 0 <= yy < h and 0 <= xx < w and grid[yy][xx]:
                    n += 1
            if n < min_neighbors:
                out[y][x] = False
    return out


def outline_grid(grid: list[list[bool]]) -> list[list[bool]]:
    """Keep only edge ink cells (4-connected exterior)."""
    if not grid:
        return grid
    h, w = len(grid), len(grid[0])
    out = [[False] * w for _ in range(h)]
    for y in range(h):
        for x in range(w):
            if not grid[y][x]:
                continue
            for dy, dx in ((-1, 0), (1, 0), (0, -1), (0, 1)):
                yy, xx = y + dy, x + dx
                if not (0 <= yy < h and 0 <= xx < w) or not grid[yy][xx]:
                    out[y][x] = True
                    break
    return out


def erode_grid(grid: list[list[bool]]) -> list[list[bool]]:
    """One 4-connected morphological erosion (thins strokes)."""
    if not grid:
        return grid
    h, w = len(grid), len(grid[0])
    out = [[False] * w for _ in range(h)]
    for y in range(h):
        for x in range(w):
            if not grid[y][x]:
                continue
            ok = True
            for dy, dx in ((-1, 0), (1, 0), (0, -1), (0, 1)):
                yy, xx = y + dy, x + dx
                if not (0 <= yy < h and 0 <= xx < w) or not grid[yy][xx]:
                    ok = False
                    break
            out[y][x] = ok
    return out


def grid_to_lines(grid: list[list[bool]], fill: str = "妈") -> list[str]:
    # One CJK cell ≈ two ASCII columns.
    blank = "  "
    lines = []
    for row in grid:
        lines.append("".join(fill if on else blank for on in row).rstrip())
    while lines and not lines[0].strip():
        lines.pop(0)
    while lines and not lines[-1].strip():
        lines.pop()
    return lines


def stack_blocks(blocks: list[list[str]], vgap: int) -> str:
    out: list[str] = []
    for i, block in enumerate(blocks):
        if i:
            out.extend([""] * vgap)
        out.extend(block)
    return "\n".join(out) + "\n"


def main() -> None:
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--font-size", type=int, default=320)
    p.add_argument("--cols", type=int, default=36, help="columns for whole 妈妈")
    p.add_argument("--rows", type=int, default=12, help="rows for whole 妈妈")
    p.add_argument("--threshold", type=int, default=100)
    p.add_argument("--vgap", type=int, default=1)
    p.add_argument("--word", default="妈妈")
    p.add_argument("--repeat", type=int, default=2)
    p.add_argument("--no-clean", action="store_true")
    p.add_argument("--drop-isolated", action="store_true", default=True)
    p.add_argument("--outline", action="store_true", help="stroke outline only (thinner)")
    p.add_argument("--erode", type=int, default=0, help="erode N times before output")
    p.add_argument(
        "--out",
        type=Path,
        default=Path("src/mama_art.txt"),
    )
    args = p.parse_args()

    font = pick_font(args.font_size)
    mask = render_text_mask(args.word, font)
    grid = to_grid(
        mask,
        cols=args.cols,
        rows=args.rows,
        threshold=args.threshold,
        clean=not args.no_clean,
    )
    for _ in range(max(0, args.erode)):
        grid = erode_grid(grid)
        grid = trim_grid(grid)
    if args.outline:
        grid = outline_grid(grid)
    if args.drop_isolated:
        grid = remove_isolated(grid, min_neighbors=1)
        grid = trim_grid(grid)

    block = grid_to_lines(grid)
    art = stack_blocks([block] * args.repeat, vgap=args.vgap)
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(art, encoding="utf-8")
    print(art, end="")
    widths = [len(line) for line in art.splitlines() if line.strip()]
    print(
        f"\n# wrote {args.out} | lines={len(art.splitlines())} "
        f"width={max(widths) if widths else 0} font={font.path}",
        flush=True,
    )


if __name__ == "__main__":
    main()
