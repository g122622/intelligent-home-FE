const Layout = () => import("@/layout/index.vue");

export default {
  path: "/security",
  name: "Security",
  component: Layout,
  redirect: "/securityPanel",
  meta: {
    icon: "ep/warn-triangle-filled",
    title: "安防监控",
    rank: 0
  },
  children: [
    {
      path: "/securityPanel",
      name: "SecurityPanel",
      component: () => import("@/views/security/index.vue"),
      meta: {
        title: "安防监控"
      }
    }
  ]
} satisfies RouteConfigsTable;
