<template>
  <div class="w-full flex flex-col h-full bg-white rounded-2xl">
    <!-- Search Input Header -->
    <div class="sticky top-0 bg-white p-3 border-b border-slate-100 z-10">
      <q-input
        v-model="searchQuery"
        dense
        outlined
        placeholder="Cari Komoditas..."
        class="bg-slate-50 rounded-xl text-xs"
      >
        <template v-slot:prepend>
          <q-icon name="search" color="grey-6" size="18px" />
        </template>
        <template v-slot:append v-if="searchQuery">
          <q-icon name="clear" color="grey-6" class="cursor-pointer" @click="searchQuery = ''" size="18px" />
        </template>
      </q-input>
    </div>

    <!-- Commodity List -->
    <div class="flex-1 max-h-[580px] overflow-y-auto divide-y divide-slate-100" v-if="searchedKomoditas && searchedKomoditas.length > 0">
      <div
        v-for="commodity in searchedKomoditas"
        :key="commodity.symbol || commodity.nama"
        @click="selectCommodity(commodity)"
        class="flex items-center justify-between gap-3 p-3.5 hover:bg-slate-50/80 transition-colors cursor-pointer group"
      >
        <!-- Avatar & Name Info -->
        <div class="flex items-center gap-3 min-w-0 flex-1">
          <q-avatar size="40px" class="shrink-0 border border-slate-200 shadow-2xs">
            <q-img
              :src="`https://harga-api.dvlp.asia/komoditas/${commodity.nama}.webp`"
              :alt="commodity.nama"
              fit="cover"
            >
              <template v-slot:error>
                <q-img src="assets/MPW.png" fit="cover" />
              </template>
            </q-img>
          </q-avatar>
          <div class="min-w-0 flex-1">
            <div class="text-xs sm:text-sm font-semibold text-slate-800 truncate group-hover:text-blue-600 transition-colors">
              {{ commodity.nama }}
            </div>
            <div class="text-[11px] text-slate-500 truncate mt-0.5">
              {{ Constants.CHART_PERIODS_LABEL[selectedPeriod] }}: Rp {{
                Utils.formatCurrency(
                  Utils.getSparklinePrices(
                    commodity,
                    selectedPeriod,
                    selectionStore.getSelectionByKey(Constants.SELECTED_WILAYAH)
                  )[0]
                ) || '0'
              }}
            </div>
          </div>
        </div>

        <!-- Sparkline -->
        <div class="flex shrink-0 w-20 justify-center">
          <SparkLine
            :data="Utils.getSparklinePrices(
              commodity,
              selectedPeriod,
              selectionStore.getSelectionByKey(Constants.SELECTED_WILAYAH)
            )"
            :color="Utils.getPriceChange(
              commodity,
              selectedPeriod,
              selectionStore.getSelectionByKey(Constants.SELECTED_WILAYAH)
            ).change <= 0 ? '#10b981' : '#ef4444'"
            :width="75"
            :height="28"
            :show-area="true"
            :show-trend-indicator="false"
            :highlight-endpoints="false"
            :stroke-width="2"
            background-color="transparent"
          />
        </div>

        <!-- Price Info & Badge -->
        <div class="text-right shrink-0">
          <div class="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
            Rp {{
              Utils.formatCurrency(
                Utils.Harga.getLastPrice(
                  commodity,
                  selectionStore.getSelectionByKey(Constants.SELECTED_WILAYAH)
                )
              ) || '0'
            }}
          </div>
          <div
            :class="[
              'inline-block px-2 py-0.5 mt-0.5 text-[11px] font-bold rounded-full text-center min-w-[45px]',
              Utils.getPriceChange(
                commodity,
                selectedPeriod,
                selectionStore.getSelectionByKey(Constants.SELECTED_WILAYAH)
              ).change <= 0
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-rose-50 text-rose-700 border border-rose-200'
            ]"
          >
            {{
              Utils.getPriceChange(
                commodity,
                selectedPeriod,
                selectionStore.getSelectionByKey(Constants.SELECTED_WILAYAH)
              ).change || '0'
            }}%
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="searchQuery && searchedKomoditas?.length === 0" class="flex flex-col items-center justify-center p-8 text-center">
      <span class="text-3xl mb-2">🔍</span>
      <div class="text-xs font-medium text-slate-500">Tidak ada komoditas yang ditemukan</div>
    </div>
  </div>

  <!-- Floating Action Button -->
  <transition name="fade">
    <q-page-sticky v-show="showFab" position="bottom-right" :offset="[18, 18]" style="z-index: 1000">
      <q-btn fab :label="Constants.CHART_PERIODS_LABEL[selectedPeriod]" @click="showPeriodDialog = true"
        class="floating-btn" elevated>
        <q-tooltip class="bg-dark text-white" anchor="top middle" self="bottom middle">
          Ubah periode dan wilayah
        </q-tooltip>
      </q-btn>
    </q-page-sticky>
  </transition>

  <!-- Period & Region Selection Dialog -->
  <q-dialog v-model="showPeriodDialog" position="bottom">
    <q-card class="dialog-card">
      <!-- Region Selection -->
      <q-card-section class="dialog-section">
        <div class="section-title">Pilih Wilayah</div>
        <div class="selection-grid">
          <q-btn v-for="(label, key) in Utils.Constants.WILAYAH_LABELS" :key="key" :label="label" class="selection-btn"
            :color="selectedKecamatan === key ? 'primary' : 'grey-3'"
            :text-color="selectedKecamatan === key ? 'white' : 'grey-8'" @click.prevent="selectWilayah(key)" no-caps
            unelevated />
        </div>
      </q-card-section>

      <q-separator />

      <!-- Period Selection -->
      <q-card-section class="dialog-section">
        <div class="section-title">Pilih Periode</div>
        <div class="selection-grid">
          <q-btn v-for="(label, period) in Constants.CHART_PERIODS_LABEL" :key="period" :label="label"
            class="selection-btn" :color="selectedPeriod === period ? 'primary' : 'grey-3'"
            :text-color="selectedPeriod === period ? 'white' : 'grey-8'" @click.prevent="selectPeriod(period)" no-caps
            unelevated />
        </div>
      </q-card-section>

      <!-- Close Button -->
      <q-card-section class="dialog-actions">
        <q-btn label="Tutup" @click="showPeriodDialog = false" color="grey-6" flat class="full-width" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeMount, watch, onBeforeUnmount } from "vue";
