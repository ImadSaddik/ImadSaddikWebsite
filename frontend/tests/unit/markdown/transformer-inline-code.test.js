import MarkdownIt from "markdown-it";
import { describe, it, expect, beforeEach } from "vitest";
import { getMarkdownTransformers } from "../../../vite/markdown/index.js";

describe("inlineCodeTransformer", () => {
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

  describe("basic inline code", () => {
    it("should transform inline code into InlineCode component", () => {
      const input = "`npm install`";
      const output = markdownItInstance.render(input);
      expect(output).toContain('<InlineCode text="npm install" />');
    });

    it("should produce a self-closing InlineCode tag", () => {
      const input = "`const x = 1`";
      const output = markdownItInstance.render(input);
      expect(output).toContain("/>");
      expect(output).not.toContain("</InlineCode>");
    });
  });

  describe("multiple inline codes", () => {
    it("should handle multiple inline codes in one paragraph", () => {
      const input = "Use `const` for constants and `let` for variables";
      const output = markdownItInstance.render(input);
      expect(output).toContain('<InlineCode text="const" />');
      expect(output).toContain('<InlineCode text="let" />');
    });

    it("should handle three inline codes on multiple lines", () => {
      const input = "Use `const`, `let`, or\n`var`";
      const output = markdownItInstance.render(input);
      expect(output).toContain('<InlineCode text="const" />');
      expect(output).toContain('<InlineCode text="let" />');
      expect(output).toContain('<InlineCode text="var" />');
    });
  });

  describe("HTML escaping", () => {
    it("should escape double quotes inside inline code", () => {
      const input = '`"quoted"`';
      const output = markdownItInstance.render(input);
      expect(output).toContain("&quot;quoted&quot;");
    });
  });

  describe("empty inline code", () => {
    it("should not produce an InlineCode component for empty backticks", () => {
      const input = "``";
      const output = markdownItInstance.render(input);
      expect(output).not.toContain("<InlineCode");
      expect(output).toContain("``");
    });
  });

  describe("fenced code block", () => {
    it("should not transform a fenced code block into InlineCode", () => {
      const input = "```js\nconst x = 1;\n```";
      const output = markdownItInstance.render(input);
      expect(output).not.toContain("<InlineCode");
    });
  });
});
