<template>
  <q-page>
    <div class="hero">
      <div class="hero-content">
        <div class="text-xs sm:text-sm font-semibold tracking-wide text-slate-300 mb-2 sm:mb-3">
          {{ Utils.getFormattedDate() }}
        </div>
        <div class="hero-badge shadow-xs">
          <span v-for="(word, index) in subtitleWords" :key="index" class="word-wrapper">
            <span class="word">&nbsp;{{ word }}</span>
          </span>
        </div>
        <h1>
          <span class="word-wrapper">
            <span class="word">&nbsp;Pemantauan</span>
          </span>
          <span class="word-wrapper">
            <span class="word">&nbsp;Harga,</span>
          </span>
          <br />
          <span class="word-wrapper">
            <span class="word" style="color: #b19cd9">&nbsp;Mengendalikan</span>
          </span>
          <span class="word-wrapper">
            <span class="word" style="color: #b19cd9">&nbsp;Inflasi</span>
          </span>
        </h1>
        <div class="button-container flex flex-col sm:flex-row items-center justify-center gap-3 mt-4 sm:mt-8">
          <a href="#komoditas" class="hero-button glow-on-hover">Data Komoditas</a>
          <a href="#edukasi-pangan" class="hero-button glow-on-hover bg-emerald-600/90 text-white border-emerald-400">🛡️ Edukasi BPOM</a>
        </div>
        <div class="flex justify-center items-center gap-4 mt-6 sm:mt-12">
          <!-- Main Logo -->
          <q-img :src="`assets/${Config.assets.logoMain}`" spinner-color="primary" class="h-8 sm:h-16 max-w-[80px] sm:max-w-[180px]" fit="contain" />
          <!-- Partner Logo -->
          <q-img :src="`assets/${Config.assets.logoPartner}`" spinner-color="primary" class="h-8 sm:h-16 max-w-[80px] sm:max-w-[180px]" fit="contain" />
        </div>
        <p class="text-[10px] sm:text-xs tracking-wider uppercase opacity-80 mt-3 sm:mt-4 mb-0">
          {{ Config.appSubtitle }} <br />
          ({{ Config.appName }})
        </p>
      </div>
    </div>
    <div class="w-full overflow-hidden py-2 sm:py-3 relative -mt-6 sm:-mt-12">
      <commodity-display :data="komoditasStore.get()" />
    </div>
    <!-- <div style="margin-bottom: 100vh"></div> -->
    <div class="w-full max-w-7xl mx-auto px-2 sm:px-3 lg:px-4 py-3 sm:py-6 space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 items-start" id="komoditas">
        <!-- Grafik Kiri -->
        <div class="lg:col-span-7 bg-white rounded-2xl p-0 sm:p-2 lg:p-3">
          <main-chart :key="mainChartKey" :data="selectedData"></main-chart>
        </div>

        <!-- List Kanan -->
        <div class="lg:col-span-5 bg-white rounded-2xl overflow-hidden p-0 sm:p-2 lg:p-3" v-if="isDataReady">
          <list-komoditas :data="komoditasStore.get()" :key="listKomoditasKey"></list-komoditas>
        </div>
      </div>
      <div id="ai-analysis" class="mt-8">
        <analysis-section :dark="false" />
      </div>
      <div id="category-section" class="mt-8">
        <CategorySection />
      </div>
      <div id="edukasi-section" class="mt-8">
        <EdukasiPanganSection />
      </div>
    </div>
  </q-page>
</template>

<script setup>
defineOptions({
  name: "IndexPage",
});
import anime from "animejs/lib/anime.es.js";
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  BarController,
  BarElement,
} from "chart.js";
import { computed, toRaw, watch, watchEffect } from "vue";
import ListKomoditas from "src/components/ListKomoditas.vue";
import MainChart from "src/components/MainChart.vue";
import { useSyncService } from "src/services/SyncKomoditas";
import { useSelectionStore } from "src/stores/selectionStore";
import { useUtils } from "src/utils/utils";
import CommodityDisplay from "src/components/CommodityDisplay.vue";
import CategorySection from "src/components/CategorySection.vue";
import AnalysisSection from "src/components/AnalysisSection.vue";
import EdukasiPanganSection from "src/components/EdukasiPanganSection.vue";
import Config from "src/config";

const subtitleWords = computed(() => Config.appSubtitle.split(' '));

