# 权限控制系统使用说明

## 概述

本系统实现了基于角色的权限控制，支持三种用户角色：
- **房主 (owner)**: 拥有所有权限
- **家庭成员 (member)**: 拥有部分权限
- **访客 (guest)**: 拥有受限权限

## 权限指令使用

### 1. 基本用法

```vue
<template>
  <!-- 角色权限控制 -->
  <el-button v-perms="{ role: 'owner' }">房主专属按钮</el-button>
  <el-button v-perms="{ role: 'member' }">家庭成员按钮</el-button>
  <el-button v-perms="{ role: 'guest' }">访客按钮</el-button>
  
  <!-- 权限字符串控制 -->
  <el-button v-perms="'btn.edit'">编辑权限按钮</el-button>
  <el-button v-perms="['btn.add', 'btn.edit']">多权限按钮</el-button>
</template>
```

### 2. 路由权限控制

在路由配置中添加 `roles` 字段：

```typescript
{
  path: "/permission/guest",
  name: "GuestPermission",
  component: () => import("@/views/permission/guest.vue"),
  meta: {
    title: "访客权限管理",
    roles: ["owner"] // 只有房主可以访问
  }
}
```

### 3. 编程式权限检查

```typescript
import { hasRole, hasPerms } from "@/utils/auth";

// 检查角色
if (hasRole('owner')) {
  // 房主专属逻辑
}

// 检查权限
if (hasPerms('btn.edit')) {
  // 有编辑权限的逻辑
}
```

## 角色定义

| 角色 | 权限描述 |
|------|----------|
| owner | 房主，拥有所有权限，包括访客权限管理 |
| member | 家庭成员，可以操作家庭设备，但不能管理权限 |
| guest | 访客，只能操作被授权的设备 |

## 访客权限管理

房主可以通过访客权限管理界面：
1. 为访客分配设备操作权限
2. 设置权限有效期
3. 查看当前活跃访客
4. 手动回收权限

## 注意事项

1. 权限指令会自动隐藏无权限的元素
2. 路由权限会自动拦截无权限的访问
3. 权限变更后需要刷新页面或重新登录生效
4. 访客权限有时效性，过期自动失效