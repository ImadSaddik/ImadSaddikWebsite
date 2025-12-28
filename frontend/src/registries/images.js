// These use eager: true to get the file paths immediately.
export const blogCoverImages = import.meta.glob("@/blogs/*/coverImage.svg", { eager: true, import: "default" });
export const courseCoverImages = import.meta.glob("@/courses/*/coverImage.svg", { eager: true, import: "default" });
export const astronomyCoverImages = import.meta.glob("@/astronomy/*/coverImage.svg", {
  eager: true,
  import: "default",
});
export const moonPhaseImages = import.meta.glob("@/assets/moon_phases/*.svg", { eager: true, import: "default" });
