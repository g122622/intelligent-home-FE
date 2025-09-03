import { http } from "@/utils/http";

export type UserResult = {
  /** 用户名 */
  username: string;
  /** 当前登录用户的角色 */
  role: "host" | "member" | "guest";
  /** `token` */
  token: string;
};

/** 登录 */
export const getLogin = (data?: object) => {
  return http.request<UserResult>("post", "/auth/login", { data });
};
