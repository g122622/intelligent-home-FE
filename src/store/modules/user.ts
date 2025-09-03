import { defineStore } from "pinia";
import {
  type userType,
  store,
  router,
  resetRouter,
  routerArrays,
  storageLocal
} from "../utils";
import { type UserResult, getLogin } from "@/api/user";
import { useMultiTagsStoreHook } from "./multiTags";
import { type DataInfo, setToken, removeToken, userKey } from "@/utils/auth";

export const useUserStore = defineStore("pure-user", {
  state: (): userType => ({
    // 用户名
    username: storageLocal().getItem<DataInfo>(userKey)?.username ?? "",
    // 页面级别权限
    role: storageLocal().getItem<DataInfo>(userKey)?.role ?? "guest",
    // 是否勾选了登录页的免登录
    isRemembered: false
  }),
  actions: {
    /** 存储用户名 */
    SET_USERNAME(username: string) {
      this.username = username;
    },
    /** 存储角色 */
    SET_ROLE(role: "host" | "member" | "guest") {
      this.role = role;
    },
    /** 存储是否勾选了登录页的免登录 */
    SET_ISREMEMBERED(bool: boolean) {
      this.isRemembered = bool;
    },
    /** 登入 */
    async loginByUsername(data) {
      return new Promise<UserResult>((resolve, reject) => {
        getLogin(data)
          .then(data => {
            setToken(data); // 设置token，会存储到localStorage
            this.SET_USERNAME(data.username);
            this.SET_ROLE(data.role);
            resolve(data);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    /** 前端登出（不调用接口） */
    logOut() {
      this.username = "";
      this.role = "guest";
      removeToken();
      // 清除角色信息
      localStorage.removeItem("userRole");
      localStorage.removeItem("user-info");
      useMultiTagsStoreHook().handleTags("equal", [...routerArrays]);
      resetRouter();
      router.push("/login");
    }
  }
});

export function useUserStoreHook() {
  return useUserStore(store);
}
