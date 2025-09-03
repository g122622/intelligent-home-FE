import { http } from "@/utils/http";

// ==================== 设备管理接口 ====================

/** 设备类型 */
export interface DeviceType {
  id: number;
  name: string;
  description: string;
}

/** 设备详情 */
export interface DeviceDetail {
  id: number;
  name: string;
  ipAddress: string;
  homeId: number;
  roomId: number;
  typeId: number;
  onlineStatus: number;
  activeStatus: number;
  lastActiveTime: string;
}

/** 设备列表响应 */
export interface DeviceListResponse {
  devices: DeviceDetail[];
}

/** 设备操作 */
export interface DeviceOperation {
  id: number;
  name: string;
  description: string;
}

/** 设备操作列表响应 */
export interface DeviceOperationsResponse {
  operations: DeviceOperation[];
}

/** 安防传感器状态 */
export interface SecuritySensorStatus {
  id: number;
  name: string;
  type: "flame" | "gas";
  status: "normal" | "abnormal";
  value: number;
  threshold: number;
  lastUpdate: string;
}

/** 报警记录 */
export interface AlarmRecord {
  id: number;
  deviceId: number;
  deviceName: string;
  alarmType: string;
  alarmTime: string;
  status: "pending" | "confirmed" | "ignored";
  description: string;
}

/** 获取设备类型列表 */
// **响应示例**:
// ```json
// [
//   {
//     "id": 1,
//     "name": "智能灯泡",
//     "description": "可调节亮度和颜色的智能灯泡"
//   },
//   {
//     "id": 2,
//     "name": "智能插座",
//     "description": "可远程控制的智能插座"
//   }
// ]
// ```
export const getDeviceTypes = (homeId: number) => {
  return http.request<DeviceType[]>(
    "get",
    `/home/${homeId}/room/device/type/list`
  );
};

/** 添加设备 */
// **接口地址**: `POST /home/{homeId}/room/device/add`

// **请求参数**:
// ```json
// {
//   "ipAddress": "192.168.1.100",
//   "homeId": 1,
//   "roomId": 1,
//   "typeId": 1,
//   "name": "客厅灯",
//   "onlineStatus": 0,
//   "activeStatus": 0
// }
// ```

// **响应示例**:
// ```json
// {
//   "status": "success",
//   "message": "添加设备成功",
//   "deviceId": 1
// }
// ```
export const addDevice = (
  data: Omit<DeviceDetail, "id" | "lastActiveTime">
) => {
  const {
    ipAddress,
    homeId,
    roomId,
    typeId,
    name,
    onlineStatus,
    activeStatus
  } = data;
  return http.request<{ status: string; message: string; deviceId: number }>(
    "post",
    `/home/${homeId}/room/device/add`,
    {
      data: {
        ipAddress,
        homeId,
        roomId,
        typeId,
        name,
        onlineStatus,
        activeStatus
      }
    }
  );
};

/** 获取设备列表 */
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
//       "activeStatus": 1,
//       "lastActiveTime": "2024-01-01T10:00:00"
//     }
//   ]
// }
// ```
export const getDeviceList = (homeId: number) => {
  return http.request<DeviceListResponse>(
    "get",
    `/home/${homeId}/room/device/list`
  );
};

/** 更新设备 */
// **接口地址**: `POST /home/{homeId}/room/device/update`

// **请求参数**:
// ```json
// {
//   "id": 1,
//   "name": "客厅主灯",
//   "roomId": 1
// }
// ```

// **响应示例**:
// ```json
// {
//   "status": "success",
//   "message": "更新成功"
// }
// ```

// **状态码**:
// - `200`: 更新成功
// - `400`: 更新失败
export const updateDeviceInfo = (
  homeId: number,
  data: {
    id: number;
    name: string;
    roomId: number;
  }
) => {
  return http.request<{ status: string; message: string }>(
    "post",
    `/home/${homeId}/room/device/update`,
    { data }
  );
};

/** 删除设备 */
export const deleteDevice = (homeId: number, deviceId: number) => {
  return http.request<{ status: string; message: string }>(
    "delete",
    `/home/${homeId}/room/device/delete?id=${deviceId}`
  );
};

/** 更新激活设备 */
// **接口地址**: `POST /home/{homeId}/room/device/active`
//
// **请求参数**:
// - `id` (query): 设备ID
//
// **请求示例**:
// ```bash
// POST /home/1/room/device/active?id=1
// ```
//
// **响应示例**:
// ```json
// {
//   "status": "success",
//   "message": "更新时间成功"
// }
// ```
export const updateActiveDevice = (homeId: number, deviceId: number) => {
  return http.request<{ status: string; message: string }>(
    "post",
    `/home/${homeId}/room/device/active?id=${deviceId}`
  );
};

