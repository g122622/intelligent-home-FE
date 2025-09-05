<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useSensorStore } from "@/store/modules/sensor";
import { ElMessage, ElButton, ElCard, ElTag, ElTable, ElTableColumn, ElPagination, ElEmpty } from "element-plus";
import { ArrowLeft, Refresh, Download } from "@element-plus/icons-vue";
import SensorDataChart from "./components/SensorDataChart.vue";

const route = useRoute();
const router = useRouter();
const sensorStore = useSensorStore();
const loading = ref(false);
const currentPage = ref(1);
const pageSize = ref(10);
const deviceId = computed(() => Number(route.params.id));

// 获取历史数据
const historyData = computed(() => {
  return sensorStore.getDeviceHistoryData(deviceId.value);
});

const deviceInfo = computed(() => {
  return sensorStore.homeSensorData?.devices.find(d => d.id === deviceId.value);
});

// 分页数据
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return historyData.value.slice(start, end);
});

// 总页数
const totalPages = computed(() => {
  return Math.ceil(historyData.value.length / pageSize.value);
});

// 加载数据
const loadData = async () => {
  if (!deviceInfo.value) return;

  loading.value = true;
  try {
    await sensorStore.fetchSensorDataHistory(deviceId.value, 100);
  } catch (error) {
    ElMessage.error("加载历史数据失败");
    console.error("加载失败:", error);
  } finally {
    loading.value = false;
  }
};

// 导出数据
const exportData = () => {
  const csvContent = [
    ['时间', '数据值', '主题'],
    ...historyData.value.map(item => [
      new Date(item.dataTime).toLocaleString(),
      item.dataValue,
      item.topic || '无'
    ])
  ].map(row => row.join(',')).join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `sensor_${deviceId.value}_history.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
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
  }
});
</script>

<template>
  <div class="sensor-history-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <ElButton :icon="ArrowLeft" type="default" @click="goBack">
          返回列表
        </ElButton>
        <h1 class="page-title">历史数据</h1>
        <p class="page-subtitle">设备ID: {{ deviceId }} - 共 {{ historyData.length }} 条记录</p>
      </div>
      <div class="header-right">
        <ElButton :icon="Refresh" :loading="loading" @click="loadData">
          刷新数据
        </ElButton>
        <ElButton :icon="Download" type="primary" @click="exportData" :disabled="historyData.length === 0">
          导出CSV
        </ElButton>
        <ElButton @click="goToDetail">
          查看详情
        </ElButton>
      </div>
    </div>

    <div v-if="deviceInfo" class="history-content">
      <!-- 数据图表 -->
      <ElCard class="chart-card" shadow="hover">
        <template #header>
          <h3>数据趋势图</h3>
        </template>

        <SensorDataChart v-if="historyData.length > 0" :deviceId="deviceId" height="350px" />
        <ElEmpty v-else description="暂无数据" />
      </ElCard>

      <!-- 数据表格 -->
      <ElCard class="table-card" shadow="hover">
        <template #header>
          <h3>历史数据记录</h3>
        </template>

        <div v-if="historyData.length > 0" class="table-container">
          <ElTable :data="paginatedData" stripe style="width: 100%" :loading="loading">
            <ElTableColumn prop="dataTime" label="时间" width="180">
              <template #default="{ row }">
                {{ new Date(row.dataTime).toLocaleString() }}
              </template>
            </ElTableColumn>

            <ElTableColumn prop="dataValue" label="数据值" width="120">
              <template #default="{ row }">
                <span class="data-value">{{ row.dataValue }}</span>
              </template>
            </ElTableColumn>

            <ElTableColumn prop="topic" label="数据主题" width="150">
              <template #default="{ row }">
                <ElTag v-if="row.topic" type="info" size="small">
                  {{ row.topic }}
                </ElTag>
                <span v-else class="no-topic">无</span>
              </template>
            </ElTableColumn>

            <ElTableColumn label="数据质量" width="120">
              <template #default="{ row }">
                <ElTag v-if="row.dataValue !== null && row.dataValue !== undefined" :type="row.dataValue < 0 || row.dataValue > 100 ? 'danger' :
                    row.dataValue >= 80 || row.dataValue <= 20 ? 'warning' : 'success'
                  " size="small">
                  {{
                    row.dataValue < 0 || row.dataValue > 100 ? '异常' :
                      row.dataValue >= 80 ? '偏高' :
                        row.dataValue <= 20 ? '偏低' : '正常' }} </ElTag>
                      <span v-else>-</span>
              </template>
            </ElTableColumn>

            <ElTableColumn prop="id" label="记录ID" width="100" />
          </ElTable>

          <!-- 分页控件 -->
          <div class="pagination-container">
            <ElPagination v-model:current-page="currentPage" v-model:page-size="pageSize"
              :page-sizes="[10, 20, 50, 100]" :total="historyData.length"
              layout="total, sizes, prev, pager, next, jumper" background />
          </div>
        </div>

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
.sensor-history-container {
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

.history-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;

  .chart-card,
  .table-card {
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
}

.table-container {
  .data-value {
    font-weight: 600;
    color: #409eff;
  }

  .no-topic {
    color: #909399;
    font-style: italic;
  }

  .pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
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

  .pagination-container {
    justify-content: center !important;
  }
}
</style>