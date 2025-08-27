<script setup lang="ts">
import { computed } from "vue";
import type { Scene, Device } from "@/api/device";

const props = defineProps<{
  scene: Scene;
  devices: Device[];
}>();

const emit = defineEmits<{
  (event: "edit", scene: Scene): void;
  (event: "delete", sceneId: string): void;
  (event: "execute", sceneId: string): void;
}>();

// 判断是否为预设场景
const isPresetScene = computed(() => {
  return !props.scene.id.startsWith("custom");
});

// 获取场景中的设备信息
const sceneDevices = computed(() => {
  return props.devices.filter(device =>
    Object.keys(props.scene.actions).includes(device.id)
  );
});

// 处理编辑
const handleEdit = () => {
  if (!isPresetScene.value) {
    emit("edit", props.scene);
  }
};

// 处理删除
const handleDelete = () => {
  if (!isPresetScene.value) {
    emit("delete", props.scene.id);
  }
};

// 处理执行
const handleExecute = () => {
  emit("execute", props.scene.id);
};
</script>

<template>
  <el-card class="scene-card" :body-style="{ padding: '16px' }">
    <!-- 场景头部 -->
    <div class="scene-header">
      <div class="scene-info">
        <el-icon
          :size="24"
          :class="['scene-icon', scene.isActive ? 'active' : 'inactive']"
        >
          <MagicStick />
        </el-icon>
        <div class="scene-details">
          <div class="scene-name">{{ scene.name }}</div>
          <div v-if="scene.description" class="scene-description">
            {{ scene.description }}
          </div>
          <div class="device-count">{{ sceneDevices.length }} 个设备</div>
        </div>
      </div>
      <el-tag v-if="isPresetScene" type="info" size="small">预设</el-tag>
    </div>

    <!-- 设备列表 -->
    <div class="devices-list">
      <div v-for="device in sceneDevices" :key="device.id" class="device-item">
        <el-icon size="16">
          <component
            :is="
              device.type === 'light'
                ? 'ep-light'
                : device.type === 'ac'
                  ? 'ep-cold'
                  : device.type === 'curtain'
                    ? 'ep-document'
                    : 'ep-monitor'
            "
          />
        </el-icon>
        <span class="device-name">{{ device.name }}</span>
        <span class="device-room">{{ device.room }}</span>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="card-actions">
      <el-button size="small" type="primary" @click="handleExecute"
        >执行</el-button
      >
      <el-button v-if="!isPresetScene" size="small" @click="handleEdit"
        >编辑</el-button
      >
      <el-button
        v-if="!isPresetScene"
        size="small"
        type="danger"
        @click="handleDelete"
        >删除</el-button
      >
    </div>

    <!-- 执行状态指示 -->
    <div v-if="scene.isActive" class="execution-status">
      <el-icon color="var(--el-color-success)"><Loading /></el-icon>
      <span>执行中...</span>
    </div>
  </el-card>
</template>

<style scoped>
.scene-card {
  transition: all 0.3s ease;
  position: relative;
}

.scene-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.scene-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.scene-info {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  flex: 1;
}

.scene-icon.active {
  color: var(--el-color-primary);
}

.scene-icon.inactive {
  color: var(--el-text-color-secondary);
}

.scene-details {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.scene-name {
  font-weight: 500;
  font-size: 14px;
  color: var(--el-text-color-primary);
  margin-bottom: 4px;
}

.scene-description {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-bottom: 4px;
  line-height: 1.4;
}

.device-count {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.devices-list {
  margin-bottom: 16px;
  max-height: 120px;
  overflow-y: auto;
}

.device-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px;
  border-radius: 4px;
  margin-bottom: 4px;
  background-color: var(--el-fill-color-light);
}

.device-item:last-child {
  margin-bottom: 0;
}

.device-name {
  font-size: 12px;
  color: var(--el-text-color-primary);
  flex: 1;
}

.device-room {
  font-size: 11px;
  color: var(--el-text-color-secondary);
}

.card-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.execution-status {
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--el-color-success);
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.execution-status .el-icon {
  animation: spin 1s linear infinite;
}

@media (max-width: 480px) {
  .scene-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .card-actions {
    justify-content: stretch;
  }

  .card-actions .el-button {
    flex: 1;
  }
}
</style>
