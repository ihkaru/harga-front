<template>
  <!-- Template tetap sama seperti sebelumnya -->
  <div class="q-pa-none full-width full-height">
    <q-card class="my-card shadow-0 q-pa-none full-height column">
      <q-card-section class="q-pa-none col">
        <div class="text-right q-pb-md">
          <q-btn
            @click="SyncSerice.updateBackend"
            :loading="loadingUpdate"
            round
            color="secondary"
            icon="refresh"
            class="text-right"
          ></q-btn>
        </div>
        <div class="text-h6 q-mb-xs">{{ selectedCommodity }}</div>
        <div class="text-h5 text-weight-bold">
          Rp {{ displayPrice.toLocaleString() }}
        </div>
        <div :class="[priceChangeClass, 'text-body2']">
          {{ priceChangePrefix }}Rp
          {{ displayPriceChange.toLocaleString() }} ({{
            displayPriceChangePercentage
          }}%)
        </div>
        <div class="text-grey text-caption">
          Harga {{ periodLabels[selectedPeriod] }} ({{
            displayInitialPriceDate ?? ""
          }}): Rp
          {{ displayInitialPrice.toLocaleString() }}
        </div>
      </q-card-section>

      <q-card-section class="chart-container col-12">
        <div
          v-show="showTooltip"
          class="date-tooltip"
          :style="{ left: tooltipPosition + 'px' }"
        >
          {{ displayDate }}
        </div>

        <div
          v-show="showTooltip"
          class="vertical-line"
          :style="{ left: tooltipPosition - 16 + 'px' }"
        ></div>

        <Line
          ref="chartRef"
          :data="chartData"
          :options="chartOptions"
          class="my-chart"
          @mouseout="handleChartLeave"
          @touchend="handleChartLeave"
        />
      </q-card-section>

      <q-card-section class="q-pa-none full-width column justify-between col">
        <div></div>
        <div class="row q-gutter-sm flex justify-evenly">
          <q-btn
            v-for="period in periods"
            :key="period.value"
            :label="period.label"
            :color="selectedPeriod === period.value ? 'primary' : 'grey'"
            @click="changePeriod(period.value)"
            flat
            round
          />
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
defineOptions({
  name: "MainChart",
});
const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});
import { easingEffects } from "chart.js/helpers";
import { ref, computed, onMounted, onBeforeMount, watch } from "vue";
import { Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useUtils } from "src/utils/utils";
import { useSelectionStore } from "src/stores/selectionStore";
import { useSyncService } from "src/services/SyncKomoditas";
const SyncSerice = useSyncService();
const Utils = useUtils();
const loadingUpdate = ref(false);
const selectionStore = useSelectionStore();
const Constants = Utils.Constants;
// Plugin yang dimodifikasi untuk menangani label di ujung grafik

const minMaxLabelsPlugin = {
  id: "minMaxLabels",
  afterDraw: (chart) => {
    const ctx = chart.ctx;
    const dataset = chart.data.datasets[0];
    const meta = chart.getDatasetMeta(0);

    if (!meta.data.length) return;

    const values = dataset.data;
    const maxValue = Math.max(...values);
    const minValue = Math.min(...values);

    const formatNumber = (num) => "Rp " + num.toLocaleString();

    const drawLabel = (value, point, isMax) => {
      ctx.save();
      ctx.fillStyle = dataset.borderColor;
      ctx.font = "12px Arial";

      const text = formatNumber(value);
      const textMetrics = ctx.measureText(text);
      const textWidth = textMetrics.width;
      const textHeight = 16;
      const bgPadding = 4;

      // Mengecek posisi x untuk mencegah label terpotong di sisi kanan/kiri
      let xPos = point.x;
      const chartWidth = chart.width;
      const labelWidth = textWidth + bgPadding * 2;

      // Menyesuaikan posisi x jika label akan terpotong
      if (xPos - labelWidth / 2 < 0) {
        // Jika terlalu kiri
        xPos = labelWidth / 2 + bgPadding;
      } else if (xPos + labelWidth / 2 > chartWidth) {
        // Jika terlalu kanan
        xPos = chartWidth - labelWidth / 2 - bgPadding;
      }

      // Menyesuaikan posisi y dan menambah padding untuk mencegah terpotong
      const chartHeight = chart.height;
      let yPos;
      const labelTotalHeight = textHeight + bgPadding * 2;

      if (isMax) {
        // Untuk label maksimum
        yPos = point.y - 10;
        if (yPos - labelTotalHeight < 0) {
          // Jika akan terpotong di atas, pindah ke bawah titik
          yPos = point.y + labelTotalHeight;
        }
      } else {
        // Untuk label minimum
        yPos = point.y + 20;
        if (yPos + labelTotalHeight > chartHeight) {
          // Jika akan terpotong di bawah, pindah ke atas titik
          yPos = point.y - labelTotalHeight;
        }
      }

      // Menggambar background
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      ctx.fillRect(
        xPos - textWidth / 2 - bgPadding,
        yPos - textHeight / 2,
        textWidth + bgPadding * 2,
        textHeight
      );

      // Menggambar text
      ctx.fillStyle = dataset.borderColor;
      ctx.textAlign = "center";
      ctx.fillText(text, xPos, yPos + textHeight / 4);
      ctx.restore();
    };

    // Mencari dan menggambar label untuk nilai max dan min
    var isMaxLabelDone = false;
    var isMinLabelDone = false;
    meta.data.forEach((point, index) => {
      if (values[index] === maxValue && !isMaxLabelDone) {
        isMaxLabelDone = true;
        drawLabel(maxValue, point, true);
      }
      if (values[index] === minValue && !isMinLabelDone) {
        isMinLabelDone = true;
        drawLabel(minValue, point, false);
      }
    });
  },
};

