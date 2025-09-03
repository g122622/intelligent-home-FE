<script setup lang="ts">
import { ref, computed } from "vue";
import { useDeviceStore } from "@/store/modules/device";
import { ElCard, ElButton, ElSelect, ElOption, ElMessage, ElDialog, ElForm, ElFormItem } from "element-plus";
import { Operation, Connection, Disconnect, Move, DataAnalysis } from "@element-plus/icons-vue";

const deviceStore = useDeviceStore();
const showOperationDialog = ref(false);
const showMoveDialog = ref(false);
const selectedDevice = ref<any>(null);
const operationId = ref(1);
const targetRoomId = ref(1);

// 设备操作选项
const operationOptions = [
  { value: 1, label: "开启设备" },
  { value: 2, label: "关闭设备" },
  { value: 3, label: "重启设备" },
  { value: 4, label: "获取状态" },
  { value: 5, label: "重置设置" }
];

// 可操作的设备列表
const operableDevices = computed(() => 
  deviceStore.devices.filter(device => device.onlineStatus === 1)
);

// 执行设备操作
const performDeviceOperation = async () => {
  if (!selectedDevice.value) {
    ElMessage.warning("请选择设备");
    return;
  }

  try {
    await deviceStore.performDeviceOperation(
      selectedDevice.value.homeId,
      selectedDevice.value.id,
      operationId.value
    );
    ElMessage.success("操作执行成功");
    showOperationDialog.value = false;
  } catch (error) {
    ElMessage.error("操作执行失败");
  }
};

// 移动设备到其他房间
const moveDeviceToRoom = async () => {
  if (!selectedDevice.value) {
    ElMessage.warning("请选择设备");
    return;
  }

  try {
    await deviceStore.moveDeviceToRoom(
      selectedDevice.value.homeId,
      selectedDevice.value.id,
      targetRoomId.value
    );
    ElMessage.success("设备移动成功");
    showMoveDialog.value = false;
  } catch (error) {
    ElMessage.error("设备移动失败");
  }
};

// 连接设备
const connectToDevice = async () => {
  if (!selectedDevice.value) {
    ElMessage.warning("请选择设备");
    return;
  }

  try {
    await deviceStore.connectToDevice(selectedDevice.value.homeId);
    ElMessage.success("设备连接成功");
  } catch (error) {
    ElMessage.error("设备连接失败");
  }
};

// 断开设备连接
const disconnectFromDevice = async () => {
  if (!selectedDevice.value) {
    ElMessage.warning("请选择设备");
    return;
  }

  try {
    await deviceStore.disconnectFromDevice(selectedDevice.value.homeId);
    ElMessage.success("设备断开成功");
  } catch (error) {
    ElMessage.error("设备断开失败");
  }
};

// 获取设备数据
const fetchDeviceData = async () => {
  if (!selectedDevice.value) {
    ElMessage.warning("请选择设备");
    return;
  }

  try {
    await deviceStore.fetchDeviceData(
      selectedDevice.value.homeId,
      selectedDevice.value.id
    );
    ElMessage.success("设备数据获取成功");
  } catch (error) {
    ElMessage.error("设备数据获取失败");
  }
};

// 打开操作对话框
const openOperationDialog = (device: any) => {
  selectedDevice.value = device;
  showOperationDialog.value = true;
};

// 打开移动对话框
const openMoveDialog = (device: any) => {
  selectedDevice.value = device;
  showMoveDialog.value = true;
};
</script>

