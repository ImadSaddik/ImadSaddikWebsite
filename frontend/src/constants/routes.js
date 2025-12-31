import { ARTICLE_TYPES } from "./content";

export const ROUTES = {
  HOME: { path: "/", name: "home" },
  BLOGS_HUB: { path: "/blogs", name: "blogs" },
  BLOG_PAGE: { path: "/blogs/:slug", name: ARTICLE_TYPES.BLOG },
  COURSES_HUB: { path: "/courses", name: "courses" },
  COURSE_PAGE: { path: "/courses/:slug", name: ARTICLE_TYPES.COURSE },
  ASTRONOMY_HUB: { path: "/astronomy", name: "astronomy" },
  ASTRONOMY_PAGE: { path: "/astronomy/:slug", name: ARTICLE_TYPES.ASTRONOMY },
  ABOUT_ME: { path: "/about-me", name: "about-me" },
  HIRE_ME: { path: "/hire-me", name: "hire-me" },
  NOT_FOUND: { path: "/:pathMatch(.*)*", name: "NotFound" },
};
