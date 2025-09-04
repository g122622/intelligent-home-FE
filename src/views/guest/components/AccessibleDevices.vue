<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useGuestStore } from "@/store/modules/guest";
import { useUserStore } from "@/store/modules/user";
import { useHomeStore } from "@/store/modules/home";
import { ElMessage } from "element-plus";
import { Monitor, Refresh, Search, User, Home } from "@element-plus/icons-vue";

const guestStore = useGuestStore();
const userStore = useUserStore();
const homeStore = useHomeStore();
const loading = ref(false);
const searchKeyword = ref("");
const selectedHomeId = ref<number | null>(null);

// 过滤后的设备列表
const filteredDevices = computed(() => {
  return guestStore.accessibleDevices.filter(device =>
    device.name.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
    device.ipAddress.includes(searchKeyword.value)
  );
});

// 初始化数据
const initializeData = async () => {
  loading.value = true;
  try {
    if (userStore.userInfo?.id && selectedHomeId.value) {
      await guestStore.fetchAccessibleDevices(
        userStore.userInfo.id,
        selectedHomeId.value
      );
    }
  } catch (error) {
    ElMessage.error("获取可访问设备失败");
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

// 获取设备状态标签
const getStatusTag = (status: number) => {
  switch (status) {
    case 1:
      return { type: "success", text: "在线" };
    case 0:
      return { type: "danger", text: "离线" };
    default:
      return { type: "info", text: "未知" };
  }
};

// 获取设备激活状态标签
const getActiveTag = (status: number) => {
  switch (status) {
    case 1:
      return { type: "success", text: "已激活" };
    case 0:
      return { type: "warning", text: "未激活" };
    default:
      return { type: "info", text: "未知" };
  }
};

onMounted(() => {
  if (homeStore.selectedHomeId) {
    selectedHomeId.value = homeStore.selectedHomeId;
  } else if (homeStore.homes.length > 0) {
    selectedHomeId.value = homeStore.homes[0].id;
  }
  initializeData();
});
</script>

<template>
  <div class="accessible-devices">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">
          <el-icon><Monitor /></el-icon>
          可访问设备
        </h1>
        <p class="page-subtitle">访客用户可以查看和操作的设备列表</p>
      </div>
      <div class="header-actions">
        <el-button :icon="Refresh" :loading="loading" @click="refreshData">
          刷新
        </el-button>
      </div>
    </div>

    <!-- 筛选工具栏 -->
    <el-card class="filter-card">
      <div class="filter-content">
        <div class="filter-group">
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
        <div class="filter-group">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索设备名称或IP地址"
            :prefix-icon="Search"
            clearable
          />
        </div>
      </div>
    </el-card>

    <!-- 权限信息 -->
    <el-card class="info-card">
      <template #header>
        <div class="card-header">
          <h2>权限信息</h2>
        </div>
      </template>

      <div class="info-content">
        <div class="info-item">
          <el-icon><User /></el-icon>
          <span>用户角色：</span>
          <el-tag type="info">{{ guestStore.userRole }}</el-tag>
        </div>
        <div class="info-item">
          <el-icon><Monitor /></el-icon>
          <span>可访问设备类型：</span>
          <div class="device-types">
            <el-tag
              v-for="typeId in guestStore.accessibleDeviceTypes"
              :key="typeId"
              type="success"
              size="small"
            >
              类型 {{ typeId }}
            </el-tag>
          </div>
        </div>
        <div class="info-item">
          <el-icon><Home /></el-icon>
          <span>设备数量：</span>
          <el-tag type="primary">{{ guestStore.accessibleDevices.length }}</el-tag>
        </div>
      </div>
    </el-card>

    <!-- 设备列表 -->
    <el-card v-loading="loading" class="devices-card">
      <template #header>
        <div class="card-header">
          <h2>设备列表</h2>
          <el-tag type="primary">
            {{ filteredDevices.length }} 个设备
          </el-tag>
        </div>
      </template>

      <div v-if="filteredDevices.length === 0" class="empty-state">
        <el-empty description="暂无可访问设备" />
      </div>

      <div v-else class="devices-grid">
        <div
          v-for="device in filteredDevices"
          :key="device.id"
          class="device-card"
        >
          <div class="device-header">
            <h3 class="device-name">{{ device.name }}</h3>
            <div class="device-status">
              <el-tag :type="getStatusTag(device.onlineStatus).type" size="small">
                {{ getStatusTag(device.onlineStatus).text }}
              </el-tag>
              <el-tag :type="getActiveTag(device.activeStatus).type" size="small">
                {{ getActiveTag(device.activeStatus).text }}
              </el-tag>
            </div>
          </div>

          <div class="device-info">
            <div class="info-row">
              <el-icon><Monitor /></el-icon>
              <span>设备ID：</span>
              <strong>{{ device.id }}</strong>
            </div>
            <div class="info-row">
              <el-icon><Connection /></el-icon>
              <span>IP地址：</span>
              <code>{{ device.ipAddress }}</code>
            </div>
            <div class="info-row">
              <el-icon><Home /></el-icon>
              <span>家庭ID：</span>
              <span>{{ device.homeId }}</span>
            </div>
            <div class="info-row">
              <el-icon><OfficeBuilding /></el-icon>
              <span>房间ID：</span>
              <span>{{ device.roomId }}</span>
            </div>
            <div class="info-row">
              <el-icon><SetUp /></el-icon>
              <span>设备类型：</span>
              <el-tag type="info" size="small">类型 {{ device.typeId }}</el-tag>
            </div>
            <div class="info-row">
              <el-icon><Clock /></el-icon>
              <span>最后活动：</span>
              <span>{{ new Date(device.lastActiveTime).toLocaleString() }}</span>
            </div>
          </div>

          <div class="device-actions">
            <el-button type="primary" size="small" plain>
              查看详情
            </el-button>
            <el-button type="info" size="small" plain>
              操作日志
            </el-button>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.accessible-devices {
  padding: 24px;
  max-width: 1200px;
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
    gap: 24px;
    align-items: center;

    .filter-group {
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

.info-card,
.devices-card {
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
    padding: 24px;
  }
}

.info-content {
  .info-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 0;
    border-bottom: 1px solid var(--el-border-color-light);

    &:last-child {
      border-bottom: none;
    }

    .el-icon {
      font-size: 18px;
      color: var(--el-text-color-secondary);
    }

    span {
      font-size: 14px;
      color: var(--el-text-color-secondary);
    }

    .device-types {
      display: flex;
      gap: 8px;
    }
  }
}

.devices-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.device-card {
  border: 1px solid var(--el-border-color-light);
  border-radius: 12px;
  padding: 20px;
  background: var(--el-bg-color);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--el-box-shadow-light);
    border-color: var(--el-color-primary-light-5);
  }

  .device-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16px;

    .device-name {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: var(--el-text-color-primary);
    }

    .device-status {
      display: flex;
      gap: 8px;
    }
  }

  .device-info {
    .info-row {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
      font-size: 14px;

      .el-icon {
        font-size: 16px;
        color: var(--el-text-color-secondary);
      }

      span {
        color: var(--el-text-color-secondary);
      }

      strong,
      code {
        color: var(--el-text-color-primary);
      }

      code {
        background: var(--el-fill-color-light);
        padding: 2px 6px;
        border-radius: 4px;
        font-family: monospace;
      }
    }
  }

  .device-actions {
    display: flex;
    gap: 8px;
    margin-top: 16px;
    justify-content: flex-end;
  }
}

.empty-state {
  padding: 40px 0;
  text-align: center;
}

@media (max-width: 768px) {
  .accessible-devices {
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
    gap: 16px !important;

    .filter-group {
      width: 100%;
    }
  }

  .devices-grid {
    grid-template-columns: 1fr;
  }

  .device-card {
    padding: 16px;
  }

  .device-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start !important;
  }

  .device-status {
    width: 100%;
    justify-content: flex-start;
  }

  .device-actions {
    justify-content: center !important;
  }
}
</style>