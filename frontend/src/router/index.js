import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import BlogPage from "@/views/BlogPage.vue";
import BlogsHub from "@/views/BlogsHub.vue";
import CoursesHub from "@/views/CoursesHub.vue";
import AstronomyHub from "@/views/AstronomyHub.vue";
import AboutMeFullStory from "@/views/AboutMeFullStory.vue";
import HireMe from "@/views/HireMe.vue";
import CoursePage from "@/views/CoursePage.vue";
import AstronomyPage from "@/views/AstronomyPage.vue";
import NotFoundPage from "@/views/NotFoundPage.vue";
import { blogArticles, courseArticles, astronomyArticles } from "@/articles.js";

const isValidSlug = (articles, type, slug) => {
  const path = `/src/${type}/${slug}/index.vue`;
  return path in articles;
};

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/blogs",
    name: "blogs",
    component: BlogsHub,
  },
  {
    path: "/blogs/:slug",
    name: "blog-post",
    component: BlogPage,
    props: true,
    beforeEnter(to) {
      const slug = to.params.slug;
      if (!isValidSlug(blogArticles, "blogs", slug)) {
        console.error(`Invalid blog slug: ${slug}`);
        return { name: "blogs" };
      }
      return true;
    },
  },
  {
    path: "/courses",
    name: "courses",
    component: CoursesHub,
  },
  {
    path: "/courses/:slug",
    name: "course-post",
    component: CoursePage,
    props: true,
    beforeEnter(to) {
      const slug = to.params.slug;
      if (!isValidSlug(courseArticles, "courses", slug)) {
        console.error(`Invalid course slug: ${slug}`);
        return { name: "courses" };
      }
      return true;
    },
  },
  {
    path: "/astronomy",
    name: "astronomy",
    component: AstronomyHub,
  },
  {
    path: "/astronomy/:slug",
    name: "astronomy-post",
    component: AstronomyPage,
    props: true,
    beforeEnter(to) {
      const slug = to.params.slug;
      if (!isValidSlug(astronomyArticles, "astronomy", slug)) {
        console.error(`Invalid astronomy slug: ${slug}`);
        return { name: "astronomy" };
      }
      return true;
    },
  },
  {
    path: "/about-me",
    name: "about-me",
    component: AboutMeFullStory,
  },
  {
    path: "/hire-me",
    name: "hire-me",
    component: HireMe,
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFoundPage,
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
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ el: to.hash, behavior: "smooth" });
        }, 300);
      });
    }
    return { top: 0 };
  },
});

export default router;
