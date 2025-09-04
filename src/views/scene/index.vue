<template>
  <div class="scene-container">
    <div class="table-container">
      <div class="table-header">
        <h3>场景管理</h3>
        <el-form :inline="true" @submit.prevent="handleSearch">
          <el-form-item>
            <el-input
              v-model="searchQuery"
              placeholder="请输入搜索内容"
              @keyup.enter="handleSearch"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleCreate">创建场景</el-button>
          </el-form-item>
        </el-form>
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

<style scoped>
.scene-container {
  padding: 20px;
}
</style>
