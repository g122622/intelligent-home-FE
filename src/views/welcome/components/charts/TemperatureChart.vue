<script setup lang="ts">
import { useDark, useECharts } from "@pureadmin/utils";
import { type PropType, ref, computed, watch, nextTick } from "vue";

interface TemperatureData {
  timestamps: string[];
  values: number[];
}

const props = defineProps({
  data: {
    type: Object as PropType<TemperatureData>,
    default: () => ({ timestamps: [], values: [] })
  },
  title: {
    type: String,
    default: "温度趋势"
  }
});

const { isDark } = useDark();
const theme = computed(() => (isDark.value ? "dark" : "light"));

const chartRef = ref();
const { setOptions } = useECharts(chartRef, { theme });

watch(
  () => props,
  async () => {
    await nextTick();
    setOptions({
      tooltip: {
        trigger: "axis",
        formatter: "{b}<br/>{a}: {c}°C"
      },
      grid: {
        top: "30px",
        left: "50px",
        right: "20px",
        bottom: "40px"
      },
      xAxis: {
        type: "category",
        data: props.data.timestamps,
        axisLabel: {
          fontSize: 12,
          rotate: 45
        }
      },
      yAxis: {
        type: "value",
        name: "温度 (°C)",
        nameTextStyle: {
          fontSize: 12
        },
        axisLabel: {
          fontSize: 12
        }
      },
      series: [
        {
          name: "温度",
          type: "line",
          data: props.data.values,
          smooth: true,
          lineStyle: {
            width: 3,
            color: "#e85f33"
          },
          itemStyle: {
            color: "#e85f33"
          },
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: "rgba(232, 95, 51, 0.3)"
                },
                {
                  offset: 1,
                  color: "rgba(232, 95, 51, 0.1)"
                }
              ]
            }
          }
        }
      ]
    });
  },
  { deep: true, immediate: true }
);
</script>

<template>
  <div ref="chartRef" style="width: 100%; height: 350px" />
</template>