import SparkLine from "./SparkLine.vue";
import { useUtils } from "src/utils/utils";
import { useSelectionStore } from "src/stores/selectionStore";
import Config from "src/config";

const Utils = useUtils();
const Constants = Utils.Constants;

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
});

const selectionStore = useSelectionStore();

const showFab = ref(false);

const handleScroll = () => {
  const target = document.getElementById('komoditas');
  if (target) {
    const targetTop = target.offsetTop;
    const scrollY = window.scrollY;
    showFab.value = scrollY > targetTop - 100;
  }
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Initial check
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});

const selectedKecamatan = computed(() => {
  return selectionStore.getSelectionByKey(Constants.SELECTED_WILAYAH);
});

const selectedKecamatanLabel = computed(() => {
  return Constants.WILAYAH_LABELS[selectedKecamatan.value];
});

const searchQuery = ref('');

const searchedKomoditas = computed(() => {
  if (!searchQuery.value) {
    return filteredKomoditas.value;
  }
  return filteredKomoditas.value.filter(commodity => {
    return commodity.nama.toLowerCase().includes(searchQuery.value.toLowerCase());
  });
});

const filteredKomoditas = computed(() => {
  // console.log("filteringg", props.data);
  const res = props.data.map((item) => {
    // console.log("fitlering item ", item);
    let res = Utils.Harga.filterByKecamatan(item, selectedKecamatan.value);
    // console.log("filter result: ", res);
    return res;
  });
  console.log("fitered res", res);
  return res.filter((item) => {
    if (item.data && item.data.length > 0) {
      return true;
    }
    console.log(`Komoditas ${item.nama} tidak memiliki harga`);
    return false;
  });
});

