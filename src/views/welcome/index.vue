<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import ReCol from "@/components/ReCol";
import { useDark } from "./utils";
import { ReNormalCountTo } from "@/components/ReCountTo";
import Segmented, { type OptionsType } from "@/components/ReSegmented";
import {
  dashboardCards,
  temperatureTrendData,
  energyDistributionData,
  humidityGaugeData,
  viewModeOptions,
  type TemperatureTrend,
  type EnergyDistribution
} from "./data";
import {
  ChartBar,
  ChartLine,
  ChartRound,
  GaugeChart,
  PieChart,
  TemperatureChart
} from "./components/charts";
import {
  getDashboardOverview,
  getTemperatureTrend,
  getEnergyDistribution,
  type DashboardData
} from "@/api/dashboard";

defineOptions({
  name: "Dashboard"
});

const { isDark } = useDark();

// 视图模式
const currentViewMode = ref("overview");
// 温度趋势数据
const temperatureTrend = ref<TemperatureTrend>(temperatureTrendData);
// 能耗分布数据
const energyDistribution = ref<EnergyDistribution[]>(energyDistributionData);
// 湿度数据
const humidityValue = ref(humidityGaugeData);
// 大屏数据
const dashboardData = ref<DashboardData | null>(null);

// 根据视图模式过滤显示的卡片
const filteredCards = computed(() => {
  switch (currentViewMode.value) {
    case "security":
      return [dashboardCards[3]]; // 只显示安防状态
    case "energy":
      return [dashboardCards[2]]; // 只显示能耗统计
    case "environment":
      return [dashboardCards[1]]; // 只显示环境数据
    default:
      return dashboardCards; // 概览模式显示所有
  }
});

// 加载数据
const loadDashboardData = async () => {
  try {
    const response = await getDashboardOverview();
    dashboardData.value = response.data;

    // 更新本地数据
    if (response.data) {
      temperatureTrend.value = response.data.temperatureTrend;
      energyDistribution.value = response.data.energyDistribution;
      humidityValue.value = response.data.humidityGauge;
    }
  } catch (error) {
    console.error("加载大屏数据失败:", error);
  }
};

// 初始化加载数据
onMounted(() => {
  loadDashboardData();
  // 设置定时刷新数据
  setInterval(loadDashboardData, 30000); // 每30秒刷新一次
});
</script>

