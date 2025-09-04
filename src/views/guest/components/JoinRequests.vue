<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useGuestStore } from "@/store/modules/guest";
import { useHomeStore } from "@/store/modules/home";
import { ElMessage, ElMessageBox } from "element-plus";
import { Bell, Check, Close, Refresh, User } from "@element-plus/icons-vue";

const guestStore = useGuestStore();
const homeStore = useHomeStore();
const loading = ref(false);
const selectedHomeId = ref<number | null>(null);

// 过滤后的请求列表
const filteredRequests = computed(() => {
  return guestStore.joinRequests.filter(request => 
    selectedHomeId.value === null || request.homeId === selectedHomeId.value
  );
});

// 待处理请求
const pendingRequests = computed(() => {
  return filteredRequests.value.filter(req => req.status === 0);
});

// 已处理请求
const processedRequests = computed(() => {
  return filteredRequests.value.filter(req => req.status !== 0);
});

// 初始化数据
const initializeData = async () => {
  loading.value = true;
  try {
    if (homeStore.selectedHomeId) {
      await guestStore.fetchJoinRequests(homeStore.selectedHomeId);
    } else if (homeStore.homes.length > 0) {
      selectedHomeId.value = homeStore.homes[0].id;
      await guestStore.fetchJoinRequests(homeStore.homes[0].id);
    }
  } catch (error) {
    ElMessage.error("获取加入请求失败");
  } finally {
    loading.value = false;
  }
};

// 处理加入请求
const handleRequest = async (request: any, status: number) => {
  try {
    if (!homeStore.selectedHomeId && !selectedHomeId.value) {
      ElMessage.error("请先选择家庭");
      return;
    }

    const homeId = homeStore.selectedHomeId || selectedHomeId.value!;
    await guestStore.handleJoinRequestAction(homeId, {
      requestId: request.id,
      userId: request.userId,
      status
    });
  } catch (error) {
    ElMessage.error("处理请求失败");
  }
};

// 同意请求
const approveRequest = async (request: any) => {
  try {
    await ElMessageBox.confirm(
      `确定要同意用户 "${request.username}" 的加入请求吗？`,
      "确认同意",
      {
        confirmButtonText: "同意",
        cancelButtonText: "取消",
        type: "success"
      }
    );
    await handleRequest(request, 1);
  } catch (error) {
    if (error !== "cancel") {
      ElMessage.error("操作失败");
    }
  }
};

