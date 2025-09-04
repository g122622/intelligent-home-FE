<script setup lang="ts">
import { computed } from "vue";
import type { Room } from "@/api/device";

const props = defineProps<{
  modelValue: string;
  rooms: Room[];
}>();

const emit = defineEmits<{
  (event: "update:modelValue", value: string): void;
}>();

const roomOptions = computed(() => [
  { value: "all", label: "所有房间" },
  ...props.rooms.map(room => ({
    value: room.id,
    label: `${room.name} (${room.deviceCount})`
  }))
]);

const handleChange = (value: string) => {
  emit("update:modelValue", value);
};
</script>

<template>
  <el-select
    :model-value="props.modelValue"
    placeholder="选择房间"
    style="width: 200px"
    clearable
    @update:model-value="handleChange"
  >
    <el-option
      v-for="option in roomOptions"
      :key="option.value"
      :label="option.label"
      :value="option.value"
    />
  </el-select>
</template>

<style scoped>
/* 可以添加自定义样式 */
</style>
