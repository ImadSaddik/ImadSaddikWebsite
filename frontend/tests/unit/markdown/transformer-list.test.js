import MarkdownIt from "markdown-it";
import { describe, it, expect, beforeEach } from "vitest";
import { getMarkdownTransformers } from "../../../vite/markdown/index.js";

describe("listTransformer", () => {
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

  describe("unordered lists", () => {
    it("should transform bullet list into UnorderedList", () => {
      const input = "- Item";
      const output = markdownItInstance.render(input);
      expect(output).toContain("<UnorderedList>");
      expect(output).toContain("</UnorderedList>");
    });

    it("should transform bullet items into UnorderedItem", () => {
      const input = "- Item 1\n- Item 2";
      const output = markdownItInstance.render(input);
      expect(output).toContain("<UnorderedItem>");
      expect(output).toContain("</UnorderedItem>");
    });

    it("should wrap all items in a single UnorderedList", () => {
      const input = "- A\n- B\n- C";
      const output = markdownItInstance.render(input);
      expect(output.match(/<UnorderedList>/g)).toHaveLength(1);
      expect(output.match(/<UnorderedItem>/g)).toHaveLength(3);
    });

    it("should not produce native ul or li tags", () => {
      const input = "- Item";
      const output = markdownItInstance.render(input);
      expect(output).not.toContain("<ul>");
      expect(output).not.toContain("<li>");
    });
  });

  describe("ordered lists", () => {
    it("should transform ordered list open into OrderedList", () => {
      const input = "1. Item";
      const output = markdownItInstance.render(input);
      expect(output).toContain("<OrderedList>");
      expect(output).toContain("</OrderedList>");
    });

    it("should transform numbered items into OrderedItem", () => {
      const input = "1. First\n2. Second";
      const output = markdownItInstance.render(input);
      expect(output).toContain("<OrderedItem>");
      expect(output).toContain("</OrderedItem>");
    });

    it("should wrap all items in a single OrderedList", () => {
      const input = "1. A\n2. B\n3. C";
      const output = markdownItInstance.render(input);
      expect(output.match(/<OrderedList>/g)).toHaveLength(1);
      expect(output.match(/<OrderedItem>/g)).toHaveLength(3);
    });

    it("should not produce native ol or li tags", () => {
      const input = "1. Item";
      const output = markdownItInstance.render(input);
      expect(output).not.toContain("<ol>");
      expect(output).not.toContain("<li>");
    });
  });

  describe("nested lists", () => {
    it("should produce correct open and close counts for nested lists", () => {
      const input = "- Parent\n  - Child 1\n  - Child 2";
      const output = markdownItInstance.render(input);
      expect((output.match(/<UnorderedList>/g) || []).length).toBe(2);
      expect((output.match(/<\/UnorderedList>/g) || []).length).toBe(2);
    });
  });

  describe("ordered list with ) marker", () => {
    it("should transform '1) Item' style into OrderedList and OrderedItem", () => {
      const input = "1) First\n2) Second";
      const output = markdownItInstance.render(input);
      expect(output).toContain("<OrderedList>");
      expect(output).toContain("<OrderedItem>");
      expect(output).toContain("</OrderedItem>");
      expect(output).toContain("</OrderedList>");
    });

    it("should not produce native ol or li tags for ) marker style", () => {
      const input = "1) Item";
      const output = markdownItInstance.render(input);
      expect(output).not.toContain("<ol>");
      expect(output).not.toContain("<li>");
    });
  });

  describe("mixed list types", () => {
    it("should render an ordered and an unordered list in the same document independently", () => {
      const input = "- Bullet\n\n1. Numbered";
      const output = markdownItInstance.render(input);
      expect(output).toContain("<UnorderedList>");
      expect(output).toContain("</UnorderedList>");
      expect(output).toContain("<OrderedList>");
      expect(output).toContain("</OrderedList>");
      expect(output.match(/<UnorderedItem>/g)).toHaveLength(1);
      expect(output.match(/<OrderedItem>/g)).toHaveLength(1);
    });
  });

  describe("markdown inside list items", () => {
    it("should render bold text inside a list item", () => {
      const input = "- **bold item**";
      const output = markdownItInstance.render(input);
      expect(output).toContain("<strong>bold item</strong>");
    });

    it("should render inline code inside a list item", () => {
      const input = "- use `npm install`";
      const output = markdownItInstance.render(input);
      expect(output).toContain('<InlineCode text="npm install" />');
    });

    it("should render a link inside a list item", () => {
      const input = "- visit [GitHub](https://github.com)";
      const output = markdownItInstance.render(input);
      expect(output).toContain('href="https://github.com"');
      expect(output).toContain('target="_blank"');
    });
  });
});
