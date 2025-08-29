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
const theme = computed(() => (isDark.value ? "dark" : "light"));

const chartRef = ref();
const { setOptions } = useECharts(chartRef, { theme });

watch(
  () => props,
  async () => {
    await nextTick();
    setOptions({
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} kWh ({d}%)'
      },
      legend: {
        orient: 'vertical',
        right: 10,
        top: 'center',
        textStyle: {
          color: isDark.value ? '#fff' : '#606266',
          fontSize: 14
        }
      },
      series: [
        {
          name: props.title,
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: isDark.value ? '#1a1a1a' : '#fff',
            borderWidth: 2
          },
          label: {
            show: false
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 16,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
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