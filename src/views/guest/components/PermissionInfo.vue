<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useGuestStore } from "@/store/modules/guest";
import { ElMessage } from "element-plus";
import { Lock, Warning, Check, Close } from "@element-plus/icons-vue";

const guestStore = useGuestStore();
const loading = ref(false);

// 初始化数据
const initializeData = async () => {
  loading.value = true;
  try {
    await guestStore.fetchPermissionInfo();
  } catch (error) {
    ElMessage.error("获取权限说明失败");
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  initializeData();
});
</script>

<template>
  <div class="permission-info">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">
          <el-icon><Lock /></el-icon>
          访客权限说明
        </h1>
        <p class="page-subtitle">了解访客用户的权限范围和限制</p>
      </div>
    </div>

    <!-- 权限信息卡片 -->
    <el-card v-loading="loading" class="permission-card">
      <template #header>
        <div class="card-header">
          <h2>权限概览</h2>
        </div>
      </template>

      <div v-if="guestStore.permissionInfo" class="permission-content">
        <!-- 角色信息 -->
        <div class="role-section">
          <h3 class="section-title">
            <el-icon><Lock /></el-icon>
            用户角色
          </h3>
          <div class="role-info">
            <el-tag type="info" size="large">
              {{ guestStore.permissionInfo.role }}
            </el-tag>
            <p class="role-description">
              {{ guestStore.permissionInfo.description }}
            </p>
          </div>
        </div>

        <!-- 权限限制 -->
        <div class="restrictions-section">
          <h3 class="section-title">
            <el-icon><Warning /></el-icon>
            权限限制
          </h3>
          <div class="restrictions-list">
            <div
              v-for="(restriction, index) in guestStore.permissionInfo.restrictions"
              :key="index"
              class="restriction-item"
            >
              <el-icon color="#F56C6C"><Close /></el-icon>
              <span>{{ restriction }}</span>
            </div>
          </div>
        </div>

        <!-- 可访问设备类型 -->
        <div class="devices-section">
          <h3 class="section-title">
            <el-icon><Check /></el-icon>
            可访问设备类型
          </h3>
          <div class="devices-grid">
            <el-tag
              v-for="typeId in guestStore.permissionInfo.accessibleDeviceTypes"
              :key="typeId"
              type="success"
              class="device-tag"
            >
              类型 {{ typeId }}
            </el-tag>
          </div>
        </div>

        <!-- 允许的操作 -->
        <div class="operations-section">
          <h3 class="section-title">
            <el-icon><Check /></el-icon>
            允许的操作
          </h3>
          <div class="operations-list">
            <div class="operation-item">
              <el-icon color="#67C23A"><Check /></el-icon>
              <span>查看设备状态 (操作ID: 1)</span>
            </div>
            <div class="operation-item">
              <el-icon color="#67C23A"><Check /></el-icon>
              <span>查看设备详情 (操作ID: 2)</span>
            </div>
            <div
              v-for="opId in guestStore.permissionInfo.allowedOperations.filter(op => op > 2)"
              :key="opId"
              class="operation-item"
            >
              <el-icon color="#67C23A"><Check /></el-icon>
              <span>其他操作 (操作ID: {{ opId }})</span>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="empty-state">
        <el-empty description="暂无权限信息" />
      </div>
    </el-card>

    <!-- 使用提示 -->
    <el-card class="tips-card">
      <template #header>
        <div class="card-header">
          <h2>使用提示</h2>
        </div>
      </template>

      <div class="tips-content">
        <div class="tip-item">
          <el-icon color="#409EFF"><InfoFilled /></el-icon>
          <div>
            <h4>权限自动应用</h4>
            <p>访客用户的权限会自动应用，无需手动配置</p>
          </div>
        </div>
        <div class="tip-item">
          <el-icon color="#409EFF"><InfoFilled /></el-icon>
          <div>
            <h4>实时生效</h4>
            <p>权限变更会立即生效，无需重新登录</p>
          </div>
        </div>
        <div class="tip-item">
          <el-icon color="#409EFF"><InfoFilled /></el-icon>
          <div>
            <h4>安全保护</h4>
            <p>系统会自动保护敏感设备，防止未授权访问</p>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.permission-info {
  padding: 24px;
  max-width: 1000px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 32px;
  text-align: center;

  .page-title {
    margin: 0;
    font-size: 28px;
    font-weight: 600;
    color: var(--el-text-color-primary);
    display: flex;
    align-items: center;
    justify-content: center;
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

.permission-card,
.tips-card {
  margin-bottom: 24px;
  border: none;
  border-radius: 12px;

  :deep(.el-card__header) {
    border-bottom: 1px solid var(--el-border-color-light);
    padding: 20px;

    h2 {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
      color: var(--el-text-color-primary);
    }
  }

  :deep(.el-card__body) {
    padding: 24px;
  }
}

.permission-content {
  .section-title {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0 0 16px 0;
    font-size: 18px;
    font-weight: 600;
    color: var(--el-text-color-primary);

    .el-icon {
      font-size: 20px;
    }
  }

  .role-section,
  .restrictions-section,
  .devices-section,
  .operations-section {
    margin-bottom: 32px;
    padding-bottom: 24px;
    border-bottom: 1px solid var(--el-border-color-light);

    &:last-child {
      margin-bottom: 0;
      padding-bottom: 0;
      border-bottom: none;
    }
  }

  .role-info {
    .el-tag {
      margin-bottom: 12px;
      font-size: 16px;
      padding: 8px 16px;
    }

    .role-description {
      margin: 0;
      font-size: 14px;
      color: var(--el-text-color-secondary);
      line-height: 1.6;
    }
  }

  .restrictions-list {
    .restriction-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      margin-bottom: 8px;
      background: var(--el-color-danger-light-9);
      border-radius: 8px;
      border-left: 4px solid var(--el-color-danger);

      .el-icon {
        font-size: 18px;
      }

      span {
        font-size: 14px;
        color: var(--el-text-color-primary);
      }
    }
  }

  .devices-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;

    .device-tag {
      font-size: 14px;
      padding: 8px 12px;
    }
  }

  .operations-list {
    .operation-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      margin-bottom: 8px;
      background: var(--el-color-success-light-9);
      border-radius: 8px;
      border-left: 4px solid var(--el-color-success);

      .el-icon {
        font-size: 18px;
      }

      span {
        font-size: 14px;
        color: var(--el-text-color-primary);
      }
    }
  }
}

.tips-content {
  .tip-item {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    padding: 16px;
    margin-bottom: 16px;
    background: var(--el-color-primary-light-9);
    border-radius: 8px;
    border-left: 4px solid var(--el-color-primary);

    &:last-child {
      margin-bottom: 0;
    }

    .el-icon {
      font-size: 24px;
      margin-top: 2px;
    }

    div {
      flex: 1;

      h4 {
        margin: 0 0 4px 0;
        font-size: 16px;
        font-weight: 600;
        color: var(--el-text-color-primary);
      }

      p {
        margin: 0;
        font-size: 14px;
        color: var(--el-text-color-secondary);
        line-height: 1.5;
      }
    }
  }
}

.empty-state {
  padding: 40px 0;
  text-align: center;
}

@media (max-width: 768px) {
  .permission-info {
    padding: 16px;
  }

  .page-header {
    .page-title {
      font-size: 24px;
    }
  }

  .permission-content {
    .section-title {
      font-size: 16px;
    }

    .devices-grid {
      justify-content: center;
    }
  }

  .tips-content {
    .tip-item {
      flex-direction: column;
      text-align: center;
      gap: 12px;

      .el-icon {
        align-self: center;
      }
    }
  }
}
</style>