const Layout = () => import("@/layout/index.vue");

export default {
  path: "/sensor",
  redirect: "/sensor/overview",
  name: "SensorControl",
  component: Layout,
  meta: {
    icon: "ep:monitor",
    title: "传感器监控",
    rank: 11,
    showLink: true
  },
  children: [
    {
      path: "/sensor/overview",
      name: "SensorOverview",
      component: () => import("@/views/sensor/index.vue"),
      meta: {
        title: "传感器概览",
        showLink: true
      }
    },
    {
      path: "/sensor/detail/:id",
      name: "SensorDetail",
      component: () => import("@/views/sensor/SensorDetail.vue"),
      meta: {
        title: "传感器详情",
        showLink: false
      }
    },
    {
      path: "/sensor/realtime/:id",
      name: "SensorRealtime",
      component: () => import("@/views/sensor/SensorRealtime.vue"),
      meta: {
        title: "实时监控",
        showLink: false
      }
    },
    {
      path: "/sensor/history/:id",
      name: "SensorHistory",
      component: () => import("@/views/sensor/SensorHistory.vue"),
      meta: {
        title: "历史数据",
        showLink: false
      }
    }
  ]
} satisfies RouteConfigsTable;
