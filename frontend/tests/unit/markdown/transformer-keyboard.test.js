import MarkdownIt from "markdown-it";
import { describe, it, expect, beforeEach } from "vitest";
import { getMarkdownTransformers } from "../../../vite/markdown/index.js";

describe("keyboardTransformer", () => {
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

  describe("basic keyboard keys", () => {
    it("should transform [[key]] into KeyboardKey component", () => {
      const input = "Press [[F12]] to inspect";
      const output = markdownItInstance.render(input);
      expect(output).toContain('<KeyboardKey text="F12" />');
    });

    it("should produce a self-closing KeyboardKey tag", () => {
      const input = "[[Enter]]";
      const output = markdownItInstance.render(input);
      expect(output).toContain("/>");
      expect(output).not.toContain("</KeyboardKey>");
    });

    it("should preserve surrounding text", () => {
      const input = "Save by pressing [[Ctrl+S]] immediately";
      const output = markdownItInstance.render(input);
      expect(output).toContain('Save by pressing <KeyboardKey text="Ctrl+S" /> immediately');
    });
  });

  describe("multiple keys and shortcuts", () => {
    it("should handle multiple keys in one line", () => {
      const input = "Press [[Ctrl]] and then [[C]]";
      const output = markdownItInstance.render(input);
      expect(output).toContain('<KeyboardKey text="Ctrl" />');
      expect(output).toContain('<KeyboardKey text="C" />');
    });

    it("should handle combination shortcuts", () => {
      const input = "Shortcut is [[Ctrl+Shift+P]]";
      const output = markdownItInstance.render(input);
      expect(output).toContain('<KeyboardKey text="Ctrl+Shift+P" />');
    });

    it("should handle keyboard keys inside link text", () => {
      const input = "Click [here for [[Ctrl+C]]](https://example.com)";
      const output = markdownItInstance.render(input);
      expect(output).toContain('<KeyboardKey text="Ctrl+C" />');
    });
  });

  describe("HTML escaping", () => {
    it("should escape quotes inside keys", () => {
      const input = '[["quoted"]]';
      const output = markdownItInstance.render(input);
      expect(output).toContain("&quot;quoted&quot;");
    });
  });

  describe("no transformation", () => {
    it("should not transform text without double brackets", () => {
      const input = "plain text with no brackets";
      const output = markdownItInstance.render(input);
      expect(output).not.toContain("<KeyboardKey");
      expect(output).toContain("plain text with no brackets");
    });

    it("should not transform empty brackets [[]]", () => {
      const input = "empty [[]] brackets";
      const output = markdownItInstance.render(input);
      expect(output).not.toContain("<KeyboardKey");
    });

    it("should not transform whitespace only brackets [[   ]]", () => {
      const input = "spaces [[   ]] brackets";
      const output = markdownItInstance.render(input);
      expect(output).not.toContain("<KeyboardKey");
    });

    it("should not transform single brackets or standard links", () => {
      const input = "[link text](https://example.com)";
      const output = markdownItInstance.render(input);
      expect(output).not.toContain("<KeyboardKey");
      expect(output).toContain('<a href="https://example.com"');
    });

    it("should not transform double brackets inside inline code", () => {
      const input = "use `[[F12]]` in code";
      const output = markdownItInstance.render(input);
      expect(output).not.toContain("<KeyboardKey");
      expect(output).toContain("<InlineCode");
    });
  });
});
