import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { 
  DeviceDetail, 
  DeviceType, 
  DeviceOperation, 
  SecuritySensorStatus, 
  AlarmRecord,
  AccessibleDevicesResponse,
  DeviceData
} from "@/api/device";
import { 
  getDeviceTypes,
  addDevice,
  getDeviceList,
  updateDeviceInfo,
  deleteDevice,
  updateActiveDevice,
  getAccessibleDevices,
  operateDevice,
  moveDevice,
  connectDevice,
  disconnectDevice,
  getDeviceData
} from "@/api/device";

export const useDeviceStore = defineStore("device", () => {
  // 设备状态
  const devices = ref<DeviceDetail[]>([]);
  const deviceTypes = ref<DeviceType[]>([]);
  const deviceOperations = ref<DeviceOperation[]>([]);
  const securitySensors = ref<SecuritySensorStatus[]>([]);
  const alarmRecords = ref<AlarmRecord[]>([]);
  const accessibleDevices = ref<AccessibleDevicesResponse | null>(null);
  const deviceData = ref<DeviceData[]>([]);
  const isLoading = ref(false);
  const currentHomeId = ref<number>(1); // 默认家庭ID

  // 计算属性
  const onlineDevices = computed(() => 
    devices.value.filter(device => device.onlineStatus === 1)
  );

  const offlineDevices = computed(() => 
    devices.value.filter(device => device.onlineStatus === 0)
  );

  const activeDevices = computed(() => 
    devices.value.filter(device => device.activeStatus === 1)
  );

  const devicesByRoom = computed(() => {
    const grouped: { [roomId: number]: DeviceDetail[] } = {};
    devices.value.forEach(device => {
      if (!grouped[device.roomId]) {
        grouped[device.roomId] = [];
      }
      grouped[device.roomId].push(device);
    });
    return grouped;
  });

  const devicesByType = computed(() => {
    const grouped: { [typeId: number]: DeviceDetail[] } = {};
    devices.value.forEach(device => {
      if (!grouped[device.typeId]) {
        grouped[device.typeId] = [];
      }
      grouped[device.typeId].push(device);
    });
    return grouped;
  });

  // API 操作
  const fetchDeviceTypes = async (homeId: number = currentHomeId.value) => {
    try {
      const response = await getDeviceTypes(homeId);
      deviceTypes.value = response.data;
    } catch (error) {
      console.error("获取设备类型失败:", error);
    }
  };

  const fetchDeviceList = async (homeId: number = currentHomeId.value) => {
    isLoading.value = true;
    try {
      const response = await getDeviceList(homeId);
      devices.value = response.data.devices;
    } catch (error) {
      console.error("获取设备列表失败:", error);
    } finally {
      isLoading.value = false;
    }
  };

  const addNewDevice = async (deviceData: Omit<DeviceDetail, "id" | "lastActiveTime">) => {
    try {
      const response = await addDevice(deviceData);
      await fetchDeviceList(deviceData.homeId);
      return response;
    } catch (error) {
      console.error("添加设备失败:", error);
      throw error;
    }
  };

  const updateDevice = async (homeId: number, deviceId: number, updates: { name: string; roomId: number }) => {
    try {
      const response = await updateDeviceInfo(homeId, { id: deviceId, ...updates });
      await fetchDeviceList(homeId);
      return response;
    } catch (error) {
      console.error("更新设备失败:", error);
      throw error;
    }
  };

  const removeDevice = async (homeId: number, deviceId: number) => {
    try {
      const response = await deleteDevice(homeId, deviceId);
      await fetchDeviceList(homeId);
      return response;
    } catch (error) {
      console.error("删除设备失败:", error);
      throw error;
    }
  };

  const activateDevice = async (homeId: number, deviceId: number) => {
    try {
      const response = await updateActiveDevice(homeId, deviceId);
      await fetchDeviceList(homeId);
      return response;
    } catch (error) {
      console.error("激活设备失败:", error);
      throw error;
    }
  };

  const fetchAccessibleDevices = async (homeId: number = currentHomeId.value) => {
    try {
      const response = await getAccessibleDevices(homeId);
      accessibleDevices.value = response.data;
    } catch (error) {
      console.error("获取可访问设备失败:", error);
    }
  };

  const performDeviceOperation = async (homeId: number, deviceId: number, operationId: number) => {
    try {
      const response = await operateDevice(homeId, deviceId, operationId);
      return response;
    } catch (error) {
      console.error("执行设备操作失败:", error);
      throw error;
    }
  };

  const moveDeviceToRoom = async (homeId: number, deviceId: number, roomId: number) => {
    try {
      const response = await moveDevice(homeId, { deviceId, roomId });
      await fetchDeviceList(homeId);
      return response;
    } catch (error) {
      console.error("移动设备失败:", error);
      throw error;
    }
  };

  const connectToDevice = async (homeId: number) => {
    try {
      const response = await connectDevice(homeId);
      return response;
    } catch (error) {
      console.error("连接设备失败:", error);
      throw error;
    }
  };

  const disconnectFromDevice = async (homeId: number) => {
    try {
      const response = await disconnectDevice(homeId);
      return response;
    } catch (error) {
      console.error("断开设备连接失败:", error);
      throw error;
    }
  };

  const fetchDeviceData = async (homeId: number, deviceId: number) => {
    try {
      const response = await getDeviceData(homeId, deviceId);
      deviceData.value = response.data.data;
      return response;
    } catch (error) {
      console.error("获取设备数据失败:", error);
      throw error;
    }
  };

  // 初始化所有数据
  const initialize = async (homeId: number = currentHomeId.value) => {
    isLoading.value = true;
    try {
      await Promise.all([
        fetchDeviceTypes(homeId),
        fetchDeviceList(homeId),
        fetchAccessibleDevices(homeId)
      ]);
    } catch (error) {
      console.error("初始化设备数据失败:", error);
    } finally {
      isLoading.value = false;
    }
  };

  return {
    devices,
    deviceTypes,
    deviceOperations,
    securitySensors,
    alarmRecords,
    accessibleDevices,
    deviceData,
    isLoading,
    currentHomeId,
    
    onlineDevices,
    offlineDevices,
    activeDevices,
    devicesByRoom,
    devicesByType,
    
    fetchDeviceTypes,
    fetchDeviceList,
    addNewDevice,
    updateDevice,
    removeDevice,
    activateDevice,
    fetchAccessibleDevices,
    performDeviceOperation,
    moveDeviceToRoom,
    connectToDevice,
    disconnectFromDevice,
    fetchDeviceData,
    initialize
  };
});