import { ARTICLE_TYPES, DIRECTORY_MAPPING } from "@/constants";

// These use eager: true to get the file paths immediately.
const blogCoverImages = import.meta.glob("@/blogs/*/coverImage.svg", { eager: true, import: "default" });
const courseCoverImages = import.meta.glob("@/courses/*/coverImage.svg", { eager: true, import: "default" });
const astronomyCoverImages = import.meta.glob("@/astronomy/*/coverImage.svg", {
  eager: true,
  import: "default",
});

export const ARTICLE_COVER_IMAGE_REGISTRY = {
  [DIRECTORY_MAPPING[ARTICLE_TYPES.BLOG]]: blogCoverImages,
  [DIRECTORY_MAPPING[ARTICLE_TYPES.COURSE]]: courseCoverImages,
  [DIRECTORY_MAPPING[ARTICLE_TYPES.ASTRONOMY]]: astronomyCoverImages,
};

export const moonPhaseImages = import.meta.glob("@/assets/moon_phases/*.svg", { eager: true, import: "default" });
