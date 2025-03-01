import { Token } from "./tokenizer";

export const parse = (tokens: Token[]): string => {
  const ast: string[] = [];
  let inList = false;
  let listType = "";

  tokens.forEach((token, index) => {
    switch (token.type) {
      case "heading":
        ast.push(
          `<h${token.level}>${parseInline(token.content!)}</h${token.level}>`
        );
        break;
      case "ul-item":
        if (!inList || listType !== "ul") {
          if (inList) ast.push(`</${listType}>`);
          ast.push("<ul>");
          inList = true;
          listType = "ul";
        }
        ast.push(`<li>${parseInline(token.content!)}</li>`);
        break;
      case "ol-item":
        if (!inList || listType !== "ol") {
          if (inList) ast.push(`</${listType}>`);
          ast.push("<ol>");
          inList = true;
          listType = "ol";
        }
        ast.push(`<li>${parseInline(token.content!)}</li>`);
        break;
      case "quote":
        ast.push(`<blockquote>${parseInline(token.content!)}</blockquote>`);
        break;
      case "text":
        ast.push(`<p>${parseInline(token.content!)}</p>`);
        break;
      case "image":
        ast.push(`<img src="${token.url}" alt="${token.alt}">`);
        break;
      case "link":
        ast.push(`<a href="${token.url}">${parseInline(token.content!)}</a>`);
        break;
      case "code":
        ast.push(`<pre><code>${token.content}</code></pre>`);
        break;
      case "hr":
        ast.push(`<hr>`);
        break;
      case "table":
        // 生成表格 HTML
        ast.push("<table>");
        if (token.rows && token.rows.length > 0) {
          // 表头
          ast.push("<thead><tr>");
          token.rows[0].forEach((header) => {
            ast.push(`<th>${parseInline(header)}</th>`);
          });
          ast.push("</tr></thead>");

          // 数据行
          ast.push("<tbody>");
          for (let i = 1; i < token.rows.length; i++) {
            ast.push("<tr>");
            token.rows[i].forEach((cell) => {
              ast.push(`<td>${parseInline(cell)}</td>`);
            });
            ast.push("</tr>");
          }
          ast.push("</tbody>");
        }
        ast.push("</table>");
        break;
      default:
        break;
    }
  });

  if (inList) ast.push(`</${listType}>`);

  return ast.join("");
};

// 解析行内元素（支持加粗、斜体、删除线、行内代码）
const parseInline = (text: string): string => {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // **加粗**
    .replace(/\*(.*?)\*/g, "<em>$1</em>") // *斜体*
    .replace(/~~(.*?)~~/g, "<del>$1</del>") // ~~删除线~~
    .replace(/`(.*?)`/g, "<code>$1</code>"); // `行内代码`
};
