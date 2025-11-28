// Pre-register all article components for lazy loading (loaded only when needed)
export const blogArticles = import.meta.glob("@/blogs/*/index.vue");
export const courseArticles = import.meta.glob("@/courses/*/index.vue");
export const astronomyArticles = import.meta.glob("@/astronomy/*/index.vue");

// Pre-load all cover images (SVG paths), using eager: true so they are loaded right away
export const blogCoverImages = import.meta.glob("@/blogs/*/coverImage.svg", { eager: true, import: "default" });
export const courseCoverImages = import.meta.glob("@/courses/*/coverImage.svg", { eager: true, import: "default" });
export const astronomyCoverImages = import.meta.glob("@/astronomy/*/coverImage.svg", {
  eager: true,
  import: "default",
});
