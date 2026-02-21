import MarkdownIt from "markdown-it";
import { describe, it, expect, beforeEach } from "vitest";
import { getMarkdownTransformers } from "../../../vite/markdown/index.js";

describe("headerTransformer", () => {
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

  describe("h2 headers", () => {
    it("should transform h2 with custom ID and class", () => {
      const input = "## Course overview";
      const output = markdownItInstance.render(input);
      expect(output).toContain('<h2 id="course-overview" class="article-body-header" data-table-of-contents="">');
      expect(output).toContain('<a class="clickable-header-link" href="#course-overview">Course overview</a>');
      expect(output).toContain("</h2>");
    });

    it("should handle h2 with inline code", () => {
      const input = "## How to use `pnpm`";
      const output = markdownItInstance.render(input);
      expect(output).toContain('<h2 id="how-to-use-pnpm" class="article-body-header"');
      expect(output).toContain('href="#how-to-use-pnpm"');
    });

    it("should handle h2 with special characters", () => {
      const input = "## Getting Started: A Guide!";
      const output = markdownItInstance.render(input);
      expect(output).toContain('id="getting-started-a-guide"');
      expect(output).toContain('class="article-body-header"');
    });
  });

  describe("h3 headers", () => {
    it("should transform h3 with custom ID and class", () => {
      const input = "### Installation steps";
      const output = markdownItInstance.render(input);
      expect(output).toContain('<h3 id="installation-steps" class="article-body-subheader" data-table-of-contents="">');
      expect(output).toContain('<a class="clickable-header-link" href="#installation-steps">Installation steps</a>');
      expect(output).toContain("</h3>");
    });

    it("should handle h3 with inline code", () => {
      const input = "### Using `npm install`";
      const output = markdownItInstance.render(input);
      expect(output).toContain('<h3 id="using-npm-install" class="article-body-subheader"');
      expect(output).toContain('href="#using-npm-install"');
    });

    it("should handle h3 with special characters", () => {
      const input = "### Getting Started: A Guide!";
      const output = markdownItInstance.render(input);
      expect(output).toContain('id="getting-started-a-guide"');
      expect(output).toContain('class="article-body-subheader"');
    });
  });

  describe("h4 headers", () => {
    it("should transform h4 with custom ID and class", () => {
      const input = "#### Quick tips";
      const output = markdownItInstance.render(input);
      expect(output).toContain('<h4 id="quick-tips" class="article-body-sub-subheader" data-table-of-contents="">');
      expect(output).toContain('<a class="clickable-header-link" href="#quick-tips">Quick tips</a>');
      expect(output).toContain("</h4>");
    });

    it("should handle h4 with inline code", () => {
      const input = "#### The `useState` hook";
      const output = markdownItInstance.render(input);
      expect(output).toContain('<h4 id="the-usestate-hook" class="article-body-sub-subheader"');
      expect(output).toContain('href="#the-usestate-hook"');
    });

    it("should handle h4 with numbers", () => {
      const input = "#### Step 1: Setup";
      const output = markdownItInstance.render(input);
      expect(output).toContain('id="step-1-setup"');
      expect(output).toContain('class="article-body-sub-subheader"');
    });
  });

  describe("duplicate headers", () => {
    it("should handle duplicate h2 headers with slugifier suffix", () => {
      const input = "## Overview\n## Overview";
      const output = markdownItInstance.render(input);
      expect(output).toContain('id="overview"');
      expect(output).toContain('id="overview-1"');
    });

    it("should handle duplicate h3 headers with slugifier suffix", () => {
      const input = "### Setup\n### Setup\n### Setup";
      const output = markdownItInstance.render(input);
      expect(output).toContain('id="setup"');
      expect(output).toContain('id="setup-1"');
      expect(output).toContain('id="setup-2"');
    });

    it("should handle duplicate h4 headers with slugifier suffix", () => {
      const input = "#### Example\n#### Example";
      const output = markdownItInstance.render(input);
      expect(output).toContain('id="example"');
      expect(output).toContain('id="example-1"');
    });
  });

  describe("unsupported header levels", () => {
    it("should not transform h1 headers", () => {
      const input = "# Main Title";
      const output = markdownItInstance.render(input);
      expect(output).not.toContain('class="article-body-header"');
      expect(output).not.toContain("clickable-header-link");
      expect(output).toContain("<h1>Main Title</h1>");
    });

    it("should not transform h5 headers", () => {
      const input = "##### Small heading";
      const output = markdownItInstance.render(input);
      expect(output).not.toContain('class="article-body');
      expect(output).not.toContain("clickable-header-link");
      expect(output).toContain("<h5>Small heading</h5>");
    });

    it("should not transform h6 headers", () => {
      const input = "###### Tiny heading";
      const output = markdownItInstance.render(input);
      expect(output).not.toContain('class="article-body');
      expect(output).not.toContain("clickable-header-link");
      expect(output).toContain("<h6>Tiny heading</h6>");
    });
  });

  describe("mixed header levels", () => {
    it("should handle multiple header levels in one document", () => {
      const input = "## Main Section\n### Subsection\n#### Detail";
      const output = markdownItInstance.render(input);
      expect(output).toContain('id="main-section"');
      expect(output).toContain('class="article-body-header"');
      expect(output).toContain('id="subsection"');
      expect(output).toContain('class="article-body-subheader"');
      expect(output).toContain('id="detail"');
      expect(output).toContain('class="article-body-sub-subheader"');
    });
  });
});
