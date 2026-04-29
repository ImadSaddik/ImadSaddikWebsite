import MarkdownIt from "markdown-it";
import { describe, it, expect, beforeEach } from "vitest";
import { getMarkdownTransformers } from "../../../vite/markdown/index.js";

describe("mathTransformer", () => {
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

  describe("inline math", () => {
    it("should transform inline math into katex HTML", () => {
      const input = "$E=mc^2$";
      const output = markdownItInstance.render(input);
      expect(output).toContain('class="katex"');
      expect(output).toContain("E=mc");
    });

    it("should not transform $ followed by space", () => {
      const input = "$ 20.00";
      const output = markdownItInstance.render(input);
      expect(output).not.toContain('class="katex"');
      expect(output).toContain("$ 20.00");
    });
  });

  describe("block math", () => {
    it("should transform block math into katex display mode HTML", () => {
      const input = "$$a^2 + b^2 = c^2$$";
      const output = markdownItInstance.render(input);
      expect(output).toContain('class="katex-display"');
      expect(output).toContain('class="katex"');
      expect(output).toContain("a");
      expect(output).toContain("b");
      expect(output).toContain("c");
    });

    it("should handle multi-line block math", () => {
      const input = "$$\nx = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}\n$$";
      const output = markdownItInstance.render(input);
      expect(output).toContain('class="katex-display"');
      expect(output).toContain("sqrt");
    });
  });
});
