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
    img: ["src", "alt", "title", "width", "height"],
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
 * 将 GitHub README 渲染出的 HTML 中相对路径的资源链接重写为 GitHub 绝对地址。
 * - 图片（src 相对路径）→ https://raw.githubusercontent.com/{owner}/{repo}/{branch}/{path}
 * - 链接（href 相对路径）→ https://github.com/{owner}/{repo}/blob/{branch}/{path}
 */
export function rewriteGithubUrls(
  html: string,
  owner: string,
  repo: string,
  branch: string,
): string {
  const rawBase = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/`;
  const blobBase = `https://github.com/${owner}/${repo}/blob/${branch}/`;

  html = html.replace(/<img[^>]*?\bsrc="([^"]+)"/g, (match, src) => {
    if (/^(https?:|data:|blob:|#|\/)/.test(src)) return match;
    return match.replace(src, rawBase + encodeURI(src).replace(/#/g, "%23"));
  });

  html = html.replace(/<a[^>]*?\bhref="([^"]+)"/g, (match, href) => {
    if (/^(https?:|mailto:|#|\/)/.test(href)) return match;
    return match.replace(href, blobBase + encodeURI(href).replace(/#/g, "%23"));
  });

  return html;
}

/** 将 Markdown 渲染为可安全展示的 HTML（GitHub README 专用） */
export async function renderMarkdownHtml(markdown: string): Promise<string> {
  const rendered = await marked.parse(markdown);
  return sanitizeHtml(rendered, markdownSanitizeOptions);
}