const commodities = [
  { name: "Beras", icon: "mdi-rice", price: 12000 },
  { name: "Gula", icon: "mdi-sugar-cane", price: 15000 },
  { name: "Minyak Goreng", icon: "mdi-oil", price: 20000 },
  { name: "Daging Ayam", icon: "mdi-chicken", price: 40000 },
  { name: "Telur", icon: "mdi-egg", price: 25000 },
];
const selectedData = ref({
  nama: "-",
  symbol: "-",
  icon: "-",
  currentPrice: 0,
  data: [
    {
      date: "2024-10-01",
      price: 17000,
    },
  ],
  sparklineData: {
    "1W": [17000],
    "1M": [17000],
    "3M": [17000],
    YTD: [17000],
    "1Y": [17000],
    ALL: [17000],
  },
});
const komoditas = ref([]);
const Utils = useUtils();
const SyncService = useSyncService();
const selectionStore = useSelectionStore();
const Constants = Utils.Constants;
const komoditasStore = useKomoditasStore();
const mainChartKey = ref("main-chart");
const isDataReady = computed(() => {
  return komoditasStore.get()?.length > 2;
});
const updateMainchart = () => {
  mainChartKey.value += "1";
};
const listKomoditasKey = ref("list-komoditas");
const updateListKomoditas = () => {
  listKomoditasKey.value += "1";
};
watch(
  () => selectionStore.getSelectionByKey(Constants.SELECTED_KOMODITAS),
  (newVal, oldVal) => {
    selectedData.value = { ...newVal };
  }
);
watch(
  () => selectionStore.getSelectionByKey(Constants.SELECTED_WILAYAH),
  (newVal, oldVal) => {
    updateMainchart();
  }
);
watch(
  () => komoditasStore.get(),
  (newVal, oldVal) => {
    if (newVal && selectedData.value.nama != "-") {
      selectedData.value = Utils.getObjectByCol(
        newVal,
        "nama",
        selectedData.value.nama
      );
      updateMainchart();
      updateListKomoditas();
    }
  }
);
onMounted(async () => {
  await SyncService.fetchKomoditas();
  komoditas.value = komoditasStore.get();
  selectedData.value = komoditas.value[0];
});
Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  BarController,
  BarElement
);
import { onBeforeMount, onMounted, ref } from "vue";
import { onBeforeRouteUpdate } from "vue-router";
import { useKomoditasStore } from "src/stores/komoditasStore";

onMounted(() => {
  // Data dummy untuk grafik
  const months = ["Apr", "Mei", "Jun", "Jul", "Agu", "Sep"];

  // Grafik trend inflasi
  anime
    .timeline({
      easing: "easeOutExpo",
    })
    .add({
      targets: ".hero-badge .word",
      translateY: [100, 0],
      opacity: [0, 1],
      duration: 800,
      delay: anime.stagger(100),
    })
    .add(
      {
        targets: "h1 .word",
        translateY: [100, 0],
        opacity: [0, 1],
        duration: 800,
        delay: anime.stagger(100),
      },
      "-=400"
    )
    .add(
      {
        targets: "p .word",
        translateY: [50, 0],
        opacity: [0, 1],
        duration: 800,
        delay: anime.stagger(50),
      },
      "-=400"
    )
    .add(
      {
        targets: ".button-container",
        translateY: [20, 0],
        opacity: [0, 1],
        duration: 600,
        delay: anime.stagger(0),
      },
      "-=400"
    )
    .add({
      targets: ".commodity-display-container",
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 800,
      delay: anime.stagger(500),
      easing: "easeOutExpo",
    });
  // anime({
  //   targets: ".commodity-display-container",
  //   opacity: [0, 1],
  //   translateY: [20, 0],
  //   duration: 400,
  //   delay: anime.stagger(150),
  //   easing: "easeOutExpo",
  // });
  // Animasi untuk chart cards
});
</script>

<style>
.glow-on-hover {
  width: 220px;
  height: 50px;
  border: none;
  outline: none;
  color: #fff;
  background: #111;
  cursor: pointer;
  position: relative;
  z-index: 0;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
}

@media (max-width: 639px) {
  .glow-on-hover {
    width: 100%;
    max-width: 240px;
    height: 38px;
    font-size: 0.75rem;
  }
}

