"""从系统粗体字体提取 G 字形轮廓，生成占满玻璃底的大 G 图标 SVG。
用法: python scripts/gen_icon.py
"""
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen
from fontTools.misc.transform import Transform

FONT_PATH = "C:/Windows/Fonts/segoeuib.ttf"
SIZE = 64
TARGET = 59.0  # G 占满图标（无背景，四周留 ~2.5px）

font = TTFont(FONT_PATH)
glyphSet = font.getGlyphSet()
cmap = font.getBestCmap()
gname = cmap[ord("G")]
glyph = glyphSet[gname]

bp = BoundsPen(glyphSet)
glyph.draw(bp)
x0, y0, x1, y1 = bp.bounds
w, h = x1 - x0, y1 - y0
cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
scale = TARGET / max(w, h)

# fontTools Transform 链式为右乘语义：最后写的先应用。
# 想要的顺序：先平移(-cx,-cy) → 缩放 → 平移到中心(32,31.5)，故链式写法需反序
t = Transform().translate(32, 31.5).scale(scale).translate(-cx, -cy)
spen = SVGPathPen(glyphSet)
tpen = TransformPen(spen, t)
glyph.draw(tpen)
d = spen.getCommands()

svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {SIZE} {SIZE}">
  <defs>
    <!-- G 本体渐变：蓝→青→紫 -->
    <linearGradient id="gtext" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2563eb"/>
      <stop offset="55%" stop-color="#06b6d4"/>
      <stop offset="100%" stop-color="#8b5cf6"/>
    </linearGradient>
    <!-- 玻璃高光：顶部白色反光，向下渐隐 -->
    <linearGradient id="glow" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.85"/>
      <stop offset="38%" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>
    <!-- 玻璃底部折射淡光 -->
    <linearGradient id="refract" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="55%" stop-color="#a5f3fc" stop-opacity="0"/>
      <stop offset="100%" stop-color="#a5f3fc" stop-opacity="0.5"/>
    </linearGradient>
  </defs>

  <!-- 大写 G：本体渐变 -->
  <g transform="translate(0,{SIZE}) scale(1,-1)">
    <path d="{d}" fill="url(#gtext)"/>
    <!-- 玻璃顶部白色高光反光 -->
    <path d="{d}" fill="url(#glow)"/>
    <!-- 玻璃底部折射淡光 -->
    <path d="{d}" fill="url(#refract)"/>
  </g>
</svg>'''

with open("app/icon.svg", "w", encoding="utf-8") as f:
    f.write(svg)
print("OK bounds:", (round(x0,1), round(y0,1), round(x1,1), round(y1,1)), "scale:", round(scale,3), "path_len:", len(d))
