import MarkdownIt from "markdown-it";
import { describe, it, expect, beforeEach } from "vitest";
import { getMarkdownTransformers } from "../../../vite/markdown/index.js";

describe("tableTransformer", () => {
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

  describe("DataTable component", () => {
    it("should transform a markdown table into a DataTable component", () => {
      const input = "| col1 | col2 |\n| --- | --- |\n| val1 | val2 |";
      const output = markdownItInstance.render(input);
      expect(output).toContain("<DataTable");
    });

    it("should produce a self-closing DataTable tag", () => {
      const input = "| A | B |\n| --- | --- |\n| 1 | 2 |";
      const output = markdownItInstance.render(input);
      expect(output).toContain("/>");
      expect(output).not.toContain("</DataTable>");
    });

    it("should not produce native table, thead, tbody, tr, or td tags", () => {
      const input = "| A | B |\n| --- | --- |\n| 1 | 2 |";
      const output = markdownItInstance.render(input);
      expect(output).not.toContain("<table");
      expect(output).not.toContain("<thead");
      expect(output).not.toContain("<tbody");
      expect(output).not.toContain("<tr");
      expect(output).not.toContain("<td");
    });
  });

  describe("headers", () => {
    it("should encode headers as a JSON array in :headers attribute", () => {
      const input = "| col1 | col2 |\n| --- | --- |\n| val1 | val2 |";
      const output = markdownItInstance.render(input);
      expect(output).toContain(':headers="[&quot;col1&quot;,&quot;col2&quot;]"');
    });

    it("should handle three-column tables", () => {
      const input = "| A | B | C |\n| --- | --- | --- |\n| 1 | 2 | 3 |";
      const output = markdownItInstance.render(input);
      expect(output).toContain("&quot;A&quot;,&quot;B&quot;,&quot;C&quot;");
    });

    it("should handle a single-column table", () => {
      const input = "| Name |\n| --- |\n| Alice |";
      const output = markdownItInstance.render(input);
      expect(output).toContain(':headers="[&quot;Name&quot;]"');
    });
  });

  describe("rows", () => {
    it("should encode rows as a nested JSON array in :rows attribute", () => {
      const input = "| col1 | col2 |\n| --- | --- |\n| val1 | val2 |";
      const output = markdownItInstance.render(input);
      expect(output).toContain(':rows="[[&quot;val1&quot;,&quot;val2&quot;]]"');
    });

    it("should handle multiple rows", () => {
      const input = "| Name | Age |\n| --- | --- |\n| Alice | 30 |\n| Bob | 25 |";
      const output = markdownItInstance.render(input);
      expect(output).toContain("&quot;Alice&quot;");
      expect(output).toContain("&quot;Bob&quot;");
    });
  });

  describe("empty body", () => {
    it("should produce an empty rows array when there are no data rows", () => {
      const input = "| A | B |\n| --- | --- |";
      const output = markdownItInstance.render(input);
      expect(output).toContain(':rows="[]"');
    });
  });

  describe("cell content edge cases", () => {
    it("should convert straight quotes in cell values to typographic quotes", () => {
      const input = '| col |\n| --- |\n| say "hi" |';
      const output = markdownItInstance.render(input);
      expect(output).toContain("&quot;say “hi”&quot;");
    });

    it("should render markdown syntax in cells as HTML", () => {
      const input = "| col |\n| --- |\n| **bold** |";
      const output = markdownItInstance.render(input);
      expect(output).toContain("<strong>bold</strong>");
      expect(output).not.toContain("**bold**");
    });
  });

  describe("multiple tables", () => {
    it("should render two tables in the same document independently", () => {
      const input = "| A | B |\n| --- | --- |\n| 1 | 2 |\n\n| X | Y |\n| --- | --- |\n| 3 | 4 |";
      const output = markdownItInstance.render(input);
      expect(output).toContain("&quot;A&quot;,&quot;B&quot;");
      expect(output).toContain("&quot;X&quot;,&quot;Y&quot;");
      expect(output).toContain("&quot;1&quot;,&quot;2&quot;");
      expect(output).toContain("&quot;3&quot;,&quot;4&quot;");
      expect(output.match(/<DataTable/g)).toHaveLength(2);
    });
  });
});
