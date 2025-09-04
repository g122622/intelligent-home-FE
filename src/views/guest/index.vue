<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useGuestStore } from "@/store/modules/guest";
import { useUserStore } from "@/store/modules/user";
import { useHomeStore } from "@/store/modules/home";
import { ElMessage } from "element-plus";
import {
  User,
  Lock,
  Setting,
  Bell,
  Monitor,
  Refresh,
  Plus
} from "@element-plus/icons-vue";
import { useRouter } from "vue-router";

const router = useRouter();
const guestStore = useGuestStore();
const userStore = useUserStore();
const homeStore = useHomeStore();
const loading = ref(false);
const activeTab = ref("permission");

// 统计数据
const stats = ref([
  {
    title: "可访问设备",
    value: 0,
    icon: Monitor,
    color: "primary",
    path: "/guest/accessible-devices"
  },
  {
    title: "待处理请求",
    value: 0,
    icon: Bell,
    color: "warning",
    path: "/guest/join-requests"
  },
  {
    title: "权限说明",
    value: "",
    icon: Lock,
    color: "success",
    path: "/guest/permission-info"
  }
]);

// 初始化数据
const initializeData = async () => {
  loading.value = true;
  try {
    await Promise.all([
      guestStore.fetchPermissionInfo(),
      homeStore.fetchMyHomes()
    ]);
    
    // 如果有当前家庭，加载相关数据
    if (homeStore.selectedHomeId) {
      await guestStore.fetchJoinRequests(homeStore.selectedHomeId);
      if (userStore.userInfo?.id) {
        await guestStore.fetchAccessibleDevices(
          userStore.userInfo.id,
          homeStore.selectedHomeId
        );
      }
    }

    // 更新统计数据
    stats.value[0].value = guestStore.accessibleDevices.length;
    stats.value[1].value = guestStore.joinRequests.filter(
      req => req.status === 0
    ).length;
    stats.value[2].value = guestStore.permissionInfo?.role || "";

  } catch (error) {
    ElMessage.error("初始化访客数据失败");
  } finally {
    loading.value = false;
  }
};

// 刷新数据
const refreshData = async () => {
  loading.value = true;
  try {
    await initializeData();
    ElMessage.success("数据刷新成功");
  } catch (error) {
    ElMessage.error("刷新数据失败");
  } finally {
    loading.value = false;
  }
};

// 导航到对应页面
const navigateTo = (path: string) => {
  router.push(path);
};

onMounted(() => {
  initializeData();
});
</script>

<template>
  <div class="guest-management">
    <!-- 页面标题和操作栏 -->
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">访客管理</h1>
        <p class="page-subtitle">管理访客权限和加入请求</p>
      </div>
      <div class="header-actions">
        <el-button :icon="Refresh" :loading="loading" @click="refreshData">
          刷新
        </el-button>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-grid">
      <el-card
        v-for="(stat, index) in stats"
        :key="index"
        class="stat-card"
        :class="`stat-card--${stat.color}`"
        shadow="hover"
        @click="navigateTo(stat.path)"
      >
        <div class="stat-content">
          <div class="stat-icon">
            <el-icon :size="32">
              <component :is="stat.icon" />
            </el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">
              {{ stat.value }}
            </div>
            <div class="stat-title">
              {{ stat.title }}
            </div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 功能导航 -->
    <el-card class="navigation-card">
      <template #header>
        <div class="card-header">
          <h3>功能导航</h3>
        </div>
      </template>

      <div class="navigation-grid">
        <el-button
          type="primary"
          :icon="Lock"
          @click="navigateTo('/guest/permission-info')"
        >
          权限说明
        </el-button>
        <el-button
          type="warning"
          :icon="Bell"
          @click="navigateTo('/guest/join-requests')"
        >
          加入请求
          <el-badge
            v-if="stats[1].value > 0"
            :value="stats[1].value"
            class="badge"
          />
        </el-button>
        <el-button
          type="success"
          :icon="Monitor"
          @click="navigateTo('/guest/accessible-devices')"
        >
          可访问设备
        </el-button>
      </div>
    </el-card>

    <!-- 快速操作 -->
    <el-card class="quick-actions-card">
      <template #header>
        <div class="card-header">
          <h3>快速操作</h3>
        </div>
      </template>

      <div class="quick-actions">
        <el-button type="primary" :icon="Plus">
          邀请访客
        </el-button>
        <el-button type="info" :icon="Setting">
          权限设置
        </el-button>
        <el-button type="warning" :icon="User">
          访客列表
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.guest-management {
  padding: 24px;
  min-height: 100%;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--el-border-color-light);

  .header-left {
    .page-title {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
      color: var(--el-text-color-primary);
    }

    .page-subtitle {
      margin: 4px 0 0;
      font-size: 14px;
      color: var(--el-text-color-secondary);
    }
  }

  .header-actions {
    display: flex;
    gap: 12px;
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.stat-card {
  cursor: pointer;
  border: none;
  border-radius: 12px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--el-box-shadow-light);
  }

  &--primary {
    border-left: 4px solid var(--el-color-primary);
  }

  &--warning {
    border-left: 4px solid var(--el-color-warning);
  }

  &--success {
    border-left: 4px solid var(--el-color-success);
  }

  .stat-content {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px;

    .stat-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 60px;
      height: 60px;
      border-radius: 12px;
      background: linear-gradient(135deg, var(--el-color-primary-light-9), var(--el-color-primary-light-7));

      .el-icon {
        color: var(--el-color-primary);
      }
    }

    .stat-info {
      flex: 1;

      .stat-value {
        font-size: 24px;
        font-weight: 600;
        color: var(--el-text-color-primary);
        margin-bottom: 4px;
      }

      .stat-title {
        font-size: 14px;
        color: var(--el-text-color-secondary);
      }
    }
  }
}

.navigation-card,
.quick-actions-card {
  margin-bottom: 24px;
  border: none;
  border-radius: 12px;

  :deep(.el-card__header) {
    border-bottom: 1px solid var(--el-border-color-light);
    padding: 20px;

    .card-header {
      h3 {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
        color: var(--el-text-color-primary);
      }
    }
  }

  :deep(.el-card__body) {
    padding: 20px;
  }
}

.navigation-grid,
.quick-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.badge {
  margin-left: 8px;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 16px;

    .header-actions {
      width: 100%;
      justify-content: flex-end;
    }
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .navigation-grid,
  .quick-actions {
    grid-template-columns: 1fr;
  }
}

// 动画效果
.stat-card {
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
  }
}

.el-button {
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-1px);
  }
}
</style>