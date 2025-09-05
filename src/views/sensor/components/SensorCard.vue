<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useSensorStore } from "@/store/modules/sensor";
import { ElCard, ElTag, ElButton, ElTooltip, ElProgress } from "element-plus";
import {
  View,
  Monitor,
  Clock,
  Connection,
  Warning,
  Select
} from "@element-plus/icons-vue";
import type { DeviceInfo } from "@/api/sensor";

interface Props {
  device: DeviceInfo;
}

interface Emits {
  (e: "view-detail", device: DeviceInfo): void;
  (e: "view-realtime", device: DeviceInfo): void;
  (e: "view-history", device: DeviceInfo): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const sensorStore = useSensorStore();
const loading = ref(false);
const latestData = ref<any>(null);

// 设备状态
const deviceStatus = computed(() => {
  if (props.device.onlineStatus === 0) {
    return { type: "danger" as const, text: "离线", icon: Warning };
  } else if (props.device.activeStatus === 0) {
    return { type: "warning" as const, text: "未激活", icon: Warning };
  } else {
    return { type: "success" as const, text: "在线", icon: Select };
  }
});

// 设备类型图标
const deviceTypeIcon = computed(() => {
  const typeIcons = {
    1: "ep:light", // 灯泡
    2: "ep:connection", // 插座
    3: "ep:monitor", // 传感器
    4: "ep:lock", // 门锁
    5: "ep:camera", // 摄像头
    6: "ep:thermometer" // 温控器
  };
  return typeIcons[props.device.typeId as keyof typeof typeIcons] || "ep:question";
});

// 设备类型名称
const deviceTypeName = computed(() => {
  const typeNames = {
    1: "智能灯泡",
    2: "智能插座",
    3: "传感器",
    4: "智能门锁",
    5: "摄像头",
    6: "温控器"
  };
  return typeNames[props.device.typeId as keyof typeof typeNames] || "未知设备";
});

// 获取最新数据
const fetchLatestData = async () => {
  if (props.device.onlineStatus === 0) return;

  loading.value = true;
  try {
    const data = await sensorStore.fetchLatestSensorData(props.device.id);
    latestData.value = data;
  } catch (error) {
    console.error("获取最新数据失败:", error);
  } finally {
    loading.value = false;
  }
};

// 数据值格式化
const formatDataValue = (value: number) => {
  if (value === null || value === undefined) return "无数据";

  // 根据设备类型格式化数据
  switch (props.device.typeId) {
    case 3: // 传感器 - 温度/湿度等
      return `${value}°C`;
    case 6: // 温控器
      return `${value}°C`;
    default:
      return value.toString();
  }
};

// 数据质量指示器
const dataQuality = computed(() => {
  if (!latestData.value?.sensorData?.dataValue) return null;

  const value = latestData.value.sensorData.dataValue;

  // 简单的数据质量判断（可根据实际业务调整）
  if (value < 0 || value > 100) {
    return { status: "danger", text: "数据异常" };
  } else if (value >= 80) {
    return { status: "warning", text: "数据偏高" };
  } else if (value <= 20) {
    return { status: "warning", text: "数据偏低" };
  } else {
    return { status: "success", text: "数据正常" };
  }
});

onMounted(() => {
  if (props.device.onlineStatus === 1) {
    fetchLatestData();
  }
});
</script>

<template>
  <ElCard class="sensor-card" :class="{ offline: device.onlineStatus === 0 }" shadow="hover">
    <!-- 卡片头部 -->
    <template #header>
      <div class="card-header">
        <div class="device-info">
          <div class="device-name">
            <el-icon>
              <component :is="deviceTypeIcon" />
            </el-icon>
            <span>{{ device.name }}</span>
          </div>
          <ElTag :type="deviceStatus.type" size="small" effect="light">
            <el-icon>
              <component :is="deviceStatus.icon" />
            </el-icon>
            {{ deviceStatus.text }}
          </ElTag>
        </div>
      </div>
    </template>

