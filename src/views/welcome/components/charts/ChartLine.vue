<script setup lang="ts">
import { type PropType, ref, computed } from "vue";
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
const { setOptions } = useECharts(chartRef, {
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
</script>

<template>
  <div ref="chartRef" style="width: 100%; height: 300px" />
</template>
