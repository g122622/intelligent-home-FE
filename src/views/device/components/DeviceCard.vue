<script setup lang="ts">
import { computed } from "vue";
import type { DeviceDetail } from "@/api/device";
import { ElTag, ElMessage } from "element-plus";
import { Edit, Delete, Connection, More, View } from "@element-plus/icons-vue";
import lightPic from "@/assets/devices/light.webp";
import sensorPic from "@/assets/devices/sensor.png";
import cameraPic from "@/assets/devices/camera.png";
import acPic from "@/assets/devices/ac.webp";
import doorPic from "@/assets/devices/door.png";
import socketPic from "@/assets/devices/socket.webp";

interface Props {
  device: DeviceDetail;
}

interface Emits {
  (e: "edit", device: DeviceDetail): void;
  (e: "delete", device: DeviceDetail): void;
  (e: "activate", device: DeviceDetail): void;
  (e: "view", device: DeviceDetail): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// 设备状态标签
const statusTag = computed(() => {
  if (props.device.onlineStatus === 0) {
    return { type: "danger" as const, text: "离线" };
  } else if (props.device.activeStatus === 0) {
    return { type: "warning" as const, text: "未激活" };
  } else {
    return { type: "success" as const, text: "在线" };
  }
});

// 设备类型图标映射 TODO 找到更符合实物的图标
const deviceIcons = {
  1: lightPic, // 智能灯泡
  2: socketPic, // 智能插座
  3: sensorPic, // 传感器
  4: doorPic, // 智能锁
  5: cameraPic, // 摄像头
  6: acPic // 温控器
};

// 获取设备图标
const getDeviceIcon = (typeId: number) => {
  return deviceIcons[typeId as keyof typeof deviceIcons] || "ep/question";
};

// 格式化最后活跃时间
const formatLastActiveTime = (time: string) => {
  return new Date(time).toLocaleString("zh-CN");
};

// 处理设备操作
const handleView = () => {
  emit("view", props.device);
};

const handleEdit = () => {
  emit("edit", props.device);
};

const handleDelete = () => {
  emit("delete", props.device);
};

const handleActivate = () => {
  emit("activate", props.device);
};

const handleQuickAction = () => {
  ElMessage.info("快速操作功能开发中");
};
</script>

<template>
  <el-card class="device-card" shadow="hover">
    <!-- 卡片头部 -->
    <template #header>
      <div class="card-header">
        <div class="device-info">
          <el-icon class="device-icon">
            <!-- TODO 图标 -->
            <img :src="getDeviceIcon(device.typeId)" style="max-width: 50px" />
          </el-icon>
          <div class="device-title">
            <h3 class="device-name">{{ device.name }}</h3>
            <p class="device-ip">{{ device.ipAddress }}</p>
          </div>
        </div>
        <el-tag :type="statusTag.type" size="small">
          {{ statusTag.text }}
        </el-tag>
      </div>
    </template>

    <!-- 设备详情 -->
    <div class="device-details">
      <div class="detail-item">
        <span class="label">设备ID:</span>
        <span class="value">{{ device.id }}</span>
      </div>
      <div class="detail-item">
        <span class="label">房间ID:</span>
        <span class="value">{{ device.roomId }}</span>
      </div>
      <div class="detail-item">
        <span class="label">类型ID:</span>
        <span class="value">{{ device.typeId }}</span>
      </div>
      <div class="detail-item">
        <span class="label">最后活跃:</span>
        <span class="value">{{
          formatLastActiveTime(device.lastActiveTime)
        }}</span>
      </div>
    </div>

    <!-- 操作按钮 -->
    <template #footer>
      <div class="card-footer">
        <div class="footer-actions">
          <el-button size="small" :icon="View" @click="handleView">
            详情
          </el-button>
          <el-button size="small" :icon="Edit" @click="handleEdit">
            编辑
          </el-button>

          <el-button
            v-if="device.onlineStatus === 1 && device.activeStatus === 0"
            size="small"
            type="primary"
            :icon="Connection"
            @click="handleActivate"
          >
            激活
          </el-button>

          <el-button size="small" :icon="More" @click="handleQuickAction">
            操作
          </el-button>

          <el-button
            size="small"
            type="danger"
            :icon="Delete"
            @click="handleDelete"
          >
            删除
          </el-button>
        </div>
      </div>
    </template>
  </el-card>
</template>

<style lang="scss" scoped>
.device-card {
  height: 100%;
  background: var(--gradient-card-light);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  border: 1px solid rgb(0 0 0 / 0.05);
  transition: all var(--duration-normal) var(--ease-out);

  &:hover {
    background: var(--gradient-card-hover);
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);
  }

  :deep(.el-card__header) {
    padding: var(--space-md) var(--space-lg);
    border-bottom: 1px solid rgb(0 0 0 / 0.08);
    background: var(--gradient-card-subtle);
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  }

  :deep(.el-card__body) {
    padding: var(--space-lg);
  }

  :deep(.el-card__footer) {
    padding: var(--space-md) var(--space-lg);
    border-top: 1px solid rgb(0 0 0 / 0.08);
    background: var(--gradient-card-subtle);
    border-radius: 0 0 var(--radius-lg) var(--radius-lg);
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;

  .device-info {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
    min-width: 0;

    .device-icon {
      font-size: 24px;
      color: var(--el-color-primary);
      flex-shrink: 0;
    }

    .device-title {
      min-width: 0;
      flex: 1;

      .device-name {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
        color: var(--el-text-color-primary);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .device-ip {
        margin: 2px 0 0;
        font-size: 12px;
        color: var(--el-text-color-secondary);
      }
    }
  }
}

.device-details {
  display: flex;
  flex-direction: column;
  gap: 8px;

  .detail-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px 0;

    .label {
      font-size: 12px;
      color: var(--el-text-color-secondary);
      font-weight: 500;
    }

    .value {
      font-size: 12px;
      color: var(--el-text-color-primary);
      font-weight: 600;
    }
  }
}

.card-footer {
  .footer-actions {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
    flex-wrap: wrap;

    .el-button {
      flex: 1;
      min-width: 60px;
    }
  }
}

// 响应式设计
@media (max-width: 480px) {
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;

    .device-info {
      width: 100%;
    }
  }

  .footer-actions {
    flex-direction: column;

    .el-button {
      width: 100%;
    }
  }
}

// 暗色模式适配
:deep() {
  .device-card {
    background: linear-gradient(
      135deg,
      var(--el-bg-color),
      var(--el-fill-color-light)
    );

    .el-card__header,
    .el-card__footer {
      background: var(--el-fill-color-lighter);
    }
  }
}

// 动画效果
.device-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateY(-4px) scale(1.02);
  }
}
</style>
