<script setup lang="ts">
import { Search } from "@element-plus/icons-vue";

const props = defineProps<{
  searchKeyword: string;
  selectedRole: string;
}>();

const emit = defineEmits<{
  (e: "update:searchKeyword", value: string): void;
  (e: "update:selectedRole", value: string): void;
}>();

const roleOptions = [
  { label: "全部角色", value: "all" },
  { label: "房主", value: "owner" },
  { label: "成员", value: "member" },
  { label: "访客", value: "guest" }
];
</script>

<template>
  <el-card class="filter-card">
    <div class="filter-content">
      <!-- 搜索框 -->
      <div class="search-section">
        <el-input
          :model-value="searchKeyword"
          placeholder="搜索家庭名称或地址..."
          :prefix-icon="Search"
          clearable
          @update:model-value="emit('update:searchKeyword', $event)"
          @clear="emit('update:searchKeyword', '')"
        >
          <template #append>
            <el-button :icon="Search" />
          </template>
        </el-input>
      </div>

      <!-- 角色筛选 -->
      <div class="filter-section">
        <span class="filter-label">角色筛选:</span>
        <el-radio-group
          :model-value="selectedRole"
          @update:model-value="emit('update:selectedRole', $event)"
        >
          <el-radio-button
            v-for="option in roleOptions"
            :key="option.value"
            :label="option.value"
          >
            {{ option.label }}
          </el-radio-button>
        </el-radio-group>
      </div>
    </div>
  </el-card>
</template>

<style lang="scss" scoped>
.filter-card {
  margin-bottom: 24px;
  border: none;
  background: var(--el-bg-color);

  :deep(.el-card__body) {
    padding: 20px;
  }

  .filter-content {
    display: flex;
    align-items: center;
    gap: 24px;

    .search-section {
      flex: 1;
      max-width: 400px;

      :deep(.el-input-group__append) {
        background-color: var(--el-color-primary);
        color: white;
        border: none;

        .el-button {
          color: white;
        }
      }
    }

    .filter-section {
      display: flex;
      align-items: center;
      gap: 12px;

      .filter-label {
        font-size: 14px;
        color: var(--el-text-color-secondary);
        white-space: nowrap;
      }
    }
  }
}

@media (max-width: 768px) {
  .filter-content {
    flex-direction: column;
    gap: 16px !important;

    .search-section {
      max-width: none !important;
      width: 100%;
    }

    .filter-section {
      width: 100%;
      justify-content: space-between;

      .filter-label {
        flex-shrink: 0;
      }

      :deep(.el-radio-group) {
        flex-wrap: wrap;
        gap: 8px;

        .el-radio-button {
          margin-bottom: 4px;
        }
      }
    }
  }
}

@media (max-width: 480px) {
  .filter-section {
    flex-direction: column;
    align-items: flex-start !important;
    gap: 8px !important;

    :deep(.el-radio-group) {
      width: 100%;
      justify-content: space-between;
    }
  }
}
</style>