<template>
  <div class="dashboard-container">
    <!-- 视图模式切换 -->
    <div class="view-mode-selector">
      <Segmented
        v-model="currentViewMode"
        :options="viewModeOptions"
        size="large"
      />
    </div>

    <!-- 数据卡片区域 -->
    <el-row :gutter="24" justify="space-around" class="mb-6">
      <re-col
        v-for="(item, index) in filteredCards"
        :key="index"
        v-motion
        class="mb-[18px]"
        :value="6"
        :md="12"
        :sm="12"
        :xs="24"
        :initial="{
          opacity: 0,
          y: 100
        }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            delay: 80 * (index + 1)
          }
        }"
      >
        <el-card class="dashboard-card" shadow="never">
          <div class="flex justify-between items-center">
            <span class="text-lg font-semibold">
              {{ item.name }}
            </span>
            <div
              class="w-10 h-10 flex justify-center items-center rounded-lg"
              :style="{
                backgroundColor: isDark ? 'transparent' : item.bgColor
              }"
            >
              <IconifyIconOffline
                :icon="item.icon"
                :color="item.color"
                width="22"
                height="22"
              />
            </div>
          </div>
          <div class="flex justify-between items-start mt-4">
            <div class="w-1/2">
              <ReNormalCountTo
                :duration="item.duration"
                :fontSize="'2em'"
                :startVal="item.value * 0.8"
                :endVal="item.value"
              />
              <p class="font-medium text-green-500 text-lg mt-1">
                {{ item.percent }}
              </p>
            </div>
            <ChartLine
              v-if="item.data.length > 1"
              class="w-1/2!"
              :color="item.color"
              :data="item.data"
            />
            <ChartRound v-else class="w-1/2!" />
          </div>
        </el-card>
      </re-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="24" class="charts-row">
      <!-- 温度趋势图 -->
      <re-col
        v-if="
          currentViewMode === 'overview' || currentViewMode === 'environment'
        "
        v-motion
        class="mb-[18px]"
        :value="12"
        :xs="24"
        :initial="{
          opacity: 0,
          y: 100
        }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            delay: 400
          }
        }"
      >
        <el-card class="chart-card" shadow="never">
          <div class="flex justify-between items-center mb-4">
            <span class="text-lg font-semibold">温度趋势</span>
            <span class="text-sm text-text_color_secondary">最近24小时</span>
          </div>
          <TemperatureChart :data="temperatureTrend" />
        </el-card>
      </re-col>

      <!-- 能耗分布饼图 -->
      <re-col
        v-if="currentViewMode === 'overview' || currentViewMode === 'energy'"
        v-motion
        class="mb-[18px]"
        :value="12"
        :xs="24"
        :initial="{
          opacity: 0,
          y: 100
        }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            delay: 480
          }
        }"
      >
        <el-card class="chart-card" shadow="never">
          <div class="flex justify-between items-center mb-4">
            <span class="text-lg font-semibold">能耗分布</span>
          </div>
          <PieChart :data="energyDistribution" />
        </el-card>
      </re-col>

      <!-- 湿度仪表盘 -->
      <re-col
        v-if="
          currentViewMode === 'overview' || currentViewMode === 'environment'
        "
        v-motion
        class="mb-[18px]"
        :value="6"
        :xs="24"
        :initial="{
          opacity: 0,
          y: 100
        }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            delay: 560
          }
        }"
      >
        <el-card class="chart-card" shadow="never">
          <div class="flex justify-between items-center mb-4">
            <span class="text-lg font-semibold">环境湿度</span>
          </div>
          <GaugeChart
            :value="humidityValue"
            :title="'湿度'"
            :unit="'%'"
            :color="'#37A2DA'"
          />
        </el-card>
      </re-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
.dashboard-container {
  padding: 20px;

  .view-mode-selector {
    margin-bottom: 24px;
    text-align: center;

    :deep(.el-segmented) {
      justify-content: center;
    }
  }

  .dashboard-card {
    min-height: 180px;

    :deep(.el-card__body) {
      padding: 20px;
    }
  }

  .chart-card {
    min-height: 400px;

    :deep(.el-card__body) {
      padding: 20px;
      height: 100%;
    }
  }

  .charts-row {
    margin-top: 20px;
  }

  // 大屏适配样式
  @media (min-width: 1920px) {
    .dashboard-card {
      min-height: 200px;

      :deep(.el-card__body) {
        padding: 24px;
      }
    }

    .chart-card {
      min-height: 450px;

      :deep(.el-card__body) {
        padding: 24px;
      }
    }

    .text-lg {
      font-size: 1.25rem;
    }

    .text-sm {
      font-size: 1rem;
    }
  }

  // 高对比度模式
  .dashboard-card {
    background: linear-gradient(
      135deg,
      var(--el-bg-color),
      var(--el-fill-color-light)
    );
    border: 1px solid var(--el-border-color);

    &:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      transform: translateY(-2px);
      transition: all 0.3s ease;
    }
  }
}

// 大字体优化
:deep() {
  .el-card {
    .text-lg {
      font-size: 1.125rem;
    }

    .text-md {
      font-size: 1rem;
    }

    .text-sm {
      font-size: 0.875rem;
    }
  }

  // 图表容器适配
  .echarts-for-vue {
    width: 100% !important;
    height: 100% !important;
  }
}

// 遥控器操作支持
@media (pointer: coarse) {
  .dashboard-card,
  .chart-card {
    border: 2px solid transparent;

    &:focus {
      border-color: var(--el-color-primary);
      outline: none;
    }
  }
}
</style>
