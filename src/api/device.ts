import { http } from "@/utils/http";

/** 设备类型 */
export interface Device {
  id: string;
  name: string;
  type: "light" | "ac" | "curtain" | "sensor" | "switch";
  room: string;
  status: boolean;
  brightness?: number; // 灯光亮度 0-100
  temperature?: number; // 空调温度 16-30
  mode?: "cool" | "heat" | "fan" | "auto"; // 空调模式
  fanSpeed?: number; // 风扇档位 1-5
  position?: number; // 窗帘位置 0-100
  lastUpdate: string;
}

/** 设备分组 */
export interface DeviceGroup {
  id: string;
  name: string;
  deviceIds: string[];
  actions: {
    [deviceId: string]: Partial<Device>;
  };
}

/** 场景模式 */
export interface Scene {
  id: string;
  name: string;
  description?: string;
  actions: {
    [deviceId: string]: Partial<Device>;
  };
  isActive: boolean;
}

/** 房间信息 */
export interface Room {
  id: string;
  name: string;
  deviceCount: number;
}

/** 获取设备列表 */
export const getDevices = () => {
  return http.request<Device[]>("get", "/devices");
};

/** 获取单个设备详情 */
export const getDevice = (id: string) => {
  return http.request<Device>("get", `/devices/${id}`);
};

/** 更新设备状态 */
export const updateDevice = (id: string, data: Partial<Device>) => {
  return http.request<Device>("patch", `/devices/${id}`, { data });
};

/** 批量更新设备状态 */
export const batchUpdateDevices = (
  data: Array<{ id: string; updates: Partial<Device> }>
) => {
  return http.request<Device[]>("post", "/devices/batch-update", { data });
};

/** 获取设备分组列表 */
export const getDeviceGroups = () => {
  return http.request<DeviceGroup[]>("get", "/device-groups");
};

/** 创建设备分组 */
export const createDeviceGroup = (data: Omit<DeviceGroup, "id">) => {
  return http.request<DeviceGroup>("post", "/device-groups", { data });
};

/** 更新设备分组 */
export const updateDeviceGroup = (id: string, data: Partial<DeviceGroup>) => {
  return http.request<DeviceGroup>("patch", `/device-groups/${id}`, { data });
};

/** 删除设备分组 */
export const deleteDeviceGroup = (id: string) => {
  return http.request("delete", `/device-groups/${id}`);
};

/** 执行设备分组操作 */
export const executeGroupAction = (groupId: string) => {
  return http.request<Device[]>("post", `/device-groups/${groupId}/execute`);
};

/** 获取场景列表 */
export const getScenes = () => {
  return http.request<Scene[]>("get", "/scenes");
};

/** 创建场景 */
export const createScene = (data: Omit<Scene, "id" | "isActive">) => {
  return http.request<Scene>("post", "/scenes", { data });
};

/** 更新场景 */
export const updateScene = (id: string, data: Partial<Scene>) => {
  return http.request<Scene>("patch", `/scenes/${id}`, { data });
};

/** 删除场景 */
export const deleteScene = (id: string) => {
  return http.request("delete", `/scenes/${id}`);
};

/** 执行场景 */
export const executeScene = (sceneId: string) => {
  return http.request<Device[]>("post", `/scenes/${sceneId}/execute`);
};

/** 获取房间列表 */
export const getRooms = () => {
  return http.request<Room[]>("get", "/rooms");
};

/** 获取WebSocket连接URL */
export const getWebSocketUrl = () => {
  return http.request<{ url: string }>("get", "/websocket-url");
};

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
export const getDeviceTypes = (homeId: number) => {
  return http.request<DeviceType[]>("get", `/home/${homeId}/room/device/type/list`);
};

/** 添加设备 */
export const addDevice = (homeId: number, data: {
  ipAddress: string;
  homeId: number;
  roomId: number;
  typeId: number;
  name: string;
  onlineStatus: number;
  activeStatus: number;
}) => {
  return http.request<{ status: string; message: string; deviceId: number }>(
    "post", 
    `/home/${homeId}/room/device/add`, 
    { data }
  );
};

/** 获取设备列表 */
export const getDeviceList = (homeId: number) => {
  return http.request<DeviceListResponse>("get", `/home/${homeId}/room/device/list`);
};

/** 更新设备 */
export const updateDeviceInfo = (homeId: number, data: {
  id: number;
  name?: string;
  roomId?: number;
}) => {
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

/** 移动设备 */
export const moveDevice = (homeId: number, data: {
  deviceId: number;
  newRoomId: number;
}) => {
  return http.request<{ message: string }>(
    "post", 
    `/home/${homeId}/room/device/move`, 
    { data }
  );
};

// ==================== 设备交互接口 ====================

/** 设备操作 */
export const operateDevice = (homeId: number, data: {
  deviceId: number;
  operationId: number;
  parameters?: Record<string, any>;
}) => {
  return http.request<{ message: string }>(
    "post", 
    `/home/${homeId}/device/operation`, 
    { data }
  );
};

/** 获取设备操作列表 */
export const getDeviceOperations = (homeId: number, deviceId: number) => {
  return http.request<DeviceOperationsResponse>(
    "get", 
    `/home/${homeId}/device/${deviceId}/operations`
  );
};

// ==================== 安防监控接口 ====================

/** 获取安防传感器状态 */
export const getSecuritySensorStatus = (homeId: number) => {
  return http.request<SecuritySensorStatus[]>("get", `/home/${homeId}/security/sensors`);
};

/** 获取报警记录 */
export const getAlarmRecords = (homeId: number, params?: {
  startTime?: string;
  endTime?: string;
  alarmType?: string;
  status?: string;
}) => {
  return http.request<AlarmRecord[]>("get", `/home/${homeId}/security/alarms`, { params });
};

/** 确认报警 */
export const confirmAlarm = (homeId: number, alarmId: number) => {
  return http.request<{ message: string }>(
    "post", 
    `/home/${homeId}/security/alarms/${alarmId}/confirm`
  );
};

/** 忽略报警 */
export const ignoreAlarm = (homeId: number, alarmId: number) => {
  return http.request<{ message: string }>(
    "post", 
    `/home/${homeId}/security/alarms/${alarmId}/ignore`
  );
};
