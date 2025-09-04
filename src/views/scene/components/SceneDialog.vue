<template>
  <el-dialog
    :title="scene ? '编辑场景' : '创建场景'"
    v-model="modelValue"
    width="50%"
  >
    <el-form :model="form" label-width="120px">
      <el-form-item label="场景名称">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="场景描述">
        <el-input v-model="form.description" type="textarea" />
      </el-form-item>
      <el-form-item label="状态">
        <el-switch v-model="form.status" />
      </el-form-item>
      <el-form-item label="开始时间">
        <el-date-picker
          v-model="form.startTime"
          type="datetime"
          placeholder="选择开始时间"
        />
      </el-form-item>
      <el-form-item label="结束时间">
        <el-date-picker
          v-model="form.endTime"
          type="datetime"
          placeholder="选择结束时间"
        />
      </el-form-item>
      <el-form-item label="设备操作">
        <SceneDeviceSelector v-model="form.deviceOperation" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="modelValue = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { createScene, updateScene } from "@/api/scene";
import SceneDeviceSelector from "./SceneDeviceSelector.vue";

const props = defineProps({
  modelValue: Boolean,
  scene: Object
});

const emit = defineEmits(["update:modelValue", "submit"]);

const form = ref({
  name: "",
  description: "",
  status: true,
  startTime: "",
  endTime: "",
  deviceOperation: []
});

watch(
  () => props.scene,
  val => {
    if (val) {
      form.value = { ...val };
    }
  },
  { immediate: true }
);

const handleSubmit = async () => {
  if (props.scene) {
    await updateScene(1, props.scene.id, form.value); // 假设homeId为1
  } else {
    await createScene(1, form.value); // 假设homeId为1
  }
  emit("submit");
  emit("update:modelValue", false);
};
</script>
