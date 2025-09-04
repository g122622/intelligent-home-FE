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
  // 不显示工具箱
  xAxis: {
    type: "category",
    show: false,
    data: props.timestamps
  },
  grid: {
    top: "5px",
    bottom: "5px",
    left: "10px",
    right: "10px"
  },
  yAxis: {
    show: false,
    type: "value",
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
      width: 2,
      shadowBlur: 0,
      shadowColor: "transparent"
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
  <div ref="chartRef" class="mini-line-chart-container" />
</template>

<style scoped>
.mini-line-chart-container {
  width: 100%;
  height: 60px;
}
@media (max-width: 600px) {
  .mini-line-chart-container {
    height: 40px;
  }
}
</style>
