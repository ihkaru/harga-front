<template>
  <div class="q-pa-md">
    <h5 class="text-h5 text-white q-my-md">Analisis AI Terkini</h5>
    <div v-if="loading" class="row justify-center q-my-md">
      <q-spinner-cube color="primary" size="3em" />
    </div>
    <div v-else-if="error" class="text-negative">
      {{ error }}
    </div>
    <div v-else>
      <q-card v-for="(analysis, index) in analyses" :key="analysis.id" class="q-mb-md bg-grey-10 text-white">
        <q-card-section>
          <div class="text-h6">{{ analysis.komoditas.nama }}</div>
          <div class="text-subtitle2" :id="`key-observation-${index}`"></div>
        </q-card-section>
        <q-separator dark />
        <q-card-section>
          <div class="text-body1" :id="`short-term-outlook-${index}`"></div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { onMounted, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useAnalysisStore } from 'src/stores/analysisStore';
import anime from 'animejs/lib/anime.es.js';

const analysisStore = useAnalysisStore();
const { analyses, loading, error } = storeToRefs(analysisStore);

const typeText = (targetId, text) => {
  const el = document.getElementById(targetId);
  if (el) {
    el.innerHTML = '';
    anime({
      targets: el,
      innerHTML: [0, text.length],
      easing: 'linear',
      duration: 2000,
      update: (anim) => {
        el.innerHTML = text.substring(0, Math.round(anim.progress * text.length / 100));
      }
    });
  }
};

watch(analyses, (newAnalyses) => {
  if (newAnalyses) {
    newAnalyses.forEach((analysis, index) => {
      typeText(`key-observation-${index}`, analysis.key_observation);
      typeText(`short-term-outlook-${index}`, analysis.short_term_outlook);
    });
  }
});

onMounted(() => {
  analysisStore.fetchAnalyses();
});
</script>

<style scoped>
.bg-grey-10 {
  background-color: #1a1a1a !important;
}
</style>
