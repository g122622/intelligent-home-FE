<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useSensorStore } from "@/store/modules/sensor";
import { ElMessage, ElButton, ElCard, ElTag, ElStatistic, ElEmpty, ElProgress } from "element-plus";
import { ArrowLeft, Refresh, Pause, Play } from "@element-plus/icons-vue";
import SensorDataChart from "./components/SensorDataChart.vue";

const route = useRoute();
const router = useRouter();
const sensorStore = useSensorStore();
const loading = ref(false);
const isPolling = ref(true);
const deviceId = computed(() => Number(route.params.id));

// 获取实时数据
const realtimeData = computed(() => {
  return sensorStore.getDeviceRealtimeData(deviceId.value);
});

const deviceInfo = computed(() => {
  return sensorStore.homeSensorData?.devices.find(d => d.id === deviceId.value);
});

// 开始轮询
const startPolling = () => {
  if (!deviceInfo.value) return;

  sensorStore.startRealtimePolling(deviceId.value, 3000);
  isPolling.value = true;
};

// 停止轮询
const stopPolling = () => {
  sensorStore.stopRealtimePolling(deviceId.value);
  isPolling.value = false;
};

// 切换轮询状态
const togglePolling = () => {
  if (isPolling.value) {
    stopPolling();
  } else {
    startPolling();
  }
};

// 加载数据
const loadData = async () => {
  if (!deviceInfo.value) return;

  loading.value = true;
  try {
    await Promise.all([
      sensorStore.fetchLatestSensorData(deviceId.value),
      sensorStore.fetchSensorDataHistory(deviceId.value, 50)
    ]);
  } catch (error) {
    ElMessage.error("加载传感器数据失败");
    console.error("加载失败:", error);
  } finally {
    loading.value = false;
  }
};

// 返回详情
const goToDetail = () => {
  router.push({
    name: "SensorDetail",
    params: { id: deviceId.value }
  });
};

// 返回列表
const goBack = () => {
  router.push({ name: "SensorOverview" });
};

onMounted(() => {
  if (deviceInfo.value) {
    loadData();
    startPolling();
  }
});

onUnmounted(() => {
  stopPolling();
});
</script>

<template>
  <div class="sensor-realtime-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <ElButton :icon="ArrowLeft" type="default" @click="goBack">
          返回列表
        </ElButton>
        <h1 class="page-title">实时监控</h1>
        <p class="page-subtitle">设备ID: {{ deviceId }}</p>
      </div>
      <div class="header-right">
        <ElButton :icon="Refresh" :loading="loading" @click="loadData">
          手动刷新
        </ElButton>
        <ElButton :icon="isPolling ? Pause : Play" :type="isPolling ? 'warning' : 'success'" @click="togglePolling">
          {{ isPolling ? '暂停轮询' : '开始轮询' }}
        </ElButton>
        <ElButton @click="goToDetail">
          查看详情
        </ElButton>
      </div>
    </div>

    <div v-if="deviceInfo" class="realtime-content">
      <!-- 设备状态信息 -->
      <ElCard class="status-card" shadow="hover">
        <template #header>
          <div class="card-header">
            <h3>设备状态</h3>
            <ElTag :type="deviceInfo.onlineStatus === 1 ? 'success' : 'danger'" effect="light">
              {{ deviceInfo.onlineStatus === 1 ? '在线' : '离线' }}
            </ElTag>
          </div>
        </template>

        <div class="status-info">
          <div class="info-item">
            <span class="label">设备名称:</span>
            <span class="value">{{ deviceInfo.name }}</span>
          </div>
          <div class="info-item">
            <span class="label">轮询状态:</span>
            <span class="value">
              <ElTag :type="isPolling ? 'success' : 'warning'">
                {{ isPolling ? '运行中' : '已暂停' }}
              </ElTag>
            </span>
          </div>
          <div class="info-item">
            <span class="label">最后活跃:</span>
            <span class="value">
              {{ deviceInfo.lastActiveTime ? new Date(deviceInfo.lastActiveTime).toLocaleString() : '无记录' }}
            </span>
          </div>
        </div>
      </ElCard>

      <!-- 实时数据展示 -->
      <ElCard class="data-card" shadow="hover">
        <template #header>
          <h3>实时数据</h3>
        </template>

        <div v-if="realtimeData?.hasData" class="realtime-data">
          <div class="data-statistic">
            <ElStatistic title="当前数值" :value="realtimeData.sensorData.dataValue" :precision="2"
              value-class="data-value">
              <template #prefix>
                <span class="unit">值: </span>
              </template>
              <template #suffix>
                <span class="unit">单位</span>
              </template>
            </ElStatistic>
          </div>

          <div class="data-meta">
            <div class="meta-item">
              <span class="label">更新时间:</span>
              <span class="value">
                {{ new Date(realtimeData.timestamp).toLocaleString() }}
              </span>
            </div>
            <div class="meta-item" v-if="realtimeData.sensorData.topic">
              <span class="label">数据主题:</span>
              <span class="value">{{ realtimeData.sensorData.topic }}</span>
            </div>
            <div class="meta-item">
              <span class="label">数据新鲜度:</span>
              <span class="value">
                {{ Math.floor((Date.now() - new Date(realtimeData.timestamp).getTime()) / 1000) }}秒前
              </span>
            </div>
          </div>
        </div>

        <ElEmpty v-else description="暂无实时数据" />
      </ElCard>

      <!-- 实时数据图表 -->
      <ElCard class="chart-card" shadow="hover">
        <template #header>
          <h3>实时趋势</h3>
        </template>

        <SensorDataChart v-if="sensorStore.getDeviceHistoryData(deviceId).length > 0" :deviceId="deviceId"
          height="300px" />
        <ElEmpty v-else description="暂无历史数据" />
      </ElCard>
    </div>

    <div v-else class="not-found">
      <ElEmpty description="设备未找到">
        <ElButton type="primary" @click="goBack">
          返回列表
        </ElButton>
      </ElEmpty>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-overlay">
      <ElProgress type="circle" :percentage="50" :width="60" :show-text="false" indeterminate />
    </div>
  </div>
</template>

<style scoped lang="scss">
.sensor-realtime-container {
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
    gap: 12px;
  }
}

.realtime-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;

  .status-card,
  .data-card,
  .chart-card {
    border-radius: 12px;
    border: none;

    :deep(.el-card__header) {
      padding: 20px;
      border-bottom: 1px solid #f0f2f5;

      h3 {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
        color: #1f2937;
      }
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
}

.status-info {
  .info-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    padding: 8px 0;
    border-bottom: 1px solid #f0f2f5;

    &:last-child {
      margin-bottom: 0;
      border-bottom: none;
    }

    .label {
      font-weight: 500;
      color: #606266;
    }

    .value {
      color: #1f2937;
    }
  }
}

.realtime-data {
  .data-statistic {
    text-align: center;
    margin-bottom: 24px;

    :deep(.el-statistic__content) {
      justify-content: center;
    }

    .data-value {
      font-size: 48px;
      font-weight: 700;
      color: #409eff;
    }

    .unit {
      font-size: 18px;
      color: #606266;
    }
  }

  .data-meta {
    .meta-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
      padding: 8px 0;

      .label {
        font-weight: 500;
        color: #606266;
      }

      .value {
        color: #1f2937;
      }
    }
  }
}

.not-found {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
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
      flex-wrap: wrap;
      justify-content: center;
    }
  }

  .status-info .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
}
</style>