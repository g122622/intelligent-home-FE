const Layout = () => import("@/layout/index.vue");

const scene: RouteConfigsTable = {
  path: "/scene",
  redirect: "/scene/management",
  name: "Scene",
  component: Layout,
  meta: {
    title: "场景管理",
    icon: "ep:operation",
    rank: 11,
    showLink: true
  },
  children: [
    {
      path: "/scene/management",
      name: "ScenManagement",
      component: () => import("@/views/scene/index.vue"),
      meta: {
        title: "场景列表",
        showLink: true
      }
    },
    {
      path: "detail/:id",
      name: "SceneDetail",
      component: () => import("@/views/scene/detail.vue"),
      meta: {
        title: "场景详情",
        showLink: false
      }
    }
  ]
};

export default scene;
