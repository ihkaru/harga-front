<template>
  <q-page>
    <div class="hero">
      <div class="hero-content">
        <div class="hero-badge">
          <span class="word-wrapper">
            <span class="word">&nbsp;Sistem</span>
          </span>
          <span class="word-wrapper">
            <span class="word">&nbsp;Informasi</span>
          </span>
          <span class="word-wrapper">
            <span class="word">&nbsp; Data</span>
          </span>
          <span class="word-wrapper">
            <span class="word">&nbsp; Perdagangan</span>
          </span>
          <span class="word-wrapper">
            <span class="word">&nbsp; Kabupaten</span>
          </span>
          <span class="word-wrapper">
            <span class="word">&nbsp; Mempawah</span>
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
            <span class="word" style="color: #b19cd9">Menstabilkan</span>
          </span>
          <span class="word-wrapper">
            <span class="word" style="color: #b19cd9">&nbsp;Ekonomi</span>
          </span>
        </h1>
        <p>
          <span class="word-wrapper">
            <span class="word">&nbsp;Dashboard</span>
          </span>
          <span class="word-wrapper">
            <span class="word">&nbsp;Terbuka</span>
          </span>
          <span class="word-wrapper">
            <span class="word">&nbsp;untuk</span>
          </span>
          <span class="word-wrapper">
            <span class="word">&nbsp;Pemantauan</span>
          </span>
          <span class="word-wrapper">
            <span class="word">&nbsp;dan</span>
          </span>
          <span class="word-wrapper">
            <span class="word">&nbsp;Pengendalian</span>
          </span>
          <span class="word-wrapper">
            <span class="word">&nbsp;Harga</span>
          </span>
          <span class="word-wrapper">
            <span class="word">&nbsp;di</span>
          </span>
          <span class="word-wrapper">
            <span class="word">&nbsp;Kabupaten</span>
          </span>
          <span class="word-wrapper">
            <span class="word">&nbsp;Mempawah</span>
          </span>
        </p>
        <div class="button-container">
          <a href="#komoditas" class="hero-button glow-on-hover"
            >Data Komoditas</a
          >
          <!-- <a href="#inflasi" class="hero-button glow-on-hover"
            >Statistik Inflasi</a
          > -->
        </div>
        <div
          class="justify-center q-gutter-xs"
          style="margin-top: 50px; display: flex"
        >
          <!-- Disperindagkop Logo -->
          <q-img
            src="~assets/MPW.png"
            spinner-color="primary"
            style="height: 8vh; max-width: 200px"
            fit="contain"
          />
          <!-- BPS Logo -->
          <q-img
            src="~assets/BPS.png"
            spinner-color="primary"
            style="height: 8vh; max-width: 200px"
            fit="contain"
          />
        </div>
        <p style="margin-top: 1vh">
          Kolaborasi <br />
          Disperindagnaker dan BPS <br />
          Kabupaten Mempawah
        </p>
      </div>
    </div>

    <div style="margin-bottom: 30vh">
      <div class="row evenly">
        <!-- Grafik kiri -->
        <div class="col-md-8 col-xs-12">
          <div class="bg-white rounded-borders q-pa-lg" id="komoditas">
            <!-- Tempatkan grafik kiri di sini -->
            <main-chart
              :key="selectedData?.nama"
              :data="selectedData"
            ></main-chart>
          </div>
        </div>

        <!-- Grafik kanan -->
        <div class="col-md-4 col-xs-12">
          <div class="bg-white rounded-borders full-width">
            <!-- Tempatkan grafik kanan di sini -->
            <list-komoditas v-if="komoditas" :data="komoditas"></list-komoditas>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
defineOptions({
  name: "IndexPage",
});
import anime from "animejs";
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
import { watch, watchEffect } from "vue";
import ListKomoditas from "src/components/ListKomoditas.vue";
import MainChart from "src/components/MainChart.vue";
import FooterHome from "src/components/FooterHome.vue";
import SahamChart from "src/components/SahamChart.vue";
import { useSyncService } from "src/services/SyncKomoditas";
import { useSelectionStore } from "src/stores/selectionStore";
import { useUtils } from "src/utils/utils";
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
watch(
  () => selectionStore.getSelectionByKey(Constants.SELECTED_KOMODITAS),
  (newVal, oldVal) => {
    selectedData.value = { ...newVal };
    // console.log("newval", selectedData.value);
  }
);
onMounted(async () => {
  // console.log(Utils.priceData.value);
  await SyncService.fetchKomoditas();
  Utils.generatePriceData("2024-01-01", "2024-11-04", 2);
  console.log("selectedData", SyncService.komoditas.value[0]);
  selectedData.value = SyncService.komoditas.value[0];
  komoditas.value = SyncService.komoditas.value;
  console.log("komoditas.value", komoditas.value);
  // selectedData.value = Utils.priceData.value;
  console.log("priceData", Utils.priceData.value);
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
      },
      "-=400"
    );

  // Animasi untuk stat cards
  anime({
    targets: ".stat-card",
    opacity: [0, 1],
    translateY: [20, 0],
    duration: 800,
    delay: anime.stagger(100),
    easing: "easeOutExpo",
  });

  // Animasi untuk chart cards
  anime({
    targets: ".chart-card",
    opacity: [0, 1],
    translateY: [20, 0],
    duration: 800,
    delay: anime.stagger(100),
    easing: "easeOutExpo",
  });
});
</script>

<style>
html {
  /* scroll-behavior: smooth; */
}

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
}

.glow-on-hover:before {
  content: "";
  background: linear-gradient(
    45deg,
    #ff0000,
    #ff7300,
    #fffb00,
    #48ff00,
    #00ffd5,
    #002bff,
    #7a00ff,
    #ff00c8,
    #ff0000
  );
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
  font-weight: 600;
  margin-bottom: 2rem;
  text-transform: uppercase;
  font-size: 0.9rem;
  opacity: 1;
  transform: translateY(20px);
}

.hero-content {
  max-width: 80vw;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.hero h1 {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 1;
  transform: translateY(20px);
  line-height: 1.2;
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

/* ... Style lainnya tetap sama ... */
</style>
