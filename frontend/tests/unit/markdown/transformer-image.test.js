import MarkdownIt from "markdown-it";
import { describe, it, expect, beforeEach } from "vitest";
import { getMarkdownTransformers } from "../../../vite/markdown/index.js";

describe("imageTransformer", () => {
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

  describe("image with caption", () => {
    it("should transform markdown images into ImageWithCaption component", () => {
      const input = '![alt text](./image.png "My Caption")';
      const output = markdownItInstance.render(input);
      expect(output).toContain(
        '<ImageWithCaption image-src="./image.png" image-alt="alt text" image-caption="My Caption" />'
      );
    });

    it("should set the correct image-src", () => {
      const input = '![photo](./photos/sunset.jpg "Sunset")';
      const output = markdownItInstance.render(input);
      expect(output).toContain('image-src="./photos/sunset.jpg"');
    });

    it("should set the correct image-alt", () => {
      const input = '![a beautiful landscape](./landscape.jpg "Landscape")';
      const output = markdownItInstance.render(input);
      expect(output).toContain('image-alt="a beautiful landscape"');
    });

    it("should set the correct image-caption", () => {
      const input = '![chart](./chart.png "Monthly revenue for Q4")';
      const output = markdownItInstance.render(input);
      expect(output).toContain('image-caption="Monthly revenue for Q4"');
    });

    it("should produce a self-closing tag", () => {
      const input = '![img](./img.png "Caption")';
      const output = markdownItInstance.render(input);
      expect(output).toContain("/>");
      expect(output).not.toContain("</ImageWithCaption>");
    });
  });

  describe("image without caption", () => {
    it("should produce an empty image-caption when no title is given", () => {
      const input = "![screenshot](./screenshot.png)";
      const output = markdownItInstance.render(input);
      expect(output).toContain('image-src="./screenshot.png"');
      expect(output).toContain('image-alt="screenshot"');
      expect(output).toContain('image-caption=""');
    });
  });

  describe("file formats", () => {
    it("should handle .svg files", () => {
      const input = '![diagram](./diagram.svg "Architecture")';
      const output = markdownItInstance.render(input);
      expect(output).toContain('image-src="./diagram.svg"');
    });

    it("should handle .jpg files", () => {
      const input = '![photo](./photo.jpg "A photo")';
      const output = markdownItInstance.render(input);
      expect(output).toContain('image-src="./photo.jpg"');
    });
  });

  describe("markdown in caption", () => {
    it("should render bold text in the caption as <strong>", () => {
      const input = '![chart](./chart.png "Revenue **grew** this quarter")';
      const output = markdownItInstance.render(input);
      expect(output).toContain("Revenue <strong>grew</strong> this quarter");
    });

    it("should render inline code in the caption as InlineCode", () => {
      const input = '![screenshot](./screenshot.png "Run `npm install` first")';
      const output = markdownItInstance.render(input);
      expect(output).toContain('<InlineCode text="npm install" />');
    });
  });

  describe("empty alt text", () => {
    it("should produce an empty image-alt attribute for images with no alt text", () => {
      const input = '![](./image.png "Caption")';
      const output = markdownItInstance.render(input);
      expect(output).toContain('image-alt=""');
      expect(output).toContain('image-caption="Caption"');
    });
  });

  describe("multiple images", () => {
    it("should render two images in the same document independently", () => {
      const input = '![first](./a.png "First")\n\n![second](./b.png "Second")';
      const output = markdownItInstance.render(input);
      expect(output).toContain('<ImageWithCaption image-src="./a.png" image-alt="first" image-caption="First" />');
      expect(output).toContain('<ImageWithCaption image-src="./b.png" image-alt="second" image-caption="Second" />');
    });
  });

  describe("image with no src", () => {
    it("should fall back to the default renderer when src is empty", () => {
      const input = "![alt]()";
      const output = markdownItInstance.render(input);
      expect(output).toContain("<img");
      expect(output).not.toContain("<ImageWithCaption");
    });
  });
});
