import { http } from "@/utils/http";

// ==================== 传感器数据接口 ====================

/** 传感器数据 */
export interface SensorData {
  id: number;
  deviceId: number;
  dataTime: string; // ISO 8601 时间格式
  topic: string | null;
  dataValue: number;
}

/** 设备基本信息 */
export interface DeviceInfo {
  id: number;
  name: string;
  ipAddress: string;
  homeId: number;
  roomId: number;
  typeId: number;
  onlineStatus: number;
  activeStatus: number;
  lastActiveTime: string; // ISO 8601 时间格式
}

/** 获取设备最新传感器数据响应 */
export interface LatestSensorDataResponse {
  success: boolean;
  deviceId: number;
  deviceName: string;
  deviceType: number;
  roomId: number;
  homeId: number;
  lastActiveTime: string;
  onlineStatus: number;
  activeStatus: number;
  sensorData: SensorData;
  dataCount: number;
}

/** 获取实时传感器数据响应 */
export interface RealtimeSensorDataResponse {
  success: boolean;
  timestamp: string; // ISO 8601 时间格式，包含毫秒
  deviceId: number;
  deviceName: string;
  onlineStatus: number;
  activeStatus: number;
  lastActiveTime: string;
  sensorData: SensorData;
  hasData: boolean;
}

/** 获取设备传感器数据历史记录响应 */
export interface HistorySensorDataResponse {
  success: boolean;
  deviceId: number;
  deviceName: string;
  historyData: SensorData[];
  dataCount: number;
}

/** 获取家庭所有设备传感器数据响应 */
export interface HomeAllSensorDataResponse {
  success: boolean;
  homeId: number;
  deviceCount: number;
  devices: DeviceInfo[];
}

/** 获取设备最新传感器数据 */
// **接口地址**: `GET /api/sensor/device/{deviceId}/latest`
//
// **请求参数**:
// - `deviceId` (path): 设备ID
//
// **响应示例**:
// ```json
// {
//   "success": true,
//   "deviceId": 1,
//   "deviceName": "客厅主灯",
//   "deviceType": 1,
//   "roomId": 1,
//   "homeId": 1,
//   "lastActiveTime": "2025-09-04T16:56:14",
//   "onlineStatus": 0,
//   "activeStatus": 0,
//   "sensorData": {
//     "id": 23,
//     "deviceId": 1,
//     "dataTime": "2025-09-04T16:56:14",
//     "topic": null,
//     "dataValue": 30
//   },
//   "dataCount": 2
// }
// ```
//
// **状态码**:
// - `200`: 获取成功
// - `404`: 设备不存在
// - `500`: 服务器内部错误
export const getLatestSensorData = (deviceId: number) => {
  return http.request<LatestSensorDataResponse>(
    "get",
    `/api/sensor/device/${deviceId}/latest`
  );
};

/** 获取实时传感器数据（轮询接口） */
// **接口地址**: `GET /api/sensor/device/{deviceId}/realtime`
//
// **请求参数**:
// - `deviceId` (path): 设备ID
//
// **响应示例**:
// ```json
// {
//   "success": true,
//   "timestamp": "2025-09-05T21:04:59.107394",
//   "deviceId": 1,
//   "deviceName": "客厅主灯",
//   "onlineStatus": 0,
//   "activeStatus": 0,
//   "lastActiveTime": "2025-09-04T16:56:14",
//   "sensorData": {
//     "id": 23,
//     "deviceId": 1,
//     "dataTime": "2025-09-04T16:56:14",
//     "topic": null,
//     "dataValue": 30
//   },
//   "hasData": true
// }
// ```
//
// **状态码**:
// - `200`: 获取成功
// - `404`: 设备不存在
// - `500`: 服务器内部错误
//
// **说明**:
// - 该接口适用于前端轮询获取实时数据
// - 建议轮询间隔为5-10秒
// - 返回的数据包含时间戳，便于前端判断数据新鲜度
export const getRealtimeSensorData = (deviceId: number) => {
  return http.request<RealtimeSensorDataResponse>(
    "get",
    `/api/sensor/device/${deviceId}/realtime`
  );
};

/** 获取设备传感器数据历史记录 */
// **接口地址**: `GET /api/sensor/device/{deviceId}/history`
//
// **请求参数**:
// - `deviceId` (path): 设备ID
// - `limit` (query): 返回数据条数限制，默认10条
//
// **响应示例**:
// ```json
// {
//   "success": true,
//   "deviceId": 1,
//   "deviceName": "客厅主灯",
//   "historyData": [
//     {
//       "id": 22,
//       "deviceId": 1,
//       "dataTime": "2025-09-04T16:55:02",
//       "topic": "security_sensors",
//       "dataValue": 30
//     }
//   ],
//   "dataCount": 2
// }
// ```
//
// **状态码**:
// - `200`: 获取成功
// - `404`: 设备不存在
// - `500`: 服务器内部错误
export const getSensorDataHistory = (deviceId: number, limit?: number) => {
  const url = limit
    ? `/api/sensor/device/${deviceId}/history?limit=${limit}`
    : `/api/sensor/device/${deviceId}/history`;
  return http.request<HistorySensorDataResponse>("get", url);
};

/** 获取家庭所有设备传感器数据 */
// **接口地址**: `GET /api/sensor/home/{homeId}/all`
//
// **请求参数**:
// - `homeId` (path): 家庭ID
//
// **响应示例**:
// ```json
// {
//   "success": true,
//   "homeId": 1,
//   "deviceCount": 9,
//   "devices": [
//     {
//       "id": 1,
//       "name": "客厅主灯",
//       "ipAddress": "0",
//       "homeId": 1,
//       "roomId": 1,
//       "typeId": 1,
//       "onlineStatus": 0,
//       "activeStatus": 0,
//       "lastActiveTime": "2025-09-04T16:56:14"
//     }
//   ]
// }
// ```
//
// **状态码**:
// - `200`: 获取成功
// - `500`: 服务器内部错误
//
// **说明**:
// - 返回家庭中所有设备的基本信息和最新活跃时间
// - 适用于设备概览页面显示
// - 数据已按设备最后活跃时间排序
export const getHomeAllSensorData = (homeId: number) => {
  return http.request<HomeAllSensorDataResponse>(
    "get",
    `/api/sensor/home/${homeId}/all`
  );
};
