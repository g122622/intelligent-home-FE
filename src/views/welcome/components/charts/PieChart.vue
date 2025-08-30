<script setup lang="ts">
import { useDark, useECharts } from "@pureadmin/utils";
import { type PropType, ref, computed, watch, nextTick } from "vue";

interface PieData {
  category: string;
  value: number;
  percentage: number;
}

const props = defineProps({
  data: {
    type: Array as PropType<PieData[]>,
    default: () => []
  },
  title: {
    type: String,
    default: "能耗分布"
  }
});

const { isDark } = useDark();
const theme = computed(/**
 * 根据当前主题模式（暗色或亮色）返回对应的字符串标识。
 * @returns {string} - 返回 "dark" 表示暗色模式，返回 "light" 表示亮色模式。
 */
() => (isDark.value ? "dark" : "light"));

const chartRef = ref();
const { setOptions } = useECharts(chartRef, { theme });

watch(
  () => props,
  async () => {
    await nextTick();
    setOptions({
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b}: {c} kWh ({d}%)"
      },
      legend: {
        orient: "vertical",
        right: 10,
        top: "center",
        textStyle: {
          color: isDark.value ? "#fff" : "#606266",
          fontSize: 14
        }
      },
      toolbox: {
        feature: {
          saveAsImage: {},
          dataView: {},
          restore: {}
        }
      },
      animation: {
        duration: 1000,
        easing: "cubicOut"
      },
      series: [
        {
          name: props.title,
          type: "pie",
          radius: ["40%", "70%"],
          avoidLabelOverlap: true,
          itemStyle: {
            borderRadius: 10,
            borderColor: isDark.value ? "#1a1a1a" : "#fff",
            borderWidth: 2,
            color: function (params) {
              const colorList = false
                ? ["#4992ff", "#7cffb2", "#fddd60", "#ff6e76", "#58d9f9"]
                : ["#c23531", "#2f4554", "#61a0a8", "#d48265", "#91c7ae"];
              return colorList[params.dataIndex % colorList.length];
            }
          },
          label: {
            show: true
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 16,
              fontWeight: "bold"
            }
          },
          labelLine: {
            show: true
          },
          data: props.data.map(item => ({
            value: item.value,
            name: `${item.category} (${item.percentage}%)`
          }))
        }
      ]
    });
  },
  { deep: true, immediate: true }
);
</script>

<template>
  <div ref="chartRef" style="width: 100%; height: 300px" />
</template>
