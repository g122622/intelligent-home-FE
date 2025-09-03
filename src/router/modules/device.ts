const Layout = () => import("@/layout/index.vue");

export default {
  path: "/device",
  name: "DeviceControl",
  component: Layout,
  redirect: "/device/management",
  meta: {
    icon: "ep:operation",
    title: "设备管理",
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
      path: "/device/control",
      name: "DeviceControlPanel",
      component: () => import("@/views/device-old-abandoned/control/index.vue"),
      meta: {
        title: "设备控制面板",
        showLink: true
      }
    },
    {
      path: "/device/groups",
      name: "DeviceGroups",
      component: () => import("@/views/device-old-abandoned/groups/index.vue"),
      meta: {
        title: "设备分组管理",
        showLink: true
      }
    },
    {
      path: "/device/scenes",
      name: "DeviceScenes",
      component: () => import("@/views/device-old-abandoned/scenes/index.vue"),
      meta: {
        title: "场景模式管理",
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
