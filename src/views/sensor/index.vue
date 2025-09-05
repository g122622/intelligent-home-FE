<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted, watch } from "vue";
import { useSensorStore } from "@/store/modules/sensor";
import { useDeviceStore } from "@/store/modules/device";
import { ElMessage, ElMessageBox } from "element-plus";
import SensorCard from "./components/SensorCard.vue";
import SensorStats from "./components/SensorStats.vue";
import SensorFilter from "./components/SensorFilter.vue";
import {
  Search,
  Refresh,
  Monitor,
  Connection,
  Warning
} from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import type { DeviceInfo } from "@/api/sensor";

const router = useRouter();
const sensorStore = useSensorStore();
const deviceStore = useDeviceStore();
const searchKeyword = ref("");
const selectedRoom = ref<number | "all">("all");
const selectedType = ref<number | "all">("all");
const onlineStatus = ref<number | "all">("all");
const loading = ref(false);
const autoRefresh = ref(true);
const refreshInterval = ref<NodeJS.Timeout | null>(null);

// 过滤后的传感器设备列表
const filteredSensors = computed(() => {
  return sensorStore.homeSensorData?.devices?.filter(device => {
    const nameMatch = device.name
      .toLowerCase()
      .includes(searchKeyword.value.toLowerCase());
    const roomMatch =
      selectedRoom.value === "all" || device.roomId === selectedRoom.value;
    const typeMatch =
      selectedType.value === "all" || device.typeId === selectedType.value;
    const statusMatch =
      onlineStatus.value === "all" ||
      device.onlineStatus === onlineStatus.value;

    return nameMatch && roomMatch && typeMatch && statusMatch;
  }) || [];
});

// 初始化数据
const initializeData = async () => {
  loading.value = true;
  try {
    await Promise.all([
      sensorStore.initialize(),
      deviceStore.fetchDeviceTypes()
    ]);
  } catch (error) {
    ElMessage.error("初始化传感器数据失败");
    console.error("初始化失败:", error);
  } finally {
    loading.value = false;
  }
};

// 刷新数据
const refreshData = async () => {
  try {
    await sensorStore.fetchHomeAllSensorData();
    ElMessage.success("数据刷新成功");
  } catch (error) {
    ElMessage.error("刷新数据失败");
    console.error("刷新失败:", error);
  }
};

// 查看传感器详情
const viewSensorDetail = (device: DeviceInfo) => {
  router.push({
    name: "SensorDetail",
    params: { id: device.id }
  });
};

// 查看实时数据
const viewRealtimeData = (device: DeviceInfo) => {
  router.push({
    name: "SensorRealtime",
    params: { id: device.id }
  });
};

// 查看历史数据
const viewHistoryData = (device: DeviceInfo) => {
  router.push({
    name: "SensorHistory",
    params: { id: device.id }
  });
};

// 设置自动刷新
const setupAutoRefresh = () => {
  if (autoRefresh.value) {
    refreshInterval.value = setInterval(() => {
      refreshData();
    }, 30000); // 30秒自动刷新
  } else if (refreshInterval.value) {
    clearInterval(refreshInterval.value);
    refreshInterval.value = null;
  }
};

onMounted(() => {
  initializeData();
  setupAutoRefresh();
});

onUnmounted(() => {
  if (refreshInterval.value) {
    clearInterval(refreshInterval.value);
  }
  sensorStore.cleanup();
});

// 监听自动刷新开关
watch(autoRefresh, setupAutoRefresh);
</script>

<template>
  <div class="sensor-overview-container">
    <!-- 页面标题和操作区 -->
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">传感器监控</h1>
        <p class="page-subtitle">实时监控和管理所有传感器设备</p>
      </div>
      <div class="header-right">
        <el-button type="primary" :icon="Refresh" :loading="loading" @click="refreshData">
          刷新数据
        </el-button>
        <el-switch v-model="autoRefresh" active-text="自动刷新" inactive-text="手动刷新" style="margin-left: 12px" />
      </div>
    </div>

    <!-- 统计信息卡片 -->
    <SensorStats />

    <!-- 过滤条件 -->
    <SensorFilter v-model:searchKeyword="searchKeyword" v-model:selectedRoom="selectedRoom"
      v-model:selectedType="selectedType" v-model:onlineStatus="onlineStatus" :loading="loading" />

    <!-- 传感器设备网格 -->
    <div class="sensor-grid">
      <template v-if="filteredSensors.length > 0">
        <SensorCard v-for="device in filteredSensors" :key="device.id" :device="device" @view-detail="viewSensorDetail"
          @view-realtime="viewRealtimeData" @view-history="viewHistoryData" />
      </template>
      <template v-else>
        <div class="empty-state">
          <el-empty description="暂无传感器设备">
            <el-button type="primary" @click="refreshData">
              刷新设备列表
            </el-button>
          </el-empty>
        </div>
      </template>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-overlay">
      <el-skeleton :rows="6" animated />
    </div>
  </div>
</template>

<style scoped lang="scss">
.sensor-overview-container {
  padding: 20px;
  min-height: calc(100vh - 84px);
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 24px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  .header-left {
    .page-title {
      margin: 0;
      font-size: 28px;
      font-weight: 600;
      color: #1f2937;
    }

    .page-subtitle {
      margin: 8px 0 0;
      color: #6b7280;
      font-size: 14px;
    }
  }

  .header-right {
    display: flex;
    align-items: center;
  }
}

.sensor-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
  margin-top: 24px;
}

.empty-state {
  grid-column: 1 / -1;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 16px;
    text-align: center;

    .header-right {
      justify-content: center;
    }
  }

  .sensor-grid {
    grid-template-columns: 1fr;
  }
}
</style>