import { describe, it, expect, vi } from "vitest";
import {
  getHighlighter,
  highlightCode,
  DEFAULT_THEME_NAME,
  removeInlineBackgroundTransformer,
} from "@/services/shiki.js";
import { createHighlighterCore } from "shiki/core";

vi.mock("shiki/core", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    createHighlighterCore: vi.fn(actual.createHighlighterCore),
  };
});

describe("shiki service", () => {
  it("exports DEFAULT_THEME_NAME as github-dark-default", () => {
    expect(DEFAULT_THEME_NAME).toBe("github-dark-default");
  });

  describe("getHighlighter", () => {
    it("returns a singleton highlighter instance across concurrent calls", async () => {
      const [instance1, instance2, instance3] = await Promise.all([
        getHighlighter(),
        getHighlighter(),
        getHighlighter(),
      ]);

      expect(instance1).toBeDefined();
      expect(instance1).toBe(instance2);
      expect(instance2).toBe(instance3);
    });

    it("resets highlighterPromise and propagates the error when initialization fails", async () => {
      vi.resetModules();
      vi.mocked(createHighlighterCore).mockRejectedValueOnce(new Error("Initialization error"));
      const { getHighlighter: getFreshHighlighter } = await import("@/services/shiki.js");

      await expect(getFreshHighlighter()).rejects.toThrow("Initialization error");
    });
  });

  describe("highlightCode", () => {
    it("renders code with syntax highlighting using the default theme", async () => {
      const code = "const message = 'hello';";
      const html = await highlightCode(code, "javascript");

      expect(html).toContain('<pre class="shiki github-dark-default"');
      expect(html).toContain('class="line"');
      expect(html).toContain("const");
      expect(html).toContain("message");
      expect(html).toContain("'hello'");
      expect(html).toContain("</pre>");
    });

    it("removes inline background-color from the pre element", async () => {
      const code = "x = 42";
      const html = await highlightCode(code, "python");

      expect(html).not.toMatch(/background-color:/);
      expect(html).toContain('style="color:#e6edf3"');
    });

    it("removes the style attribute completely if no other styles remain", async () => {
      const code = "echo test";
      const html = await highlightCode(code, "bash");

      expect(html).not.toContain('style=""');
    });

    it("processes notation highlights to apply the highlighted class", async () => {
      const code = "const a = 1;\nconst b = 2; // [!code highlight]\nconst c = 3;";
      const html = await highlightCode(code, "javascript");

      expect(html).toContain('class="line highlighted"');
      expect(html).not.toContain("[!code highlight]");
    });

    it("throws an error when an unsupported or unbundled language is specified", async () => {
      await expect(highlightCode("some code", "unsupported-lang")).rejects.toThrow();
    });
  });

  describe("removeInlineBackgroundTransformer", () => {
    it("does nothing when node has no style property", () => {
      const node = { properties: {} };
      removeInlineBackgroundTransformer.pre(node);
      expect(node.properties.style).toBeUndefined();
    });

    it("removes inline background-color while preserving other styles", () => {
      const node = {
        properties: { style: "background-color: #0d1117; color: #e6edf3;" },
      };
      removeInlineBackgroundTransformer.pre(node);
      expect(node.properties.style).toBe("color: #e6edf3;");
    });

    it("deletes the style property completely if no other styles remain", () => {
      const node = { properties: { style: "background-color: #0d1117;" } };
      removeInlineBackgroundTransformer.pre(node);
      expect(node.properties.style).toBeUndefined();
    });
  });
});
