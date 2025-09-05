<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { useDeviceStore } from "@/store/modules/device";
import { ElInput, ElSelect, ElOption, ElForm, ElFormItem } from "element-plus";
import { Search } from "@element-plus/icons-vue";

interface Props {
  loading?: boolean;
}

interface Emits {
  (e: "update:searchKeyword", value: string): void;
  (e: "update:selectedRoom", value: number | "all"): void;
  (e: "update:selectedType", value: number | "all"): void;
  (e: "update:onlineStatus", value: number | "all"): void;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
});

const emit = defineEmits<Emits>();

const deviceStore = useDeviceStore();
const localSearchKeyword = ref("");
const localSelectedRoom = ref<number | "all">("all");
const localSelectedType = ref<number | "all">("all");
const localOnlineStatus = ref<number | "all">("all");

// 房间选项
const roomOptions = computed(() => [
  { value: "all", label: "所有房间" },
  ...(deviceStore.devicesByRoom
    ? Object.keys(deviceStore.devicesByRoom).map(roomId => ({
      value: Number(roomId),
      label: `房间 ${roomId}`
    }))
    : [])
]);

// 设备类型选项
const typeOptions = computed(() => [
  { value: "all", label: "所有类型" },
  ...(deviceStore.deviceTypes.map(type => ({
    value: type.id,
    label: type.name
  })))
]);

// 状态选项
const statusOptions = [
  { value: "all", label: "所有状态" },
  { value: 1, label: "在线" },
  { value: 0, label: "离线" }
];

// 监听本地变化并触发更新
watch(localSearchKeyword, value => {
  emit("update:searchKeyword", value);
});

watch(localSelectedRoom, value => {
  emit("update:selectedRoom", value);
});

watch(localSelectedType, value => {
  emit("update:selectedType", value);
});

watch(localOnlineStatus, value => {
  emit("update:onlineStatus", value);
});

// 重置筛选条件
const resetFilters = () => {
  localSearchKeyword.value = "";
  localSelectedRoom.value = "all";
  localSelectedType.value = "all";
  localOnlineStatus.value = "all";
};
</script>

<template>
  <ElCard class="filter-card" shadow="hover">
    <ElForm :model="{}" label-width="80px" class="filter-form">
      <!-- 搜索框 -->
      <ElFormItem label="搜索设备">
        <ElInput v-model="localSearchKeyword" placeholder="输入设备名称搜索..." :prefix-icon="Search" :disabled="props.loading"
          clearable />
      </ElFormItem>

      <!-- 房间筛选 -->
      <ElFormItem label="房间筛选">
        <ElSelect v-model="localSelectedRoom" :disabled="props.loading" clearable placeholder="选择房间">
          <ElOption v-for="option in roomOptions" :key="option.value" :label="option.label" :value="option.value" />
        </ElSelect>
      </ElFormItem>

      <!-- 类型筛选 -->
      <ElFormItem label="类型筛选">
        <ElSelect v-model="localSelectedType" :disabled="props.loading" clearable placeholder="选择设备类型">
          <ElOption v-for="option in typeOptions" :key="option.value" :label="option.label" :value="option.value" />
        </ElSelect>
      </ElFormItem>

      <!-- 状态筛选 -->
      <ElFormItem label="状态筛选">
        <ElSelect v-model="localOnlineStatus" :disabled="props.loading" clearable placeholder="选择设备状态">
          <ElOption v-for="option in statusOptions" :key="option.value" :label="option.label" :value="option.value" />
        </ElSelect>
      </ElFormItem>
    </ElForm>

    <!-- 操作按钮 -->
    <div class="filter-actions">
      <el-button type="default" :disabled="props.loading" @click="resetFilters">
        重置筛选
      </el-button>
    </div>
  </ElCard>
</template>

<style scoped lang="scss">
.filter-card {
  margin-bottom: 24px;
  border-radius: 12px;
  border: none;

  :deep(.el-card__body) {
    padding: 24px;
  }
}

.filter-form {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  align-items: end;

  :deep(.el-form-item) {
    margin-bottom: 0;
  }

  :deep(.el-form-item__label) {
    font-weight: 500;
    color: #606266;
  }
}

.filter-actions {
  margin-top: 16px;
  text-align: right;
}

@media (max-width: 768px) {
  .filter-card {
    :deep(.el-card__body) {
      padding: 16px;
    }
  }

  .filter-form {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}
</style>