import { Token } from './tokenizer';

export const parse = (tokens: Token[]): string => {
  const ast: string[] = [];

  tokens.forEach((token) => {
    switch (token.type) {
      case 'heading':
        ast.push(`<h${token.level}>${token.content}</h${token.level}>`);
        break;
      case 'bold':
        ast.push(`<strong>${token.content}</strong>`);
        break;
      case 'list':
        ast.push(`<ul><li>${token.content}</li></ul>`);
        break;
      case 'quote':
        ast.push(`<blockquote>${token.content}</blockquote>`);
        break;
      case 'text':
        ast.push(`<p>${token.content}</p>`);
        break;
      default:
        break;
    }
  });

  return ast.join('');
};
