<template>
  <div>
    <q-list
      class="scroll"
      style="max-height: 550px"
      bordered
      separator
      v-if="filteredKomoditas"
    >
      <q-item
        v-for="commodity in filteredKomoditas"
        :key="commodity.symbol"
        class="q-py-md"
        v-ripple
        @click="selectCommodity(commodity)"
        clickable
      >
        <q-item-section avatar>
          <q-avatar>
            <q-icon
              :name="commodity.icon"
              size="md"
              :color="
                getPriceChange(commodity).change <= 0 ? 'positive' : 'negative'
              "
            />
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label class="text-weight-bold">{{
            commodity.nama
          }}</q-item-label>
          <q-item-label caption
            >{{ Constants.CHART_PERIODS_LABEL[selectedPeriod] }} lalu: Rp
            {{
              Utils.formatCurrency(
                generateSparklinePrices(
                  commodity,
                  selectedPeriod,
                  selectionStore.getSelectionByKey(Constants.SELECTED_WILAYAH)
                )[0]
              )
            }}</q-item-label
          >
        </q-item-section>

        <q-item-section class="col-4">
          <SparkLine
            :data="
              generateSparklinePrices(
                commodity,
                selectedPeriod,
                selectionStore.getSelectionByKey(Constants.SELECTED_WILAYAH)
              )
            "
            :color="
              getPriceChange(commodity).change <= 0 ? '#21ba45' : '#c10015'
            "
            :width="100"
            :height="30"
          />
        </q-item-section>

        <q-item-section side>
          <div class="text-right">
            <div class="text-weight-bold">
              Rp{{
                Utils.formatCurrency(
                  Utils.Harga.getLastPrice(
                    commodity,
                    selectionStore.getSelectionByKey(Constants.SELECTED_WILAYAH)
                  )
                )
              }}
            </div>
            <div
              :class="
                getPriceChange(commodity).change <= 0
                  ? 'text-positive'
                  : 'text-negative'
              "
            >
              {{ getPriceChange(commodity).change }}%
            </div>
          </div>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
  <!-- Floating Speed Dial Button -->
  <q-page-sticky position="bottom-right" :offset="[20, 20]">
    <q-btn
      fab
      :label="Constants.CHART_PERIODS_LABEL[selectedPeriod]"
      @click="showPeriodDialog = true"
      style="background-color: #120a33; color: white"
      elevated
    />
  </q-page-sticky>

  <!-- Period Selection Dialog -->
  <q-dialog v-model="showPeriodDialog" position="bottom">
    <q-card style="width: 100%; max-width: 400px">
      <q-card-section class="row items-center no-wrap">
        <div class="text-h6">Pilih Wilayah</div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <div class="row q-col-gutter-sm">
          <div
            v-for="(label, key) in Utils.Constants.WILAYAH_LABELS"
            :key="key"
            class="col-4"
          >
            <q-btn
              :label="label"
              class="full-width"
              @click="selectWilayah(key)"
              no-caps
            />
          </div>
        </div>
      </q-card-section>

      <q-card-section class="row items-center no-wrap">
        <div class="text-h6">Pilih Periode</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div class="row q-col-gutter-sm">
          <div
            v-for="(label, period) in Constants.CHART_PERIODS_LABEL"
            :key="period"
            class="col-4"
          >
            <q-btn
              :label="label"
              class="full-width"
              :color="selectedPeriod === period ? 'primary' : 'grey-4'"
              :text-color="selectedPeriod === period ? 'white' : 'black'"
              @click="selectPeriod(period)"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeMount, watch } from "vue";
import SparkLine from "./SparkLine.vue";
import { useUtils } from "src/utils/utils";
import { useSelectionStore } from "src/stores/selectionStore";

const Utils = useUtils();
const Constants = Utils.Constants;

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
});

const selectionStore = useSelectionStore();
const selectedKecamatan = computed(() => {
  return selectionStore.getSelectionByKey(Constants.SELECTED_WILAYAH);
});
const selectedKecamatanLabel = computed(() => {
  return Constants.WILAYAH_LABELS[selectedKecamatan];
});

