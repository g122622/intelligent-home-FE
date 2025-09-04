import { http } from "@/utils/http";

// ==================== 访客权限管理接口 ====================

/** 访客可访问设备信息 */
export interface AccessibleDevice {
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

/** 访客可访问设备列表响应 */
export interface GuestAccessibleDevicesResponse {
  devices: AccessibleDevice[];
  userRole: string;
  accessibleDeviceTypes: number[];
  message: string;
}

/** 检查访客设备操作权限响应 */
export interface CheckGuestPermissionResponse {
  hasPermission: boolean;
  message: string;
}

/** 访客权限说明响应 */
export interface GuestPermissionInfoResponse {
  role: string;
  description: string;
  restrictions: string[];
  accessibleDeviceTypes: number[];
  allowedOperations: number[];
}

/** 获取访客可访问设备列表 */
// **接口地址**: `GET /guest/{userId}/home/{homeId}/accessible-devices`
//
// **请求参数**:
// - `userId` (path): 用户ID
// - `homeId` (path): 家庭ID
//
// **响应示例**:
// ```json
// {
//   "devices": [
//     {
//       "id": 5,
//       "name": "客厅窗户",
//       "ipAddress": "192.168.1.105",
//       "homeId": 1,
//       "roomId": 1,
//       "typeId": 5,
//       "onlineStatus": 1,
//       "activeStatus": 1,
//       "lastActiveTime": "2024-01-01T10:00:00"
//     }
//   ],
//   "userRole": "GUEST",
//   "accessibleDeviceTypes": [5, 6],
//   "message": "访客可访问设备列表获取成功"
// }
// ```
//
// **状态码**:
// - `200`: 查询成功
// - `403`: 用户不是访客
// - `404`: 没有可访问的设备
//
// **说明**:
// - 该接口专门为访客用户设计
// - 访客只能访问特定类型的设备（如窗户、监控摄像头等）
// - 返回的设备列表已根据访客权限进行过滤
// - 需要验证用户确实为访客身份
export const getGuestAccessibleDevices = (userId: number, homeId: number) => {
  return http.request<GuestAccessibleDevicesResponse>(
    "get",
    `/guest/${userId}/home/${homeId}/accessible-devices`
  );
};

/** 检查访客设备操作权限 */
// **接口地址**: `GET /guest/{userId}/home/{homeId}/device/{deviceId}/operation/{operationId}/check`
//
// **请求参数**:
// - `userId` (path): 用户ID
// - `homeId` (path): 家庭ID
// - `deviceId` (path): 设备ID
// - `operationId` (path): 操作ID
//
// **响应示例**:
// ```json
// {
//   "hasPermission": false,
//   "message": "访客没有权限执行此操作"
// }
// ```
//
// **状态码**:
// - `200`: 权限检查完成
// - `403`: 用户不是访客
//
// **说明**:
// - 用于检查访客用户是否可以对指定设备执行指定操作
// - 访客通常只能执行查看类操作（操作ID 1, 2）
// - 不能执行控制类操作（操作ID > 2）
// - 会验证用户是否为访客身份
export const checkGuestOperationPermission = (
  userId: number,
  homeId: number,
  deviceId: number,
  operationId: number
) => {
  return http.request<CheckGuestPermissionResponse>(
    "get",
    `/guest/${userId}/home/${homeId}/device/${deviceId}/operation/${operationId}/check`
  );
};

/** 获取访客权限说明 */
// **接口地址**: `GET /guest/permission-info`
//
// **请求参数**: 无
//
// **响应示例**:
// ```json
// {
//   "role": "GUEST",
//   "description": "访客用户",
//   "restrictions": [
//     "只能访问特定类型的设备（如传感器、监控摄像头等）",
//     "只能执行查看类操作，不能进行控制操作",
//     "不能添加、删除或修改设备",
//     "不能访问敏感设备（如门锁、保险柜等）"
//   ],
//   "accessibleDeviceTypes": [5, 6],
//   "allowedOperations": [1, 2]
// }
// ```
//
// **状态码**:
// - `200`: 获取成功
//
// **说明**:
// - 提供访客用户的权限说明和限制信息
// - 帮助前端了解访客的权限范围
// - 可用于权限提示和用户引导
// - 无需认证，可直接访问
export const getGuestPermissionInfo = () => {
  return http.request<GuestPermissionInfoResponse>(
    "get",
    "/guest/permission-info"
  );
};

// ==================== 访客管理接口 ====================

/** 进入请求信息 */
export interface JoinRequest {
  id: number;
  userId: number;
  username: string;
  status: number; // 0: 等待处理, 1: 已同意, 2: 已拒绝
  statusName: string;
  recordTime: string;
}

/** 进入请求列表响应 */
export interface JoinRequestListResponse {
  requests: JoinRequest[];
}

/** 发起加入家庭申请 */
// **接口地址**: `POST /home/{homeId}/request/put`
//
// **请求参数**: 无
//
// **响应示例**:
// ```json
// {
//   "message": "申请成功"
// }
// ```
//
// **状态码**:
// - `200`: 申请成功/已发送过申请
// - `404`: 该家庭不存在
// - `409`: 已加入该家庭
// - `500`: 申请失败
export const applyToJoinHome = (homeId: number) => {
  return http.request<{ message: string }>(
    "post",
    `/home/${homeId}/request/put`
  );
};

/** 获取进入请求列表 */
// **接口地址**: `GET /home/{homeId}/request/receive`
//
// **响应示例**:
// ```json
// {
//   "requests": [
//     {
//       "id": 1,
//       "userId": 3,
//       "username": "访客",
//       "status": 0,
//       "statusName": "等待处理",
//       "recordTime": "2024-01-01T10:00:00"
//     }
//   ]
// }
// ```
//
// **状态码**:
// - `200`: 获取成功
// - `404`: 该家庭不存在/没有加入家庭的申请
export const getJoinRequests = (homeId: number) => {
  return http.request<JoinRequestListResponse>(
    "get",
    `/home/${homeId}/request/receive`
  );
};

/** 处理进入请求 */
// **接口地址**: `POST /home/{homeId}/request/receive/handle`
//
// **请求参数**:
// ```json
// {
//   "requestId": 1,
//   "userId": 3,
//   "status": 1
// }
// ```
//
// **响应示例**:
// ```json
// {
//   "message": "处理成功"
// }
// ```
//
// **状态码**:
// - `200`: 处理成功
// - `404`: 申请不存在或已取消
// - `500`: 处理失败
export const handleJoinRequest = (
  homeId: number,
  data: {
    requestId: number;
    userId: number;
    status: number;
  }
) => {
  return http.request<{ message: string }>(
    "post",
    `/home/${homeId}/request/receive/handle`,
    { data }
  );
};
