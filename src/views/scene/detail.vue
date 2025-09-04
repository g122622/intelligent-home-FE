<template>
  <div class="scene-detail">
    <el-page-header @back="goBack">
      <template #content>
        <span class="text-large font-600 mr-3"> {{ scene.name }} </span>
      </template>
    </el-page-header>

    <el-descriptions title="场景详情" border>
      <el-descriptions-item label="场景名称">{{ scene.name }}</el-descriptions-item>
      <el-descriptions-item label="状态">
        <el-tag :type="scene.status ? 'success' : 'danger'">
          {{ scene.status ? '启用' : '禁用' }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="开始时间">{{ scene.startTime }}</el-descriptions-item>
      <el-descriptions-item label="结束时间">{{ scene.endTime }}</el-descriptions-item>
      <el-descriptions-item label="描述">{{ scene.description }}</el-descriptions-item>
    </el-descriptions>

    <el-divider />
    
    <el-card header="设备操作">
      <el-table :data="devices" border>
        <el-table-column prop="deviceName" label="设备名称" />
        <el-table-column prop="deviceTypeName" label="设备类型" />
        <el-table-column prop="operationName" label="操作" />
        <el-table-column prop="operationDescription" label="操作描述" />
      </el-table>
    </el-card>

    <div class="action-buttons">
      <el-button type="primary" @click="handleStart" v-if="scene.status">启动场景</el-button>
      <el-button type="danger" @click="handleStop" v-if="scene.status">停止场景</el-button>
      <el-button @click="handleEdit">编辑</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getSceneDeviceView, startScene, stopScene } from '@/api/scene'

const route = useRoute()
const router = useRouter()

const scene = ref({
  id: Number(route.params.id),
  name: '',
  description: '',
  status: 0,
  startTime: '',
  endTime: ''
})

const devices = ref([])

const fetchSceneDevices = async () => {
  const res = await getSceneDeviceView(1, scene.value.id) // 假设homeId为1
  devices.value = res.devices
}

const handleStart = async () => {
  await startScene(1, scene.value.id) // 假设homeId为1
}

const handleStop = async () => {
  await stopScene(1, scene.value.id) // 假设homeId为1
}

const handleEdit = () => {
  router.push({ name: 'SceneEdit', params: { id: scene.value.id } })
}

const goBack = () => {
  router.push({ name: 'SceneIndex' })
}

onMounted(() => {
  // 这里应该从store或API获取场景基本信息
  fetchSceneDevices()
})
</script>

<style scoped>
.scene-detail {
  padding: 20px;
}
.action-buttons {
  margin-top: 20px;
  text-align: right;
}
</style>