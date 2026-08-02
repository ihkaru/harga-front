<template>
  <div class="flex flex-center">
    <div ref="scrollWrapper" class="scroll-wrapper">
      <div ref="scrollContent" class="scroll-content">
        <!-- Loop pertama -->
        <CommodityCard
          v-for="commodity in commodities"
          :key="'first-' + commodity.symbol"
          :name="commodity.nama.trim()"
          :icon="commodity.icon"
          :price="commodity.currentPrice"
          :data="commodity.data"
          :location="'Pasar ' + selectedPasar"
          :src="Utils.getCommodityImageUrl(commodity.nama)"
          @click="selectCommodity(commodity)"
        />
        <!-- Loop kedua, menggandakan card untuk efek looping tanpa jeda -->
        <CommodityCard
          v-for="commodity in commodities"
          :key="'second-' + commodity.symbol"
          :name="commodity.nama"
          :icon="commodity.icon"
          :price="commodity.currentPrice"
          :data="commodity.data"
          :location="'Pasar ' + selectedPasar"
          :src="Utils.getCommodityImageUrl(commodity.nama)"
          @click="selectCommodity(commodity)"
        />
      </div>
    </div>
  </div>
</template>
<script setup>
import CommodityCard from "components/CommodityCard.vue";
import { useSelectionStore } from "src/stores/selectionStore";
import { useConstants } from "src/utils/constants";
import { computed, defineProps, onBeforeUnmount, onMounted, ref } from "vue";
const Constants = useConstants();
const selectionStore = useSelectionStore();
const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
});
const commodities = computed(() => {
  return props.data.filter((commodity) => commodity.currentPrice !== 0);
});

const selectCommodity = (commodity) => {
  selectionStore.setSelection(Constants.SELECTED_KOMODITAS, commodity);
  const target = document.getElementById("komoditas");
  if (target) {
    target.scrollIntoView({ behavior: "smooth" });
  }
};

const selectedPasar = computed(() => {
  return Constants.KECAMATAN_PASAR[
    selectionStore.getSelectionByKey(Constants.SELECTED_WILAYAH)
  ];
});
const selectedKecamatanLabel = computed(() => {
  return Constants.WILAYAH_LABELS[
    selectionStore.getSelectionByKey(Constants.SELECTED_WILAYAH)
  ];
});
const scrollWrapper = ref(null);
const scrollContent = ref(null);
let animationFrame;

function startScrolling() {
  let scrollPosition = 0;

  function scroll() {
    scrollPosition -= 0.5; // Kecepatan scrolling bisa diatur dengan mengubah nilai ini
    if (scrollContent.value) {
      const scrollWidth = scrollContent.value.scrollWidth / 2;

      if (Math.abs(scrollPosition) >= scrollWidth) {
        scrollPosition = 0;
      }

      scrollContent.value.style.transform = `translateX(${scrollPosition}px)`;
    }

    animationFrame = requestAnimationFrame(scroll);
  }

  scroll();
}

onMounted(() => {
  startScrolling();
});

onBeforeUnmount(() => {
  cancelAnimationFrame(animationFrame);
});
</script>
<style scoped>
.scroll-wrapper {
  overflow: hidden;
  width: 100%;
  display: flex;
  position: relative;
  justify-content: flex-start;
  padding-top: 8px;
  padding-bottom: 12px;
}

.scroll-content {
  display: flex;
  gap: 16px;
  will-change: transform;
}
</style>
