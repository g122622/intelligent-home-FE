<template>
  <div class="scene-management">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">场景管理</h1>
        <p class="page-subtitle">管理和配置智能家居场景模式</p>
      </div>
      <div class="header-actions">
        <el-input
          v-model="searchQuery"
          placeholder="搜索场景..."
          style="width: 200px; margin-right: 12px"
          @keyup.enter="handleSearch"
        />
        <el-button type="primary" @click="handleCreate">创建场景</el-button>
      </div>
    </div>

    <el-table :data="sceneList" border style="width: 100%">
      <el-table-column prop="name" label="场景名称" />
      <el-table-column prop="description" label="场景描述" />
      <el-table-column prop="status" label="状态">
        <template #default="{ row }">
          <el-tag :type="row.status ? 'success' : 'danger'">
            {{ row.status ? "启用" : "禁用" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="startTime" label="开始时间" />
      <el-table-column prop="endTime" label="结束时间" />
      <el-table-column label="操作" width="220">
        <template #default="{ row }">
          <el-button size="small" @click="handleDetail(row)">详情</el-button>
          <el-button size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <SceneDialog
      v-model="dialogVisible"
      :scene="currentScene"
      @submit="handleSubmit"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { getSceneList, deleteScene } from "@/api/scene";
import SceneDialog from "./components/SceneDialog.vue";
import { useRouter } from "vue-router";

const sceneList = ref([]);
const dialogVisible = ref(false);
const currentScene = ref(null);
const router = useRouter();
const searchQuery = ref("");

const fetchSceneList = async (searchParams: string) => {
  const res = await getSceneList(1); // TODO 假设homeId为1
  sceneList.value = res.scenes;
};

const handleCreate = () => {
  currentScene.value = null;
  dialogVisible.value = true;
};

const handleEdit = scene => {
  currentScene.value = { ...scene };
  dialogVisible.value = true;
};

const handleDelete = async scene => {
  await deleteScene(1, scene.id); // TODO 假设homeId为1
  fetchSceneList("");
};

const handleSubmit = () => {
  dialogVisible.value = false;
  fetchSceneList("");
};

const handleDetail = scene => {
  router.push({ name: "SceneDetail", params: { id: scene.id } });
};

const handleSearch = (searchParams: string) => {
  fetchSceneList(searchQuery.value);
};

onMounted(() => {
  fetchSceneList("");
});
</script>

<style lang="scss" scoped>
.scene-management {
  padding: var(--space-lg);
  min-height: 100%;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-lg);
  padding-bottom: var(--space-md);
  border-bottom: 1px solid rgb(0 0 0 / 0.08);

  .header-left {
    .page-title {
       margin: 0;
       font-size: 24px;
       font-weight: 600;
       color: var(--el-text-color-primary);
     }

    .page-subtitle {
      margin: var(--space-xs) 0 0;
      font-size: 14px;
      color: var(--el-text-color-secondary);
    }
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
  }
}

// 表格容器样式
:deep(.el-table) {
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  border: 1px solid rgb(0 0 0 / 0.05);
  
  .el-table__header-wrapper {
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  }
  
  .el-table__body-wrapper {
    border-radius: 0 0 var(--radius-lg) var(--radius-lg);
  }
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: var(--space-md);

    .header-actions {
      width: 100%;
      justify-content: flex-end;
    }
  }
}
</style>
