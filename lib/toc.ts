export interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

/**
 * 从已 sanitize 的 HTML 正文中提取 h2/h3 生成目录，
 * 同时为每个标题注入锚点 id（必须在 sanitize 之后调用，否则 id 会被剥离）。
 */
export function extractToc(html: string): { html: string; toc: TocItem[] } {
  const toc: TocItem[] = [];
  let index = 0;

  const newHtml = html.replace(/<(h2|h3)([^>]*)>([\s\S]*?)<\/\1>/gi, (match, tag, attrs, inner) => {
    const text = inner.replace(/<[^>]*>/g, "").trim();
    if (!text) return match;
    index += 1;
    const id = `toc-${index}`;
    toc.push({ id, text, level: tag.toLowerCase() === "h2" ? 2 : 3 });
    return `<${tag.toLowerCase()} id="${id}">${inner}</${tag.toLowerCase()}>`;
  });

  return { html: newHtml, toc };
}
