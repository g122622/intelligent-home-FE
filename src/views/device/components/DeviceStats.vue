<script setup lang="ts">
import { computed } from "vue";
import { useDeviceStore } from "@/store/modules/device";
import { ElRow, ElCol, ElCard, ElStatistic } from "element-plus";
import { Connection, Disconnect, Check, Clock } from "@element-plus/icons-vue";

const deviceStore = useDeviceStore();

// 计算统计数据
const stats = computed(() => {
  const total = deviceStore.devices.length;
  const online = deviceStore.onlineDevices.length;
  const offline = deviceStore.offlineDevices.length;
  const active = deviceStore.activeDevices.length;
  
  const onlineRate = total > 0 ? ((online / total) * 100).toFixed(1) : "0";
  const activeRate = total > 0 ? ((active / total) * 100).toFixed(1) : "0";
  
  return {
    total,
    online,
    offline,
    active,
    onlineRate,
    activeRate
  };
});

// 统计卡片配置
const statCards = computed(() => [
  {
    title: "设备总数",
    value: stats.value.total,
    icon: Connection,
    color: "var(--el-color-primary)",
    suffix: "台",
    loading: deviceStore.isLoading
  },
  {
    title: "在线设备",
    value: stats.value.online,
    icon: Check,
    color: "var(--el-color-success)",
    suffix: "台",
    loading: deviceStore.isLoading,
    extra: `在线率: ${stats.value.onlineRate}%`
  },
  {
    title: "离线设备",
    value: stats.value.offline,
    icon: Disconnect,
    color: "var(--el-color-danger)",
    suffix: "台",
    loading: deviceStore.isLoading
  },
  {
    title: "活跃设备",
    value: stats.value.active,
    icon: Clock,
    color: "var(--el-color-warning)",
    suffix: "台",
    loading: deviceStore.isLoading,
    extra: `活跃率: ${stats.value.activeRate}%`
  }
]);
</script>

<template>
  <ElRow :gutter="16" class="device-stats">
    <ElCol
      v-for="(card, index) in statCards"
      :key="index"
      :xs="24"
      :sm="12"
      :md="6"
      class="stat-col"
    >
      <ElCard class="stat-card" shadow="hover">
        <div class="stat-content">
          <!-- 图标区域 -->
          <div class="stat-icon" :style="{ color: card.color }">
            <ElIcon size="24">
              <component :is="card.icon" />
            </ElIcon>
          </div>
          
          <!-- 统计数字 -->
          <div class="stat-main">
            <ElStatistic
              :value="card.value"
              :title="card.title"
              :precision="0"
              :loading="card.loading"
            >
              <template #suffix>
                <span class="stat-suffix">{{ card.suffix }}</span>
              </template>
            </ElStatistic>
            
            <!-- 额外信息 -->
            <div v-if="card.extra" class="stat-extra">
              {{ card.extra }}
            </div>
          </div>
        </div>
        
        <!-- 卡片底部装饰 -->
        <div class="stat-decoration" :style="{ backgroundColor: card.color }"></div>
      </ElCard>
    </ElCol>
  </ElRow>
</template>

<style lang="scss" scoped>
.device-stats {
  margin-bottom: 24px;
}

.stat-col {
  margin-bottom: 16px;
}

.stat-card {
  position: relative;
  overflow: hidden;
  border: none;
  background: linear-gradient(
    135deg,
    var(--el-bg-color),
    var(--el-fill-color-light)
  );
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--el-box-shadow-light);
    
    .stat-decoration {
      width: 100%;
    }
  }

  :deep(.el-card__body) {
    padding: 20px;
    position: relative;
    z-index: 2;
  }
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--el-fill-color-lighter);
  border-radius: 12px;
  transition: all 0.3s ease;
  
  .stat-card:hover & {
    transform: scale(1.1);
    background: var(--el-fill-color);
  }
}

.stat-main {
  flex: 1;
  min-width: 0;
}

:deep(.el-statistic) {
  .el-statistic__head {
    margin-bottom: 4px;
    
    .el-statistic__title {
      font-size: 12px;
      font-weight: 500;
      color: var(--el-text-color-secondary);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
  }
  
  .el-statistic__content {
    .el-statistic__number {
      font-size: 24px;
      font-weight: 700;
      color: var(--el-text-color-primary);
      line-height: 1.2;
    }
  }
}

.stat-suffix {
  font-size: 14px;
  font-weight: 500;
  color: var(--el-text-color-secondary);
  margin-left: 2px;
}

.stat-extra {
  margin-top: 4px;
  font-size: 11px;
  font-weight: 500;
  color: var(--el-text-color-secondary);
  opacity: 0.8;
}

.stat-decoration {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 3px;
  background: var(--el-color-primary);
  transition: width 0.3s ease;
  z-index: 1;
}

// 响应式设计
@media (max-width: 768px) {
  .stat-content {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }
  
  .stat-icon {
    width: 40px;
    height: 40px;
    
    .el-icon {
      font-size: 20px;
    }
  }
  
  :deep(.el-statistic) {
    .el-statistic__content {
      .el-statistic__number {
        font-size: 20px;
      }
    }
  }
}

// 暗色模式优化
:deep() {
  .stat-card {
    background: linear-gradient(
      135deg,
      var(--el-bg-color),
      var(--el-fill-color-dark)
    );
    
    .stat-icon {
      background: var(--el-fill-color-darker);
    }
  }
}

// 动画效果
@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

.stat-card {
  animation: pulse 2s ease-in-out infinite;
  
  &:nth-child(1) {
    animation-delay: 0s;
  }
  &:nth-child(2) {
    animation-delay: 0.5s;
  }
  &:nth-child(3) {
    animation-delay: 1s;
  }
  &:nth-child(4) {
    animation-delay: 1.5s;
  }
  
  &:hover {
    animation: none;
  }
}
</style>