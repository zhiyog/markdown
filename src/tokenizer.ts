export type Token = {
  type: string;
  content?: string;
  level?: number;
  url?: string;
  alt?: string;
  children?: Token[];
  rows?: string[][]; // 用于表格的行数据
};

export const tokenize = (markdown: string): Token[] => {
  const lines = markdown.split("\n").map(line => line.trim()).filter(Boolean);
  return parseLines(lines);
};

// 解析块级内容
const parseLines = (lines: string[]): Token[] => {
  const tokens: Token[] = [];
  let inCodeBlock = false;
  let codeBlockContent: string[] = [];
  let inTable = false;
  let tableRows: string[][] = [];
  let tableHeaders: string[] = [];

  while (lines.length) {
    const line = lines.shift()!;

    // 解析代码块 ``` 多行代码
    if (/^```/.test(line)) {
      if (inCodeBlock) {
        tokens.push({ type: "code", content: codeBlockContent.join("\n") });
        codeBlockContent = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockContent.push(line);
      continue;
    }

    // 解析表格
    if (/\|.*\|/.test(line)) {
      if (!inTable) {
        inTable = true;
        tableHeaders = line.split("|").map(cell => cell.trim()).filter(Boolean);
        // 跳过分隔线
        const separatorLine = lines.shift()!;
        continue;
      } else {
        const row = line.split("|").map(cell => cell.trim()).filter(Boolean);
        tableRows.push(row);
      }
      continue;
    } else if (inTable) {
      // 表格结束
      tokens.push({ type: "table", rows: [tableHeaders, ...tableRows] });
      inTable = false;
      tableHeaders = [];
      tableRows = [];
    }

    // 标题
    if (/^#{1,6} /.test(line)) {
      const level = line.match(/^#{1,6}/)![0].length;
      tokens.push({ type: "heading", level, content: parseInline(line.slice(level).trim()) });
    }
    // 水平线
    else if (/^(-{3,}|\*{3,})$/.test(line)) {
      tokens.push({ type: "hr" });
    }
    // 引用
    else if (/^> /.test(line)) {
      tokens.push({ type: "quote", content: parseInline(line.slice(2).trim()) });
    }
    // 列表
    else if (/^(\*|-|\+) /.test(line) || /^\d+\. /.test(line)) {
      const isOrdered = /^\d+\. /.test(line);
      tokens.push({
        type: isOrdered ? "ol-item" : "ul-item",
        content: parseInline(line.replace(/^(\*|-|\+|\d+\.) /, "").trim())
      });
    }
    // 解析图片
    else if (/!\[(.*?)\]\((.*?)\)/.test(line)) {
      const match = line.match(/!\[(.*?)\]\((.*?)\)/);
      tokens.push({ type: "image", alt: match![1], url: match![2] });
    }
    // 解析超链接
    else if (/\[(.*?)\]\((.*?)\)/.test(line)) {
      const match = line.match(/\[(.*?)\]\((.*?)\)/);
      tokens.push({ type: "link", content: match![1], url: match![2] });
    }
    // 普通文本
    else {
      tokens.push({ type: "text", content: parseInline(line) });
    }
  }

  // 处理最后可能未结束的表格
  if (inTable) {
    tokens.push({ type: "table", rows: [tableHeaders, ...tableRows] });
  }

  return tokens;
};

// 解析行内元素（加粗、斜体、删除线、行内代码）
const parseInline = (text: string): string => {
  text = text.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>"); // **加粗**
  text = text.replace(/\*(.*?)\*/g, "<i>$1</i>"); // *斜体*
  text = text.replace(/~~(.*?)~~/g, "<del>$1</del>"); // ~~删除线~~
  text = text.replace(/`(.*?)`/g, "<code>$1</code>"); // `行内代码`
  return text;
};