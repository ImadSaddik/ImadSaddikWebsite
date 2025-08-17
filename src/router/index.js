import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import PreFilteringWithKnnSearch from "@/blogs/PreFilteringWithKnnSearch.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/blogs",
    name: "blogs",
    component: PreFilteringWithKnnSearch,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
