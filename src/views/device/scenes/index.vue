<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useDeviceStore } from "@/store/modules/device";
import { createScene, updateScene, deleteScene, executeScene } from "@/api/device";
import SceneDialog from "./components/SceneDialog.vue";
import SceneCard from "./components/SceneCard.vue";

const deviceStore = useDeviceStore();
const showDialog = ref(false);
const editingScene = ref<any>(null);

// 打开创建对话框
const handleCreate = () => {
  editingScene.value = null;
  showDialog.value = true;
};

// 打开编辑对话框
const handleEdit = (scene: any) => {
  editingScene.value = { ...scene };
  showDialog.value = true;
};

// 保存场景
const handleSave = async (sceneData: any) => {
  try {
    if (editingScene.value?.id) {
      await updateScene(editingScene.value.id, sceneData);
    } else {
      await createScene(sceneData);
    }
    await deviceStore.fetchScenes();
    showDialog.value = false;
  } catch (error) {
    console.error("保存场景失败:", error);
  }
};

// 删除场景
const handleDelete = async (sceneId: string) => {
  try {
    await deleteScene(sceneId);
    await deviceStore.fetchScenes();
  } catch (error) {
    console.error("删除场景失败:", error);
  }
};

// 执行场景
const handleExecute = async (sceneId: string) => {
  try {
    await executeScene(sceneId);
    await deviceStore.fetchDevices();
  } catch (error) {
    console.error("执行场景失败:", error);
  }
};

onMounted(async () => {
  await deviceStore.fetchScenes();
  await deviceStore.fetchDevices();
});
</script>

<template>
  <div class="scenes-page">
    <!-- 页面标题和操作按钮 -->
    <div class="page-header">
      <h2>场景模式管理</h2>
      <el-button type="primary" @click="handleCreate">
        <el-icon><plus /></el-icon>
        创建场景
      </el-button>
    </div>

    <!-- 预设场景 -->
    <div v-if="deviceStore.scenes.filter(s => !s.id.startsWith('custom')).length > 0" class="preset-scenes">
      <h3>预设场景</h3>
      <div class="scenes-grid">
        <SceneCard
          v-for="scene in deviceStore.scenes.filter(s => !s.id.startsWith('custom'))"
          :key="scene.id"
          :scene="scene"
          :devices="deviceStore.devices"
          @execute="handleExecute"
        />
      </div>
    </div>

    <!-- 自定义场景 -->
    <div v-if="deviceStore.scenes.filter(s => s.id.startsWith('custom')).length > 0" class="custom-scenes">
      <h3>自定义场景</h3>
      <div class="scenes-grid">
        <SceneCard
          v-for="scene in deviceStore.scenes.filter(s => s.id.startsWith('custom'))"
          :key="scene.id"
          :scene="scene"
          :devices="deviceStore.devices"
          @edit="handleEdit"
          @delete="handleDelete"
          @execute="handleExecute"
        />
      </div>
    </div>

    <!-- 空状态 -->
    <el-empty
      v-if="deviceStore.scenes.length === 0"
      description="暂无场景模式"
    >
      <el-button type="primary" @click="handleCreate">创建第一个场景</el-button>
    </el-empty>

    <!-- 创建/编辑对话框 -->
    <SceneDialog
      v-model="showDialog"
      :scene="editingScene"
      :devices="deviceStore.devices"
      @save="handleSave"
    />
  </div>
</template>

<style scoped>
.scenes-page {
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

.preset-scenes,
.custom-scenes {
  margin-bottom: 32px;
}

.preset-scenes h3,
.custom-scenes h3 {
  margin: 0 0 16px 0;
  color: var(--el-text-color-primary);
  font-weight: 500;
}

.scenes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .scenes-grid {
    grid-template-columns: 1fr;
  }
}
</style>