// Mendaftarkan plugin
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  minMaxLabelsPlugin
);

Utils.generatePriceData("2024-01-01", "2024-11-04", 2);

const commodityData = ref([]);
// console.log(props.data);
// const commodityData = ref(Utils.priceData.value);

const chartRef = ref(null);
const selectedCommodity = ref("Beras");

const selectedPeriod = ref(
  selectionStore.getSelectionByKey(Constants.SELECTED_PERIOD_CHART) ?? "1M"
);
console.log(
  "selected period",
  selectionStore.getSelectionByKey(Constants.SELECTED_PERIOD_CHART)
);
const displayPrice = ref(0);
const displayInitialPrice = ref(0);
const displayInitialPriceDate = ref("");
const displayPriceChange = ref(0);
const displayPriceChangePercentage = ref(0);
const displayDate = ref("");
const lineColor = ref("#FF0000");
const showTooltip = ref(false);
const tooltipPosition = ref(0);

const periods = [
  { label: "1W", value: "1W" },
  { label: "1M", value: "1M" },
  { label: "3M", value: "3M" },
  { label: "YTD", value: "YTD" },
  { label: "1Y", value: "1Y" },
  { label: "ALL", value: "ALL" },
];
const periodLabels = {
  "1W": "1 pekan lalu",
  "1M": "1 bulan lalu",
  "3M": "3 bulan lalu",
  YTD: "Year to Date",
  "1Y": "1 tahun lalu",
  ALL: "awal",
};

onMounted(async () => {
  commodityData.value = props.data?.data;
  selectedCommodity.value = props.data?.nama;
  loadingUpdate.value = SyncSerice.loadingUpdate.value;
  console.log("mainchart", props.data);
});
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const priceChangeClass = computed(() => {
  const change = displayPrice.value - displayInitialPrice.value;
  return change <= 0 ? "text-positive" : "text-negative";
});

const priceChangePrefix = computed(() => {
  const change = displayPrice.value - displayInitialPrice.value;
  return change >= 0 ? "+" : "-";
});

const filteredData = computed(() => {
  const now = new Date();
  const data = [...commodityData.value];

  switch (selectedPeriod.value) {
    case "1D":
      return data.filter((item) => {
        const date = new Date(item.date);
        return date.getTime() >= now.getTime() - 86400000;
      });
    case "1W":
      return data.filter((item) => {
        const date = new Date(item.date);
        return date.getTime() >= now.getTime() - 7 * 86400000;
      });
    case "1M":
      return data.filter((item) => {
        const date = new Date(item.date);
        return date.getTime() >= now.getTime() - 30 * 86400000;
      });
    case "3M":
      return data.filter((item) => {
        const date = new Date(item.date);
        return date.getTime() >= now.getTime() - 90 * 86400000;
      });
    case "YTD":
      return data.filter((item) => {
        const date = new Date(item.date);
        return date.getFullYear() === now.getFullYear();
      });
    case "1Y":
      return data.filter((item) => {
        const date = new Date(item.date);
        return date.getTime() >= now.getTime() - 365 * 86400000;
      });
    case "ALL":
      return data;
    default:
      return data;
  }
});

const updateChartColor = (currentPrice, initialPrice) => {
  lineColor.value = currentPrice <= initialPrice ? "#22C55E" : "#EF4444";
};

const calculatePriceChange = (currentPrice, initialPrice) => {
  const priceChange = Math.abs(currentPrice - initialPrice);
  const priceChangePercentage = (
    ((currentPrice - initialPrice) / initialPrice) *
    100
  ).toFixed(2);
  return { priceChange, priceChangePercentage };
};

const updateDisplayValues = (currentPrice, initialPrice, date) => {
  displayPrice.value = currentPrice;
  displayInitialPrice.value = initialPrice;
  displayDate.value = formatDate(date);
  const { priceChange, priceChangePercentage } = calculatePriceChange(
    currentPrice,
    initialPrice
  );
  displayPriceChange.value = priceChange;
  displayPriceChangePercentage.value = priceChangePercentage;
  updateChartColor(currentPrice, initialPrice);
};