/** 获取用户可访问设备 */
// **接口地址**: `GET /home/{homeId}/room/device/accessibleDevices`
//
// **请求头**: 需要JWT Token
//
// **请求参数**:
// - `homeId` (path): 家庭ID (在URL路径中)
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
//       "activeStatus": 1,
//       "lastActiveTime": "2024-01-01T10:00:00"
//     }
//   ],
//   "userRole": "HOST",
//   "isGuest": false
// }
// ```
//
// **状态码**:
// - `200`: 查询成功
// - `404`: 没有可访问的设备
//
// **说明**:
// - 该接口会根据当前登录用户的角色返回不同的设备列表
// - 用户ID自动从JWT Token中获取，无需手动传递
// - 房主可以访问所有设备，家庭成员访问大部分设备，访客只能访问特定设备
// - 响应中包含用户角色信息，便于前端进行权限控制
export interface AccessibleDevicesResponse {
  devices: DeviceDetail[];
  userRole: "HOST" | "MEMBER" | "GUEST";
  isGuest: boolean;
}

export const getAccessibleDevices = (homeId: number) => {
  return http.request<AccessibleDevicesResponse>(
    "get",
    `/home/${homeId}/room/device/accessibleDevices`
  );
};

// ==================== 设备交互接口 ====================

/** 设备操作 */
// **接口地址**: `POST /home/{homeId}/device/{deviceId}/operation/{operationId}`
//
// **请求参数**:
// - `deviceId` (path): 设备ID
// - `operationId` (path): 操作ID
// - `homeId` (path): 家庭ID
//
// **请求头**: 需要JWT Token
//
// **响应示例**:
// ```json
// {
//   "message": "命令已发送"
// }
// ```
//
// **状态码**:
// - `200`: 命令已发送
// - `403`: 没有权限进行此操作
// - `404`: 设备未在线
//
// **说明**:
// - 该接口会自动进行权限检查
// - 访客用户只能对特定设备执行查看类操作
// - 房主和家庭成员拥有更广泛的设备操作权限
export const operateDevice = (
  homeId: number,
  deviceId: number,
  operationId: number
) => {
  return http.request<{ message: string }>(
    "post",
    `/home/${homeId}/device/${deviceId}/operation/${operationId}`
  );
};

/** 移动设备 */
// **接口地址**: `POST /home/{homeId}/device/move`
//
// **请求参数**:
// ```json
// {
//   "deviceId": 1,
//   "roomId": 2
// }
// ```
//
// **响应示例**:
// ```json
// {
//   "message": "设备移动成功"
// }
// ```
//
// **状态码**:
// - `200`: 设备移动成功
// - `400`: 请求参数错误或运行时错误
// - `500`: 设备移动失败或服务器错误
export const moveDevice = (
  homeId: number,
  data: {
    deviceId: number;
    roomId: number;
  }
) => {
  return http.request<{ message: string }>(
    "post",
    `/home/${homeId}/device/move`,
    { data }
  );
};

/** 连接设备 */
// **接口地址**: `POST /home/{homeId}/device/connect`
//
// **请求参数**: 无
//
// **响应示例**:
// ```json
// {
//   "message": "设备连接成功"
// }
// ```
//
// **状态码**:
// - `200`: 设备连接成功
export const connectDevice = (homeId: number) => {
  return http.request<{ message: string }>(
    "post",
    `/home/${homeId}/device/connect`
  );
};

/** 断开设备连接 */
// **接口地址**: `POST /home/{homeId}/device/disconnect`
//
// **请求参数**: 无
//
// **响应示例**:
// ```json
// {
//   "message": "设备断开连接成功"
// }
// ```
//
// **状态码**:
// - `200`: 设备断开连接成功
export const disconnectDevice = (homeId: number) => {
  return http.request<{ message: string }>(
    "post",
    `/home/${homeId}/device/disconnect`
  );
};

/** 获取设备数据 */
// **接口地址**: `GET /home/{homeId}/device/{deviceId}/getData`
//
// **请求参数**:
// - `deviceId` (path): 设备ID
//
// **响应示例**:
// ```json
// {
//   "data": [
//     {
//       "id": 1,
//       "deviceId": 1,
//       "data": "设备数据内容",
//       "timestamp": "2024-01-01T10:00:00"
//     }
//   ]
// }
// ```
//
// **状态码**:
// - `200`: 获取数据成功
// - `404`: 没有任何数据信息
export interface DeviceData {
  id: number;
  deviceId: number;
  data: string;
  timestamp: string;
}

export interface GetDeviceDataResponse {
  data: DeviceData[];
}

export const getDeviceData = (homeId: number, deviceId: number) => {
  return http.request<GetDeviceDataResponse>(
    "get",
    `/home/${homeId}/device/${deviceId}/getData`
  );
};
