// 根据角色动态生成路由
import { defineFakeRoute } from "vite-plugin-fake-server/client";

export default defineFakeRoute([
  {
    url: "/auth/login",
    method: "post",
    response: ({ body }) => {
      return {
        token:
          "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIzIiwiZXhwIjoxNzU2OTY5MjQ2fQ.akNZb_V2JmT4IMJFr1XykTmaAgwtAWFqFXXYrRFFdss",
        message: "登录成功"
      };
    }
  }
]);
