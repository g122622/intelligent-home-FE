import { http } from "@/utils/http";

// ==================== 房间管理接口 ====================

/** 房间信息 */
export interface RoomInfo {
  id: number;
  homeId: number;
  name: string;
  isDeleted: boolean;
}

/** 房间设备响应 */
export interface RoomDevicesResponse {
  devices: Array<{
    id: number;
    name: string;
    ipAddress: string;
    homeId: number;
    roomId: number;
    typeId: number;
    onlineStatus: number;
    activeStatus: number;
  }>;
  message: string;
}

/** 房间列表响应 */
export interface RoomListResponse {
  message: string;
  Rooms: RoomInfo[];
}

/** 创建房间 */
// **接口地址**: `POST /home/{homeId}/room/create`
//
// **请求参数**:
// ```json
// {
//   "homeId": 1,
//   "name": "卧室"
// }
// ```
//
// **响应示例**:
// ```json
// {
//   "message": "创建成功"
// }
// ```
export const createRoom = (homeId: number, name: string) => {
  return http.request<{ message: string }>(
    "post",
    `/home/${homeId}/room/create`,
    {
      data: { homeId, name }
    }
  );
};

/** 获取房间列表 */
// **接口地址**: `GET /home/{homeId}/room/list`
//
// **响应示例**:
// ```json
// {
//   "message": "查看成功",
//   "Rooms": [
//     {
//       "id": 1,
//       "homeId": 2,
//       "name": "bedroom",
//       "isDeleted": false
//     }
//   ]
// }
// ```
export const getRoomList = (homeId: number) => {
  return http.request<RoomListResponse>("get", `/home/${homeId}/room/list`);
};

/** 删除房间 */
// **接口地址**: `DELETE /home/{homeId}/room/delete`
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
//   "message": "删除成功"
// }
// ```
//
// **状态码**:
// - `200`: 删除成功
// - `404`: 家庭不存在该房间
// - `500`: 删除失败
export const deleteRoom = (homeId: number, roomId: number) => {
  return http.request<{ message: string }>(
    "delete",
    `/home/${homeId}/room/delete`,
    {
      data: { id: roomId }
    }
  );
};

/** 获取房间设备 */
// **接口地址**: `POST /home/{homeId}/room/device`
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
//   "devices": [
//     {
//       "id": 1,
//       "name": "客厅灯",
//       "ipAddress": "192.168.1.100",
//       "homeId": 1,
//       "roomId": 1,
//       "typeId": 1,
//       "onlineStatus": 1,
//       "activeStatus": 1
//     }
//   ],
//   "message": "查看成功"
// }
// ```
//
// **状态码**:
// - `200`: 设备查看成功
// - `404`: 房间或设备未找到
export const getRoomDevices = (homeId: number, roomId: number) => {
  return http.request<RoomDevicesResponse>(
    "post",
    `/home/${homeId}/room/device`,
    {
      data: { id: roomId }
    }
  );
};
