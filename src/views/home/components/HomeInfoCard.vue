<script setup lang="ts">
import { computed } from "vue";
import { HomeInfo } from "@/api/home";
import { useHomeStore } from "@/store/modules/home";
import { ElMessage } from "element-plus";
import { DocumentCopy, Location, Edit, Refresh } from "@element-plus/icons-vue";

const props = defineProps<{
  home: HomeInfo;
}>();

const homeStore = useHomeStore();

// 格式化创建时间
const formattedCreateTime = computed(() => {
  return new Date(props.home.createTime).toLocaleString();
});

// 用户角色
const userRole = computed(() => {
  const myHome = homeStore.myHomes.find(h => h.homeId === props.home.id);
  return myHome?.roleName || "未知";
});

// 复制家庭ID
const copyHomeId = async () => {
  try {
    await navigator.clipboard.writeText(props.home.id.toString());
    ElMessage.success("家庭ID已复制到剪贴板");
  } catch (error) {
    ElMessage.error("复制失败");
  }
};
</script>

<template>
  <el-card class="info-card">
    <template #header>
      <div class="card-header">
        <h3 class="card-title">家庭信息</h3>
        <el-tag :type="userRole === '房主' ? 'success' : 'primary'">
          {{ userRole }}
        </el-tag>
      </div>
    </template>

    <div class="info-content">
      <!-- 基本信息 -->
      <div class="info-section">
        <h4 class="section-title">基本信息</h4>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">家庭ID:</span>
            <span class="info-value">
              {{ home.id }}
              <el-button
                type="text"
                size="small"
                title="复制ID"
                @click="copyHomeId"
              >
                <el-icon><document-copy /></el-icon>
              </el-button>
            </span>
          </div>
          <div class="info-item">
            <span class="info-label">家庭名称:</span>
            <span class="info-value">{{ home.name }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">创建时间:</span>
            <span class="info-value">{{ formattedCreateTime }}</span>
          </div>
        </div>
      </div>

      <!-- 地址信息 -->
      <div class="info-section">
        <h4 class="section-title">地址信息</h4>
        <div class="address-content">
          <el-icon><location /></el-icon>
          <span class="address-text">{{ home.address }}</span>
        </div>
      </div>

      <!-- 统计信息 -->
      <div class="info-section">
        <h4 class="section-title">统计信息</h4>
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-number">
              {{ homeStore.currentHomeRooms.length }}
            </div>
            <div class="stat-label">房间数量</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">
              {{ homeStore.currentHomeMembers.length }}
            </div>
            <div class="stat-label">成员数量</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">
              {{ homeStore.currentHomeDevices.length }}
            </div>
            <div class="stat-label">设备数量</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 操作按钮 -->
    <template #footer>
      <div class="card-footer">
        <el-button v-if="userRole === '房主'" type="primary">
          <el-icon><edit /></el-icon>
          编辑信息
        </el-button>
        <el-button type="info">
          <el-icon><refresh /></el-icon>
          刷新数据
        </el-button>
      </div>
    </template>
  </el-card>
</template>

<style lang="scss" scoped>
.info-card {
  border: none;
  border-radius: 12px;
  background: linear-gradient(
    135deg,
    var(--el-bg-color),
    var(--el-fill-color-light)
  );

  :deep(.el-card__header) {
    border-bottom: 1px solid var(--el-border-color-light);
    padding: 20px;

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .card-title {
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

  :deep(.el-card__footer) {
    border-top: 1px solid var(--el-border-color-light);
    padding: 20px;
  }

  .info-content {
    .info-section {
      margin-bottom: 24px;

      &:last-child {
        margin-bottom: 0;
      }

      .section-title {
        margin: 0 0 16px 0;
        font-size: 16px;
        font-weight: 600;
        color: var(--el-text-color-primary);
      }

      .info-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 16px;

        .info-item {
          display: flex;
          flex-direction: column;
          gap: 4px;

          .info-label {
            font-size: 12px;
            color: var(--el-text-color-secondary);
            font-weight: 500;
          }

          .info-value {
            font-size: 14px;
            color: var(--el-text-color-primary);
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 8px;
          }
        }
      }

      .address-content {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        padding: 16px;
        background: var(--el-fill-color-light);
        border-radius: 8px;
        border: 1px solid var(--el-border-color);

        .address-text {
          font-size: 14px;
          color: var(--el-text-color-primary);
          line-height: 1.5;
          flex: 1;
        }
      }

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;

        .stat-item {
          text-align: center;
          padding: 16px;
          background: var(--el-fill-color-light);
          border-radius: 8px;
          border: 1px solid var(--el-border-color);
          transition: all 0.3s ease;

          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }

          .stat-number {
            font-size: 24px;
            font-weight: 700;
            color: var(--el-color-primary);
            margin-bottom: 4px;
          }

          .stat-label {
            font-size: 12px;
            color: var(--el-text-color-secondary);
          }
        }
      }
    }
  }

  .card-footer {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
  }
}

@media (max-width: 768px) {
  .info-grid {
    grid-template-columns: 1fr !important;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr) !important;
  }

  .card-footer {
    flex-direction: column;

    .el-button {
      width: 100%;
    }
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr !important;
  }
}
</style>
