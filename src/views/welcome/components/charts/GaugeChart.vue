<script setup lang="ts">
import { useDark, useECharts } from "@pureadmin/utils";
import { type PropType, ref, computed, watch, nextTick } from "vue";

const props = defineProps({
  value: {
    type: Number,
    default: 0
  },
  max: {
    type: Number,
    default: 100
  },
  title: {
    type: String,
    default: "湿度"
  },
  unit: {
    type: String,
    default: "%"
  },
  color: {
    type: String,
    default: "#41b6ff"
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
      series: [
        {
          type: "gauge",
          startAngle: 180,
          endAngle: 0,
          min: 0,
          max: props.max,
          progress: {
            show: true,
            width: 18
          },
          pointer: {
            show: false
          },
          axisLine: {
            lineStyle: {
              width: 18,
              color: [
                [0.3, "#FF6E76"],
                [0.7, "#FDDD60"],
                [1, "#37A2DA"]
              ]
            }
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: false
          },
          axisLabel: {
            show: false
          },
          detail: {
            valueAnimation: true,
            fontSize: 24,
            fontWeight: "bold",
            formatter: `{value}${props.unit}`,
            color: props.color,
            offsetCenter: [0, "30%"]
          },
          title: {
            fontSize: 14,
            offsetCenter: [0, "70%"],
            color: isDark.value ? "#fff" : "#606266"
          },
          data: [
            {
              value: props.value,
              name: props.title
            }
          ]
        }
      ]
    });
  },
  { deep: true, immediate: true }
);
</script>

<template>
  <div ref="chartRef" style="width: 100%; height: 200px" />
</template>
