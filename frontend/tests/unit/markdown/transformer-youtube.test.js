import MarkdownIt from "markdown-it";
import { describe, it, expect, beforeEach } from "vitest";
import { getMarkdownTransformers } from "../../../vite/markdown/index.js";

describe("youtubeTransformer", () => {
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

  describe("basic embed", () => {
    it("should transform ::: youtube into a YouTubePlayer opening tag", () => {
      const input = "::: youtube https://www.youtube.com/embed/123\n:::";
      const output = markdownItInstance.render(input);
      expect(output).toContain('<YouTubePlayer video-url="https://www.youtube.com/embed/123">');
    });

    it("should produce a closing YouTubePlayer tag", () => {
      const input = "::: youtube https://www.youtube.com/embed/123\n:::";
      const output = markdownItInstance.render(input);
      expect(output).toContain("</YouTubePlayer>");
    });

    it("should set the correct video-url attribute", () => {
      const input = "::: youtube https://www.youtube.com/embed/dQw4w9WgXcQ\n:::";
      const output = markdownItInstance.render(input);
      expect(output).toContain('video-url="https://www.youtube.com/embed/dQw4w9WgXcQ"');
    });
  });

  describe("markdown link syntax", () => {
    it("should extract the URL from markdown link syntax", () => {
      const input = "::: youtube [Link](https://www.youtube.com/embed/123)\n:::";
      const output = markdownItInstance.render(input);
      expect(output).toContain('video-url="https://www.youtube.com/embed/123"');
    });

    it("should ignore the link text and only use the URL", () => {
      const input = "::: youtube [Watch this video](https://www.youtube.com/embed/abc)\n:::";
      const output = markdownItInstance.render(input);
      expect(output).toContain('video-url="https://www.youtube.com/embed/abc"');
      expect(output).not.toContain("Watch this video");
    });
  });

  describe("no transformation", () => {
    it("should not transform an unknown container type", () => {
      const input = "::: vimeo https://vimeo.com/123\n:::";
      const output = markdownItInstance.render(input);
      expect(output).not.toContain("<YouTubePlayer");
    });

    it("should not transform when no space or URL follows youtube", () => {
      const input = "::: youtube\n:::";
      const output = markdownItInstance.render(input);
      expect(output).not.toContain("<YouTubePlayer");
    });

    it("should not transform when only whitespace follows youtube", () => {
      const input = "::: youtube \n:::";
      const output = markdownItInstance.render(input);
      // params.trim() removes the trailing space, leaving just "youtube" which fails the regex
      expect(output).not.toContain("<YouTubePlayer");
    });
  });
});
