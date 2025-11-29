import { describe, it, expect } from "vitest";
import { isValidSlug } from "@/router/index.js";

describe("isValidSlug", () => {
  const articles = {
    "/src/blogs/hello-world/index.vue": () => Promise.resolve(),
  };

  it("returns true when slug maps to registered component", () => {
    const result = isValidSlug(articles, "blogs", "hello-world");
    expect(result).toBe(true);
  });

  it("returns false when slug is missing", () => {
    const result = isValidSlug(articles, "blogs", "unknown");
    expect(result).toBe(false);
  });
});
