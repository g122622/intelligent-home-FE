<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useDeviceStore } from "@/store/modules/device";
import { updateDevice, getWebSocketUrl } from "@/api/device";
import DeviceCard from "./components/DeviceCard.vue";
import RoomFilter from "./components/RoomFilter.vue";
import TypeFilter from "./components/TypeFilter.vue";

const deviceStore = useDeviceStore();
const selectedRoom = ref<string>("all");
const selectedType = ref<string>("all");
const searchKeyword = ref("");

// 过滤后的设备列表
const filteredDevices = computed(() => {
  return deviceStore.devices.filter(device => {
    const roomMatch = selectedRoom.value === "all" || device.room === selectedRoom.value;
    const typeMatch = selectedType.value === "all" || device.type === selectedType.value;
    const keywordMatch = device.name.toLowerCase().includes(searchKeyword.value.toLowerCase());
    return roomMatch && typeMatch && keywordMatch;
  });
});

// 初始化WebSocket连接
const initWebSocketConnection = async () => {
  try {
    const response = await getWebSocketUrl();
    deviceStore.initWebSocket(response.data.url);
  } catch (error) {
    console.error("获取WebSocket URL失败:", error);
  }
};

// 更新设备状态
const handleDeviceUpdate = async (deviceId: string, updates: any) => {
  try {
    await updateDevice(deviceId, updates);
    deviceStore.updateDeviceStatus(deviceId, updates);
  } catch (error) {
    console.error("更新设备状态失败:", error);
  }
};

onMounted(async () => {
  await deviceStore.initialize();
  await initWebSocketConnection();
});

onUnmounted(() => {
  deviceStore.closeWebSocket();
});
</script>

<template>
  <div class="device-control-panel">
    <!-- 筛选工具栏 -->
    <div class="filter-toolbar">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索设备..."
        style="width: 300px; margin-right: 16px"
        clearable
      >
        <template #prefix>
          <el-icon><search /></el-icon>
        </template>
      </el-input>

      <RoomFilter v-model="selectedRoom" :rooms="deviceStore.rooms" />
      <TypeFilter v-model="selectedType" />
    </div>

    <!-- 设备网格 -->
    <div class="device-grid">
      <DeviceCard
        v-for="device in filteredDevices"
        :key="device.id"
        :device="device"
        @update="handleDeviceUpdate"
      />
    </div>

    <!-- 空状态 -->
    <el-empty
      v-if="filteredDevices.length === 0 && !deviceStore.isLoading"
      description="暂无设备"
    />

    <!-- 加载状态 -->
    <div v-if="deviceStore.isLoading" class="loading-container">
      <el-skeleton :rows="6" animated />
    </div>
  </div>
</template>

<style scoped>
.device-control-panel {
  padding: 20px;
}

.filter-toolbar {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  align-items: center;
  flex-wrap: wrap;
}

.device-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.loading-container {
  padding: 40px 0;
}

@media (max-width: 768px) {
  .filter-toolbar {
    flex-direction: column;
    align-items: stretch;
  }
  
  .device-grid {
    grid-template-columns: 1fr;
  }
}
</style>