const filteredKomoditas = computed(() => {
  console.log("filteringg", props.data);
  const res = props.data.map((item) => {
    console.log("fitlering item ", item);
    // console.log("filtering for: ", selectedKecamatanLabel.value);
    let res = Utils.Harga.filterByKecamatan(item, selectedKecamatan.value);
    console.log("filter result: ", res);
    return res;
  });
  console.log("fitered res", res);
  return res.filter((item) => {
    if (item.data.length > 0) {
      return true;
    }
    console.log(`Komoditas ${item.nama} tidak memiliki harga`);
  });
});
// Period selection state
const selectedPeriod = computed(() => {
  return (
    selectionStore.getSelectionByKey(Constants.SELECTED_PERIOD_CHART) ??
    Constants.DEFAULT_SELECTED_PERIOD
  );
});

const showPeriodDialog = ref(false);

// watch(
//   () => props.data,
//   (newVal, oldVal) => {
//     if (props.data?.length > 0) commodities.value = props.data.data;
//   }
// );

// const initData = (commodities) => {
//   if (commodities?.length > 0) {
//   }
// };

const selectPeriod = (period) => {
  console.log("period selected", period);
  selectionStore.setSelection(Constants.SELECTED_PERIOD_CHART, period);
  selectedPeriod.value = period;
  showPeriodDialog.value = false;
};

// Function to calculate price change for selected period
const getPriceChange = (commodity) => {
  const data = generateSparklinePrices(
    commodity,
    selectedPeriod.value,
    selectionStore.getSelectionByKey(Constants.SELECTED_WILAYAH)
  );
  // console.log("data price change: ", data, commodity);
  const startPrice = data[0];
  const endPrice = data[data.length - 1];

  let change;
  if (startPrice === 0) {
    change = 0;
  } else {
    change = (((endPrice - startPrice) / startPrice) * 100).toFixed(2);
  }
  if (isNaN(change)) {
    change = 0.0;
  }
  if (!(startPrice * 1)) {
    // console.log("Komoditas tanpa start: ", commodity);
  }

  return {
    change,
    startPrice,
    endPrice,
  };
};

// Commodities data
// const commodities = ref(props.data);
const selectCommodity = (commodity) => {
  selectionStore.setSelection(Constants.SELECTED_KOMODITAS, commodity);
  // console.log(
  //   "SELECTED_KOMODITAS",
  //   selectionStore.getSelectionByKey(Constants.SELECTED_KOMODITAS)
  // );
};
onBeforeMount(() => {
  // commodities.value = props.data;
  // console.log("commodities", commodities.value);
});

const getDataRange = (period) => {
  const now = new Date();
  let startDate;
  switch (period) {
    case "1W": // Last 7 days
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case "1M": // Last 1 month
      startDate = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        now.getDate()
      );
      break;
    case "3M": // Last 3 months
      startDate = new Date(
        now.getFullYear(),
        now.getMonth() - 3,
        now.getDate()
      );
      break;
    case "YTD": // Year-to-Date
      startDate = new Date(now.getFullYear(), 0, 1);
      break;
    case "1Y": // Last 1 year
      startDate = new Date(
        now.getFullYear() - 1,
        now.getMonth(),
        now.getDate()
      );
      break;
    default:
      return null;
    // throw new Error("Invalid period specified: " + period);
  }
  return startDate;
};

const generateSparklinePrices = (data, period, kecamatan) => {
  // Helper function to calculate date ranges

  // Filter data based on kecamatan
  const filteredByKecamatan = data.data.filter(
    (entry) => entry.kecamatan == Constants.WILAYAH_LABELS[kecamatan]
  );
  // console.log("filtering data:", filteredByKecamatan);

  // Get the date range for the specified period
  const startDate = getDataRange(period);

  // Filter data based on the date range and extract prices
  const sparklinePrices = filteredByKecamatan
    .filter((entry) => new Date(entry.date) >= startDate)
    .map((entry) => entry.price);

  if (sparklinePrices.length < 1) {
    // console.log("Komoditas " + data.nama + " Tanpa sparkline", data, startDate);
  }
  return sparklinePrices;
};

const selectWilayah = (wilayahKey) => {
  selectionStore.setSelection(Utils.Constants.SELECTED_WILAYAH, wilayahKey);
};
</script>

<style scoped>
.text-positive {
  color: #21ba45;
}

.text-negative {
  color: #c10015;
}

.sparkline-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
</style>
