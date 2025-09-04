const Layout = () => import("@/layout/index.vue");

export default {
  path: "/home",
  redirect: "/home/management",
  name: "HomeManagement",
  component: Layout,
  meta: {
    icon: "ep:home-filled",
    title: "家庭管理",
    rank: 5,
    showLink: true
  },
  children: [
    {
      path: "/home/management",
      name: "HomeManagement",
      component: () => import("@/views/home/index.vue"),
      meta: {
        title: "家庭管理",
        showLink: true
      }
    },
    {
      path: "/home/detail/:id",
      name: "HomeDetail",
      component: () => import("@/views/home/HomeDetail.vue"),
      meta: {
        title: "家庭详情",
        showLink: false
      }
    },
    {
      path: "/home/create",
      name: "HomeCreate",
      component: () => import("@/views/home/HomeCreate.vue"),
      meta: {
        title: "创建家庭",
        showLink: false
      }
    },
    {
      path: "/home/edit/:id",
      name: "HomeEdit",
      component: () => import("@/views/home/HomeEdit.vue"),
      meta: {
        title: "编辑家庭",
        showLink: false
      }
    }
  ]
} satisfies RouteConfigsTable;
