<script setup lang="ts">
import { computed } from "vue";
import { HomeInfo } from "@/api/home";
import { useHomeStore } from "@/store/modules/home";
import { ElTag } from "element-plus";

const props = defineProps<{
  home: HomeInfo;
}>();

const emit = defineEmits<{
  (e: "view", home: HomeInfo): void;
  (e: "edit", home: HomeInfo): void;
  (e: "delete", home: HomeInfo): void;
}>();

const homeStore = useHomeStore();

// 计算用户在该家庭中的角色
const userRole = computed(() => {
  const myHome = homeStore.myHomes.find(h => h.homeId === props.home.id);
  return myHome?.roleName || "未知";
});

// 计算角色标签类型
const roleTagType = computed(() => {
  const role = homeStore.myHomes.find(h => h.homeId === props.home.id)?.role;
  switch (role) {
    case 0:
      return "success"; // 房主
    case 1:
      return "primary"; // 成员
    case 2:
      return "info"; // 访客
    default:
      return "info";
  }
});

// 格式化创建时间
const formattedCreateTime = computed(() => {
  return new Date(props.home.createTime).toLocaleDateString();
});
</script>

<template>
  <el-card class="home-card" shadow="hover">
    <!-- 卡片头部 -->
    <div class="card-header">
      <div class="home-info">
        <h3 class="home-name">{{ home.name }}</h3>
        <el-tag :type="roleTagType" size="small">
          {{ userRole }}
        </el-tag>
      </div>
      <div class="home-actions">
        <el-button type="primary" link size="small" @click="emit('view', home)">
          查看
        </el-button>
      </div>
    </div>

    <!-- 卡片内容 -->
    <div class="card-content">
      <div class="home-address">
        <el-icon><location /></el-icon>
        <span class="address-text">{{ home.address }}</span>
      </div>

      <div class="home-meta">
        <div class="meta-item">
          <span class="meta-label">创建时间:</span>
          <span class="meta-value">{{ formattedCreateTime }}</span>
        </div>
      </div>
    </div>

    <!-- 卡片底部 -->
    <template #footer>
      <div class="card-footer">
        <el-button type="primary" size="small" @click="emit('view', home)">
          详情
        </el-button>
        <el-button
          v-if="homeStore.ownedHomes.some(h => h.homeId === home.id)"
          type="warning"
          size="small"
          @click="emit('edit', home)"
        >
          编辑
        </el-button>
        <el-button
          v-if="homeStore.ownedHomes.some(h => h.homeId === home.id)"
          type="danger"
          size="small"
          @click="emit('delete', home)"
        >
          删除
        </el-button>
      </div>
    </template>
  </el-card>
</template>

<style lang="scss" scoped>
.home-card {
  height: 100%;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16px;

    .home-info {
      .home-name {
        margin: 0 0 8px 0;
        font-size: 18px;
        font-weight: 600;
        color: var(--el-text-color-primary);
      }
    }

    .home-actions {
      display: flex;
      gap: 4px;
    }
  }

  .card-content {
    .home-address {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
      color: var(--el-text-color-secondary);

      .address-text {
        font-size: 14px;
        line-height: 1.4;
      }
    }

    .home-meta {
      .meta-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;

        .meta-label {
          font-size: 12px;
          color: var(--el-text-color-secondary);
        }

        .meta-value {
          font-size: 12px;
          color: var(--el-text-color-primary);
          font-weight: 500;
        }
      }
    }
  }

  .card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
  }
}

@media (max-width: 480px) {
  .card-footer {
    flex-direction: column;
    gap: 8px;

    .el-button {
      width: 100%;
    }
  }
}
</style>
