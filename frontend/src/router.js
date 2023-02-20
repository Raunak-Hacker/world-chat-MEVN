import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/:id",
      component: () => import("./pages/ChatUI.vue"),
      props: true,
    },
    {
      name: "about",
      path: "/about",
      component: () => import("./pages/AboutUs.vue"),
    },
    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: () => import("./pages/NotFound.vue"),
    },
  ],
});

export default router;
