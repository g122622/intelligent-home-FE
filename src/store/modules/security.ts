import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { SecuritySensorStatus, AlarmRecord } from "@/api/device";
import {
  getSecuritySensorStatus,
  getAlarmRecords,
  confirmAlarm,
  ignoreAlarm
} from "@/api/device";

export const useSecurityStore = defineStore("security", () => {
  // 安防状态
  const sensors = ref<SecuritySensorStatus[]>([]);
  const alarmRecords = ref<AlarmRecord[]>([]);
  const isLoading = ref(false);
  const hasAlarm = ref(false);

  // 计算属性 - 添加安全检查
  const abnormalSensors = computed(() => {
    return Array.isArray(sensors.value)
      ? sensors.value.filter(sensor => sensor?.status === "abnormal")
      : [];
  });

  const pendingAlarms = computed(() => {
    return Array.isArray(alarmRecords.value)
      ? alarmRecords.value.filter(alarm => alarm?.status === "pending")
      : [];
  });

  // 获取安防传感器状态
  const fetchSecuritySensors = async (homeId: number = 1) => {
    try {
      const response = await getSecuritySensorStatus(homeId);
      // 确保response是数组
      sensors.value = Array.isArray(response) ? response : [];

      // 检查是否有异常传感器
      hasAlarm.value = sensors.value.some(
        sensor => sensor.status === "abnormal"
      );
    } catch (error) {
      console.error("获取安防传感器状态失败:", error);
      // 开发阶段提供假数据
      sensors.value = [
        {
          id: 1,
          name: "厨房火焰传感器",
          type: "flame",
          status: "normal",
          value: 0.2,
          threshold: 1.0,
          lastUpdate: new Date().toISOString()
        },
        {
          id: 2,
          name: "厨房燃气传感器",
          type: "gas",
          status: "normal",
          value: 50,
          threshold: 1000,
          lastUpdate: new Date().toISOString()
        }
      ];
      hasAlarm.value = false;
    }
  };

  // 获取报警记录
  const fetchAlarmRecords = async (
    homeId: number = 1,
    params?: {
      startTime?: string;
      endTime?: string;
      alarmType?: string;
      status?: string;
    }
  ) => {
    isLoading.value = true;
    try {
      const response = await getAlarmRecords(homeId, params);
      // 确保response是数组
      alarmRecords.value = Array.isArray(response) ? response : [];
    } catch (error) {
      console.error("获取报警记录失败:", error);
      // 开发阶段提供假数据
      alarmRecords.value = [
        {
          id: 1,
          deviceId: 1,
          deviceName: "厨房火焰传感器",
          alarmType: "flame",
          alarmTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          status: "confirmed",
          description: "检测到火焰异常"
        },
        {
          id: 2,
          deviceId: 2,
          deviceName: "厨房燃气传感器",
          alarmType: "gas",
          alarmTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          status: "ignored",
          description: "检测到燃气浓度异常"
        }
      ];
    } finally {
      isLoading.value = false;
    }
  };

  // 确认报警
  const confirmAlarmRecord = async (homeId: number = 1, alarmId: number) => {
    try {
      await confirmAlarm(homeId, alarmId);
      // 更新本地状态
      const alarm = alarmRecords.value.find(a => a.id === alarmId);
      if (alarm) {
        alarm.status = "confirmed";
      }
    } catch (error) {
      console.error("确认报警失败:", error);
      throw error;
    }
  };

  // 忽略报警
  const ignoreAlarmRecord = async (homeId: number = 1, alarmId: number) => {
    try {
      await ignoreAlarm(homeId, alarmId);
      // 更新本地状态
      const alarm = alarmRecords.value.find(a => a.id === alarmId);
      if (alarm) {
        alarm.status = "ignored";
      }
    } catch (error) {
      console.error("忽略报警失败:", error);
      throw error;
    }
  };

  // 初始化数据
  const initialize = async (homeId: number = 1) => {
    await Promise.all([
      fetchSecuritySensors(homeId),
      fetchAlarmRecords(homeId)
    ]);
  };

  // 模拟WebSocket报警推送
  const simulateAlarmPush = (alarmData: Partial<AlarmRecord>) => {
    const newAlarm: AlarmRecord = {
      id: Date.now(),
      deviceId: alarmData.deviceId || 1,
      deviceName: alarmData.deviceName || "未知设备",
      alarmType: alarmData.alarmType || "unknown",
      alarmTime: new Date().toISOString(),
      status: "pending",
      description: alarmData.description || "检测到异常"
    };

    alarmRecords.value.unshift(newAlarm);
    hasAlarm.value = true;

    // 触发浏览器通知
    if (Notification.permission === "granted") {
      new Notification("安全警报", {
        body: `${newAlarm.deviceName}: ${newAlarm.description}`,
        icon: "/favicon.ico"
      });
    }
  };

  return {
    sensors,
    alarmRecords,
    isLoading,
    hasAlarm,
    abnormalSensors,
    pendingAlarms,

    fetchSecuritySensors,
    fetchAlarmRecords,
    confirmAlarmRecord,
    ignoreAlarmRecord,
    initialize,
    simulateAlarmPush
  };
});
