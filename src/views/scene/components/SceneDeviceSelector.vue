<template>
  <div class="device-selector">
    <el-button type="primary" @click="showDialog = true"
      >添加设备操作</el-button
    >

    <el-table :data="selectedDevices" border>
      <el-table-column prop="deviceName" label="设备名称" />
      <el-table-column prop="operationName" label="操作" />
      <el-table-column label="操作">
        <template #default="{ $index }">
          <el-button size="small" type="danger" @click="removeDevice($index)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="showDialog" title="选择设备操作" width="70%">
      <!-- 这里添加设备选择逻辑 -->
      <template #footer>
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmSelection">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const showDialog = ref(false);
const selectedDevices = ref([]);

const removeDevice = index => {
  selectedDevices.value.splice(index, 1);
};

const confirmSelection = () => {
  // 这里添加设备选择逻辑
  showDialog.value = false;
};
</script>

<style scoped>
.device-selector {
  margin-top: 20px;
}
</style>
