<script setup lang="ts">
import { computed } from "vue";
import { useHomeStore } from "@/store/modules/home";
import { ReNormalCountTo } from "@/components/ReCountTo";

const homeStore = useHomeStore();

const stats = computed(() => [
  {
    title: "总家庭数",
    value: homeStore.homes.length,
    icon: "ep:home-filled",
    color: "#409EFF",
    bgColor: "rgba(64, 158, 255, 0.1)"
  },
  {
    title: "拥有的家庭",
    value: homeStore.ownedHomes.length,
    icon: "ep:key",
    color: "#67C23A",
    bgColor: "rgba(103, 194, 58, 0.1)"
  },
  {
    title: "成员身份",
    value: homeStore.memberHomes.length,
    icon: "ep:user",
    color: "#E6A23C",
    bgColor: "rgba(230, 162, 60, 0.1)"
  },
  {
    title: "访客身份",
    value: homeStore.guestHomes.length,
    icon: "ep:guide",
    color: "#909399",
    bgColor: "rgba(144, 147, 153, 0.1)"
  }
]);
</script>

<template>
  <div class="home-stats">
    <el-row :gutter="20">
      <el-col
        v-for="(stat, index) in stats"
        :key="index"
        :xs="24"
        :sm="12"
        :md="6"
        class="stat-col"
      >
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <div class="stat-icon" :style="{ backgroundColor: stat.bgColor }">
              <el-icon :color="stat.color" :size="24">
                <component :is="stat.icon" />
              </el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">
                <ReNormalCountTo
                  :endVal="stat.value"
                  :duration="2000"
                  :fontSize="'24px'"
                  :fontWeight="'600'"
                  :color="stat.color"
                />
              </div>
              <div class="stat-title">
                {{ stat.title }}
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
.home-stats {
  margin-bottom: 24px;

  .stat-col {
    margin-bottom: 20px;
  }

  .stat-card {
    border: none;
    border-radius: 12px;
    background: linear-gradient(
      135deg,
      var(--el-bg-color),
      var(--el-fill-color-light)
    );

    :deep(.el-card__body) {
      padding: 20px;
    }

    .stat-content {
      display: flex;
      align-items: center;
      gap: 16px;

      .stat-icon {
        width: 56px;
        height: 56px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .stat-info {
        .stat-value {
          margin-bottom: 4px;
          font-size: 24px;
          font-weight: 600;
          color: var(--el-text-color-primary);
        }

        .stat-title {
          font-size: 14px;
          color: var(--el-text-color-secondary);
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .stat-content {
    flex-direction: column;
    text-align: center;
    gap: 12px !important;

    .stat-info {
      .stat-value {
        font-size: 20px !important;
      }

      .stat-title {
        font-size: 12px !important;
      }
    }
  }
}

// 深色模式适配
:deep(.el-card) {
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }
}
</style>
