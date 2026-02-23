import { createRouter, createWebHistory } from "vue-router";
import { ARTICLE_TYPES, ROUTES, DIRECTORY_MAPPING } from "@/constants";

const routes = [
  {
    path: ROUTES.HOME.path,
    name: ROUTES.HOME.name,
    component: () => import("../views/HomeView.vue"),
  },
  {
    path: ROUTES.BLOGS_HUB.path,
    name: ROUTES.BLOGS_HUB.name,
    component: () => import("@/views/BlogsHub.vue"),
  },
  {
    path: ROUTES.BLOG_PAGE.path,
    name: ROUTES.BLOG_PAGE.name,
    component: () => import("@/views/ArticlePage.vue"),
    props: (route) => ({
      slug: route.params.slug,
      folder: DIRECTORY_MAPPING[ARTICLE_TYPES.BLOG],
      articleType: ARTICLE_TYPES.BLOG,
    }),
  },
  {
    path: ROUTES.COURSES_HUB.path,
    name: ROUTES.COURSES_HUB.name,
    component: () => import("@/views/CoursesHub.vue"),
  },
  {
    path: ROUTES.COURSE_PAGE.path,
    name: ROUTES.COURSE_PAGE.name,
    component: () => import("@/views/ArticlePage.vue"),
    props: (route) => ({
      slug: route.params.slug,
      folder: DIRECTORY_MAPPING[ARTICLE_TYPES.COURSE],
      articleType: ARTICLE_TYPES.COURSE,
    }),
  },
  {
    path: ROUTES.ASTRONOMY_HUB.path,
    name: ROUTES.ASTRONOMY_HUB.name,
    component: () => import("@/views/AstronomyHub.vue"),
  },
  {
    path: ROUTES.ASTRONOMY_PAGE.path,
    name: ROUTES.ASTRONOMY_PAGE.name,
    component: () => import("@/views/ArticlePage.vue"),
    props: (route) => ({
      slug: route.params.slug,
      folder: DIRECTORY_MAPPING[ARTICLE_TYPES.ASTRONOMY],
      articleType: ARTICLE_TYPES.ASTRONOMY,
    }),
  },
  {
    path: ROUTES.ABOUT_ME.path,
    name: ROUTES.ABOUT_ME.name,
    component: () => import("@/views/AboutMeFullStory.vue"),
  },
  {
    path: ROUTES.HIRE_ME.path,
    name: ROUTES.HIRE_ME.name,
    component: () => import("@/views/HireMe.vue"),
  },
  {
    path: ROUTES.NOT_FOUND.path,
    name: ROUTES.NOT_FOUND.name,
    component: () => import("@/views/NotFoundPage.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }

    if (to.hash) {
      return {
        el: to.hash,
        behavior: "smooth",
      };
    }

    return { top: 0 };
  },
});

export default router;
