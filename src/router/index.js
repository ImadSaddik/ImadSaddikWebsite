import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import BlogPage from "@/views/BlogPage.vue";
import BlogsHub from "@/views/BlogsHub.vue";

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
        await import(`@/blogs/${to.params.slug}.vue`);
        return true;
      } catch (error) {
        // Redirect to the blogs endpoint if the slug is invalid
        return { name: "blogs" };
      }
    },
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
