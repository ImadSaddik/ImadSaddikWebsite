import MarkdownIt from "markdown-it";
import { describe, it, expect, beforeEach } from "vitest";
import { getMarkdownTransformers } from "../../../vite/markdown/index.js";

describe("superscriptTransformer", () => {
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

  describe("basic superscript", () => {
    it("should transform ^text^ into SuperscriptText component", () => {
      const input = "The value is 2^10^.";
      const output = markdownItInstance.render(input);
      expect(output).toContain('<SuperscriptText text="10" />');
    });

    it("should produce a self-closing SuperscriptText tag", () => {
      const input = "x^2^";
      const output = markdownItInstance.render(input);
      expect(output).toContain("/>");
      expect(output).not.toContain("</SuperscriptText>");
    });

    it("should preserve surrounding text", () => {
      const input = "Area = πr^2^ where r is the radius";
      const output = markdownItInstance.render(input);
      expect(output).toContain('Area = πr<SuperscriptText text="2" /> where r is the radius');
    });
  });

  describe("multiple superscripts", () => {
    it("should handle multiple superscripts in one line", () => {
      const input = "x^2^ + y^2^ = z^2^";
      const output = markdownItInstance.render(input);
      expect(output.match(/<SuperscriptText text="2" \/>/g)).toHaveLength(3);
    });

    it("should handle different superscript values in one line", () => {
      const input = "2^10^ is 1024 and 3^3^ is 27";
      const output = markdownItInstance.render(input);
      expect(output).toContain('<SuperscriptText text="10" />');
      expect(output).toContain('<SuperscriptText text="3" />');
    });
  });

  describe("no transformation", () => {
    it("should not transform text with no carets", () => {
      const input = "plain text with no carets";
      const output = markdownItInstance.render(input);
      expect(output).not.toContain("<SuperscriptText");
      expect(output).toContain("plain text with no carets");
    });

    it("should not transform an unmatched opening caret", () => {
      const input = "text^only one caret";
      const output = markdownItInstance.render(input);
      expect(output).not.toContain("<SuperscriptText");
    });

    it("should not transform an unmatched closing caret", () => {
      const input = "only one caret^";
      const output = markdownItInstance.render(input);
      expect(output).not.toContain("<SuperscriptText");
    });

    it("should not transform empty carets ^^", () => {
      const input = "nothing here ^^ at all";
      const output = markdownItInstance.render(input);
      expect(output).not.toContain("<SuperscriptText");
    });

    it("should not transform carets inside inline code", () => {
      const input = "use `x^2^` in code";
      const output = markdownItInstance.render(input);
      expect(output).not.toContain("<SuperscriptText");
      expect(output).toContain("<InlineCode");
    });
  });
});