.glow-on-hover:before {
  content: "";
  background: linear-gradient(45deg,
      #ff0000,
      #ff7300,
      #fffb00,
      #48ff00,
      #00ffd5,
      #002bff,
      #7a00ff,
      #ff00c8,
      #ff0000);
  position: absolute;
  top: -2px;
  left: -2px;
  background-size: 400%;
  z-index: -1;
  filter: blur(5px);
  width: calc(100% + 4px);
  height: calc(100% + 4px);
  animation: glowing 20s linear infinite;
  opacity: 1;
  transition: opacity 0.3s ease-in-out;
  border-radius: 10px;
}

.glow-on-hover:active {
  color: #000;
}

.glow-on-hover:active:after {
  background: transparent;
}

.glow-on-hover:hover:before {
  opacity: 1;
}

.glow-on-hover:after {
  z-index: -1;
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  background: #111;
  left: 0;
  top: 0;
  border-radius: 10px;
}

@keyframes glowing {
  0% {
    background-position: 0 0;
  }

  50% {
    background-position: 400% 0;
  }

  100% {
    background-position: 0 0;
  }
}

.hero {
  min-height: 100vh;
  max-width: 100vw;
  background: linear-gradient(135deg, #0a0426 0%, #1a1040 100%);
  color: white;
  padding: 2rem;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

@media (max-width: 639px) {
  .hero {
    padding: 1rem 0.5rem;
  }
}

.hero::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url("/api/placeholder/1920/1080") center/cover;
  opacity: 0.1;
}

.hero-badge {
  background: #ffd700;
  color: #000;
  padding: 0.5rem 1.5rem;
  border-radius: 50px;
  font-weight: 700;
  margin-bottom: 2rem;
  text-transform: uppercase;
  font-size: 0.9rem;
  opacity: 1;
  transform: translateY(20px);
  display: inline-block;
}

@media (max-width: 639px) {
  .hero-badge {
    padding: 0.35rem 1rem;
    font-size: 0.75rem;
    margin-bottom: 1.25rem;
    max-width: 95%;
    line-height: 1.3;
  }
}

@media (max-width: 479px) {
  .hero-badge {
    padding: 0.25rem 0.65rem;
    font-size: 0.62rem;
    margin-bottom: 0.75rem;
    max-width: 92%;
    line-height: 1.25;
  }
}

.hero-content {
  max-width: 80vw;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

@media (max-width: 639px) {
  .hero-content {
    max-width: 96vw;
  }
}

.hero h1 {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 1;
  transform: translateY(20px);
  line-height: 1.2;
  font-weight: 300;
}

@media (max-width: 1023px) {
  .hero h1 {
    font-size: 3.25rem;
  }
}

@media (max-width: 767px) {
  .hero h1 {
    font-size: 2.25rem;
    margin-bottom: 0.75rem;
  }
}

@media (max-width: 479px) {
  .hero h1 {
    font-size: 1.35rem;
    margin-bottom: 0.5rem;
  }
}

.hero h1 span {
  color: #b19cd9;
}

.hero p {
  font-size: 1.2rem;
  opacity: 1;
  transform: translateY(20px);
  margin-bottom: 2rem;
}

.button-container {
  display: flex;
  gap: 1rem;
  justify-content: center;
  opacity: 0;
  transform: translateY(20px);
}

.commodity-display-container {
  opacity: 0;
}

.hero-button {
  padding: 0.8rem 0rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  text-decoration: none;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  cursor: pointer;
}

.hero-button:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

/* Sisanya tetap sama seperti sebelumnya */
.stats-container {
  max-width: 1200px;
  margin: -10px auto 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  position: relative;
  z-index: 2;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  opacity: 0;
  transform: translateY(20px);
  max-height: 180px;
}

.stat-card h5 {
  color: #333;
  margin-top: 0;
  margin-bottom: 0rem;
}

.stat-card .value {
  font-size: 2rem;
  font-weight: bold;
  color: #1a237e;
}

.charts-container {
  max-width: 100vw;
  margin: 2rem auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 2rem;
}

.chart-card {
  background: white;
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  opacity: 0;
  height: 50vh;
  max-height: 400px;
  transform: translateY(20px);
}

@media (max-width: 768px) {
  .hero h1 {
    font-size: 2.5rem;
  }

  .charts-container {
    grid-template-columns: 100vw;
  }
}

/* ... Style sebelumnya tetap sama ... */
.word-wrapper {
  display: inline-block;
  overflow: hidden;
}

.word {
  display: inline-block;
  opacity: 0;
  transform: translateY(100%);
}

.char {
  display: inline-block;
  opacity: 0;
  transform: translateY(100%);
}
</style>