<template>
  <ElCard class="operations-panel" shadow="never">
    <template #header>
      <div class="panel-header">
        <h3 class="panel-title">设备操作面板</h3>
        <p class="panel-subtitle">对选中的设备执行各种操作</p>
      </div>
    </template>

    <!-- 设备选择 -->
    <div class="device-selection">
      <ElSelect
        v-model="selectedDevice"
        placeholder="选择要操作的设备"
        filterable
        clearable
        size="large"
        style="width: 100%"
      >
        <ElOption
          v-for="device in operableDevices"
          :key="device.id"
          :label="`${device.name} (ID: ${device.id})`"
          :value="device"
        />
      </ElSelect>
    </div>

    <!-- 操作按钮组 -->
    <div class="operation-buttons">
      <ElButton
        :icon="Operation"
        type="primary"
        :disabled="!selectedDevice"
        @click="openOperationDialog(selectedDevice)"
      >
        执行操作
      </ElButton>

      <ElButton
        :icon="Move"
        type="warning"
        :disabled="!selectedDevice"
        @click="openMoveDialog(selectedDevice)"
      >
        移动设备
      </ElButton>

      <ElButton
        :icon="Connection"
        type="success"
        :disabled="!selectedDevice"
        @click="connectToDevice"
      >
        连接设备
      </ElButton>

      <ElButton
        :icon="Disconnect"
        type="danger"
        :disabled="!selectedDevice"
        @click="disconnectFromDevice"
      >
        断开连接
      </ElButton>

      <ElButton
        :icon="DataAnalysis"
        type="info"
        :disabled="!selectedDevice"
        @click="fetchDeviceData"
      >
        获取数据
      </ElButton>
    </div>

    <!-- 操作结果展示 -->
    <div v-if="deviceStore.deviceData.length > 0" class="data-results">
      <h4>设备数据:</h4>
      <div class="data-list">
        <div
          v-for="(data, index) in deviceStore.deviceData"
          :key="index"
          class="data-item"
        >
          <span class="data-time">{{ new Date(data.timestamp).toLocaleString() }}</span>
          <span class="data-content">{{ data.data }}</span>
        </div>
      </div>
    </div>

    <!-- 执行操作对话框 -->
    <ElDialog
      v-model="showOperationDialog"
      title="执行设备操作"
      width="400px"
    >
      <ElForm label-width="80px">
        <ElFormItem label="选择操作">
          <ElSelect v-model="operationId" placeholder="请选择操作">
            <ElOption
              v-for="option in operationOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </ElSelect>
        </ElFormItem>
      </ElForm>
      
      <template #footer>
        <ElButton @click="showOperationDialog = false">取消</ElButton>
        <ElButton type="primary" @click="performDeviceOperation">执行</ElButton>
      </template>
    </ElDialog>

    <!-- 移动设备对话框 -->
    <ElDialog
      v-model="showMoveDialog"
      title="移动设备到房间"
      width="400px"
    >
      <ElForm label-width="80px">
        <ElFormItem label="目标房间">
          <ElInputNumber
            v-model="targetRoomId"
            :min="1"
            :max="999"
            controls-position="right"
          />
        </ElFormItem>
      </ElForm>
      
      <template #footer>
        <ElButton @click="showMoveDialog = false">取消</ElButton>
        <ElButton type="primary" @click="moveDeviceToRoom">移动</ElButton>
      </template>
    </ElDialog>
  </ElCard>
</template>

<style lang="scss" scoped>
.operations-panel {
  margin-top: 24px;
  border: 1px solid var(--el-border-color-light);
  border-radius: 12px;

  :deep(.el-card__header) {
    padding: 20px;
    border-bottom: 1px solid var(--el-border-color-light);
    background: var(--el-fill-color-lighter);
  }

  :deep(.el-card__body) {
    padding: 20px;
  }
}

.panel-header {
  .panel-title {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: var(--el-text-color-primary);
  }

  .panel-subtitle {
    margin: 4px 0 0;
    font-size: 14px;
    color: var(--el-text-color-secondary);
  }
}

.device-selection {
  margin-bottom: 20px;
}

.operation-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  margin-bottom: 20px;
}

.data-results {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid var(--el-border-color-light);

  h4 {
    margin: 0 0 12px;
    font-size: 16px;
    font-weight: 600;
    color: var(--el-text-color-primary);
  }
}

.data-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 200px;
  overflow-y: auto;
}

.data-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: var(--el-fill-color-light);
  border-radius: 6px;
  font-size: 12px;

  .data-time {
    color: var(--el-text-color-secondary);
  }

  .data-content {
    color: var(--el-text-color-primary);
    font-weight: 500;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .operation-buttons {
    grid-template-columns: 1fr;
  }

  .data-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
}

// 暗色模式适配
:deep() {
  .operations-panel {
    background: var(--el-bg-color);
    
    .el-card__header {
      background: var(--el-fill-color-dark);
    }
  }

  .data-item {
    background: var(--el-fill-color-darker);
  }
}

// 动画效果
.operation-buttons {
  .el-button {
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-1px);
    }
    
    &:active {
      transform: translateY(0);
    }
  }
}
</style>