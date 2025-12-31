import { createRouter, createWebHistory } from "vue-router";
import { ARTICLE_TYPES } from "@/constants";

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("../views/HomeView.vue"),
  },
  {
    path: "/blogs",
    name: "blogs",
    component: () => import("@/views/BlogsHub.vue"),
  },
  {
    path: "/blogs/:slug",
    name: ARTICLE_TYPES.BLOG,
    component: () => import("@/views/BlogPage.vue"),
    props: true,
  },
  {
    path: "/courses",
    name: "courses",
    component: () => import("@/views/CoursesHub.vue"),
  },
  {
    path: "/courses/:slug",
    name: ARTICLE_TYPES.COURSE,
    component: () => import("@/views/CoursePage.vue"),
    props: true,
  },
  {
    path: "/astronomy",
    name: "astronomy",
    component: () => import("@/views/AstronomyHub.vue"),
  },
  {
    path: "/astronomy/:slug",
    name: ARTICLE_TYPES.ASTRONOMY,
    component: () => import("@/views/AstronomyPage.vue"),
    props: true,
  },
  {
    path: "/about-me",
    name: "about-me",
    component: () => import("@/views/AboutMeFullStory.vue"),
  },
  {
    path: "/hire-me",
    name: "hire-me",
    component: () => import("@/views/HireMe.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
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
