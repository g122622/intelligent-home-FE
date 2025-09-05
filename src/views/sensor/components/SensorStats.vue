<script setup lang="ts">
import { computed } from "vue";
import { useSensorStore } from "@/store/modules/sensor";
import { ElStatistic, ElRow, ElCol, ElCard } from "element-plus";
import { Connection, Monitor, Warning, Select } from "@element-plus/icons-vue";

const sensorStore = useSensorStore();

// 统计信息
const stats = computed(() => ({
  total: sensorStore.homeSensorData?.deviceCount || 0,
  online: sensorStore.onlineSensors.length,
  offline: sensorStore.offlineSensors.length,
  active: sensorStore.homeSensorData?.devices?.filter(d => d.activeStatus === 1).length || 0
}));

// 在线率
const onlineRate = computed(() => {
  if (stats.value.total === 0) return 0;
  return Math.round((stats.value.online / stats.value.total) * 100);
});
</script>

<template>
  <ElCard class="stats-card" shadow="hover">
    <ElRow :gutter="20">
      <!-- 总设备数 -->
      <ElCol :xs="12" :sm="6">
        <ElStatistic title="总传感器数" :value="stats.total" :precision="0" value-class="statistic-value">
          <template #prefix>
            <Monitor class="statistic-icon" />
          </template>
        </ElStatistic>
      </ElCol>

      <!-- 在线设备 -->
      <ElCol :xs="12" :sm="6">
        <ElStatistic title="在线传感器" :value="stats.online" :precision="0" value-class="statistic-value online">
          <template #prefix>
            <Connection class="statistic-icon" />
          </template>
        </ElStatistic>
      </ElCol>

      <!-- 离线设备 -->
      <ElCol :xs="12" :sm="6">
        <ElStatistic title="离线传感器" :value="stats.offline" :precision="0" value-class="statistic-value offline">
          <template #prefix>
            <Warning class="statistic-icon" />
          </template>
        </ElStatistic>
      </ElCol>

      <!-- 在线率 -->
      <ElCol :xs="12" :sm="6">
        <ElStatistic title="在线率" :value="onlineRate" :precision="0" suffix="%" value-class="statistic-value rate">
          <template #prefix>
            <Select class="statistic-icon" />
          </template>
        </ElStatistic>
      </ElCol>
    </ElRow>
  </ElCard>
</template>

<style scoped lang="scss">
.stats-card {
  margin-bottom: 24px;
  border-radius: 12px;
  border: none;

  :deep(.el-card__body) {
    padding: 24px;
  }
}

.statistic-value {
  font-size: 28px;
  font-weight: 600;

  &.online {
    color: #67c23a;
  }

  &.offline {
    color: #f56c6c;
  }

  &.rate {
    color: #409eff;
  }
}

.statistic-icon {
  width: 20px;
  height: 20px;
  margin-right: 8px;
  color: inherit;
}

:deep(.el-statistic__content) {
  display: flex;
  align-items: center;
}

:deep(.el-statistic__head) {
  margin-bottom: 8px;
  font-size: 14px;
  color: #606266;
  font-weight: 500;
}

@media (max-width: 768px) {
  .stats-card {
    :deep(.el-card__body) {
      padding: 16px;
    }
  }

  .statistic-value {
    font-size: 24px;
  }
}
</style>