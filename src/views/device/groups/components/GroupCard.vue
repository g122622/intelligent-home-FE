<script setup lang="ts">
import { computed } from "vue";
import type { DeviceGroup, Device } from "@/api/device";

const props = defineProps<{
  group: DeviceGroup;
  devices: Device[];
}>();

const emit = defineEmits<{
  (event: "edit", group: DeviceGroup): void;
  (event: "delete", groupId: string): void;
  (event: "execute", groupId: string): void;
}>();

// 获取分组中的设备信息
const groupDevices = computed(() => {
  return props.devices.filter(device =>
    props.group.deviceIds.includes(device.id)
  );
});

// 处理编辑
const handleEdit = () => {
  emit("edit", props.group);
};

// 处理删除
const handleDelete = () => {
  emit("delete", props.group.id);
};

// 处理执行
const handleExecute = () => {
  emit("execute", props.group.id);
};
</script>

<template>
  <el-card class="group-card" :body-style="{ padding: '16px' }">
    <!-- 分组头部 -->
    <div class="group-header">
      <div class="group-info">
        <el-icon :size="24" class="group-icon">
          <ep-folder />
        </el-icon>
        <div class="group-details">
          <div class="group-name">{{ group.name }}</div>
          <div class="device-count">{{ groupDevices.length }} 个设备</div>
        </div>
      </div>
      <div class="group-actions">
        <el-button size="small" @click="handleExecute">执行</el-button>
      </div>
    </div>

    <!-- 设备列表 -->
    <div class="devices-list">
      <div v-for="device in groupDevices" :key="device.id" class="device-item">
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
      <el-button size="small" type="primary" @click="handleEdit"
        >编辑</el-button
      >
      <el-button size="small" type="danger" @click="handleDelete"
        >删除</el-button
      >
    </div>
  </el-card>
</template>

<style scoped>
.group-card {
  transition: all 0.3s ease;
}

.group-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.group-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.group-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.group-icon {
  color: var(--el-color-primary);
}

.group-details {
  display: flex;
  flex-direction: column;
}

.group-name {
  font-weight: 500;
  font-size: 14px;
  color: var(--el-text-color-primary);
}

.device-count {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.devices-list {
  margin-bottom: 16px;
  max-height: 200px;
  overflow-y: auto;
}

.device-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
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

@media (max-width: 480px) {
  .group-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .card-actions {
    justify-content: stretch;
  }

  .card-actions .el-button {
    flex: 1;
  }
}
</style>