// 拒绝请求
const rejectRequest = async (request: any) => {
  try {
    await ElMessageBox.confirm(
      `确定要拒绝用户 "${request.username}" 的加入请求吗？`,
      "确认拒绝",
      {
        confirmButtonText: "拒绝",
        cancelButtonText: "取消",
        type: "warning"
      }
    );
    await handleRequest(request, 2);
  } catch (error) {
    if (error !== "cancel") {
      ElMessage.error("操作失败");
    }
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

onMounted(() => {
  initializeData();
});
</script>

<template>
  <div class="join-requests">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">
          <el-icon><Bell /></el-icon>
          加入请求管理
        </h1>
        <p class="page-subtitle">处理用户加入家庭的申请请求</p>
      </div>
      <div class="header-actions">
        <el-button :icon="Refresh" :loading="loading" @click="refreshData">
          刷新
        </el-button>
      </div>
    </div>

    <!-- 家庭选择器 -->
    <el-card class="filter-card">
      <div class="filter-content">
        <span class="filter-label">选择家庭：</span>
        <el-select
          v-model="selectedHomeId"
          placeholder="请选择家庭"
          @change="initializeData"
        >
          <el-option
            v-for="home in homeStore.homes"
            :key="home.id"
            :label="home.name"
            :value="home.id"
          />
        </el-select>
      </div>
    </el-card>

    <!-- 待处理请求 -->
    <el-card v-loading="loading" class="requests-card">
      <template #header>
        <div class="card-header">
          <h2>待处理请求</h2>
          <el-tag type="warning" size="small">
            {{ pendingRequests.length }} 条待处理
          </el-tag>
        </div>
      </template>

      <div v-if="pendingRequests.length === 0" class="empty-state">
        <el-empty description="暂无待处理请求" />
      </div>

      <div v-else class="requests-list">
        <div
          v-for="request in pendingRequests"
          :key="request.id"
          class="request-item pending"
        >
          <div class="request-avatar">
            <el-avatar :size="48" :icon="User" />
          </div>
          <div class="request-info">
            <h4 class="request-username">{{ request.username }}</h4>
            <p class="request-time">
              申请时间：{{ new Date(request.recordTime).toLocaleString() }}
            </p>
            <p class="request-status">
              状态：<el-tag type="warning" size="small">等待处理</el-tag>
            </p>
          </div>
          <div class="request-actions">
            <el-button
              type="success"
              :icon="Check"
              size="small"
              @click="approveRequest(request)"
            >
              同意
            </el-button>
            <el-button
              type="danger"
              :icon="Close"
              size="small"
              @click="rejectRequest(request)"
            >
              拒绝
            </el-button>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 已处理请求 -->
    <el-card class="requests-card">
      <template #header>
        <div class="card-header">
          <h2>历史请求</h2>
          <el-tag type="info" size="small">
            {{ processedRequests.length }} 条已处理
          </el-tag>
        </div>
      </template>

      <div v-if="processedRequests.length === 0" class="empty-state">
        <el-empty description="暂无历史请求" />
      </div>

      <div v-else class="requests-list">
        <div
          v-for="request in processedRequests"
          :key="request.id"
          class="request-item processed"
          :class="request.status === 1 ? 'approved' : 'rejected'"
        >
          <div class="request-avatar">
            <el-avatar :size="48" :icon="User" />
          </div>
          <div class="request-info">
            <h4 class="request-username">{{ request.username }}</h4>
            <p class="request-time">
              处理时间：{{ new Date(request.recordTime).toLocaleString() }}
            </p>
            <p class="request-status">
              状态：
              <el-tag
                :type="request.status === 1 ? 'success' : 'danger'"
                size="small"
              >
                {{ request.statusName }}
              </el-tag>
            </p>
          </div>
          <div class="request-result">
            <el-icon
              :color="request.status === 1 ? '#67C23A' : '#F56C6C'"
              :size="24"
            >
              <component :is="request.status === 1 ? Check : Close" />
            </el-icon>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.join-requests {
  padding: 24px;
  max-width: 1000px;
  margin: 0 auto;
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
      font-size: 28px;
      font-weight: 600;
      color: var(--el-text-color-primary);
      display: flex;
      align-items: center;
      gap: 12px;

      .el-icon {
        font-size: 32px;
      }
    }

    .page-subtitle {
      margin: 8px 0 0;
      font-size: 16px;
      color: var(--el-text-color-secondary);
    }
  }
}

.filter-card {
  margin-bottom: 24px;
  border: none;
  border-radius: 12px;

  .filter-content {
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

.requests-card {
  margin-bottom: 24px;
  border: none;
  border-radius: 12px;

  :deep(.el-card__header) {
    border-bottom: 1px solid var(--el-border-color-light);
    padding: 20px;

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      h2 {
        margin: 0;
        font-size: 20px;
        font-weight: 600;
        color: var(--el-text-color-primary);
      }
    }
  }

  :deep(.el-card__body) {
    padding: 20px;
  }
}

.requests-list {
  .request-item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px;
    margin-bottom: 12px;
    border-radius: 12px;
    transition: all 0.3s ease;

    &.pending {
      background: var(--el-color-warning-light-9);
      border: 1px solid var(--el-color-warning-light-5);

      &:hover {
        background: var(--el-color-warning-light-8);
        transform: translateX(4px);
      }
    }

    &.approved {
      background: var(--el-color-success-light-9);
      border: 1px solid var(--el-color-success-light-5);
    }

    &.rejected {
      background: var(--el-color-danger-light-9);
      border: 1px solid var(--el-color-danger-light-5);
    }

    .request-avatar {
      flex-shrink: 0;
    }

    .request-info {
      flex: 1;

      .request-username {
        margin: 0 0 8px 0;
        font-size: 16px;
        font-weight: 600;
        color: var(--el-text-color-primary);
      }

      .request-time,
      .request-status {
        margin: 4px 0;
        font-size: 14px;
        color: var(--el-text-color-secondary);
      }
    }

    .request-actions {
      display: flex;
      gap: 8px;
      flex-shrink: 0;
    }

    .request-result {
      flex-shrink: 0;
    }
  }
}

.empty-state {
  padding: 40px 0;
  text-align: center;
}

@media (max-width: 768px) {
  .join-requests {
    padding: 16px;
  }

  .page-header {
    flex-direction: column;
    gap: 16px;

    .header-actions {
      width: 100%;
      justify-content: flex-end;
    }
  }

  .filter-content {
    flex-direction: column;
    align-items: flex-start !important;
    gap: 8px !important;
  }

  .request-item {
    flex-direction: column;
    text-align: center;
    gap: 12px !important;

    .request-actions {
      width: 100%;
      justify-content: center;
    }
  }
}
</style>