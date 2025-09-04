import { http } from "@/utils/http";

// ==================== 场景管理接口 ====================

/** 场景详情 */
export interface SceneDetail {
  id?: number;
  name: string;
  description: string;
  status: number; // 1表示启用，0表示禁用
  startTime: string; // ISO 8601 时间格式
  endTime: string; // ISO 8601 时间格式
  deviceOperation: {
    deviceId: number;
    deviceOperationId: number;
    parameters: Record<string, any>;
  }[];
}

/** 场景列表响应 */
export interface SceneListResponse {
  scenes: Array<{
    id: number;
    name: string;
    description: string;
    status: number;
    startTime: string;
    endTime: string;
  }>;
}

/** 场景设备视图项 */
export interface SceneDeviceView {
  deviceId: number;
  deviceName: string;
  deviceTypeName: string;
  operationName: string;
  operationDescription: string;
}

/** 场景设备视图响应 */
export interface SceneDeviceViewResponse {
  devices: SceneDeviceView[];
  message: string;
}

/** 创建场景 */
// **接口地址**: `POST /home/{homeId}/scene/add`
//
// **请求参数**:
// ```json
// {
//   "name": "回家模式",
//   "description": "回家后自动开启灯光和空调",
//   "status": 1,
//   "startTime": "2024-01-01T18:00:00",
//   "endTime": "2024-01-01T22:00:00",
//   "deviceOperation": [
//     {
//       "deviceId": 1,
//       "deviceOperationId": 1,
//       "parameters": {
//         "brightness": 100
//       }
//     }
//   ]
// }
// ```
//
// **响应示例**:
// ```json
// {
//   "message": "创建场景成功"
// }
// ```
export const createScene = (homeId: number, data: SceneDetail) => {
  return http.request<{ message: string }>(
    "post",
    `/home/${homeId}/scene/add`,
    { data }
  );
};

/** 获取场景列表 */
// **接口地址**: `GET /home/{homeId}/scene/view`
//
// **响应示例**:
// ```json
// {
//   "scenes": [
//     {
//       "id": 1,
//       "name": "回家模式",
//       "description": "回家后自动开启灯光和空调",
//       "status": 1,
//       "startTime": "2024-01-01T18:00:00",
//       "endTime": "2024-01-01T22:00:00"
//     }
//   ]
// }
// ```
export const getSceneList = (homeId: number) => {
  return http.request<SceneListResponse>("get", `/home/${homeId}/scene/view`);
};

/** 获取场景设备视图 */
// **接口地址**: `GET /home/{homeId}/scene/view/{sceneId}/device`
//
// **响应示例**:
// ```json
// {
//   "devices": [
//     {
//       "deviceId": 1,
//       "deviceName": "客厅灯",
//       "deviceTypeName": "智能灯泡",
//       "operationName": "开关",
//       "operationDescription": "设备的开关操作"
//     }
//   ],
//   "message": "查看成功"
// }
// ```
export const getSceneDeviceView = (homeId: number, sceneId: number) => {
  return http.request<SceneDeviceViewResponse>(
    "get",
    `/home/${homeId}/scene/view/${sceneId}/device`
  );
};

/** 启动场景 */
// **接口地址**: `POST /home/{homeId}/scene/start`
//
// **请求参数**:
// ```json
// {
//   "sceneId": 1
// }
// ```
//
// **响应示例**:
// ```json
// {
//   "message": "场景已开启",
//   "设备开启情况": {
//     "1": "已执行",
//     "2": "未在线"
//   }
// }
// ```
//
// **状态码**:
// - `200`: 启动成功
// - `404`: 场景不存在
// - `500`: 启动失败
export const startScene = (homeId: number, sceneId: number) => {
  return http.request<{
    message: string;
    设备开启情况?: Record<string, string>;
  }>("post", `/home/${homeId}/scene/start`, {
    data: { sceneId }
  });
};

/** 停止场景 */
// **接口地址**: `POST /home/{homeId}/scene/stop`
//
// **请求参数**:
// ```json
// {
//   "sceneId": 1
// }
// ```
//
// **响应示例**:
// ```json
// {
//   "message": "场景已关闭"
// }
// ```
//
// **状态码**:
// - `200`: 停止成功
// - `404`: 场景不存在
// - `500`: 停止失败
export const stopScene = (homeId: number, sceneId: number) => {
  return http.request<{ message: string }>(
    "post",
    `/home/${homeId}/scene/stop`,
    { data: { sceneId } }
  );
};

/** 更新场景 */
// **接口地址**: `POST /home/{homeId}/scene/update/{sceneId}`
//
// **请求参数**:
// ```json
// {
//   "name": "回家模式",
//   "description": "回家后自动开启灯光和空调",
//   "status": 1,
//   "startTime": "2024-01-01T18:00:00",
//   "endTime": "2024-01-01T22:00:00",
//   "deviceOperation": [
//     {
//       "deviceId": 1,
//       "deviceOperationId": 1,
//       "parameters": {
//         "brightness": 100
//       }
//     }
//   ]
// }
// ```
//
// **响应示例**:
// ```json
// {
//   "message": "更新场景成功"
// }
// ```
//
// **状态码**:
// - `201`: 修改成功
// - `404`: 场景不存在
// - `500`: 修改失败
export const updateScene = (
  homeId: number,
  sceneId: number,
  data: SceneDetail
) => {
  return http.request<{ message: string }>(
    "post",
    `/home/${homeId}/scene/update/${sceneId}`,
    { data }
  );
};

/** 删除场景 */
// **接口地址**: `DELETE /home/{homeId}/scene/delete/{sceneId}`
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
// - `404`: 场景不存在
// - `500`: 删除场景失败
export const deleteScene = (homeId: number, sceneId: number) => {
  return http.request<{ message: string }>(
    "delete",
    `/home/${homeId}/scene/delete/${sceneId}`
  );
};
