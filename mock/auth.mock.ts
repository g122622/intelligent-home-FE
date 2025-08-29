// 认证相关接口mock数据
import { defineFakeRoute } from "vite-plugin-fake-server/client";

export default defineFakeRoute([
  {
    url: "/auth/login",
    method: "post",
    response: ({ body }) => {
      const { phone, password } = body;

      // 模拟不同角色的登录
      if (phone === "13800138000" && password === "password123") {
        return {
          token: "eyJhbGciOiJIUzUxMiJ9.admin_token",
          message: "登录成功"
        };
      } else if (phone === "13800138001" && password === "password123") {
        return {
          token: "eyJhbGciOiJIUzUxMiJ9.member_token",
          message: "登录成功"
        };
      } else if (phone === "13800138002" && password === "password123") {
        return {
          token: "eyJhbGciOiJIUzUxMiJ9.guest_token",
          message: "登录成功"
        };
      } else {
        return {
          message: "手机号或密码错误"
        };
      }
    }
  },
  {
    url: "/auth/register",
    method: "post",
    response: () => {
      return {
        message: "注册成功"
      };
    }
  },
  {
    url: "/auth/search-user-by-phone",
    method: "get",
    response: ({ query }) => {
      const { phone } = query;

      if (phone === "13800138000") {
        return {
          status: "success",
          name: "房主用户",
          userId: 1
        };
      } else if (phone === "13800138001") {
        return {
          status: "success",
          name: "家庭成员",
          userId: 2
        };
      } else if (phone === "13800138002") {
        return {
          status: "success",
          name: "访客用户",
          userId: 3
        };
      } else {
        return {
          status: "error",
          message: "用户不存在"
        };
      }
    }
  }
]);