const handleChartLeave = () => {
  showTooltip.value = false;
  if (filteredData.value.length > 0) {
    const lastIndex = filteredData.value.length - 1;
    const currentData = filteredData.value[lastIndex];
    const initialData = filteredData.value[0];
    displayInitialPriceDate.value = initialData.date;
    updateDisplayValues(currentData.price, initialData.price, currentData.date);
  }
};
let easing = easingEffects.easeInCirc;
let restart = false;
const totalDuration = 300;
const duration = (ctx) =>
  (easing(ctx.index / filteredData.value.length) * totalDuration) /
  filteredData.value.length;
const delay = (ctx) =>
  easing(ctx.index / filteredData.value.length) * totalDuration;
const previousY = (ctx) =>
  ctx.index === 0
    ? ctx.chart.scales.y.getPixelForValue(100)
    : ctx.chart
        .getDatasetMeta(ctx.datasetIndex)
        .data[ctx.index - 1].getProps(["y"], true).y;
const animation = {
  x: {
    type: "number",
    easing: "linear",
    duration: duration,
    from: NaN, // the point is initially skipped
    delay(ctx) {
      if (ctx.type !== "data" || ctx.xStarted) {
        return 0;
      }
      ctx.xStarted = true;
      return delay(ctx);
    },
  },
  y: {
    type: "number",
    easing: "linear",
    duration: duration,
    from: previousY,
    delay(ctx) {
      if (ctx.type !== "data" || ctx.yStarted) {
        return 0;
      }
      ctx.yStarted = true;
      return delay(ctx);
    },
  },
};
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    intersect: false,
    mode: "index",
  },
  plugins: {
    legend: {
      display: false,
    },

    tooltip: {
      enabled: false,
    },
  },
  scales: {
    y: {
      display: false,
      // Menambahkan padding pada skala y untuk memberikan ruang bagi label
      beginAtZero: false,
      padding: {
        top: 20,
        bottom: 20,
      },
    },
    x: {
      display: false,
      // Menambahkan padding pada skala x untuk memberikan ruang bagi label
      padding: {
        left: 20,
        right: 20,
      },
    },
  },
  hover: {
    mode: "index",
    intersect: false,
  },
  onHover: (event, elements, chart) => {
    if (!event?.native) return;

    const chartPosition = chart.canvas.getBoundingClientRect();

    if (elements && elements.length) {
      showTooltip.value = true;
      const dataIndex = elements[0].index;
      const currentData = filteredData.value[dataIndex];
      const initialData = filteredData.value[0];
      displayInitialPriceDate.value = initialData.date;

      const xPosition = elements[0].element.x;
      tooltipPosition.value = xPosition + 15;

      updateDisplayValues(
        currentData.price,
        initialData.price,
        currentData.date
      );
    } else {
      showTooltip.value = false;
    }
  },
  events: ["mousemove", "mouseout", "touchstart", "touchmove", "touchend"],
};

const chartData = computed(() => ({
  labels: filteredData.value.map((item) => item.date),
  datasets: [
    {
      label: selectedCommodity.value,
      borderColor: lineColor.value,
      data: filteredData.value.map((item) => item.price),
      tension: 0.2,
      borderWidth: 3,
      pointRadius: 0,
      pointHoverRadius: 4,
      pointHoverBackgroundColor: lineColor.value,
      pointHoverBorderColor: "#FFF",
      pointHoverBorderWidth: 2,
    },
  ],
}));
onMounted(() => {
  handleChartLeave();
});

watch(
  () => selectedPeriod.value,
  (newVal, oldVal) => {
    selectionStore.setSelection(Constants.SELECTED_PERIOD_CHART, newVal);
    console.log(
      Constants.SELECTED_PERIOD_CHART,
      selectionStore.getSelectionByKey(Constants.SELECTED_PERIOD_CHART)
    );
  }
);
const changePeriod = (period) => {
  selectedPeriod.value = period;
  handleChartLeave();
};
</script>

<style scoped>
/* Style tetap sama seperti sebelumnya */
.my-card {
  width: 100%;
  margin: 0 auto;
  max-width: 100%;
  max-height: 100%;
}

.my-chart {
  max-width: 100%;
  max-height: 100%;
}

.chart-container {
  /* position: relative; */
  padding: 0;
  /* Menambahkan padding untuk memastikan ada ruang untuk label */
}

.vertical-line {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 1px;
  background-color: rgba(0, 0, 0, 0.2);
  pointer-events: none;
  z-index: 1;
}

.date-tooltip {
  position: absolute;
  top: 0;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  pointer-events: none;
  z-index: 2;
  white-space: nowrap;
}
/* .line {
  width: 100%;
  max-height: 70%;
} */
</style>
