import React, { useState, useEffect } from 'react';
import { tokenize, Token } from './tokenizer';
import { parse } from './parser';

const MarkdownEditor: React.FC = () => {
  const [input, setInput] = useState<string>('');
  const [preview, setPreview] = useState<string>('');

  // 实时更新预览
  useEffect(() => {
    const tokens: Token[] = tokenize(input);
    const html = parse(tokens);
    setPreview(html);
  }, [input]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'row', height: '100vh' }}>
      <textarea
        value={input}
        onChange={handleChange}
        style={{ width: '50%', height: '100%', padding: '10px', fontSize: '16px' }}
        placeholder="Write Markdown here"
      />
      <div
        style={{ width: '50%', padding: '10px', overflowY: 'auto' }}
        dangerouslySetInnerHTML={{ __html: preview }}
      />
    </div>
  );
};

export default MarkdownEditor;
