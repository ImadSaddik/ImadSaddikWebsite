export const ARTICLE_READ_THRESHOLD = 0.25;
export const MILLISECONDS_PER_MINUTE = 60000;

export const DEFAULT_ARTICLE_TITLE = "Imad Saddik - Articles";

export const ARTICLE_TYPES = {
  BLOG: "blog-post",
  COURSE: "course-post",
  ASTRONOMY: "astronomy-post",
};

export const DIRECTORY_MAPPING = {
  [ARTICLE_TYPES.BLOG]: "blogs",
  [ARTICLE_TYPES.COURSE]: "courses",
  [ARTICLE_TYPES.ASTRONOMY]: "astronomy",
};

export const HUB_MAPPING = {
  [ARTICLE_TYPES.BLOG]: { path: "/blogs", name: "blogs page" },
  [ARTICLE_TYPES.COURSE]: { path: "/courses", name: "courses page" },
  [ARTICLE_TYPES.ASTRONOMY]: { path: "/astronomy", name: "astronomy page" },
};