    <!-- 卡片内容 -->
    <div class="card-content">
      <!-- 设备基本信息 -->
      <div class="device-meta">
        <div class="meta-item">
          <span class="meta-label">类型:</span>
          <span class="meta-value">{{ deviceTypeName }}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">房间:</span>
          <span class="meta-value">房间 {{ device.roomId }}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">IP:</span>
          <span class="meta-value">{{ device.ipAddress || "未配置" }}</span>
        </div>
      </div>

      <!-- 传感器数据 -->
      <div v-if="device.onlineStatus === 1" class="sensor-data">
        <div class="data-header">
          <span class="data-title">最新数据</span>
          <ElTooltip v-if="dataQuality" :content="dataQuality.text" placement="top">
            <ElTag :type="dataQuality.status as any" size="small" effect="plain">
              {{ dataQuality.text }}
            </ElTag>
          </ElTooltip>
        </div>

        <div v-if="latestData?.sensorData" class="data-value">
          <div class="value-display">
            {{ formatDataValue(latestData.sensorData.dataValue) }}
          </div>
          <div class="data-time">
            {{ new Date(latestData.sensorData.dataTime).toLocaleString() }}
          </div>
        </div>

        <div v-else class="no-data">
          <el-empty description="暂无数据" :image-size="40" />
        </div>
      </div>

      <div v-else class="offline-message">
        <el-empty description="设备离线" :image-size="40" />
      </div>
    </div>

    <!-- 卡片底部操作 -->
    <template #footer>
      <div class="card-actions">
        <ElButton size="small" :icon="View" @click="emit('view-detail', device)">
          详情
        </ElButton>

        <ElButton v-if="device.onlineStatus === 1" size="small" :icon="Monitor" type="primary"
          @click="emit('view-realtime', device)">
          实时
        </ElButton>

        <ElButton v-if="device.onlineStatus === 1" size="small" :icon="Clock" @click="emit('view-history', device)">
          历史
        </ElButton>
      </div>
    </template>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-overlay">
      <el-progress type="circle" :percentage="50" :width="40" :show-text="false" indeterminate />
    </div>
  </ElCard>
</template>

<style scoped lang="scss">
.sensor-card {
  position: relative;
  border-radius: 12px;
  border: 1px solid #e4e7ed;
  transition: all 0.3s ease;
  overflow: hidden;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }

  &.offline {
    opacity: 0.7;
    filter: grayscale(0.3);
  }

  :deep(.el-card__header) {
    padding: 16px 20px;
    border-bottom: 1px solid #f0f2f5;
  }

  :deep(.el-card__body) {
    padding: 20px;
  }

  :deep(.el-card__footer) {
    padding: 16px 20px;
    border-top: 1px solid #f0f2f5;
  }
}

.card-header {
  .device-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;

    .device-name {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
      font-size: 16px;
      color: #1f2937;

      .el-icon {
        font-size: 18px;
        color: #409eff;
      }
    }
  }
}

.card-content {
  .device-meta {
    margin-bottom: 16px;

    .meta-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
      font-size: 13px;

      .meta-label {
        color: #606266;
        font-weight: 500;
      }

      .meta-value {
        color: #1f2937;
      }
    }
  }

  .sensor-data {
    .data-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;

      .data-title {
        font-size: 14px;
        font-weight: 600;
        color: #1f2937;
      }
    }

    .data-value {
      text-align: center;
      padding: 16px;
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
      border-radius: 8px;

      .value-display {
        font-size: 28px;
        font-weight: 700;
        color: #409eff;
        margin-bottom: 8px;
      }

      .data-time {
        font-size: 12px;
        color: #6b7280;
      }
    }

    .no-data {
      padding: 20px 0;
    }
  }

  .offline-message {
    padding: 20px 0;
    text-align: center;
  }
}

.card-actions {
  display: flex;
  gap: 8px;
  justify-content: center;

  .el-button {
    flex: 1;
  }
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
  border-radius: 12px;
}

@media (max-width: 480px) {
  .card-actions {
    flex-direction: column;
    gap: 8px;

    .el-button {
      width: 100%;
    }
  }
}
</style>