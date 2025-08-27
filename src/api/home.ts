import { http } from "@/utils/http";

export interface HomeInfo {
  id: number;
  name: string;
  address: string;
  createTime: string;
}

export interface RoomInfo {
  id: number;
  name: string;
  homeId: number;
}

export interface MemberInfo {
  userId: number;
  username: string;
  role: number;
  roleName: string;
}

export interface DeviceInfo {
  id: number;
  name: string;
  typeName: string;
  onlineStatus: number;
  activeStatus: number;
}

export interface HomeDetailResult {
  home: HomeInfo;
  rooms: RoomInfo[];
  members: MemberInfo[];
  devices: DeviceInfo[];
}

/** 获取用户家庭列表 */
export const getHomes = () => {
  return http.request<{ homes: HomeInfo[] }>("get", "/home/get");
};

/** 创建家庭 */
export const createHome = (data: { name: string; address: string }) => {
  return http.request<{ message: string }>("post", "/home/create", { data });
};

/** 删除家庭 */
export const deleteHome = (homeId: number) => {
  return http.request<{ message: string }>("delete", `/home/delete/${homeId}`);
};

/** 查看家庭详情 */
export const getHomeDetail = (homeId: number) => {
  return http.request<HomeDetailResult>("get", `/home/view/${homeId}`);
};

/** 创建房间 */
export const createRoom = (homeId: number, name: string) => {
  return http.request<{ message: string }>("post", `/home/${homeId}/room/create`, { 
    data: { name } 
  });
};

/** 获取房间列表 */
export const getRooms = (homeId: number) => {
  return http.request<{ rooms: RoomInfo[] }>("get", `/home/${homeId}/room/list`);
};

/** 删除房间 */
export const deleteRoom = (homeId: number, roomId: number) => {
  return http.request<{ message: string }>("delete", `/home/${homeId}/room/delete/${roomId}`);
};