// These use dynamic imports (glob) so they are lazy-loaded chunks.
export const blogArticles = import.meta.glob("@/blogs/*/index.vue");
export const courseArticles = import.meta.glob("@/courses/*/index.vue");
export const astronomyArticles = import.meta.glob("@/astronomy/*/index.vue");
