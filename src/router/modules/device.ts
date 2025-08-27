const Layout = () => import("@/layout/index.vue");

export default {
  path: "/device",
  name: "DeviceControl",
  component: Layout,
  redirect: "/device/control",
  meta: {
    icon: "ep-monitor",
    title: "设备控制",
    rank: 10,
    showLink: true,
    roles: ["admin", "homeowner"]
  },
  children: [
    {
      path: "/device/control",
      name: "DeviceControlPanel",
      component: () => import("@/views/device/control/index.vue"),
      meta: {
        title: "设备控制面板",
        showLink: true
      }
    },
    {
      path: "/device/groups",
      name: "DeviceGroups",
      component: () => import("@/views/device/groups/index.vue"),
      meta: {
        title: "设备分组管理",
        showLink: true
      }
    },
    {
      path: "/device/scenes",
      name: "DeviceScenes",
      component: () => import("@/views/device/scenes/index.vue"),
      meta: {
        title: "场景模式管理",
        showLink: true
      }
    }
  ]
} satisfies RouteConfigsTable;
