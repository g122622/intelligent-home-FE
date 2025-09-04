import { http } from "@/utils/http";

// ==================== 家庭管理接口 ====================

/** 家庭基本信息 */
export interface HomeInfo {
  id: number;
  name: string;
  address: string;
  createTime: string;
}

/** 房间信息 */
export interface RoomInfo {
  id: number;
  name: string;
  homeId: number;
}

/** 家庭成员信息 */
export interface MemberInfo {
  userId: number;
  username: string;
  role: number; // 0: 房主, 1: 家庭成员, 2: 访客
  roleName: string;
}

/** 设备简要信息 */
export interface DeviceSummary {
  id: number;
  name: string;
  typeName: string;
  onlineStatus: number;
  activeStatus: number;
}

/** 家庭详情响应 */
export interface HomeDetailResponse {
  home: HomeInfo;
  rooms: RoomInfo[];
  members: MemberInfo[];
  devices: DeviceSummary[];
}

/** 用户家庭角色信息 */
export interface UserHomeRole {
  homeId: number;
  homeName: string;
  role: number;
  roleName: string;
}

/** 用户家庭列表响应 */
export interface UserHomesResponse {
  homes: HomeInfo[];
}

/** 用户所在家庭响应 */
export interface MyHomeResponse {
  home: UserHomeRole[];
}

/** 搜索家庭响应 */
export interface SearchHomeResponse {
  homes: Array<{
    id: number;
    name: string;
    address: string;
  }>;
}

/** 获取用户家庭列表 */
// **接口地址**: `GET /home/get`
//
// **请求头**: 需要JWT Token
//
// **响应示例**:
// ```json
// {
//   "homes": [
//     {
//       "id": 1,
//       "name": "我的家",
//       "address": "北京市朝阳区xxx街道",
//       "createTime": "2024-01-01T10:00:00"
//     }
//   ]
// }
// ```
export const getUserHomes = () => {
  return http.request<UserHomesResponse>("get", "/home/get");
};

/** 创建家庭 */
// **接口地址**: `POST /home/create`
//
// **请求参数**:
// ```json
// {
//   "name": "新家庭",
//   "address": "家庭地址"
// }
// ```
//
// **响应示例**:
// ```json
// {
//   "message": "创建成功"
// }
// ```
export const createHome = (data: { name: string; address: string }) => {
  return http.request<{ message: string }>("post", "/home/create", { data });
};

/** 删除家庭 */
// **接口地址**: `DELETE /home/delete/{homeId}`
//
// **响应示例**:
// ```json
// {
//   "message": "删除成功"
// }
// ```
export const deleteHome = (homeId: number) => {
  return http.request<{ message: string }>("delete", `/home/delete/${homeId}`);
};

/** 查看家庭详情 */
// **接口地址**: `GET /home/view/{homeId}`
//
// **响应示例**:
// ```json
// {
//   "home": {
//     "id": 1,
//     "name": "我的家",
//     "address": "北京市朝阳区xxx街道"
//   },
//   "rooms": [
//     {
//       "id": 1,
//       "name": "客厅",
//       "homeId": 1
//     }
//   ],
//   "members": [
//     {
//       "userId": 1,
//       "username": "张三",
//       "role": 0,
//       "roleName": "房主"
//     }
//   ],
//   "devices": [
//     {
//       "id": 1,
//       "name": "客厅灯",
//       "typeName": "智能灯泡",
//       "onlineStatus": 1,
//       "activeStatus": 1
//     }
//   ]
// }
// ```
export const getHomeDetail = (homeId: number) => {
  return http.request<HomeDetailResponse>("get", `/home/view/${homeId}`);
};

/** 获取用户所在家庭 */
// **接口地址**: `GET /home/myHome`
//
// **请求头**: 需要JWT Token
//
// **响应示例**:
// ```json
// {
//   "home": [
//     {
//       "homeId": 1,
//       "homeName": "我的家",
//       "role": 0,
//       "roleName": "房主"
//     }
//   ]
// }
// ```
//
// **状态码**:
// - `200`: 查询成功
export const getMyHome = () => {
  return http.request<MyHomeResponse>("get", "/home/myHome");
};

