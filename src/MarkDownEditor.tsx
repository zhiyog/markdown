import React, { useState, useEffect, useRef } from "react";
import { tokenize, Token } from "./tokenizer";
import { parse } from "./parser";
import exportPDF from "./pdf";
import { Button } from "antd";

/*

# title1
## title2
### title3
- 1
- 2

1. 加粗：**bold**   
2. 斜体：*italic*    
3. 删除线：~~strikethrough~~

![alt text](https://zhiyog.github.io/img/game/game.jpg)
[个人网站](https://zhiyog.github.io/)

> 这是引用
---
| header 1 | header 2 |
| -------- | -------- |
| cell 1   | cell 2   |
| cell 3   | cell 4   |
| cell 5   | cell 6   |
***
```
code
int main(){
return 0;
}
```

*/
const MarkdownEditor: React.FC = () => {
  const [input, setInput] = useState<string>("");
  const [preview, setPreview] = useState<string>("");
  const contentRef = useRef<HTMLDivElement>(null);

  // 实时更新预览
  useEffect(() => {
    const tokens: Token[] = tokenize(input);
    console.log("tokens是", tokens);
    const html = parse(tokens);
    console.log("html是", html);
    setPreview(html);
  }, [input]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  return (
    <div style={{ display: "flex", flexDirection: "row", height: "100vh" }}>
      <Button onClick={() => exportPDF(contentRef.current, "test")}>
        导出 PDF
      </Button>

      <textarea
        value={input}
        onChange={handleChange}
        style={{
          width: "50%",
          height: "100%",
          padding: "10px",
          fontSize: "16px",
        }}
        placeholder="Write Markdown here"
      />
      <div style={{ width: "50%", overflowY: "auto" }}>
        <div
          style={{ padding: "10px" }}
          ref={contentRef}
          dangerouslySetInnerHTML={{ __html: preview }}
        />
      </div>
    </div>
  );
};

export default MarkdownEditor;
