import type { Directive, DirectiveBinding } from "vue";

interface PermissionValue {
  role?: string;
  permission?: string;
}

/** 权限指令 */
const permission: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding<PermissionValue | string>) {
    const { value } = binding;
    const currentRole = localStorage.getItem("userRole") || "";
    
    let hasPermission = true;
    
    if (typeof value === "string") {
      // 简单角色检查
      hasPermission = currentRole === value;
    } else if (value && typeof value === "object") {
      // 复杂权限检查
      if (value.role) {
        hasPermission = currentRole === value.role;
      }
      // 这里可以扩展其他权限检查逻辑
    }
    
    if (!hasPermission) {
      el.style.display = "none";
    }
  }
};

export default permission;