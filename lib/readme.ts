import { marked } from "marked";
import sanitizeHtml from "sanitize-html";

// sanitize-html 白名单（与博客正文一致，放行代码块 / 表格 / 图片）
export const markdownSanitizeOptions: sanitizeHtml.IOptions = {
  allowedTags: [
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "p",
    "a",
    "ul",
    "ol",
    "li",
    "blockquote",
    "code",
    "pre",
    "img",
    "hr",
    "br",
    "strong",
    "em",
    "del",
    "table",
    "thead",
    "tbody",
    "tr",
    "th",
    "td",
    "span",
    "div",
  ],
  allowedAttributes: {
    a: ["href", "title", "target", "rel"],
    img: ["src", "alt", "title", "width", "height", "loading", "referrerpolicy"],
    code: ["class"],
    span: ["class", "style"],
    pre: ["class"],
    div: ["class"],
    th: ["align"],
    td: ["align"],
  },
  allowedSchemes: ["http", "https", "mailto", "data"],
};

/**
 * 将 GitHub README 渲染出的 HTML 中相对路径的资源链接重写为可访问的绝对地址。
 * - 图片（src 相对路径，含 `./`、`../`、`/` 开头）→ jsDelivr CDN：
 *   `https://cdn.jsdelivr.net/gh/{owner}/{repo}@{branch}/{path}`
 *   （国内可稳定访问，避免 raw.githubusercontent.com 被墙导致图片加载失败）
 * - 链接（href 相对路径）→ `https://github.com/{owner}/{repo}/blob/{branch}/{path}`
 * - 绝对地址（http/https/data:）与锚点（#）原样保留
 * - 自动为图片补上 `loading="lazy"` 与 `referrerpolicy="no-referrer"`（懒加载 + 防防盗链）
 */
export function rewriteGithubUrls(
  html: string,
  owner: string,
  repo: string,
  branch: string,
): string {
  const cdnBase = `https://cdn.jsdelivr.net/gh/${owner}/${repo}@${branch}/`;
  const blobBase = `https://github.com/${owner}/${repo}/blob/${branch}/`;

  html = html.replace(/<img\b[^>]*?\bsrc="([^"]+)"[^>]*>/g, (match, src) => {
    // 绝对地址 / data URI 原样保留
    if (/^(https?:|data:|blob:)/i.test(src)) return match;

    // 归一化：去掉 ./ ../ 与开头的 /，去掉 ?query 参数（CDN 不需要）
    const clean = src
      .replace(/^(?:\.\.?\/)+/, "")
      .replace(/^\/+/, "")
      .split("?")[0];
    if (!clean) return match;

    // 注意：marked 渲染时已对 URL 做过一次百分号编码（中文→%E7%95%8C），
    // 这里不能再次 encodeURI（会把 % 编码成 %25 导致双重编码），
    // 只兜底编码 ASCII 空白/引号/尖括号 + 未编码的非 ASCII 字符，并把 # 转义为 %23
    const path = clean
      .replace(/[\u0000-\u0020<>"'`\u0080-\uFFFF]/g, (c: string) => encodeURIComponent(c))
      .replace(/#/g, "%23");

    const abs = cdnBase + path;
    let out = match.replace(src, abs);

    // 补懒加载与防防盗链（若原标签未写）
    if (!/\bloading\s*=/.test(out)) {
      out = out.replace(/\s*\/?>$/, ' loading="lazy">');
    }
    if (!/\breferrerpolicy\s*=/.test(out)) {
      out = out.replace(/\s*\/?>$/, ' referrerpolicy="no-referrer">');
    }
    return out;
  });

  html = html.replace(/<a\b[^>]*?\bhref="([^"]+)"/g, (match, href) => {
    // 绝对地址 / 锚点 / 邮件 / JS 原样保留
    if (/^(https?:|mailto:|#|javascript:)/i.test(href)) return match;

    // 归一化后转为 blob 绝对地址（同样避免双重编码）
    const clean = href
      .replace(/^(?:\.\.?\/)+/, "")
      .replace(/^\/+/, "")
      .split("?")[0];
    if (!clean) return match;

    const path = clean
      .replace(/[\u0000-\u0020<>"'`\u0080-\uFFFF]/g, (c: string) => encodeURIComponent(c))
      .replace(/#/g, "%23");

    return match.replace(href, blobBase + path);
  });

  return html;
}

/** 将 Markdown 渲染为可安全展示的 HTML（GitHub README 专用） */
export async function renderMarkdownHtml(markdown: string): Promise<string> {
  const rendered = await marked.parse(markdown);
  return sanitizeHtml(rendered, markdownSanitizeOptions);
}
