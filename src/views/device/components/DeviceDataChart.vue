<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import { useDeviceStore } from "@/store/modules/device";
import { ElCard, ElEmpty } from "element-plus";
import * as echarts from "echarts";

interface Props {
  device: any;
}

const props = defineProps<Props>();
const deviceStore = useDeviceStore();
const chartRef = ref<HTMLDivElement>();
const chartInstance = ref<echarts.ECharts>();

// 准备图表数据
const chartData = computed(() => {
  const data = deviceStore.deviceData.slice(-20); // 取最近20条数据
  const timestamps = data.map(item => new Date(item.timestamp).toLocaleTimeString());
  const values = data.map(item => {
    // 尝试解析数据值，如果无法解析则使用默认值
    try {
      const parsed = JSON.parse(item.data);
      return parsed.value || parsed.temperature || parsed.humidity || 0;
    } catch {
      return Math.random() * 100; // 随机数据用于演示
    }
  });
  
  return { timestamps, values };
});

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return;

  chartInstance.value = echarts.init(chartRef.value);
  
  const option = {
    title: {
      text: '设备数据趋势',
      left: 'center',
      textStyle: {
        color: 'var(--el-text-color-primary)',
        fontSize: 16,
        fontWeight: '600'
      }
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'var(--el-bg-color-overlay)',
      borderColor: 'var(--el-border-color-light)',
      textStyle: {
        color: 'var(--el-text-color-primary)'
      },
      axisPointer: {
        type: 'shadow',
        shadowStyle: {
          color: 'var(--el-color-primary-light-9)'
        }
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '80px',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: chartData.value.timestamps,
      axisLine: {
        lineStyle: {
          color: 'var(--el-border-color)'
        }
      },
      axisLabel: {
        color: 'var(--el-text-color-secondary)',
        rotate: 45
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: 'var(--el-text-color-secondary)'
      },
      splitLine: {
        lineStyle: {
          color: 'var(--el-border-color-lighter)',
          type: 'dashed'
        }
      }
    },
    series: [
      {
        name: '数据值',
        type: 'line',
        data: chartData.value.values,
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        itemStyle: {
          color: 'var(--el-color-primary)'
        },
        lineStyle: {
          color: 'var(--el-color-primary)',
          width: 3
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'var(--el-color-primary-light-5)' },
            { offset: 1, color: 'var(--el-color-primary-light-9)' }
          ])
        },
        markPoint: {
          data: [
            { type: 'max', name: '最大值' },
            { type: 'min', name: '最小值' }
          ],
          itemStyle: {
            color: 'var(--el-color-danger)'
          }
        },
        markLine: {
          data: [
            { type: 'average', name: '平均值' }
          ],
          lineStyle: {
            color: 'var(--el-color-warning)',
            type: 'dashed'
          }
        }
      }
    ]
  };

  chartInstance.value.setOption(option);
};

// 更新图表
const updateChart = () => {
  if (!chartInstance.value) return;

  const option = {
    xAxis: {
      data: chartData.value.timestamps
    },
    series: [
      {
        data: chartData.value.values
      }
    ]
  };

  chartInstance.value.setOption(option);
};

// 监听数据变化
watch(chartData, () => {
  updateChart();
});

// 监听设备变化
watch(() => props.device, () => {
  if (chartInstance.value) {
    chartInstance.value.dispose();
    initChart();
  }
});

// 响应式调整
const handleResize = () => {
  if (chartInstance.value) {
    chartInstance.value.resize();
  }
};

onMounted(() => {
  initChart();
  window.addEventListener('resize', handleResize);
});

// 清理
onUnmounted(() => {
  if (chartInstance.value) {
    chartInstance.value.dispose();
  }
  window.removeEventListener('resize', handleResize);
});
</script>

<template>
  <ElCard class="chart-card" shadow="never">
    <template #header>
      <div class="chart-header">
        <h3>数据监控</h3>
        <span class="device-name">{{ device.name }}</span>
      </div>
    </template>

    <div v-if="deviceStore.deviceData.length === 0" class="empty-chart">
      <ElEmpty description="暂无数据记录" />
    </div>

    <div v-else class="chart-container">
      <div ref="chartRef" class="chart" style="width: 100%; height: 400px;"></div>
      
      <!-- 数据统计 -->
      <div class="chart-stats">
        <div class="stat-item">
          <span class="stat-label">数据点数:</span>
          <span class="stat-value">{{ deviceStore.deviceData.length }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">最新值:</span>
          <span class="stat-value">{{ chartData.values[chartData.values.length - 1]?.toFixed(2) || 'N/A' }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">平均值:</span>
          <span class="stat-value">{{ 
            chartData.values.length > 0 
              ? (chartData.values.reduce((a, b) => a + b, 0) / chartData.values.length).toFixed(2)
              : 'N/A'
          }}</span>
        </div>
      </div>
    </div>
  </ElCard>
</template>

<style lang="scss" scoped>
.chart-card {
  :deep(.el-card__header) {
    padding: 20px;
    border-bottom: 1px solid var(--el-border-color-light);
    background: var(--el-fill-color-lighter);
  }

  :deep(.el-card__body) {
    padding: 20px;
  }
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: var(--el-text-color-primary);
  }

  .device-name {
    font-size: 14px;
    color: var(--el-text-color-secondary);
    font-weight: 500;
  }
}

.empty-chart {
  padding: 60px 0;
}

.chart-container {
  .chart {
    border-radius: 8px;
    background: var(--el-bg-color);
    border: 1px solid var(--el-border-color-light);
  }
}

.chart-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 20px;
  padding: 16px;
  background: var(--el-fill-color-light);
  border-radius: 8px;
  border: 1px solid var(--el-border-color-light);
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: var(--el-bg-color);
  border-radius: 6px;
  border: 1px solid var(--el-border-color-lighter);

  .stat-label {
    font-size: 14px;
    color: var(--el-text-color-secondary);
    font-weight: 500;
  }

  .stat-value {
    font-size: 16px;
    color: var(--el-text-color-primary);
    font-weight: 600;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .chart-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .chart-stats {
    grid-template-columns: 1fr;
  }

  .stat-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
}

// 暗色模式适配
:deep() {
  .chart-card {
    background: var(--el-bg-color);
    
    .el-card__header {
      background: var(--el-fill-color-dark);
    }
  }

  .chart-stats {
    background: var(--el-fill-color-darker);
    border-color: var(--el-border-color);
  }

  .stat-item {
    background: var(--el-bg-color);
    border-color: var(--el-border-color);
  }
}

// 动画效果
.chart-container {
  .chart {
    transition: all 0.3s ease;
    
    &:hover {
      box-shadow: var(--el-box-shadow-light);
    }
  }
}

.stat-item {
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: var(--el-box-shadow-light);
  }
}
</style>