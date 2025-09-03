<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useDeviceStore } from "@/store/modules/device";
import { ElMessage, ElMessageBox } from "element-plus";
import DeviceCard from "./components/DeviceCard.vue";
import DeviceForm from "./components/DeviceForm.vue";
import DeviceFilter from "./components/DeviceFilter.vue";
import DeviceStats from "./components/DeviceStats.vue";
import DeviceOperations from "./components/DeviceOperations.vue";
import { Search, Plus, Refresh, Setting, Operation, View } from "@element-plus/icons-vue";

const deviceStore = useDeviceStore();
const searchKeyword = ref("");
const selectedRoom = ref<number | "all">("all");
const selectedType = ref<number | "all">("all");
const onlineStatus = ref<number | "all">("all");
const showDeviceForm = ref(false);
const editingDevice = ref<DeviceDetail | null>(null);
const loading = ref(false);

// 过滤后的设备列表
const filteredDevices = computed(() => {
  return deviceStore.devices.filter(device => {
    const nameMatch = device.name.toLowerCase().includes(searchKeyword.value.toLowerCase());
    const roomMatch = selectedRoom.value === "all" || device.roomId === selectedRoom.value;
    const typeMatch = selectedType.value === "all" || device.typeId === selectedType.value;
    const statusMatch = onlineStatus.value === "all" || device.onlineStatus === onlineStatus.value;
    
    return nameMatch && roomMatch && typeMatch && statusMatch;
  });
});

// 初始化数据
const initializeData = async () => {
  loading.value = true;
  try {
    await deviceStore.initialize();
  } catch (error) {
    ElMessage.error("初始化设备数据失败");
  } finally {
    loading.value = false;
  }
};

// 刷新数据
const refreshData = async () => {
  loading.value = true;
  try {
    await deviceStore.fetchDeviceList();
    ElMessage.success("数据刷新成功");
  } catch (error) {
    ElMessage.error("刷新数据失败");
  } finally {
    loading.value = false;
  }
};

// 打开添加设备表单
const openAddForm = () => {
  editingDevice.value = null;
  showDeviceForm.value = true;
};

// 打开编辑设备表单
const openEditForm = (device: DeviceDetail) => {
  editingDevice.value = { ...device };
  showDeviceForm.value = true;
};

// 删除设备
const handleDeleteDevice = async (device: DeviceDetail) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除设备 "${device.name}" 吗？此操作不可恢复。`,
      "确认删除",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }
    );
    
    await deviceStore.removeDevice(device.homeId, device.id);
    ElMessage.success("设备删除成功");
  } catch (error) {
    if (error !== "cancel") {
      ElMessage.error("删除设备失败");
    }
  }
};

// 激活设备
const handleActivateDevice = async (device: DeviceDetail) => {
  try {
    await deviceStore.activateDevice(device.homeId, device.id);
    ElMessage.success("设备激活成功");
  } catch (error) {
    ElMessage.error("激活设备失败");
  }
};

// 查看设备详情
const viewDeviceDetail = (device: DeviceDetail) => {
  router.push(`/device/detail/${device.id}`);
};

// 处理表单提交
const handleFormSubmit = async () => {
  showDeviceForm.value = false;
  await refreshData();
};

onMounted(() => {
  initializeData();
});
</script>

<template>
  <div class="device-management">
    <!-- 页面标题和操作栏 -->
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">设备管理</h1>
        <p class="page-subtitle">管理您的智能家居设备</p>
      </div>
      <div class="header-actions">
        <el-button :icon="Refresh" @click="refreshData" :loading="loading">
          刷新
        </el-button>
        <el-button type="primary" :icon="Plus" @click="openAddForm">
          添加设备
        </el-button>
      </div>
    </div>

    <!-- 设备统计卡片 -->
    <DeviceStats />

    <!-- 筛选工具栏 -->
    <DeviceFilter
      v-model:searchKeyword="searchKeyword"
      v-model:selectedRoom="selectedRoom"
      v-model:selectedType="selectedType"
      v-model:onlineStatus="onlineStatus"
    />

    <!-- 设备网格 -->
    <div class="device-grid-container">
      <div v-if="loading" class="loading-container">
        <el-skeleton :rows="6" animated />
      </div>

      <template v-else>
        <div v-if="filteredDevices.length === 0" class="empty-state">
          <el-empty description="暂无设备数据" />
        </div>

        <div v-else class="device-grid">
          <DeviceCard
            v-for="device in filteredDevices"
            :key="device.id"
            :device="device"
            @view="viewDeviceDetail(device)"
            @edit="openEditForm(device)"
            @delete="handleDeleteDevice(device)"
            @activate="handleActivateDevice(device)"
          />
        </div>
      </template>
    </div>

    <!-- 设备操作面板 -->
    <DeviceOperations />

    <!-- 设备表单对话框 -->
    <DeviceForm
      v-model:visible="showDeviceForm"
      :device="editingDevice"
      @submit="handleFormSubmit"
    />
  </div>
</template>

<style lang="scss" scoped>
.device-management {
  padding: 24px;
  min-height: 100%;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--el-border-color-light);

  .header-left {
    .page-title {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
      color: var(--el-text-color-primary);
    }

    .page-subtitle {
      margin: 4px 0 0;
      font-size: 14px;
      color: var(--el-text-color-secondary);
    }
  }

  .header-actions {
    display: flex;
    gap: 12px;
  }
}

.device-grid-container {
  margin-top: 24px;
}

.loading-container {
  padding: 40px 0;
}

.empty-state {
  padding: 60px 0;
}

.device-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
  margin-top: 16px;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 16px;

    .header-actions {
      width: 100%;
      justify-content: flex-end;
    }
  }

  .device-grid {
    grid-template-columns: 1fr;
  }
}

// 动画效果
.device-card-enter-active,
.device-card-leave-active {
  transition: all 0.3s ease;
}

.device-card-enter-from,
.device-card-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>