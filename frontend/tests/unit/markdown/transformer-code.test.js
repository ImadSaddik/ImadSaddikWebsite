import MarkdownIt from "markdown-it";
import { describe, it, expect, beforeEach } from "vitest";
import { getMarkdownTransformers } from "../../../vite/markdown/index.js";

describe("codeTransformer", () => {
  let markdownItInstance;

  beforeEach(() => {
    markdownItInstance = new MarkdownIt({
      html: true,
      linkify: true,
      typographer: true,
    });

    getMarkdownTransformers().forEach((transformer) => {
      markdownItInstance.use(transformer);
    });
  });

  describe("CodeBlock component", () => {
    it("should transform fenced code blocks into CodeBlock component", () => {
      const input = "```python\nprint('hello')\n```";
      const output = markdownItInstance.render(input);
      expect(output).toContain("<CodeBlock");
      expect(output).toContain('language="python"');
    });

    it("should set the correct language attribute", () => {
      const input = "```javascript\nconsole.log('hi')\n```";
      const output = markdownItInstance.render(input);
      expect(output).toContain('language="javascript"');
    });

    it("should handle bash code blocks", () => {
      const input = "```bash\nnpm install\n```";
      const output = markdownItInstance.render(input);
      expect(output).toContain('language="bash"');
      expect(output).toContain("npm install");
    });

    it("should handle multi-line code blocks", () => {
      const input = "```python\nline1 = 1\nline2 = 2\nline3 = 3\n```";
      const output = markdownItInstance.render(input);
      expect(output).toContain("line1 = 1");
      expect(output).toContain("line2 = 2");
      expect(output).toContain("line3 = 3");
    });

    it("should default to language='text' when no language is specified", () => {
      const input = "```\nsome plain text\n```";
      const output = markdownItInstance.render(input);
      expect(output).toContain("<CodeBlock");
      expect(output).toContain('language="text"');
    });

    it("should use only the first word of the info string as the language", () => {
      const input = "```python filename.py\npass\n```";
      const output = markdownItInstance.render(input);
      expect(output).toContain('language="python"');
      expect(output).not.toContain("filename.py");
    });
  });

  describe("HTML escaping in code", () => {
    it("should escape single quotes", () => {
      const input = "```python\nprint('hello')\n```";
      const output = markdownItInstance.render(input);
      expect(output).toContain("&#39;hello&#39;");
    });

    it("should escape double quotes", () => {
      const input = '```bash\necho "hello"\n```';
      const output = markdownItInstance.render(input);
      expect(output).toContain("&quot;hello&quot;");
    });

    it("should escape angle brackets", () => {
      const input = "```html\n<div>content</div>\n```";
      const output = markdownItInstance.render(input);
      expect(output).toContain("&lt;div&gt;");
    });

    it("should escape ampersands", () => {
      const input = "```text\nfoo & bar\n```";
      const output = markdownItInstance.render(input);
      expect(output).toContain("foo &amp; bar");
    });
  });

  describe("CodeOutput component", () => {
    it("should transform 'output' language into CodeOutput component", () => {
      const input = "```output\nSuccess!\n```";
      const output = markdownItInstance.render(input);
      expect(output).toContain('<CodeOutput code-output="Success!" />');
    });

    it("should handle multi-line output blocks", () => {
      const input = "```output\nLine 1\nLine 2\nLine 3\n```";
      const output = markdownItInstance.render(input);
      expect(output).toContain("<CodeOutput");
      expect(output).toContain("Line 1");
      expect(output).toContain("Line 2");
      expect(output).toContain("Line 3");
    });

    it("should preserve literal newlines in the code-output attribute value", () => {
      const input = "```output\nfirst\nsecond\n```";
      const output = markdownItInstance.render(input);
      expect(output).toContain("first\nsecond");
    });
  });
});
