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

  describe("image with alt text and caption", () => {
    it("should transform ::: image into ImageWithCaption component", () => {
      const input = '::: image ./image.png "alt text"\nMy Caption\n:::';
      const output = markdownItInstance.render(input);
      expect(output).toContain('<ImageWithCaption image-src="./image.png" image-alt="alt text">');
    });

    it("should set the correct image-src attribute", () => {
      const input = '::: image ./photos/sunset.jpg "A sunset"\nSunset over the hills.\n:::';
      const output = markdownItInstance.render(input);
      expect(output).toContain('image-src="./photos/sunset.jpg"');
    });

    it("should set the correct image-alt attribute", () => {
      const input = '::: image ./landscape.jpg "A beautiful landscape"\nCaption.\n:::';
      const output = markdownItInstance.render(input);
      expect(output).toContain('image-alt="A beautiful landscape"');
    });

    it("should produce a closing ImageWithCaption tag", () => {
      const input = '::: image ./img.png "An image"\nCaption text.\n:::';
      const output = markdownItInstance.render(input);
      expect(output).toContain("</ImageWithCaption>");
    });

    it("should render the caption text as slot content", () => {
      const input = '::: image ./chart.png "Monthly revenue"\nMonthly revenue for Q4.\n:::';
      const output = markdownItInstance.render(input);
      expect(output).toContain("Monthly revenue for Q4.");
    });

    it("should produce an empty image-alt when no alt text is given", () => {
      const input = "::: image ./screenshot.png\nCaption here.\n:::";
      const output = markdownItInstance.render(input);
      expect(output).toContain('image-src="./screenshot.png"');
      expect(output).toContain('image-alt=""');
    });

    it("should render the component with no slot content when the container body is empty", () => {
      const input = '::: image ./diagram.png "Diagram"\n:::';
      const output = markdownItInstance.render(input);
      expect(output).toContain('<ImageWithCaption image-src="./diagram.png" image-alt="Diagram">');
      expect(output).toContain("</ImageWithCaption>");
    });
  });

  describe("file formats", () => {
    it("should handle .svg files", () => {
      const input = '::: image ./diagram.svg "Architecture diagram"\nCaption.\n:::';
      const output = markdownItInstance.render(input);
      expect(output).toContain('image-src="./diagram.svg"');
    });

    it("should handle .jpg files", () => {
      const input = '::: image ./photo.jpg "A photo"\nCaption.\n:::';
      const output = markdownItInstance.render(input);
      expect(output).toContain('image-src="./photo.jpg"');
    });

    it("should handle .jpeg files", () => {
      const input = '::: image ./photo.jpeg "A photo"\nCaption.\n:::';
      const output = markdownItInstance.render(input);
      expect(output).toContain('image-src="./photo.jpeg"');
    });

    it("should handle .png files", () => {
      const input = '::: image ./screenshot.png "A screenshot"\nCaption.\n:::';
      const output = markdownItInstance.render(input);
      expect(output).toContain('image-src="./screenshot.png"');
    });
  });

  describe("markdown in caption slot", () => {
    it("should render bold text in the caption as <strong>", () => {
      const input = '::: image ./chart.png "Chart"\nRevenue **grew** this quarter.\n:::';
      const output = markdownItInstance.render(input);
      expect(output).toContain("<strong>grew</strong>");
    });

    it("should render inline code in the caption as InlineCode", () => {
      const input = '::: image ./screenshot.png "Screenshot"\nRun `npm install` first.\n:::';
      const output = markdownItInstance.render(input);
      expect(output).toContain('<InlineCode text="npm install" />');
    });

    it("should render links in the caption as <a> tags", () => {
      const input = '::: image ./photo.jpg "Photo"\nCheck out [this link](https://example.com).\n:::';
      const output = markdownItInstance.render(input);
      expect(output).toContain('<a href="https://example.com" target="_blank" rel="noopener noreferrer">this link</a>');
    });

    it("should render superscripts", () => {
      const input = '::: image ./formula.png "Formula"\nE = mc^2^.\n:::';
      const output = markdownItInstance.render(input);
      expect(output).toContain('E = mc<SuperscriptText text="2" />.');
    });

    it("should render inline icons", () => {
      const input =
        '::: image ./icon.png "Icon"\nLook for the star icon ::icon{/src/assets/icons/star.svg}:: in the guide.\n:::';
      const output = markdownItInstance.render(input);
      expect(output).toContain('<InlineIcon icon="/src/assets/icons/star.svg" />');
    });

    it("should render font awesome icons", () => {
      const input =
        '::: image ./icon.png "Icon"\nTo indicate a warning, use the ::fa{exclamation-triangle}:: icon.\n:::';
      const output = markdownItInstance.render(input);
      expect(output).toContain('<i class="exclamation-triangle"></i>');
    });
  });

  describe("alt text edge cases", () => {
    it("should preserve apostrophes in alt text", () => {
      const input = `::: image ./test.png "It's a diagram"\nCaption.\n:::`;
      const output = markdownItInstance.render(input);
      expect(output).toContain(`image-alt="It's a diagram"`);
    });

    it("should escape ampersands in alt text", () => {
      const input = '::: image ./test.png "Foo & Bar"\nCaption.\n:::';
      const output = markdownItInstance.render(input);
      expect(output).toContain('image-alt="Foo &amp; Bar"');
    });

    it("should escape angle brackets in alt text", () => {
      const input = '::: image ./test.png "Foo < Bar >"\nCaption.\n:::';
      const output = markdownItInstance.render(input);
      expect(output).toContain('image-alt="Foo &lt; Bar &gt;"');
    });

    it("should escape double quotes in alt text", () => {
      const input = '::: image ./test.png "Foo "Bar""\nCaption.\n:::';
      const output = markdownItInstance.render(input);
      expect(output).toContain('image-alt="Foo &quot;Bar&quot;"');
    });
  });

  describe("multiple images", () => {
    it("should render two images in the same document independently", () => {
      const input =
        '::: image ./a.png "First image"\nFirst caption.\n:::\n\n::: image ./b.png "Second image"\nSecond caption.\n:::';
      const output = markdownItInstance.render(input);
      expect(output).toContain('<ImageWithCaption image-src="./a.png" image-alt="First image">');
      expect(output).toContain('<ImageWithCaption image-src="./b.png" image-alt="Second image">');
    });
  });

  describe("no transformation", () => {
    it("should not transform when no src is provided", () => {
      const input = "::: image\n:::";
      const output = markdownItInstance.render(input);
      expect(output).not.toContain("<ImageWithCaption");
    });

    it("should not transform an unknown container type", () => {
      const input = '::: img ./photo.png "A photo"\nCaption.\n:::';
      const output = markdownItInstance.render(input);
      expect(output).not.toContain("<ImageWithCaption");
    });
  });
});
