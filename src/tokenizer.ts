export type Token = {
  type: string;
  level?: number;
  content: string;
};

export const tokenize = (markdown: string): Token[] => {
  const tokens: Token[] = [];
  const lines = markdown.split('\n');

  lines.forEach((line) => {
    if (line.startsWith('#')) {
      const level = line.match(/^#*/)?.[0].length || 0;
      tokens.push({ type: 'heading', level, content: line.slice(level).trim() });
    } else if (line.startsWith('**') && line.endsWith('**')) {
      tokens.push({ type: 'bold', content: line.slice(2, -2) });
    } else if (line.startsWith('*') || line.startsWith('-')) {
      tokens.push({ type: 'list', content: line.slice(2).trim() });
    } else if (line.startsWith('>')) {
      tokens.push({ type: 'quote', content: line.slice(1).trim() });
    } else {
      tokens.push({ type: 'text', content: line });
    }
  });

  return tokens;
};
