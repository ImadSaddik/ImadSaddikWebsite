import MarkdownIt from "markdown-it";
import { describe, it, expect, beforeEach } from "vitest";
import { getMarkdownTransformers } from "../../../vite/markdown/index.js";

describe("admonitionTransformer", () => {
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

  describe("supported types", () => {
    it.each([
      ["tip", "Helpful info"],
      ["info", "For your information"],
      ["warning", "Be careful"],
      ["danger", "Critical issue"],
    ])("should transform ::: %s into AdmonitionBlock with type='%s'", (type, content) => {
      const input = `::: ${type}\n${content}\n:::`;
      const output = markdownItInstance.render(input);
      const expectedTitle = type.charAt(0).toUpperCase() + type.slice(1);
      expect(output).toContain(`<AdmonitionBlock type="${type}"><template #title>${expectedTitle}</template>`);
      expect(output).toContain("</AdmonitionBlock>");
    });
  });

  describe("custom titles", () => {
    it.each([
      ["tip", "Custom Tip Title"],
      ["info", "Custom Info Title"],
      ["warning", "Custom Warning Title"],
      ["danger", "Custom Danger Title"],
    ])("should use a custom title when provided for type '%s'", (type, title) => {
      const input = `::: ${type} ${title}\nWatch out!\n:::`;
      const output = markdownItInstance.render(input);
      expect(output).toContain(`<AdmonitionBlock type="${type}"><template #title>${title}</template>`);
      expect(output).toContain("</AdmonitionBlock>");
    });
  });

  describe("unsupported types", () => {
    it.each(["unknown", "note", "caution", "alert"])(
      "should not produce an AdmonitionBlock for unsupported type '%s'",
      (type) => {
        const input = `::: ${type}\nSome content\n:::`;
        const output = markdownItInstance.render(input);
        expect(output).not.toContain("<AdmonitionBlock");
        expect(output).not.toContain("</AdmonitionBlock>");
      }
    );
  });

  describe("empty body", () => {
    it.each(["tip", "info", "warning", "danger"])(
      "should render an AdmonitionBlock with no inner content for type '%s'",
      (type) => {
        const input = `::: ${type}\n:::`;
        const output = markdownItInstance.render(input);
        const expectedTitle = type.charAt(0).toUpperCase() + type.slice(1);
        expect(output).toContain(`<AdmonitionBlock type="${type}"><template #title>${expectedTitle}</template>`);
        expect(output).toContain("</AdmonitionBlock>");
      }
    );
  });

  describe("whitespace-only title", () => {
    it.each(["tip", "info", "warning", "danger"])(
      "should fall back to the type name as title when only whitespace follows the type '%s'",
      (type) => {
        const input = `::: ${type}   \nSome content\n:::`;
        const output = markdownItInstance.render(input);
        const expectedTitle = type.charAt(0).toUpperCase() + type.slice(1);
        expect(output).toContain(`<AdmonitionBlock type="${type}"><template #title>${expectedTitle}</template>`);
        expect(output).toContain("</AdmonitionBlock>");
      }
    );
  });

  describe("multiple admonitions", () => {
    it("should render two consecutive admonition blocks independently", () => {
      const input = `::: tip First\nContent A\n:::\n\n::: warning Second\nContent B\n:::`;
      const output = markdownItInstance.render(input);
      expect(output).toContain(`<AdmonitionBlock type="tip"><template #title>First</template>`);
      expect(output).toContain(`<AdmonitionBlock type="warning"><template #title>Second</template>`);
      expect(output.split("</AdmonitionBlock>").length - 1).toBe(2);
    });
  });

  describe("inline markdown in custom titles", () => {
    it("should render inline code inside the admonition title", () => {
      const input = `::: info Why \`/usr/local/bin\` instead of \`~/.local/bin\`?\nContent\n:::`;
      const output = markdownItInstance.render(input);
      expect(output).toContain(
        '<AdmonitionBlock type="info"><template #title>Why <InlineCode text="/usr/local/bin" /> instead of <InlineCode text="~/.local/bin" />?</template>'
      );
      expect(output).toContain("</AdmonitionBlock>");
    });

    it("should render bold and emphasis inside the admonition title", () => {
      const input = `::: tip **Important** *notice*\nContent\n:::`;
      const output = markdownItInstance.render(input);
      expect(output).toContain(
        '<AdmonitionBlock type="tip"><template #title><strong>Important</strong> <em>notice</em></template>'
      );
      expect(output).toContain("</AdmonitionBlock>");
    });
  });

  describe("nested markdown content", () => {
    it("should render inline markdown inside the admonition body as HTML", () => {
      const input = `::: tip\n**bold text** and [a link](https://example.com)\n:::`;
      const output = markdownItInstance.render(input);
      expect(output).toContain("<strong>bold text</strong>");
      expect(output).toContain('<a href="https://example.com" target="_blank" rel="noopener noreferrer">a link</a>');
    });
  });
});
