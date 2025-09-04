<script setup lang="ts">
import { computed } from "vue";
import { DeviceSummary } from "@/api/home";
import { useRouter } from "vue-router";
import { Operation } from "@element-plus/icons-vue";

const props = defineProps<{
  devices: DeviceSummary[];
}>();

const router = useRouter();

// 设备统计
const deviceStats = computed(() => ({
  total: props.devices.length,
  online: props.devices.filter(d => d.onlineStatus === 1).length,
  offline: props.devices.filter(d => d.onlineStatus === 0).length,
  active: props.devices.filter(d => d.activeStatus === 1).length,
  inactive: props.devices.filter(d => d.activeStatus === 0).length
}));

// 按类型分组的设备
const devicesByType = computed(() => {
  const grouped: { [type: string]: DeviceSummary[] } = {};
  props.devices.forEach(device => {
    if (!grouped[device.typeName]) {
      grouped[device.typeName] = [];
    }
    grouped[device.typeName].push(device);
  });
  return grouped;
});

// 状态标签类型
const statusTagType = (device: DeviceSummary) => {
  if (device.onlineStatus === 0) return "danger";
  return device.activeStatus === 1 ? "success" : "warning";
};

// 状态文本
const statusText = (device: DeviceSummary) => {
  if (device.onlineStatus === 0) return "离线";
  return device.activeStatus === 1 ? "在线" : "待机";
};

// 查看设备详情
const viewDeviceDetail = (device: DeviceSummary) => {
  router.push(`/device/detail/${device.id}`);
};
</script>

<template>
  <el-card class="device-list-card">
    <template #header>
      <div class="card-header">
        <h3 class="card-title">设备概览</h3>
        <div class="header-actions">
          <el-button type="primary" size="small" @click="$router.push('/device/management')">
            <el-icon><operation /></el-icon>
            管理设备
          </el-button>
        </div>
      </div>
    </template>

    <!-- 设备统计 -->
    <div class="device-stats">
      <el-row :gutter="16">
        <el-col :xs="12" :sm="6">
          <el-statistic title="总设备数" :value="deviceStats.total" />
        </el-col>
        <el-col :xs="12" :sm="6">
          <el-statistic title="在线设备" :value="deviceStats.online">
            <template #suffix">/{{ deviceStats.total }}</template>
          </el-statistic>
        </el-col>
        <el-col :xs="12" :sm="6">
          <el-statistic title="活跃设备" :value="deviceStats.active">
            <template #suffix">/{{ deviceStats.total }}</template>
          </el-statistic>
        </el-col>
        <el-col :xs="12" :sm="6">
          <el-statistic title="离线设备" :value="deviceStats.offline">
            <template #suffix">/{{ deviceStats.total }}</template>
          </el-statistic>
        </el-col>
      </el-row>
    </div>

    <!-- 设备列表 -->
    <div class="device-content">
      <div v-if="props.devices.length === 0" class="empty-state">
        <el-empty description="暂无设备数据" />
      </div>

      <template v-else>
        <!-- 按类型分组 -->
        <div
          v-for="(typeDevices, typeName) in devicesByType"
          :key="typeName"
          class="device-type-group"
        >
          <h4 class="type-title">{{ typeName }} ({{ typeDevices.length }})</h4>
          <el-table :data="typeDevices" size="small">
            <el-table-column label="设备名称" min-width="150">
              <template #default="{ row }">
                <span class="device-name">{{ row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="statusTagType(row)" size="small">
                  {{ statusText(row) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="80" align="right">
              <template #default="{ row }">
                <el-button
                  type="primary"
                  link
                  size="small"
                  @click="viewDeviceDetail(row)"
                >
                  详情
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </template>
    </div>
  </el-card>
</template>

<style lang="scss" scoped>
.device-list-card {
  border: none;
  border-radius: 12px;

  :deep(.el-card__header) {
    border-bottom: 1px solid var(--el-border-color-light);
    padding: 20px;

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .card-title {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
        color: var(--el-text-color-primary);
      }
    }
  }

  :deep(.el-card__body) {
    padding: 20px;
  }

  .device-stats {
    margin-bottom: 24px;
    padding: 16px;
    background: var(--el-fill-color-light);
    border-radius: 8px;
    border: 1px solid var(--el-border-color);

    :deep(.el-statistic) {
      text-align: center;

      .el-statistic__number {
        font-size: 24px;
        font-weight: 700;
        color: var(--el-color-primary);
      }

      .el-statistic__title {
        font-size: 12px;
        color: var(--el-text-color-secondary);
      }
    }
  }

  .device-content {
    .empty-state {
      padding: 40px 0;
    }

    .device-type-group {
      margin-bottom: 24px;

      &:last-child {
        margin-bottom: 0;
      }

      .type-title {
        margin: 0 0 12px 0;
        font-size: 16px;
        font-weight: 600;
        color: var(--el-text-color-primary);
        padding: 8px 12px;
        background: var(--el-fill-color-light);
        border-radius: 6px;
        border-left: 4px solid var(--el-color-primary);
      }

      :deep(.el-table) {
        border-radius: 8px;
        border: 1px solid var(--el-border-color);

        .el-table__header-wrapper,
        .el-table__body-wrapper {
          border-radius: 8px;
        }

        .device-name {
          font-weight: 500;
          color: var(--el-text-color-primary);
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .device-stats {
    .el-row {
      .el-col {
        margin-bottom: 12px;

        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }

  .card-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start !important;

    .header-actions {
      width: 100%;
      justify-content: flex-end;
    }
  }
}

@media (max-width: 480px) {
  .device-stats {
    :deep(.el-statistic) {
      .el-statistic__number {
        font-size: 20px;
      }
    }
  }

  .device-type-group {
    .type-title {
      font-size: 14px !important;
    }
  }
}
</style>