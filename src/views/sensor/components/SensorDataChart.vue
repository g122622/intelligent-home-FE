<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from "vue";
import { useSensorStore } from "@/store/modules/sensor";
import { ElEmpty } from "element-plus";
import * as echarts from "echarts";

interface Props {
  deviceId: number;
  height?: string;
}

const props = withDefaults(defineProps<Props>(), {
  height: "400px"
});

const sensorStore = useSensorStore();
const chartRef = ref<HTMLDivElement>();
const chartInstance = ref<echarts.ECharts>();

// 获取历史数据
const historyData = computed(() => {
  return sensorStore.getDeviceHistoryData(props.deviceId);
});

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return;

  chartInstance.value = echarts.init(chartRef.value);
  updateChart();
};

// 更新图表数据
const updateChart = () => {
  if (!chartInstance.value || historyData.value.length === 0) return;

  const option: echarts.EChartsOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e4e7ed',
      textStyle: {
        color: '#606266'
      },
      axisPointer: {
        type: 'line',
        lineStyle: {
          color: '#409eff',
          width: 1
        }
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: historyData.value.map(item =>
        new Date(item.dataTime).toLocaleTimeString()
      ),
      axisLine: {
        lineStyle: {
          color: '#dcdfe6'
        }
      },
      axisLabel: {
        color: '#606266',
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
      splitLine: {
        lineStyle: {
          color: '#f0f2f5',
          type: 'dashed'
        }
      },
      axisLabel: {
        color: '#606266'
      }
    },
    series: [
      {
        name: '传感器数据',
        type: 'line',
        data: historyData.value.map(item => item.dataValue),
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        itemStyle: {
          color: '#409eff'
        },
        lineStyle: {
          color: '#409eff',
          width: 3
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(64, 158, 255, 0.3)' },
            { offset: 1, color: 'rgba(64, 158, 255, 0.1)' }
          ])
        },
        markPoint: {
          data: [
            { type: 'max', name: '最大值' },
            { type: 'min', name: '最小值' }
          ]
        },
        markLine: {
          data: [
            { type: 'average', name: '平均值' }
          ]
        }
      }
    ],
    dataZoom: [
      {
        type: 'inside',
        start: 0,
        end: 100
      }
    ]
  };

  chartInstance.value.setOption(option);
};

// 响应式调整
const resizeChart = () => {
  chartInstance.value?.resize();
};

// 监听数据变化
watch(historyData, () => {
  updateChart();
}, { deep: true });

onMounted(() => {
  initChart();
  window.addEventListener('resize', resizeChart);
});

// 清理
onUnmounted(() => {
  window.removeEventListener('resize', resizeChart);
  chartInstance.value?.dispose();
});
</script>

<template>
  <div class="sensor-chart-container">
    <div v-if="historyData.length > 0" class="chart-wrapper">
      <div ref="chartRef" class="chart" :style="{ height: height }"></div>
    </div>
    <ElEmpty v-else description="暂无数据" />
  </div>
</template>

<style scoped lang="scss">
.sensor-chart-container {
  width: 100%;
  height: 100%;

  .chart-wrapper {
    width: 100%;
    height: 100%;

    .chart {
      width: 100%;
      height: 100%;
      min-height: 300px;
    }
  }
}
</style>