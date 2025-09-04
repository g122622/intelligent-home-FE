<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useHomeStore } from "@/store/modules/home";
import { ElMessage } from "element-plus";
import HomeInfoCard from "./components/HomeInfoCard.vue";
import RoomList from "./components/RoomList.vue";
import MemberList from "./components/MemberList.vue";
import DeviceList from "./components/DeviceList.vue";
import PermissionManager from "./components/PermissionManager.vue";
import {
  HomeFilled,
  User,
  Operation,
  Setting,
  ArrowLeft,
  Refresh
} from "@element-plus/icons-vue";

const route = useRoute();
const router = useRouter();
const homeStore = useHomeStore();

const homeId = computed(() => Number(route.params.id));
const activeTab = ref("info");
const loading = ref(false);

// 加载家庭详情
const loadHomeDetail = async () => {
  loading.value = true;
  try {
    await homeStore.fetchHomeDetail(homeId.value);
  } catch (error) {
    ElMessage.error("加载家庭详情失败");
    router.push("/home/management");
  } finally {
    loading.value = false;
  }
};

// 返回家庭列表
const goBack = () => {
  router.push("/home/management");
};

onMounted(() => {
  if (homeId.value) {
    loadHomeDetail();
  }
});

// 监听homeId变化
watch(homeId, newId => {
  if (newId) {
    loadHomeDetail();
  }
});
</script>

<template>
  <div class="home-detail">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <el-button
          :icon="ArrowLeft"
          link
          size="large"
          class="back-button"
          @click="goBack"
        >
          返回
        </el-button>
        <div class="header-info">
          <h1 class="page-title">
            {{ homeStore.currentHome?.name || "家庭详情" }}
          </h1>
          <p class="page-subtitle">
            {{ homeStore.currentHome?.address || "加载中..." }}
          </p>
        </div>
      </div>
      <div class="header-actions">
        <el-button :icon="Refresh" :loading="loading" @click="loadHomeDetail">
          刷新
        </el-button>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="10" animated />
    </div>

    <!-- 内容区域 -->
    <template v-else-if="homeStore.currentHome">
      <!-- 标签页导航 -->
      <el-tabs v-model="activeTab" class="detail-tabs">
        <el-tab-pane label="基本信息" name="info">
          <HomeInfoCard :home="homeStore.currentHome" />
        </el-tab-pane>

        <el-tab-pane label="房间管理" name="rooms">
          <RoomList :rooms="homeStore.currentHomeRooms" />
        </el-tab-pane>

        <el-tab-pane label="成员管理" name="members">
          <MemberList :members="homeStore.currentHomeMembers" />
        </el-tab-pane>

        <el-tab-pane label="设备概览" name="devices">
          <DeviceList :devices="homeStore.currentHomeDevices" />
        </el-tab-pane>

        <el-tab-pane
          v-if="homeStore.ownedHomes.some(h => h.homeId === homeId)"
          label="权限管理"
          name="permissions"
        >
          <PermissionManager :homeId="homeId" />
        </el-tab-pane>
      </el-tabs>
    </template>

    <!-- 空状态 -->
    <div v-else class="empty-state">
      <el-empty description="家庭信息加载失败" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.home-detail {
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
    display: flex;
    align-items: center;
    gap: 16px;

    .back-button {
      margin-right: 8px;
    }

    .header-info {
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
  }

  .header-actions {
    display: flex;
    gap: 12px;
  }
}

.detail-tabs {
  :deep(.el-tabs__header) {
    margin: 0;

    .el-tabs__nav-wrap::after {
      height: 1px;
    }

    .el-tabs__item {
      font-weight: 500;
      padding: 0 20px;
      height: 48px;
      display: flex;
      align-items: center;
    }
  }

  :deep(.el-tabs__content) {
    padding: 24px 0;
  }
}

.loading-container {
  padding: 40px 0;
}

.empty-state {
  padding: 60px 0;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 16px;

    .header-left {
      width: 100%;
      justify-content: space-between;
    }

    .header-actions {
      width: 100%;
      justify-content: flex-end;
    }
  }

  .detail-tabs {
    :deep(.el-tabs__item) {
      padding: 0 12px;
      font-size: 14px;
    }
  }
}
</style>
