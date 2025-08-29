const Layout = () => import("@/layout/index.vue");

export default {
  path: "/permission",
  name: "Permission",
  component: Layout,
  redirect: "/permission/guest",
  meta: {
    icon: "ep/lock",
    title: "权限管理",
    rank: 10,
    roles: ["admin", "homeowner"] // 只有房主可以访问
  },
  children: [
    {
      path: "/permission/guest",
      name: "GuestPermission",
      component: () => import("@/views/permission/guest.vue"),
      meta: {
        title: "访客权限管理",
        roles: ["admin", "homeowner"] // 只有房主可以访问
      }
    },
    {
      path: "/permission/demo",
      name: "PermissionDemo",
      component: () => import("@/views/permission/demo.vue"),
      meta: {
        title: "权限演示",
        roles: ["admin", "homeowner", "member", "guest"] // 所有角色都可以访问
      }
    },
    {
      path: "/permission/test",
      name: "PermissionTest",
      component: () => import("@/views/permission/test.vue"),
      meta: {
        title: "权限测试",
        roles: ["admin", "homeowner", "member", "guest"] // 所有角色都可以访问
      }
    },
    {
      path: "/permission/debug",
      name: "PermissionDebug",
      component: () => import("@/views/permission/debug.vue"),
      meta: {
        title: "权限调试",
        roles: ["admin", "homeowner", "member", "guest"] // 所有角色都可以访问
      }
    }
  ]
} satisfies RouteConfigsTable;
