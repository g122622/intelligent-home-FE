<script setup lang="ts">
const props = defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{
  (event: "update:modelValue", value: string): void;
}>();

const typeOptions = [
  { value: "all", label: "所有类型" },
  { value: "light", label: "灯光" },
  { value: "ac", label: "空调" },
  { value: "curtain", label: "窗帘" },
  { value: "sensor", label: "传感器" },
  { value: "switch", label: "开关" }
];

const handleChange = (value: string) => {
  emit("update:modelValue", value);
};
</script>

<template>
  <el-select
    :model-value="props.modelValue"
    placeholder="选择类型"
    style="width: 200px"
    clearable
    @update:model-value="handleChange"
  >
    <el-option
      v-for="option in typeOptions"
      :key="option.value"
      :label="option.label"
      :value="option.value"
    />
  </el-select>
</template>

<style scoped>
/* 可以添加自定义样式 */
</style>
