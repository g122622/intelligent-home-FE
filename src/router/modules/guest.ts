const Layout = () => import("@/layout/index.vue");

export default {
  path: "/guest",
  name: "GuestManagementIndex",
  component: Layout,
  redirect: "/guest/management",
  meta: {
    icon: "ep:user",
    title: "访客管理",
    rank: 6,
    showLink: true
  },
  children: [
    {
      path: "/guest/management",
      name: "GuestManagement",
      component: () => import("@/views/guest/index.vue"),
      meta: {
        title: "访客管理",
        showLink: true
      }
    },
    {
      path: "/guest/permission-info",
      name: "GuestPermissionInfo",
      component: () => import("@/views/guest/components/PermissionInfo.vue"),
      meta: {
        title: "权限说明",
        showLink: true
      }
    },
    {
      path: "/guest/join-requests",
      name: "GuestJoinRequests",
      component: () => import("@/views/guest/components/JoinRequests.vue"),
      meta: {
        title: "加入请求",
        showLink: true
      }
    },
    {
      path: "/guest/accessible-devices",
      name: "GuestAccessibleDevices",
      component: () => import("@/views/guest/components/AccessibleDevices.vue"),
      meta: {
        title: "可访问设备",
        showLink: true
      }
    }
  ]
} satisfies RouteConfigsTable;
