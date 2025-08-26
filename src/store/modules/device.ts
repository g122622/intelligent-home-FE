import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { Device, DeviceGroup, Scene, Room } from "@/api/device";
import { getDevices, getDeviceGroups, getScenes, getRooms } from "@/api/device";

export const useDeviceStore = defineStore("device", () => {
  // 设备状态
  const devices = ref<Device[]>([]);
  const deviceGroups = ref<DeviceGroup[]>([]);
  const scenes = ref<Scene[]>([]);
  const rooms = ref<Room[]>([]);
  const isLoading = ref(false);
  const wsConnection = ref<WebSocket | null>(null);

  // 计算属性
  const devicesByRoom = computed(() => {
    const grouped: { [room: string]: Device[] } = {};
    devices.value.forEach(device => {
      if (!grouped[device.room]) {
        grouped[device.room] = [];
      }
      grouped[device.room].push(device);
    });
    return grouped;
  });

  const devicesByType = computed(() => {
    const grouped: { [type: string]: Device[] } = {};
    devices.value.forEach(device => {
      if (!grouped[device.type]) {
        grouped[device.type] = [];
      }
      grouped[device.type].push(device);
    });
    return grouped;
  });

  // 获取设备列表
  const fetchDevices = async () => {
    isLoading.value = true;
    try {
      const response = await getDevices();
      devices.value = response.data;
    } catch (error) {
      console.error("获取设备列表失败:", error);
    } finally {
      isLoading.value = false;
    }
  };

  // 获取设备分组
  const fetchDeviceGroups = async () => {
    try {
      const response = await getDeviceGroups();
      deviceGroups.value = response.data;
    } catch (error) {
      console.error("获取设备分组失败:", error);
    }
  };

  // 获取场景列表
  const fetchScenes = async () => {
    try {
      const response = await getScenes();
      scenes.value = response.data;
    } catch (error) {
      console.error("获取场景列表失败:", error);
    }
  };

  // 获取房间列表
  const fetchRooms = async () => {
    try {
      const response = await getRooms();
      rooms.value = response.data;
    } catch (error) {
      console.error("获取房间列表失败:", error);
    }
  };

  // 初始化所有数据
  const initialize = async () => {
    await Promise.all([
      fetchDevices(),
      fetchDeviceGroups(),
      fetchScenes(),
      fetchRooms()
    ]);
  };

  // 更新单个设备状态
  const updateDeviceStatus = (deviceId: string, updates: Partial<Device>) => {
    const deviceIndex = devices.value.findIndex(d => d.id === deviceId);
    if (deviceIndex !== -1) {
      devices.value[deviceIndex] = {
        ...devices.value[deviceIndex],
        ...updates,
        lastUpdate: new Date().toISOString()
      };
    }
  };

  // 批量更新设备状态
  const batchUpdateDeviceStatus = (updates: Array<{ id: string; updates: Partial<Device> }>) => {
    updates.forEach(({ id, updates: deviceUpdates }) => {
      updateDeviceStatus(id, deviceUpdates);
    });
  };

  // 初始化WebSocket连接
  const initWebSocket = (url: string) => {
    if (wsConnection.value) {
      wsConnection.value.close();
    }

    wsConnection.value = new WebSocket(url);

    wsConnection.value.onopen = () => {
      console.log("WebSocket连接已建立");
    };

    wsConnection.value.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "device_status_update") {
          updateDeviceStatus(data.deviceId, data.updates);
        } else if (data.type === "batch_device_update") {
          batchUpdateDeviceStatus(data.updates);
        }
      } catch (error) {
        console.error("WebSocket消息解析失败:", error);
      }
    };

    wsConnection.value.onclose = () => {
      console.log("WebSocket连接已关闭");
      wsConnection.value = null;
    };

    wsConnection.value.onerror = (error) => {
      console.error("WebSocket连接错误:", error);
    };
  };

  // 关闭WebSocket连接
  const closeWebSocket = () => {
    if (wsConnection.value) {
      wsConnection.value.close();
      wsConnection.value = null;
    }
  };

  return {
    devices,
    deviceGroups,
    scenes,
    rooms,
    isLoading,
    devicesByRoom,
    devicesByType,
    
    fetchDevices,
    fetchDeviceGroups,
    fetchScenes,
    fetchRooms,
    initialize,
    updateDeviceStatus,
    batchUpdateDeviceStatus,
    initWebSocket,
    closeWebSocket
  };
});