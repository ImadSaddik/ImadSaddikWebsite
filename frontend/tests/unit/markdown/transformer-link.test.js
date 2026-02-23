import MarkdownIt from "markdown-it";
import { describe, it, expect, beforeEach } from "vitest";
import { getMarkdownTransformers } from "../../../vite/markdown/index.js";

describe("linkTransformer", () => {
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

  describe("external links", () => {
    it("should add target='_blank' to external http links", () => {
      const input = "[GitHub](https://github.com)";
      const output = markdownItInstance.render(input);
      expect(output).toContain('target="_blank"');
    });

    it("should add rel='noopener noreferrer' to external links", () => {
      const input = "[GitHub](https://github.com)";
      const output = markdownItInstance.render(input);
      expect(output).toContain('rel="noopener noreferrer"');
    });

    it("should handle http (non-https) external links", () => {
      const input = "[Old Site](http://example.com)";
      const output = markdownItInstance.render(input);
      expect(output).toContain('target="_blank"');
      expect(output).toContain('rel="noopener noreferrer"');
    });

    it("should preserve the href of external links", () => {
      const input = "[Docs](https://vuejs.org/guide)";
      const output = markdownItInstance.render(input);
      expect(output).toContain('href="https://vuejs.org/guide"');
    });

    it("should handle multiple external links in one paragraph", () => {
      const input = "Visit [Vue](https://vuejs.org) and [Vite](https://vitejs.dev)";
      const output = markdownItInstance.render(input);
      expect(output).toContain('href="https://vuejs.org"');
      expect(output).toContain('href="https://vitejs.dev"');
      expect(output.match(/target="_blank"/g)).toHaveLength(2);
    });
  });

  describe("internal links", () => {
    it("should not add target='_blank' to absolute path links", () => {
      const input = "[About Me](/about-me)";
      const output = markdownItInstance.render(input);
      expect(output).not.toContain('target="_blank"');
      expect(output).toContain('href="/about-me"');
    });

    it("should not add target='_blank' to relative path links", () => {
      const input = "[Section](#section-one)";
      const output = markdownItInstance.render(input);
      expect(output).not.toContain('target="_blank"');
      expect(output).toContain('href="#section-one"');
    });

    it("should not add rel to internal links", () => {
      const input = "[Contact](/contact)";
      const output = markdownItInstance.render(input);
      expect(output).not.toContain('rel="noopener noreferrer"');
    });
  });

  describe("other schemes", () => {
    it("should not add target='_blank' to mailto: links", () => {
      const input = "[Email](mailto:hello@example.com)";
      const output = markdownItInstance.render(input);
      expect(output).not.toContain('target="_blank"');
      expect(output).not.toContain('rel="noopener noreferrer"');
      expect(output).toContain('href="mailto:hello@example.com"');
    });

    it("should not add target='_blank' to tel: links", () => {
      const input = "[Call](tel:+1234567890)";
      const output = markdownItInstance.render(input);
      expect(output).not.toContain('target="_blank"');
      expect(output).not.toContain('rel="noopener noreferrer"');
      expect(output).toContain('href="tel:+1234567890"');
    });

    it("should not add target='_blank' to protocol-relative URLs", () => {
      const input = "[Site](//example.com)";
      const output = markdownItInstance.render(input);
      expect(output).not.toContain('target="_blank"');
      expect(output).not.toContain('rel="noopener noreferrer"');
      expect(output).toContain('href="//example.com"');
    });
  });
});
