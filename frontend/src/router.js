import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      redirect: "/europe",
    },
    {
      path: "/:id",
      component: () => import("./pages/ChatUI.vue"),
      props: true,
    },
    {
      name: "about",
      path: "/about",
      component: () => import("./pages/AboutMe.vue"),
    },
    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: () => import("./pages/NotFound.vue"),
    },
  ],
});

export default router;
