<script setup lang="ts">
import { type PropType, ref, computed, onMounted, onUnmounted } from "vue";
import { useDark, useECharts } from "@pureadmin/utils";

const props = defineProps({
  data: {
    type: Array as PropType<
      Array<{ name: string; values: number[]; color: string }>
    >,
    default: () => []
  },
  timestamps: {
    type: Array as PropType<string[]>,
    default: () => []
  }
});

const { isDark } = useDark();

const theme = computed(() => (isDark.value ? "dark" : "light"));

const chartRef = ref();
const { setOptions, resize } = useECharts(chartRef, {
  theme,
  renderer: "svg"
});

setOptions({
  toolbox: {
    feature: {
      saveAsImage: {},
      dataView: {},
      restore: {}
    }
  },
  container: ".line-card",
  xAxis: {
    type: "category",
    show: true,
    data: props.timestamps,
    axisLabel: {
      show: true,
      formatter: function (value) {
        return value;
      }
    }
  },
  grid: {
    top: "15px",
    bottom: "25px",
    left: "45px",
    right: "15px"
  },
  yAxis: {
    show: true,
    type: "value",
    splitNumber: 8, // 增加分割线数量
    axisLabel: {
      show: true,
      formatter: function (value) {
        return (
          value +
          (props.data[0].name === "温度"
            ? "°C"
            : props.data[0].name === "湿度"
              ? "%"
              : "kWh")
        );
      }
    },
    min: function (value) {
      return Math.floor(value.min * 0.9);
    },
    max: function (value) {
      return Math.ceil(value.max * 1.1);
    }
  },
  tooltip: {
    trigger: "axis",
    formatter: function (params) {
      let result = params[0].axisValue + "<br>";
      params.forEach(item => {
        result += `${item.marker} ${item.seriesName}: ${item.value}<br>`;
      });
      return result;
    }
  },
  series: props.data.map(item => ({
    name: item.name,
    data: item.values,
    type: "line",
    symbol: "none",
    smooth: true,
    color: item.color,
    lineStyle: {
      shadowOffsetY: 3,
      shadowBlur: 7,
      shadowColor: item.color
    }
  }))
});

function handleResize() {
  resize();
}

onMounted(() => {
  window.addEventListener("resize", handleResize);
});
onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});
</script>

<template>
  <div ref="chartRef" class="chart-line-container" />
</template>
<style scoped>
.chart-line-container {
  width: 100%;
  height: 250px;
}
@media (max-width: 600px) {
  .chart-line-container {
    height: 180px;
  }
}
</style>
