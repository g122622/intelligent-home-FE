import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type {
  SensorData,
  DeviceInfo,
  LatestSensorDataResponse,
  RealtimeSensorDataResponse,
  HistorySensorDataResponse,
  HomeAllSensorDataResponse
} from "@/api/sensor";
import {
  getLatestSensorData,
  getRealtimeSensorData,
  getSensorDataHistory,
  getHomeAllSensorData
} from "@/api/sensor";

export const useSensorStore = defineStore("sensor", () => {
  // 传感器状态
  const latestSensorData = ref<Map<number, LatestSensorDataResponse>>(new Map());
  const realtimeSensorData = ref<Map<number, RealtimeSensorDataResponse>>(new Map());
  const sensorHistory = ref<Map<number, SensorData[]>>(new Map());
  const homeSensorData = ref<HomeAllSensorDataResponse | null>(null);
  const isLoading = ref(false);
  const pollingIntervals = ref<Map<number, number>>(new Map());
  const currentHomeId = ref<number>(1); // 默认家庭ID

  // 计算属性
  const onlineSensors = computed(() => {
    const sensors: DeviceInfo[] = [];
    homeSensorData.value?.devices?.forEach(device => {
      if (device.onlineStatus === 1) {
        sensors.push(device);
      }
    });
    return sensors;
  });

  const offlineSensors = computed(() => {
    const sensors: DeviceInfo[] = [];
    homeSensorData.value?.devices?.forEach(device => {
      if (device.onlineStatus === 0) {
        sensors.push(device);
      }
    });
    return sensors;
  });

  const sensorsByRoom = computed(() => {
    const grouped: { [roomId: number]: DeviceInfo[] } = {};
    homeSensorData.value?.devices?.forEach(device => {
      if (!grouped[device.roomId]) {
        grouped[device.roomId] = [];
      }
      grouped[device.roomId].push(device);
    });
    return grouped;
  });

  const sensorsByType = computed(() => {
    const grouped: { [typeId: number]: DeviceInfo[] } = {};
    homeSensorData.value?.devices?.forEach(device => {
      if (!grouped[device.typeId]) {
        grouped[device.typeId] = [];
      }
      grouped[device.typeId].push(device);
    });
    return grouped;
  });

  // API 操作
  const fetchLatestSensorData = async (deviceId: number) => {
    try {
      const response = await getLatestSensorData(deviceId);
      latestSensorData.value.set(deviceId, response);
      return response;
    } catch (error) {
      console.error("获取最新传感器数据失败:", error);
      throw error;
    }
  };

  const fetchRealtimeSensorData = async (deviceId: number) => {
    try {
      const response = await getRealtimeSensorData(deviceId);
      realtimeSensorData.value.set(deviceId, response);
      return response;
    } catch (error) {
      console.error("获取实时传感器数据失败:", error);
      throw error;
    }
  };

  const startRealtimePolling = (deviceId: number, intervalMs: number = 5000) => {
    // 先停止现有的轮询
    stopRealtimePolling(deviceId);

    // 立即获取一次数据
    fetchRealtimeSensorData(deviceId);

    // 设置轮询间隔
    const intervalId = window.setInterval(() => {
      fetchRealtimeSensorData(deviceId);
    }, intervalMs);

    pollingIntervals.value.set(deviceId, intervalId);
  };

  const stopRealtimePolling = (deviceId: number) => {
    const intervalId = pollingIntervals.value.get(deviceId);
    if (intervalId) {
      window.clearInterval(intervalId);
      pollingIntervals.value.delete(deviceId);
    }
  };

  const fetchSensorDataHistory = async (deviceId: number, limit: number = 10) => {
    try {
      const response = await getSensorDataHistory(deviceId, limit);
      sensorHistory.value.set(deviceId, response.historyData);
      return response;
    } catch (error) {
      console.error("获取传感器历史数据失败:", error);
      throw error;
    }
  };

  const fetchHomeAllSensorData = async (homeId: number = currentHomeId.value) => {
    isLoading.value = true;
    try {
      const response = await getHomeAllSensorData(homeId);
      homeSensorData.value = response;
      return response;
    } catch (error) {
      console.error("获取家庭所有传感器数据失败:", error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  const getDeviceLatestData = (deviceId: number) => {
    return latestSensorData.value.get(deviceId);
  };

  const getDeviceRealtimeData = (deviceId: number) => {
    return realtimeSensorData.value.get(deviceId);
  };

  const getDeviceHistoryData = (deviceId: number) => {
    return sensorHistory.value.get(deviceId) || [];
  };

  // 初始化所有数据
  const initialize = async (homeId: number = currentHomeId.value) => {
    isLoading.value = true;
    try {
      await fetchHomeAllSensorData(homeId);
    } catch (error) {
      console.error("初始化传感器数据失败:", error);
    } finally {
      isLoading.value = false;
    }
  };

  // 清理所有轮询
  const cleanup = () => {
    pollingIntervals.value.forEach((intervalId, deviceId) => {
      window.clearInterval(intervalId);
    });
    pollingIntervals.value.clear();
  };

  return {
    latestSensorData,
    realtimeSensorData,
    sensorHistory,
    homeSensorData,
    isLoading,
    pollingIntervals,
    currentHomeId,

    onlineSensors,
    offlineSensors,
    sensorsByRoom,
    sensorsByType,

    fetchLatestSensorData,
    fetchRealtimeSensorData,
    startRealtimePolling,
    stopRealtimePolling,
    fetchSensorDataHistory,
    fetchHomeAllSensorData,
    getDeviceLatestData,
    getDeviceRealtimeData,
    getDeviceHistoryData,
    initialize,
    cleanup
  };
});