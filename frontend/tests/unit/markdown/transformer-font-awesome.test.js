import MarkdownIt from "markdown-it";
import { describe, it, expect, beforeEach } from "vitest";
import { getMarkdownTransformers } from "../../../vite/markdown/index.js";

describe("fontAwesomeTransformer", () => {
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

  describe("basic icon", () => {
    it("should transform ::fa{...}:: into an <i> element", () => {
      const input = "::fa{fa-solid fa-home}::";
      const output = markdownItInstance.render(input);
      expect(output).toContain('<i class="fa-solid fa-home"></i>');
    });

    it("should handle icons with surrounding text", () => {
      const input = "Click the ::fa{fa-solid fa-home}:: icon to go home.";
      const output = markdownItInstance.render(input);
      expect(output).toContain('Click the <i class="fa-solid fa-home"></i> icon to go home.');
    });
  });

  describe("multiple icons", () => {
    it("should handle two icons in one line", () => {
      const input = "::fa{fa-solid fa-star}:: and ::fa{fa-solid fa-heart}::";
      const output = markdownItInstance.render(input);
      expect(output).toContain('<i class="fa-solid fa-star"></i>');
      expect(output).toContain('<i class="fa-solid fa-heart"></i>');
    });
  });

  describe("extra modifier classes", () => {
    it("should preserve all classes including size and animation modifiers", () => {
      const input = "::fa{fa-solid fa-home fa-2x fa-spin}::";
      const output = markdownItInstance.render(input);
      expect(output).toContain('<i class="fa-solid fa-home fa-2x fa-spin"></i>');
    });
  });

  describe("no transformation", () => {
    it("should not transform when closing :: is missing", () => {
      const input = "::fa{fa-solid fa-home}";
      const output = markdownItInstance.render(input);
      expect(output).not.toContain('<i class="fa-solid fa-home"></i>');
    });

    it("should not transform when closing brace is missing", () => {
      const input = "::fa{fa-solid fa-home::";
      const output = markdownItInstance.render(input);
      expect(output).not.toContain('<i class="fa-solid fa-home"></i>');
    });

    it("should not transform an unknown prefix", () => {
      const input = "::icon{fa-solid fa-home}::";
      const output = markdownItInstance.render(input);
      expect(output).not.toContain('<i class="fa-solid fa-home"></i>');
    });

    it("should produce an empty class attribute for empty braces", () => {
      const input = "::fa{}::";
      const output = markdownItInstance.render(input);
      expect(output).toContain('<i class=""></i>');
    });
  });
});
