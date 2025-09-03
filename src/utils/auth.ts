import Cookies from "js-cookie";
import { useUserStoreHook } from "@/store/modules/user";
import { storageLocal } from "@pureadmin/utils";

export interface DataInfo {
  /** token */
  token: string;
  /** 用户名 */
  username?: string;
  /** 当前登录用户的角色 */
  role?: "host" | "member" | "guest";
}

export const userKey = "user-info";
export const TokenKey = "authorized-token";
/**
 * 通过`multiple-tabs`是否在`cookie`中，判断用户是否已经登录系统，
 * 从而支持多标签页打开已经登录的系统后无需再登录。
 * 浏览器完全关闭后`multiple-tabs`将自动从`cookie`中销毁，
 * 再次打开浏览器需要重新登录系统
 * */
export const multipleTabsKey = "multiple-tabs";

/** 获取`token` */
export function getToken(): DataInfo {
  // 此处与`TokenKey`相同，此写法解决初始化时`Cookies`中不存在`TokenKey`报错
  return Cookies.get(TokenKey)
    ? JSON.parse(Cookies.get(TokenKey))
    : storageLocal().getItem(userKey);
}

/**
 * @description 设置`token`
 */
export function setToken(data: DataInfo) {
  const { token } = data;
  const { isRemembered } = useUserStoreHook();
  const cookieString = JSON.stringify({ token });

  // TODO 验证记住密码功能是否有效
  Cookies.set(TokenKey, cookieString);
  Cookies.set(
    multipleTabsKey,
    "true",
    isRemembered
      ? {
          // 7天后过期
          expires: 7
        }
      : {}
  );

  function setUserKey({ username, role }) {
    useUserStoreHook().SET_USERNAME(username);
    useUserStoreHook().SET_ROLE(role);
    // 设置用户信息到localStorage
    storageLocal().setItem(userKey, {
      username
    });
  }

  if (data.username && data.role) {
    const { username, role } = data;
    setUserKey({
      username,
      role
    });
  } else {
    const username = storageLocal().getItem<DataInfo>(userKey)?.username ?? "";
    const role = storageLocal().getItem<DataInfo>(userKey)?.role ?? "guest";
    setUserKey({
      username,
      role
    });
  }
}

/** 删除`token`以及key值为`user-info`的localStorage信息 */
export function removeToken() {
  Cookies.remove(TokenKey);
  Cookies.remove(multipleTabsKey);
  storageLocal().removeItem(userKey);
}

/** 格式化token（jwt格式） */
export const formatToken = (token: string): string => {
  return "Bearer " + token;
};

/** 是否有按钮级别的权限（根据登录接口返回的`permissions`字段进行判断）*/
export const hasPerms = (_value: string | Array<string>): boolean => {
  // TODO
  return true;
};

/** 检查用户角色权限 */
export const hasRole = (_role: string): boolean => {
  // TODO
  return true;
};