/** 更新家庭名称 */
// **接口地址**: `POST /home/{homeId}/updateName`
//
// **请求参数**:
// ```json
// {
//   "name": "新家庭名称"
// }
// ```
//
// **响应示例**:
// ```json
// {
//   "message": "更新成功"
// }
// ```
//
// **状态码**:
// - `200`: 更新成功
// - `400`: 家庭名称不能为空
// - `404`: 家庭不存在
// - `500`: 更新失败
export const updateHomeName = (homeId: number, name: string) => {
  return http.request<{ message: string }>(
    "post",
    `/home/${homeId}/updateName`,
    {
      data: { name }
    }
  );
};

/** 更新家庭地址 */
// **接口地址**: `POST /home/{homeId}/updateAddress`
//
// **请求参数**:
// ```json
// {
//   "address": "新家庭地址"
// }
// ```
//
// **响应示例**:
// ```json
// {
//   "message": "更新成功"
// }
// ```
//
// **状态码**:
// - `200`: 更新成功
// - `400`: 地址不能为空
// - `404`: 家庭不存在
// - `500`: 更新失败
export const updateHomeAddress = (homeId: number, address: string) => {
  return http.request<{ message: string }>(
    "post",
    `/home/${homeId}/updateAddress`,
    {
      data: { address }
    }
  );
};

/** 搜索家庭 */
// **接口地址**: `GET /home/search?keyword={keyword}`
//
// **请求参数**:
// - `keyword` (query): 搜索关键词
//
// **响应示例**:
// ```json
// {
//   "homes": [
//     {
//       "id": 1,
//       "name": "我的家",
//       "address": "北京市朝阳区xxx街道"
//     }
//   ]
// }
// ```
//
// **状态码**:
// - `200`: 搜索成功
// - `404`: 没有找到符合条件的家庭
export const searchHomes = (keyword: string) => {
  return http.request<SearchHomeResponse>(
    "get",
    `/home/search?keyword=${encodeURIComponent(keyword)}`
  );
};

// ==================== 成员管理接口 ====================

/** 添加家庭成员 */
// **接口地址**: `POST /home/member/add`
//
// **请求参数**:
// ```json
// {
//   "userId": 1,
//   "homeId": 1,
//   "role": 1
// }
// ```
//
// **响应示例**:
// ```json
// {
//   "message": "添加成功"
// }
// ```
//
// **说明**: 家庭成员信息通过查看家庭详情接口获取，该接口返回家庭的所有成员信息。
export const addHomeMember = (data: {
  userId: number;
  homeId: number;
  role: number;
}) => {
  return http.request<{ message: string }>("post", "/home/member/add", {
    data
  });
};

// ==================== 权限管理接口 ====================

/** 用户权限信息 */
export interface PermissionInfo {
  id: number;
  userId: number;
  homeId: number;
  deviceId: number;
  operationId: number;
  hasPermission: boolean;
  endTime: string; // ISO 8601 时间格式
}

/** 添加用户权限 */
// **接口地址**: `POST /permission/{homeId}/add`
//
// **请求头**: 需要JWT Token
//
// **请求参数**:
// ```json
// {
//   "id": 1,
//   "userId": 1,
//   "homeId": 1,
//   "deviceId": 1,
//   "operationId": 1,
//   "hasPermission": true,
//   "endTime": "2024-12-31T23:59:59"
// }
// ```
//
// **响应示例**:
// ```json
// {
//   "message": "添加权限成功"
// }
// ```
//
// **状态码**:
// - `201`: 添加权限成功
// - `409`: 该用户已拥有此权限
// - `500`: 添加权限失败
//
// **说明**:
// - 只有房主可以添加用户权限
// - 权限ID必须唯一
// - 可以设置权限的有效期
export const addUserPermission = (
  homeId: number,
  data: Omit<PermissionInfo, "homeId">
) => {
  return http.request<{ message: string }>(
    "post",
    `/permission/${homeId}/add`,
    { data }
  );
};

/** 取消用户权限 */
// **接口地址**: `DELETE /permission/cancel`
//
// **请求头**: 需要JWT Token
//
// **请求参数**:
// ```json
// {
//   "id": 1
// }
// ```
//
// **响应示例**:
// ```json
// {
//   "message": "取消权限成功"
// }
// ```
//
// **状态码**:
// - `200`: 取消权限成功
// - `409`: 该用户未拥有此权限
// - `500`: 取消权限失败
//
// **说明**:
// - 只有房主可以取消用户权限
// - 通过权限ID来取消特定权限
export const cancelUserPermission = (permissionId: number) => {
  return http.request<{ message: string }>("delete", "/permission/cancel", {
    data: { id: permissionId }
  });
};
