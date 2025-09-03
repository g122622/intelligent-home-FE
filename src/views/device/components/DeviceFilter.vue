<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { useDeviceStore } from "@/store/modules/device";
import { ElInput, ElSelect, ElOption, ElButton } from "element-plus";
import { Search, Refresh, Filter } from "@element-plus/icons-vue";

interface Props {
  searchKeyword?: string;
  selectedRoom?: number | "all";
  selectedType?: number | "all";
  onlineStatus?: number | "all";
}

interface Emits {
  (e: "update:searchKeyword", value: string): void;
  (e: "update:selectedRoom", value: number | "all"): void;
  (e: "update:selectedType", value: number | "all"): void;
  (e: "update:onlineStatus", value: number | "all"): void;
  (e: "reset"): void;
}

const props = withDefaults(defineProps<Props>(), {
  searchKeyword: "",
  selectedRoom: "all",
  selectedType: "all",
  onlineStatus: "all"
});

const emit = defineEmits<Emits>();

const deviceStore = useDeviceStore();
const localSearch = ref(props.searchKeyword);
const localRoom = ref(props.selectedRoom);
const localType = ref(props.selectedType);
const localStatus = ref(props.onlineStatus);

// 监听本地变化并触发更新
watch([localSearch, localRoom, localType, localStatus], () => {
  emit("update:searchKeyword", localSearch.value);
  emit("update:selectedRoom", localRoom.value);
  emit("update:selectedType", localType.value);
  emit("update:onlineStatus", localStatus.value);
});

// 监听props变化更新本地值
watch(() => props.searchKeyword, (val) => localSearch.value = val);
watch(() => props.selectedRoom, (val) => localRoom.value = val);
watch(() => props.selectedType, (val) => localType.value = val);
watch(() => props.onlineStatus, (val) => localStatus.value = val);

// 重置筛选条件
const resetFilters = () => {
  localSearch.value = "";
  localRoom.value = "all";
  localType.value = "all";
  localStatus.value = "all";
  emit("reset");
};

// 获取唯一的房间列表
const uniqueRooms = computed(() => {
  const rooms = new Set<number>();
  deviceStore.devices.forEach(device => {
    rooms.add(device.roomId);
  });
  return Array.from(rooms).sort((a, b) => a - b);
});

// 获取唯一的设备类型列表
const uniqueTypes = computed(() => {
  const types = new Set<number>();
  deviceStore.devices.forEach(device => {
    types.add(device.typeId);
  });
  return Array.from(types).sort((a, b) => a - b);
});
</script>

<template>
  <div class="device-filter">
    <div class="filter-content">
      <!-- 搜索框 -->
      <div class="filter-item">
        <el-input
          v-model="localSearch"
          placeholder="搜索设备名称..."
          :prefix-icon="Search"
          clearable
          size="large"
          style="width: 300px"
        />
      </div>

      <!-- 房间筛选 -->
      <div class="filter-item">
        <el-select
          v-model="localRoom"
          placeholder="选择房间"
          size="large"
          style="width: 180px"
        >
          <el-option label="所有房间" value="all" />
          <el-option
            v-for="roomId in uniqueRooms"
            :key="roomId"
            :label="`房间 ${roomId}`"
            :value="roomId"
          />
        </el-select>
      </div>

      <!-- 类型筛选 -->
      <div class="filter-item">
        <el-select
          v-model="localType"
          placeholder="选择类型"
          size="large"
          style="width: 180px"
        >
          <el-option label="所有类型" value="all" />
          <el-option
            v-for="typeId in uniqueTypes"
            :key="typeId"
            :label="`类型 ${typeId}`"
            :value="typeId"
          />
        </el-select>
      </div>

      <!-- 状态筛选 -->
      <div class="filter-item">
        <el-select
          v-model="localStatus"
          placeholder="选择状态"
          size="large"
          style="width: 180px"
        >
          <el-option label="所有状态" value="all" />
          <el-option label="在线" :value="1" />
          <el-option label="离线" :value="0" />
        </el-select>
      </div>

      <!-- 操作按钮 -->
      <div class="filter-actions">
        <el-button
          :icon="Filter"
          size="large"
          @click="resetFilters"
        >
          重置
        </el-button>
      </div>
    </div>

    <!-- 筛选结果统计 -->
    <div v-if="deviceStore.devices.length > 0" class="filter-stats">
      <span class="stats-text">
        共找到 {{ deviceStore.devices.length }} 个设备
        <template v-if="localSearch">
          ，包含"{{ localSearch }}"
        </template>
        <template v-if="localRoom !== 'all'">
          ，房间 {{ localRoom }}
        </template>
        <template v-if="localType !== 'all'">
          ，类型 {{ localType }}
        </template>
        <template v-if="localStatus !== 'all'">
          ，状态 {{ localStatus === 1 ? '在线' : '离线' }}
        </template>
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.device-filter {
  background: var(--el-bg-color);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  border: 1px solid var(--el-border-color-light);
}

.filter-content {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;

  .filter-item {
    flex-shrink: 0;
  }

  .filter-actions {
    flex-shrink: 0;
  }
}

.filter-stats {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--el-border-color-lighter);

  .stats-text {
    font-size: 14px;
    color: var(--el-text-color-secondary);
    font-weight: 500;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .filter-content {
    flex-direction: column;
    align-items: stretch;

    .filter-item {
      width: 100%;

      :deep(.el-input),
      :deep(.el-select) {
        width: 100% !important;
      }
    }

    .filter-actions {
      width: 100%;
      
      .el-button {
        width: 100%;
      }
    }
  }
}

// 暗色模式适配
:deep() {
  .el-input__wrapper,
  .el-select__wrapper {
    background: var(--el-fill-color-light);
    border: 1px solid var(--el-border-color);
    
    &:hover {
      border-color: var(--el-color-primary);
    }
    
    &.is-focus {
      border-color: var(--el-color-primary);
      box-shadow: 0 0 0 2px var(--el-color-primary-light-5);
    }
  }
}

// 动画效果
.filter-item {
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-1px);
  }
}
</style>