<template>
  <div>
    <q-list
      class="scroll"
      style="max-height: 550px"
      bordered
      separator
      v-if="props.data"
    >
      <q-item
        v-for="commodity in props.data"
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
            >{{ periodLabels[selectedPeriod] }} lalu: Rp
            {{
              Utils.formatCurrency(commodity.sparklineData[selectedPeriod][0])
            }}</q-item-label
          >
        </q-item-section>

        <q-item-section class="col-4">
          <SparkLine
            :data="commodity.sparklineData[selectedPeriod]"
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
              Rp{{ Utils.formatCurrency(commodity.currentPrice) }}
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
      color="primary"
      :label="periodLabels[selectedPeriod]"
      @click="showPeriodDialog = true"
    />
  </q-page-sticky>

  <!-- Period Selection Dialog -->
  <q-dialog v-model="showPeriodDialog" position="bottom">
    <q-card style="width: 100%; max-width: 400px">
      <q-card-section class="row items-center no-wrap">
        <div class="text-h6">Select Period</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div class="row q-col-gutter-sm">
          <div
            v-for="(label, period) in periodLabels"
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
import { ref, computed, onMounted } from "vue";
import SparkLine from "./SparkLine.vue";
import { useUtils } from "src/utils/utils";
import { useSelectionStore } from "src/stores/selectionStore";
const Utils = useUtils();
const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
});
// Period selection state
const selectedPeriod = ref("1M");
const showPeriodDialog = ref(false);

const periodLabels = {
  "1W": "1 pekan",
  "1M": "1 bulan",
  "3M": "3 bulan",
  YTD: "Year to Date",
  "1Y": "1 tahun",
  ALL: "All Time",
};

const selectPeriod = (period) => {
  selectedPeriod.value = period;
  showPeriodDialog.value = false;
};

// Function to calculate price change for selected period
const getPriceChange = (commodity) => {
  const data = commodity.sparklineData[selectedPeriod.value];
  const startPrice = data[0];
  const endPrice = data[data.length - 1];
  const change = (((endPrice - startPrice) / startPrice) * 100).toFixed(2);
  return {
    change,
    startPrice,
    endPrice,
  };
};

const Constants = useUtils().Constants;
// Commodities data
const commodities = ref([]);
const selectionStore = useSelectionStore();
const selectCommodity = (commodity) => {
  selectionStore.setSelection(Constants.SELECTED_KOMODITAS, commodity);
  console.log(
    "SELECTED_KOMODITAS",
    selectionStore.getSelectionByKey(Constants.SELECTED_KOMODITAS)
  );
};
onMounted(() => {
  commodities.value = props.data;
  console.log("commodities", commodities.value);
});
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
