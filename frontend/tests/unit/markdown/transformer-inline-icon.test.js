import MarkdownIt from "markdown-it";
import { describe, it, expect, beforeEach } from "vitest";
import { getMarkdownTransformers } from "../../../vite/markdown/index.js";

describe("inlineIconTransformer", () => {
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
    it("should transform ::icon{...}:: into an InlineIcon component", () => {
      const input = "::icon{./icons/edit.svg}::";
      const output = markdownItInstance.render(input);
      expect(output).toContain('<InlineIcon icon="./icons/edit.svg" />');
    });

    it("should produce a self-closing InlineIcon tag", () => {
      const input = "::icon{./icons/star.svg}::";
      const output = markdownItInstance.render(input);
      expect(output).toContain("/>");
      expect(output).not.toContain("</InlineIcon>");
    });

    it("should set the icon attribute correctly", () => {
      const input = "::icon{./assets/logo.svg}::";
      const output = markdownItInstance.render(input);
      expect(output).toContain('icon="./assets/logo.svg"');
    });

    it("should handle icons with surrounding text", () => {
      const input = "Click the ::icon{./edit.svg}:: button to edit.";
      const output = markdownItInstance.render(input);
      expect(output).toContain('Click the <InlineIcon icon="./edit.svg" /> button to edit.');
    });
  });

  describe("path types", () => {
    it("should handle relative paths", () => {
      const input = "::icon{./icons/download.svg}::";
      const output = markdownItInstance.render(input);
      expect(output).toContain('<InlineIcon icon="./icons/download.svg" />');
    });

    it("should handle absolute paths", () => {
      const input = "::icon{/assets/icons/logo.svg}::";
      const output = markdownItInstance.render(input);
      expect(output).toContain('<InlineIcon icon="/assets/icons/logo.svg" />');
    });
  });

  describe("multiple icons", () => {
    it("should handle two icons in one line", () => {
      const input = "Use ::icon{./save.svg}:: or ::icon{./cancel.svg}::";
      const output = markdownItInstance.render(input);
      expect(output).toContain('<InlineIcon icon="./save.svg" />');
      expect(output).toContain('<InlineIcon icon="./cancel.svg" />');
    });
  });

  describe("non-svg file types", () => {
    it.each(["png", "webp", "jpg"])("should handle .%s icon paths", (ext) => {
      const input = `::icon{./icons/logo.${ext}}::`;
      const output = markdownItInstance.render(input);
      expect(output).toContain(`<InlineIcon icon="./icons/logo.${ext}" />`);
    });
  });

  describe("no transformation", () => {
    it("should not transform when closing :: is missing", () => {
      const input = "::icon{./edit.svg}";
      const output = markdownItInstance.render(input);
      expect(output).not.toContain("<InlineIcon");
    });

    it("should not transform when closing brace is missing", () => {
      const input = "::icon{./edit.svg::";
      const output = markdownItInstance.render(input);
      expect(output).not.toContain("<InlineIcon");
    });

    it("should not transform an unknown prefix", () => {
      const input = "::fa{./edit.svg}::";
      const output = markdownItInstance.render(input);
      expect(output).not.toContain("<InlineIcon");
    });

    it("should produce an empty icon attribute for empty braces", () => {
      const input = "::icon{}::";
      const output = markdownItInstance.render(input);
      expect(output).toContain('<InlineIcon icon="" />');
    });
  });
});
