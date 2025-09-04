const Layout = () => import("@/layout/index.vue");

export default {
  path: "/device",
  redirect: "/device/management",
  name: "DeviceControl",
  component: Layout,
  meta: {
    icon: "ep:operation",
    title: "设备控制",
    rank: 10,
    showLink: true
  },
  children: [
    {
      path: "/device/management",
      name: "DeviceManagement",
      component: () => import("@/views/device/index.vue"),
      meta: {
        title: "设备管理",
        showLink: true
      }
    },
    {
      path: "/device/detail/:id",
      name: "DeviceDetail",
      component: () => import("@/views/device/DeviceDetail.vue"),
      meta: {
        title: "设备详情",
        showLink: false
      }
    }
  ]
} satisfies RouteConfigsTable;
