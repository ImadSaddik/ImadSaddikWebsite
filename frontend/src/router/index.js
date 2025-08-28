import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import BlogPage from "@/views/BlogPage.vue";
import BlogsHub from "@/views/BlogsHub.vue";
import CoursesHub from "@/views/CoursesHub.vue";
import AstronomyHub from "@/views/AstronomyHub.vue";

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
    async beforeEnter(to) {
      try {
        const slug = to.params.slug;
        await import(`@/blogs/${slug}`);
        return true;
      } catch (error) {
        // Redirect to the blogs endpoint if the slug is invalid
        return { name: "blogs" };
      }
    },
  },
  {
    path: "/courses",
    name: "courses",
    component: CoursesHub,
  },
  {
    path: "/astronomy",
    name: "astronomy",
    component: AstronomyHub,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
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
