<script setup lang="ts">
import { computed } from "vue";
import type { Device } from "@/api/device";

const props = defineProps<{
  device: Device;
}>();

const emit = defineEmits<{
  (event: "update", deviceId: string, updates: any): void;
}>();

// 设备图标映射
const deviceIcons = {
  light: "Sunrise",
  ac: "Refrigerator",
  curtain: "Document",
  sensor: "Platform",
  switch: "SwitchButton"
};

// 设备类型名称映射
const deviceTypeNames = {
  light: "灯光",
  ac: "空调",
  curtain: "窗帘",
  sensor: "传感器",
  switch: "开关"
};

// 处理开关状态变化
const handleSwitchChange = (status: boolean) => {
  emit("update", props.device.id, { status });
};

// 处理亮度变化
const handleBrightnessChange = (brightness: number) => {
  emit("update", props.device.id, { brightness });
};

// 处理温度变化
const handleTemperatureChange = (temperature: number) => {
  emit("update", props.device.id, { temperature });
};

// 处理模式变化
const handleModeChange = (mode: string) => {
  emit("update", props.device.id, { mode });
};

// 处理风扇速度变化
const handleFanSpeedChange = (fanSpeed: number) => {
  emit("update", props.device.id, { fanSpeed });
};

// 处理窗帘位置变化
const handlePositionChange = (position: number) => {
  emit("update", props.device.id, { position });
};
</script>

<template>
  <el-card class="device-card" :body-style="{ padding: '16px' }">
    <!-- 设备头部信息 -->
    <div class="device-header">
      <div class="device-info">
        <el-icon
          :size="24"
          :class="['device-icon', device.status ? 'active' : 'inactive']"
        >
          <component :is="deviceIcons[device.type]" />
        </el-icon>
        <div class="device-details">
          <div class="device-name">{{ device.name }}</div>
          <div class="device-meta">
            <span class="device-type">{{ deviceTypeNames[device.type] }}</span>
            <span class="device-room">{{ device.room }}</span>
          </div>
        </div>
      </div>
      <el-switch
        :model-value="device.status"
        @change="handleSwitchChange"
        :disabled="device.type === 'sensor'"
      />
    </div>

    <!-- 设备控制区域 -->
    <div class="device-controls">
      <!-- 灯光控制 -->
      <div v-if="device.type === 'light' && device.status" class="control-item">
        <span>亮度</span>
        <el-slider
          :model-value="device.brightness || 50"
          :min="0"
          :max="100"
          :step="5"
          @change="handleBrightnessChange"
          show-input
        />
      </div>

      <!-- 空调控制 -->
      <div v-if="device.type === 'ac' && device.status" class="control-item">
        <span>温度</span>
        <el-slider
          :model-value="device.temperature || 24"
          :min="16"
          :max="30"
          @change="handleTemperatureChange"
          show-input
        />

        <span>模式</span>
        <el-select
          :model-value="device.mode || 'cool'"
          @change="handleModeChange"
          size="small"
        >
          <el-option label="制冷" value="cool" />
          <el-option label="制热" value="heat" />
          <el-option label="送风" value="fan" />
          <el-option label="自动" value="auto" />
        </el-select>

        <span v-if="device.mode === 'fan'">风速</span>
        <el-slider
          v-if="device.mode === 'fan'"
          :model-value="device.fanSpeed || 3"
          :min="1"
          :max="5"
          :step="1"
          @change="handleFanSpeedChange"
          show-input
        />
      </div>

      <!-- 窗帘控制 -->
      <div
        v-if="device.type === 'curtain' && device.status"
        class="control-item"
      >
        <span>位置</span>
        <el-slider
          :model-value="device.position || 0"
          :min="0"
          :max="100"
          :step="10"
          @change="handlePositionChange"
          show-input
        />
      </div>

      <!-- 传感器显示 -->
      <div v-if="device.type === 'sensor'" class="sensor-data">
        <div class="sensor-value">在线</div>
        <div class="last-update">
          最后更新: {{ new Date(device.lastUpdate).toLocaleTimeString() }}
        </div>
      </div>
    </div>

    <!-- 设备状态 -->
    <div class="device-status">
      <el-tag :type="device.status ? 'success' : 'info'" size="small">
        {{ device.status ? "开启" : "关闭" }}
      </el-tag>
    </div>
  </el-card>
</template>

<style scoped>
.device-card {
  transition: all 0.3s ease;
}

.device-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.device-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.device-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.device-icon.active {
  color: var(--el-color-primary);
}

.device-icon.inactive {
  color: var(--el-text-color-secondary);
}

.device-details {
  display: flex;
  flex-direction: column;
}

.device-name {
  font-weight: 500;
  font-size: 14px;
  color: var(--el-text-color-primary);
}

.device-meta {
  display: flex;
  gap: 8px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.device-controls {
  margin-bottom: 16px;
}

.control-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.control-item span {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.sensor-data {
  text-align: center;
  padding: 8px 0;
}

.sensor-value {
  font-size: 18px;
  font-weight: bold;
  color: var(--el-color-success);
}

.last-update {
  font-size: 11px;
  color: var(--el-text-color-secondary);
  margin-top: 4px;
}

.device-status {
  display: flex;
  justify-content: flex-end;
}

@media (max-width: 480px) {
  .device-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .device-controls {
    margin-top: 16px;
  }
}
</style>
