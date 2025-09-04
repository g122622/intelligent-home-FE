<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useDeviceStore } from "@/store/modules/device";
import type { DeviceDetail } from "@/api/device";
import { ElMessage, ElLoading } from "element-plus";
import DeviceOperations from "./components/DeviceOperations.vue";
import DeviceDataChart from "./components/DeviceDataChart.vue";

const route = useRoute();
const router = useRouter();
const deviceStore = useDeviceStore();
const deviceId = ref<number>(parseInt(route.params.id as string));
const device = ref<DeviceDetail | null>(null);
const loading = ref(true);
const activeTab = ref("overview");

// 获取设备详情
const fetchDeviceDetail = async () => {
  loading.value = true;
  try {
    // 从设备列表中查找设备
    await deviceStore.fetchDeviceList();
    const foundDevice = deviceStore.devices.find(d => d.id === deviceId.value);

    if (foundDevice) {
      device.value = foundDevice;
      // 获取设备数据
      await deviceStore.fetchDeviceData(foundDevice.homeId, foundDevice.id);
    } else {
      ElMessage.error("设备不存在");
      router.push("/device/management");
    }
  } catch (error) {
    ElMessage.error("获取设备详情失败");
    console.error(error);
  } finally {
    loading.value = false;
  }
};

// 设备状态标签
const statusTag = computed(() => {
  if (!device.value) return { type: "info" as const, text: "未知" };

  if (device.value.onlineStatus === 0) {
    return { type: "danger" as const, text: "离线" };
  } else if (device.value.activeStatus === 0) {
    return { type: "warning" as const, text: "未激活" };
  } else {
    return { type: "success" as const, text: "在线" };
  }
});

// 格式化时间
const formatTime = (time: string) => {
  return new Date(time).toLocaleString("zh-CN");
};

// 返回设备列表
const goBack = () => {
  router.push("/device/management");
};

onMounted(() => {
  fetchDeviceDetail();
});
</script>

<template>
  <div class="device-detail-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <el-button icon="arrow-left" @click="goBack">返回</el-button>
        <h1 class="page-title">设备详情</h1>
      </div>
      <div class="header-actions">
        <el-button icon="refresh" :loading="loading" @click="fetchDeviceDetail">
          刷新
        </el-button>
      </div>
    </div>

    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="10" animated />
    </div>

    <div v-else-if="device" class="device-content">
      <!-- 设备基本信息 -->
      <el-card class="device-info-card" shadow="never">
        <template #header>
          <div class="card-header">
            <h3>设备信息</h3>
            <el-tag :type="statusTag.type" size="large">
              {{ statusTag.text }}
            </el-tag>
          </div>
        </template>

        <div class="info-grid">
          <div class="info-item">
            <span class="label">设备名称:</span>
            <span class="value">{{ device.name }}</span>
          </div>
          <div class="info-item">
            <span class="label">设备ID:</span>
            <span class="value">{{ device.id }}</span>
          </div>
          <div class="info-item">
            <span class="label">IP地址:</span>
            <span class="value">{{ device.ipAddress }}</span>
          </div>
          <div class="info-item">
            <span class="label">家庭ID:</span>
            <span class="value">{{ device.homeId }}</span>
          </div>
          <div class="info-item">
            <span class="label">房间ID:</span>
            <span class="value">{{ device.roomId }}</span>
          </div>
          <div class="info-item">
            <span class="label">类型ID:</span>
            <span class="value">{{ device.typeId }}</span>
          </div>
          <div class="info-item">
            <span class="label">在线状态:</span>
            <span class="value">{{
              device.onlineStatus === 1 ? "在线" : "离线"
            }}</span>
          </div>
          <div class="info-item">
            <span class="label">激活状态:</span>
            <span class="value">{{
              device.activeStatus === 1 ? "已激活" : "未激活"
            }}</span>
          </div>
          <div class="info-item">
            <span class="label">最后活跃:</span>
            <span class="value">{{ formatTime(device.lastActiveTime) }}</span>
          </div>
        </div>
      </el-card>

      <!-- 标签页内容 -->
      <el-tabs v-model="activeTab" class="detail-tabs">
        <el-tab-pane label="数据监控" name="overview">
          <DeviceDataChart :device="device" />
        </el-tab-pane>

        <el-tab-pane label="设备操作" name="operations">
          <DeviceOperations />
        </el-tab-pane>

        <el-tab-pane label="操作历史" name="history">
          <div class="history-content">
            <h4>最近操作记录</h4>
            <div
              v-if="deviceStore.deviceData.length === 0"
              class="empty-history"
            >
              <el-empty description="暂无操作记录" />
            </div>
            <div v-else class="history-list">
              <div
                v-for="(data, index) in deviceStore.deviceData.slice(0, 10)"
                :key="index"
                class="history-item"
              >
                <div class="history-time">{{ formatTime(data.timestamp) }}</div>
                <div class="history-data">{{ data.data }}</div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <div v-else class="not-found">
      <el-empty description="设备不存在" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.device-detail-page {
  padding: 24px;
  min-height: 100%;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--el-border-color-light);

  .header-left {
    display: flex;
    align-items: center;
    gap: 16px;

    .page-title {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
      color: var(--el-text-color-primary);
    }
  }
}

.loading-container {
  padding: 40px 0;
}

.device-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.device-info-card {
  :deep(.el-card__header) {
    padding: 20px;
    border-bottom: 1px solid var(--el-border-color-light);
    background: var(--el-fill-color-lighter);
  }

  :deep(.el-card__body) {
    padding: 20px;
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid var(--el-border-color-lighter);

  &:last-child {
    border-bottom: none;
  }

  .label {
    font-weight: 500;
    color: var(--el-text-color-secondary);
  }

  .value {
    font-weight: 600;
    color: var(--el-text-color-primary);
  }
}

.detail-tabs {
  :deep(.el-tabs__header) {
    margin: 0;
  }

  :deep(.el-tabs__content) {
    padding: 20px 0;
  }
}

.history-content {
  h4 {
    margin: 0 0 16px;
    font-size: 16px;
    font-weight: 600;
    color: var(--el-text-color-primary);
  }
}

.empty-history {
  padding: 40px 0;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 400px;
  overflow-y: auto;
}

.history-item {
  padding: 12px 16px;
  background: var(--el-fill-color-light);
  border-radius: 8px;
  border: 1px solid var(--el-border-color-light);

  .history-time {
    font-size: 12px;
    color: var(--el-text-color-secondary);
    margin-bottom: 4px;
  }

  .history-data {
    font-size: 14px;
    color: var(--el-text-color-primary);
    font-weight: 500;
  }
}

.not-found {
  padding: 60px 0;
}

// 响应式设计
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;

    .header-left {
      justify-content: space-between;
    }
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
}

// 暗色模式适配
:deep() {
  .device-info-card {
    background: var(--el-bg-color);

    .el-card__header {
      background: var(--el-fill-color-dark);
    }
  }

  .history-item {
    background: var(--el-fill-color-darker);
    border-color: var(--el-border-color);
  }
}
</style>
