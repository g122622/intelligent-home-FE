<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useHomeStore } from "@/store/modules/home";
import { ElMessage, ElMessageBox } from "element-plus";
import HomeCard from "./components/HomeCard.vue";
import HomeForm from "./components/HomeForm.vue";
import HomeFilter from "./components/HomeFilter.vue";
import HomeStats from "./components/HomeStats.vue";
import {
  Search,
  Plus,
  Refresh,
  HomeFilled,
  User,
  Setting
} from "@element-plus/icons-vue";
import { useRouter } from "vue-router";

const router = useRouter();
const homeStore = useHomeStore();
const searchKeyword = ref("");
const selectedRole = ref<"all" | "owner" | "member" | "guest">("all");
const showHomeForm = ref(false);
const editingHome = ref<any>(null);
const loading = ref(false);

// 过滤后的家庭列表
const filteredHomes = computed(() => {
  return homeStore.homes.filter(home => {
    const nameMatch = home.name
      .toLowerCase()
      .includes(searchKeyword.value.toLowerCase());
    const addressMatch = home.address
      .toLowerCase()
      .includes(searchKeyword.value.toLowerCase());

    const roleMatch =
      selectedRole.value === "all" ||
      (selectedRole.value === "owner" &&
        homeStore.ownedHomes.some(h => h.homeId === home.id)) ||
      (selectedRole.value === "member" &&
        homeStore.memberHomes.some(h => h.homeId === home.id)) ||
      (selectedRole.value === "guest" &&
        homeStore.guestHomes.some(h => h.homeId === home.id));

    return (nameMatch || addressMatch) && roleMatch;
  });
});

// 初始化数据
const initializeData = async () => {
  loading.value = true;
  try {
    await homeStore.initialize();
  } catch (error) {
    ElMessage.error("初始化家庭数据失败");
  } finally {
    loading.value = false;
  }
};

// 刷新数据
const refreshData = async () => {
  loading.value = true;
  try {
    await homeStore.fetchUserHomes();
    ElMessage.success("数据刷新成功");
  } catch (error) {
    ElMessage.error("刷新数据失败");
  } finally {
    loading.value = false;
  }
};

// 打开添加家庭表单
const openAddForm = () => {
  editingHome.value = null;
  showHomeForm.value = true;
};

// 打开编辑家庭表单
const openEditForm = (home: any) => {
  editingHome.value = { ...home };
  showHomeForm.value = true;
};

// 删除家庭
const handleDeleteHome = async (home: any) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除家庭 "${home.name}" 吗？此操作不可恢复。`,
      "确认删除",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }
    );

    await homeStore.removeHome(home.id);
    ElMessage.success("家庭删除成功");
  } catch (error) {
    if (error !== "cancel") {
      ElMessage.error("删除家庭失败");
    }
  }
};

// 查看家庭详情
const viewHomeDetail = (home: any) => {
  router.push(`/home/detail/${home.id}`);
};

// 处理表单提交
const handleFormSubmit = async () => {
  showHomeForm.value = false;
  await refreshData();
};

onMounted(() => {
  initializeData();
});
</script>

<template>
  <div class="home-management">
    <!-- 页面标题和操作栏 -->
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">家庭管理</h1>
        <p class="page-subtitle">管理您的智能家居家庭</p>
      </div>
      <div class="header-actions">
        <el-button :icon="Refresh" :loading="loading" @click="refreshData">
          刷新
        </el-button>
        <el-button type="primary" :icon="Plus" @click="openAddForm">
          创建家庭
        </el-button>
      </div>
    </div>

    <!-- 家庭统计卡片 -->
    <HomeStats />

    <!-- 筛选工具栏 -->
    <HomeFilter
      v-model:searchKeyword="searchKeyword"
      v-model:selectedRole="selectedRole"
    />

    <!-- 家庭网格 -->
    <div class="home-grid-container">
      <div v-if="loading" class="loading-container">
        <el-skeleton :rows="6" animated />
      </div>

      <template v-else>
        <div v-if="filteredHomes.length === 0" class="empty-state">
          <el-empty description="暂无家庭数据" />
        </div>

        <div v-else class="home-grid">
          <HomeCard
            v-for="home in filteredHomes"
            :key="home.id"
            :home="home"
            @view="viewHomeDetail(home)"
            @edit="openEditForm(home)"
            @delete="handleDeleteHome(home)"
          />
        </div>
      </template>
    </div>

    <!-- 家庭表单对话框 -->
    <HomeForm
      v-model:visible="showHomeForm"
      :home="editingHome"
      @submit="handleFormSubmit"
    />
  </div>
</template>

<style lang="scss" scoped>
.home-management {
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

.home-grid-container {
  margin-top: 24px;
}

.loading-container {
  padding: 40px 0;
}

.empty-state {
  padding: 60px 0;
}

.home-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 20px;
  margin-top: 16px;
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

  .home-grid {
    grid-template-columns: 1fr;
  }
}

// 动画效果
.home-card-enter-active,
.home-card-leave-active {
  transition: all 0.3s ease;
}

.home-card-enter-from,
.home-card-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
