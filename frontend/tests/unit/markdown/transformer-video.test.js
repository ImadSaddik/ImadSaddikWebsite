import MarkdownIt from "markdown-it";
import { describe, it, expect, beforeEach } from "vitest";
import { getMarkdownTransformers } from "../../../vite/markdown/index.js";

describe("videoTransformer", () => {
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

  describe("video with caption", () => {
    it("should transform ::: video into VideoWithCaption component", () => {
      const input = '::: video ./test.mp4 "A cool video"\n:::';
      const output = markdownItInstance.render(input);
      expect(output).toContain('<VideoWithCaption video-src="./test.mp4" video-caption="A cool video">');
    });

    it("should set the correct video-src attribute", () => {
      const input = '::: video ./tutorial.webm "Tutorial"\n:::';
      const output = markdownItInstance.render(input);
      expect(output).toContain('video-src="./tutorial.webm"');
    });

    it("should set the correct video-caption attribute", () => {
      const input = '::: video ./demo.mp4 "How to get started"\n:::';
      const output = markdownItInstance.render(input);
      expect(output).toContain('video-caption="How to get started"');
    });

    it("should produce a closing VideoWithCaption tag", () => {
      const input = '::: video ./test.mp4 "Caption"\n:::';
      const output = markdownItInstance.render(input);
      expect(output).toContain("</VideoWithCaption>");
    });
  });

  describe("video without caption", () => {
    it("should produce an empty video-caption when no caption is given", () => {
      const input = "::: video ./test.mp4\n:::";
      const output = markdownItInstance.render(input);
      expect(output).toContain('video-src="./test.mp4"');
      expect(output).toContain('video-caption=""');
    });
  });

  describe("file formats", () => {
    it("should handle .webm files", () => {
      const input = '::: video ./clip.webm "A webm clip"\n:::';
      const output = markdownItInstance.render(input);
      expect(output).toContain('video-src="./clip.webm"');
    });

    it("should handle absolute paths", () => {
      const input = '::: video /assets/videos/intro.mp4 "Intro"\n:::';
      const output = markdownItInstance.render(input);
      expect(output).toContain('video-src="/assets/videos/intro.mp4"');
    });
  });

  describe("caption edge cases", () => {
    it("should preserve apostrophes in captions", () => {
      const input = `::: video ./test.mp4 "It's a demo"\n:::`;
      const output = markdownItInstance.render(input);
      expect(output).toContain(`video-caption="It's a demo"`);
    });

    it("should preserve ampersands in captions", () => {
      const input = '::: video ./test.mp4 "Foo & Bar"\n:::';
      const output = markdownItInstance.render(input);
      expect(output).toContain('video-caption="Foo & Bar"');
    });

    it("should preserve percent signs in captions", () => {
      const input = '::: video ./test.mp4 "100% awesome"\n:::';
      const output = markdownItInstance.render(input);
      expect(output).toContain('video-caption="100% awesome"');
    });
  });

  describe("no transformation", () => {
    it("should not transform when no src is provided", () => {
      const input = "::: video\n:::";
      const output = markdownItInstance.render(input);
      expect(output).not.toContain("<VideoWithCaption");
    });

    it("should not transform an unknown container type", () => {
      const input = '::: film ./clip.mp4 "A film"\n:::';
      const output = markdownItInstance.render(input);
      expect(output).not.toContain("<VideoWithCaption");
    });
  });
});
