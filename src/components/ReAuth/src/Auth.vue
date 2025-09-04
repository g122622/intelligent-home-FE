<template>
  <div v-if="hasPermission">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  /** 需要的角色权限 */
  role: {
    type: String,
    default: ""
  },
  /** 需要的具体权限 */
  permission: {
    type: String,
    default: ""
  }
});

// 获取当前用户角色和权限
const currentRole = localStorage.getItem("userRole") || "";
const currentPermissions = []; // 可以从store或localStorage获取

const hasPermission = computed(() => {
  // 如果有指定角色，检查角色
  if (props.role) {
    return currentRole === props.role;
  }

  // 如果有指定权限，检查权限
  if (props.permission) {
    return currentPermissions.includes(props.permission);
  }

  // 默认允许访问
  return true;
});
</script>
