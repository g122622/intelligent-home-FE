import { http } from "@/utils/http";

export interface LoginParams {
  phone: string;
  password: string;
}

export interface RegisterParams {
  username: string;
  phone: string;
  password: string;
}

export interface LoginResult {
  token: string;
  message: string;
}

export interface RegisterResult {
  message: string;
}

export interface SearchUserResult {
  status: string;
  name: string;
  userId: number;
}

/** 用户登录 */
export const login = (data: LoginParams) => {
  return http.request<LoginResult>("post", "/auth/login", { data });
};

/** 用户注册 */
export const register = (data: RegisterParams) => {
  return http.request<RegisterResult>("post", "/auth/register", { data });
};

/** 搜索用户 */
export const searchUserByPhone = (phone: string) => {
  return http.request<SearchUserResult>(
    "get",
    `/auth/search-user-by-phone?phone=${phone}`
  );
};
