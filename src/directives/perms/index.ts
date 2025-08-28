import { hasPerms, hasRole } from "@/utils/auth";
import type { Directive, DirectiveBinding } from "vue";

interface PermissionBinding {
  role?: string;
  permission?: string | Array<string>;
}

export const perms: Directive = {
  mounted(
    el: HTMLElement,
    binding: DirectiveBinding<string | Array<string> | PermissionBinding>
  ) {
    const { value } = binding;
    let hasAccess = false;

    if (typeof value === "string" || Array.isArray(value)) {
      // 旧格式：权限字符串或数组
      if (value) {
        hasAccess = hasPerms(value);
      } else {
        throw new Error(
          "[Directive: perms]: need perms! Like v-perms=\"['btn.add','btn.edit']\" or v-perms=\"{role: 'admin'}\""
        );
      }
    } else if (value && typeof value === "object") {
      // 新格式：对象格式，支持角色和权限检查
      if (value.role) {
        hasAccess = hasRole(value.role);
      } else if (value.permission) {
        hasAccess = hasPerms(value.permission);
      }
    }

    if (!hasAccess) {
      el.style.display = "none";
    }
  }
};