const selectedPeriod = computed(() => {
  return (
    selectionStore.getSelectionByKey(Constants.SELECTED_PERIOD_CHART) ??
    Constants.DEFAULT_SELECTED_PERIOD
  );
});

const showPeriodDialog = ref(false);

const selectPeriod = (period) => {
  selectionStore.setSelection(Constants.SELECTED_PERIOD_CHART, period);
  setTimeout(() => {
    showPeriodDialog.value = false;
  }, 100);
};

const selectCommodity = (commodity) => {
  selectionStore.setSelection(Constants.SELECTED_KOMODITAS, commodity);
};

const selectWilayah = (wilayahKey) => {
  selectionStore.setSelection(Utils.Constants.SELECTED_WILAYAH, wilayahKey);
};

const onImageError = (error) => {
  console.warn('Failed to load commodity image:', error);
};

onBeforeMount(() => {
  // Any initialization logic here
});
</script>

<style scoped>
.commodity-list-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #fafafa;
}

.search-container {
  padding: 16px;
  background-color: white;
  border-bottom: 1px solid #e0e0e0;
}

.search-input {
  max-width: 100%;
}

.commodity-list {
  flex: 1;
  max-height: 550px;
  background-color: white;
}

.commodity-item {
  padding: 16px;
  min-height: 80px;
  transition: background-color 0.2s ease;
}

.commodity-item:hover {
  background-color: #f5f5f5;
}

.commodity-avatar {
  min-width: 64px;
  margin-right: 4px;
}

.commodity-image {
  border: 2px solid #e0e0e0;
  transition: border-color 0.2s ease;
}

.commodity-item:hover .commodity-image {
  border-color: #1976d2;
}

.commodity-info {
  flex: 1;
  margin-right: 8px;
}

.commodity-name {
  font-weight: 600;
  font-size: 16px;
  color: #212121;
  margin-bottom: 4px;
}

.commodity-period {
  font-size: 13px;
  color: #757575;
}

.sparkline-section {
  width: 100px;
  min-width: 100px;
  max-width: 100px;
  margin-right: 12px;
}

.sparkline-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  width: 100%;
  padding: 4px;
  border-radius: 6px;
}

.price-section {
  min-width: 80px;
  text-align: right;
}

.price-container {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.current-price {
  font-weight: 700;
  font-size: 14px;
  color: #212121;
  white-space: nowrap;
}

.price-change {
  font-weight: 600;
  font-size: 13px;
  padding: 2px 6px;
  border-radius: 4px;
  min-width: 45px;
  text-align: center;
}

.text-positive {
  color: #2e7d32;
  background-color: #e8f5e8;
}

.text-negative {
  color: #d32f2f;
  background-color: #ffeaea;
}

.floating-btn {
  background: linear-gradient(135deg, #1976d2, #1565c0);
  color: white;
  font-weight: 600;
  min-width: 64px;
  height: 56px;
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.4);
}

.floating-btn:hover {
  box-shadow: 0 6px 16px rgba(25, 118, 210, 0.5);
}

.dialog-card {
  width: 100%;
  max-width: 420px;
  margin: 0 auto;
  border-radius: 16px 16px 0 0;
}

.dialog-section {
  padding: 20px 24px 16px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #212121;
  margin-bottom: 16px;
}

.selection-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 8px;
}

.selection-btn {
  height: 44px;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.dialog-actions {
  padding: 12px 24px 20px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  text-align: center;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .commodity-item {
    padding: 12px 16px;
  }

  .commodity-name {
    font-size: 15px;
  }

  .sparkline-section {
    width: 80px;
    min-width: 80px;
    max-width: 80px;
  }

  .price-section {
    min-width: 70px;
  }

  .current-price {
    font-size: 13px;
  }

  .price-change {
    font-size: 12px;
  }
}

/* Loading skeleton animation */
@keyframes shimmer {
  0% {
    background-position: -200px 0;
  }

  100% {
    background-position: calc(200px + 100%) 0;
  }
}

.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
  animation: shimmer 1.5s infinite;
}
</style>
