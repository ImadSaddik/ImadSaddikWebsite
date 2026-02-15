import { ARTICLE_TYPES, DIRECTORY_MAPPING } from "@/constants";

// These use dynamic imports (glob) so they are lazy-loaded chunks.
export const ARTICLE_MARKDOWN_REGISTRY = {
  [DIRECTORY_MAPPING[ARTICLE_TYPES.BLOG]]: {
    renderable: import.meta.glob("@/blogs/**/content.md"),
    source: import.meta.glob("@/blogs/**/content.md", { query: "?raw", import: "default" }),
  },
  [DIRECTORY_MAPPING[ARTICLE_TYPES.COURSE]]: {
    renderable: import.meta.glob("@/courses/**/content.md"),
    source: import.meta.glob("@/courses/**/content.md", { query: "?raw", import: "default" }),
  },
  [DIRECTORY_MAPPING[ARTICLE_TYPES.ASTRONOMY]]: {
    renderable: import.meta.glob("@/astronomy/**/content.md"),
    source: import.meta.glob("@/astronomy/**/content.md", { query: "?raw", import: "default" }),
  },
};
