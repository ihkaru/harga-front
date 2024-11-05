<template>
  <div class="sparkline-container">
    <svg :width="width" :height="height" :viewBox="`0 0 ${width} ${height}`">
      <path
        :d="generatePath"
        :stroke="color"
        stroke-width="2"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </div>
</template>

<script setup>
import { computed, defineComponent } from "vue";
defineOptions({
  name: "SparkLine",
});

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
  width: {
    type: Number,
    default: 100,
  },
  height: {
    type: Number,
    default: 30,
  },
  color: {
    type: String,
    default: "#333",
  },
});

const generatePath = computed(() => {
  const data = props.data;
  if (!data.length) return "";

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const xStep = props.width / (data.length - 1);
  const yScale = props.height / range;

  const points = data.map((value, index) => {
    const x = index * xStep;
    const y = props.height - (value - min) * yScale;
    return `${x},${y}`;
  });

  return `M ${points.join(" L ")}`;
});
</script>
