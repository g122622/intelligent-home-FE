<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useSensorStore } from "@/store/modules/sensor";
import { ElMessage, ElButton, ElCard, ElTag, ElDescriptions, ElDescriptionsItem, ElProgress, ElEmpty } from "element-plus";
import { ArrowLeft, Refresh, Monitor, History } from "@element-plus/icons-vue";
import SensorDataChart from "./components/SensorDataChart.vue";

const route = useRoute();
const router = useRouter();
const sensorStore = useSensorStore();
const loading = ref(false);
const deviceId = computed(() => Number(route.params.id));

// 获取设备数据
const deviceData = computed(() => {
  return sensorStore.getDeviceLatestData(deviceId.value);
});

const deviceInfo = computed(() => {
  return sensorStore.homeSensorData?.devices.find(d => d.id === deviceId.value);
});

// 加载数据
const loadData = async () => {
  if (!deviceInfo.value) return;

  loading.value = true;
  try {
    await Promise.all([
      sensorStore.fetchLatestSensorData(deviceId.value),
      sensorStore.fetchSensorDataHistory(deviceId.value, 20)
    ]);
  } catch (error) {
    ElMessage.error("加载传感器数据失败");
    console.error("加载失败:", error);
  } finally {
    loading.value = false;
  }
};

// 查看实时数据
const viewRealtime = () => {
  router.push({
    name: "SensorRealtime",
    params: { id: deviceId.value }
  });
};

// 查看历史数据
const viewHistory = () => {
  router.push({
    name: "SensorHistory",
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
  }
});
</script>

<template>
  <div class="sensor-detail-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <ElButton :icon="ArrowLeft" type="default" @click="goBack">
          返回列表
        </ElButton>
        <h1 class="page-title">传感器详情</h1>
      </div>
      <div class="header-right">
        <ElButton :icon="Refresh" :loading="loading" @click="loadData">
          刷新数据
        </ElButton>
        <ElButton v-if="deviceInfo?.onlineStatus === 1" :icon="Monitor" type="primary" @click="viewRealtime">
          实时监控
        </ElButton>
        <ElButton v-if="deviceInfo?.onlineStatus === 1" :icon="History" @click="viewHistory">
          历史数据
        </ElButton>
      </div>
    </div>

    <div v-if="deviceInfo" class="detail-content">
      <!-- 设备基本信息 -->
      <ElCard class="info-card" shadow="hover">
        <template #header>
          <div class="card-header">
            <h3>设备信息</h3>
            <ElTag :type="deviceInfo.onlineStatus === 1 ? 'success' : 'danger'" effect="light">
              {{ deviceInfo.onlineStatus === 1 ? '在线' : '离线' }}
            </ElTag>
          </div>
        </template>

        <ElDescriptions :column="2" border>
          <ElDescriptionsItem label="设备名称">
            {{ deviceInfo.name }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="设备ID">
            {{ deviceInfo.id }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="房间ID">
            房间 {{ deviceInfo.roomId }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="家庭ID">
            {{ deviceInfo.homeId }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="IP地址">
            {{ deviceInfo.ipAddress || '未配置' }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="最后活跃时间">
            {{ deviceInfo.lastActiveTime ? new Date(deviceInfo.lastActiveTime).toLocaleString() : '无记录' }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="激活状态">
            <ElTag :type="deviceInfo.activeStatus === 1 ? 'success' : 'warning'">
              {{ deviceInfo.activeStatus === 1 ? '已激活' : '未激活' }}
            </ElTag>
          </ElDescriptionsItem>
          <ElDescriptionsItem label="在线状态">
            <ElTag :type="deviceInfo.onlineStatus === 1 ? 'success' : 'danger'">
              {{ deviceInfo.onlineStatus === 1 ? '在线' : '离线' }}
            </ElTag>
          </ElDescriptionsItem>
        </ElDescriptions>
      </ElCard>

      <!-- 最新数据 -->
      <ElCard v-if="deviceData" class="data-card" shadow="hover">
        <template #header>
          <h3>最新传感器数据</h3>
        </template>

        <div class="data-content">
          <div v-if="deviceData.sensorData" class="current-data">
            <div class="data-value">
              <span class="value">{{ deviceData.sensorData.dataValue }}</span>
              <span class="unit">单位</span>
            </div>
            <div class="data-time">
              更新时间: {{ new Date(deviceData.sensorData.dataTime).toLocaleString() }}
            </div>
            <div class="data-topic" v-if="deviceData.sensorData.topic">
              数据主题: {{ deviceData.sensorData.topic }}
            </div>
          </div>
          <ElEmpty v-else description="暂无数据" />
        </div>
      </ElCard>

      <!-- 数据图表 -->
      <ElCard v-if="sensorStore.getDeviceHistoryData(deviceId.value).length > 0" class="chart-card" shadow="hover">
        <template #header>
          <h3>数据趋势</h3>
        </template>
        <SensorDataChart :deviceId="deviceId.value" />
      </ElCard>

      <ElCard v-else class="chart-card" shadow="hover">
        <template #header>
          <h3>数据趋势</h3>
        </template>
        <ElEmpty description="暂无历史数据" />
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
.sensor-detail-container {
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
    display: flex;
    align-items: center;
    gap: 16px;

    .page-title {
      margin: 0;
      font-size: 28px;
      font-weight: 600;
      color: #1f2937;
    }
  }

  .header-right {
    display: flex;
    gap: 12px;
  }
}

.detail-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;

  .info-card,
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

  .data-content {
    .current-data {
      text-align: center;
      padding: 20px;

      .data-value {
        margin-bottom: 16px;

        .value {
          font-size: 48px;
          font-weight: 700;
          color: #409eff;
          margin-right: 8px;
        }

        .unit {
          font-size: 18px;
          color: #606266;
        }
      }

      .data-time,
      .data-topic {
        font-size: 14px;
        color: #606266;
        margin-bottom: 8px;
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

    .header-left {
      flex-direction: column;
      gap: 12px;
    }

    .header-right {
      flex-wrap: wrap;
      justify-content: center;
    }
  }

  .detail-content {
    grid-template-columns: 1fr;
  }
}
</style>