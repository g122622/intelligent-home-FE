<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useDeviceStore } from "@/store/modules/device";
import { createDeviceGroup, updateDeviceGroup, deleteDeviceGroup, executeGroupAction } from "@/api/device";
import GroupDialog from "./components/GroupDialog.vue";
import GroupCard from "./components/GroupCard.vue";

const deviceStore = useDeviceStore();
const showDialog = ref(false);
const editingGroup = ref<any>(null);

// 打开创建对话框
const handleCreate = () => {
  editingGroup.value = null;
  showDialog.value = true;
};

// 打开编辑对话框
const handleEdit = (group: any) => {
  editingGroup.value = { ...group };
  showDialog.value = true;
};

// 保存分组
const handleSave = async (groupData: any) => {
  try {
    if (editingGroup.value?.id) {
      await updateDeviceGroup(editingGroup.value.id, groupData);
    } else {
      await createDeviceGroup(groupData);
    }
    await deviceStore.fetchDeviceGroups();
    showDialog.value = false;
  } catch (error) {
    console.error("保存分组失败:", error);
  }
};

// 删除分组
const handleDelete = async (groupId: string) => {
  try {
    await deleteDeviceGroup(groupId);
    await deviceStore.fetchDeviceGroups();
  } catch (error) {
    console.error("删除分组失败:", error);
  }
};

// 执行分组操作
const handleExecute = async (groupId: string) => {
  try {
    await executeGroupAction(groupId);
    await deviceStore.fetchDevices();
  } catch (error) {
    console.error("执行分组操作失败:", error);
  }
};

onMounted(async () => {
  await deviceStore.fetchDeviceGroups();
  await deviceStore.fetchDevices();
});
</script>

<template>
  <div class="device-groups-page">
    <!-- 页面标题和操作按钮 -->
    <div class="page-header">
      <h2>设备分组管理</h2>
      <el-button type="primary" @click="handleCreate">
        <el-icon><plus /></el-icon>
        创建分组
      </el-button>
    </div>

    <!-- 分组列表 -->
    <div class="groups-grid">
      <GroupCard
        v-for="group in deviceStore.deviceGroups"
        :key="group.id"
        :group="group"
        :devices="deviceStore.devices"
        @edit="handleEdit"
        @delete="handleDelete"
        @execute="handleExecute"
      />
    </div>

    <!-- 空状态 -->
    <el-empty
      v-if="deviceStore.deviceGroups.length === 0"
      description="暂无设备分组"
    >
      <el-button type="primary" @click="handleCreate">创建第一个分组</el-button>
    </el-empty>

    <!-- 创建/编辑对话框 -->
    <GroupDialog
      v-model="showDialog"
      :group="editingGroup"
      :devices="deviceStore.devices"
      @save="handleSave"
    />
  </div>
</template>

<style scoped>
.device-groups-page {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-header h2 {
  margin: 0;
  color: var(--el-text-color-primary);
}

.groups-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .groups-grid {
    grid-template-columns: 1fr;
  }
}
</style>