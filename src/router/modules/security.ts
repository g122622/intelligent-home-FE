import type { RouteRecordRaw } from "vue-router";

const securityRoutes: RouteRecordRaw[] = [
  {
    path: "/security",
    name: "Security",
    component: () => import("@/views/security/index.vue"),
    meta: {
      title: "安防监控",
      icon: "ep:lock",
      requiresAuth: true,
      keepAlive: true
    }
  }
];

export default securityRoutes;