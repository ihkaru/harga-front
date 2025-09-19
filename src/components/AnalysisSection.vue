<template>
  <div class="q-pa-md-md q-pa-xs-none">
    <div v-if="loading" class="row justify-center q-my-md">
      <q-spinner-cube color="primary" size="3em" />
    </div>
    <div v-else-if="error" class="text-negative">
      {{ error }}
    </div>

    <div v-else>
      <!-- AI Generated Report Header -->
      <div class="ai-header text-center q-mb-xl q-pt-md">
        <q-icon name="auto_awesome" class="gemini-icon" size="3.5em" />
        <h4 class="text-h4 text-weight-bold q-mt-md q-mb-sm">
          Analisis Cerdas Berbasis AI
        </h4>
        <p class="text-subtitle1" :class="dark ? 'text-grey-5' : 'text-grey-7'"
          style="max-width: 600px; margin: 0 auto;">
          Didukung oleh model AI generatif untuk memberikan wawasan mendalam tentang data harga komoditas.
        </p>
      </div>

      <!-- Analysis Cards -->
      <div class="row q-col-gutter-md">
        <div v-for="analysis in analyses" :key="analysis.id" class="col-12 col-md-6">
          <q-card :class="['ai-card', { 'dark': dark, 'light': !dark }]">
            <q-card-section>
              <q-item>
                <q-item-section avatar>
                  <q-avatar>
                    <q-img :src="'https://harga-api.dvlp.asia/komoditas/' +
                      analysis.komoditas.nama +
                      '.webp'
                      " style="
                        max-width: 50px;
                        max-height: 50px;
                        border-radius: 50%;
                      " />
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-h6 text-weight-bold">{{ analysis.komoditas.nama }}</q-item-label>
                  <q-item-label caption :class="dark ? 'text-grey-5' : 'text-grey-7'">Analisis per: {{ new
                    Date(analysis.analysis_date).toLocaleDateString() }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-chip :color="getWeekPriceChange(analysis.komoditas.nama).trend === 'up' ? 'red' : 'green'"
                    text-color="white" dense>
                    {{ getWeekPriceChange(analysis.komoditas.nama).change }}%
                    <q-tooltip>{{ getWeekPriceChange(analysis.komoditas.nama).tooltip }}</q-tooltip>
                  </q-chip>
                  1 Minggu Terakhir
                </q-item-section>
              </q-item>
              <div class="row items-center q-gutter-sm q-mt-sm">
                <q-chip dense :icon="getTrendIcon(analysis.trend_direction)"
                  :color="getTrendColor(analysis.trend_direction)" text-color="white">
                  Tren {{ analysis.trend_direction }}
                </q-chip>
                <q-chip dense :icon="getConditionIcon(analysis.condition_level)"
                  :color="getConditionColor(analysis.condition_level)" text-color="white">
                  {{ analysis.condition_level }}
                </q-chip>
                <q-chip dense :icon="getVolatilityIcon(analysis.volatility_level)"
                  :color="getVolatilityColor(analysis.volatility_level)" text-color="white">
                  Volatilitas {{ analysis.volatility_level }}
                </q-chip>
              </div>
            </q-card-section>

            <!-- Tabs for Detailed Sections -->
            <q-tabs v-model="analysis.tab" dense :class="dark ? 'text-grey-4' : 'text-grey-7'" align="justify"
              indicator-color="primary">
              <q-tab label="Ringkasan" name="summary" />
              <q-tab label="Detail Analisis" name="details" />
              <q-tab label="Rekomendasi" name="recommendations" />
              <q-tab label="Peringatan" name="warnings" />
            </q-tabs>

            <q-separator />

            <q-tab-panels v-model="analysis.tab" animated>
              <q-tab-panel name="summary">
                <q-scroll-area style="height: 300px;">
                  <div class="text-subtitle1 text-weight-medium q-mb-sm">Observasi Kunci</div>
                  <p class="text-body2 q-mb-md">{{ analysis.key_observation }}</p>
                  <q-separator class="q-my-md" />
                  <div class="text-subtitle1 text-weight-medium q-mb-sm">Posisi Harga</div>
                  <p class="text-body2 q-mb-md">{{ analysis.current_position }}</p>
                  <q-separator class="q-my-md" />
                  <div class="text-subtitle1 text-weight-medium q-mb-sm">Prospek Jangka Pendek</div>
                  <p class="text-body2">{{ analysis.short_term_outlook }}</p>
                </q-scroll-area>
              </q-tab-panel>

              <q-tab-panel name="details">
                <q-scroll-area style="height: 300px;">
                  <q-list separator>
                    <q-item>
                      <q-item-section>
                        <q-item-label overline>Pola Harga</q-item-label>
                        <q-item-label>{{ analysis.price_pattern }}</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section>
                        <q-item-label overline>Analisis Volatilitas</q-item-label>
                        <q-item-label>{{ analysis.volatility_analysis }}</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section>
                        <q-item-label overline>Analisis Tren</q-item-label>
                        <q-item-label>{{ analysis.trend_analysis }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-scroll-area>
              </q-tab-panel>

              <q-tab-panel name="recommendations">
                <q-scroll-area style="height: 300px;">
                  <div class="text-subtitle1 text-weight-medium q-mb-sm">Saran Monitoring</div>
                  <q-list dense class="q-mb-md">
                    <q-item v-for="suggestion in analysis.monitoring_suggestions" :key="suggestion.id">
                      <q-item-section avatar>
                        <q-icon color="primary" name="monitor_heart" />
                      </q-item-section>
                      <q-item-section>{{ suggestion.content }}</q-item-section>
                    </q-item>
                  </q-list>
                  <q-separator class="q-my-md" />
                  <div class="text-subtitle1 text-weight-medium q-mb-sm">Metrik Kunci untuk Diperhatikan</div>
                  <q-list dense>
                    <q-item v-for="metric in analysis.key_metrics_to_watch" :key="metric.id">
                      <q-item-section avatar>
                        <q-icon color="primary" name="visibility" />
                      </q-item-section>
                      <q-item-section>{{ metric.content }}</q-item-section>
                    </q-item>
                  </q-list>
                </q-scroll-area>
              </q-tab-panel>

              <q-tab-panel name="warnings">
                <q-scroll-area style="height: 300px;">
                  <div class="text-subtitle1 text-weight-medium q-mb-sm">Peringatan Berbasis Data</div>
                  <q-list dense class="q-mb-md">
                    <q-item v-for="alert in analysis.data_based_alerts" :key="alert.id">
                      <q-item-section avatar>
                        <q-icon color="negative" name="warning" />
                      </q-item-section>
                      <q-item-section>{{ alert.content }}</q-item-section>
                    </q-item>
                  </q-list>
                  <q-separator class="q-my-md" />
                  <div class="text-subtitle1 text-weight-medium q-mb-sm">Peringatan Statistik</div>
                  <q-list dense>
                    <q-item v-for="warning in analysis.statistical_warnings" :key="warning.id">
                      <q-item-section avatar>
                        <q-icon color="orange" name="science" />
                      </q-item-section>
                      <q-item-section>{{ warning.content }}</q-item-section>
                    </q-item>
                  </q-list>
                </q-scroll-area>
              </q-tab-panel>
            </q-tab-panels>
          </q-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, watch, defineProps, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useAnalysisStore } from 'src/stores/analysisStore';
import { useKomoditasStore } from 'src/stores/komoditasStore';

const props = defineProps({
  dark: {
    type: Boolean,
    default: true,
  },
});

const analysisStore = useAnalysisStore();
const { analyses, loading, error } = storeToRefs(analysisStore);
const komoditasStore = useKomoditasStore();

function getWeekPriceChange(komoditasNama) {
  const commodity = komoditasStore.get().find(c => c.nama === komoditasNama);
  console.log('Calculating week price change for commodity ID:', komoditasNama, commodity, komoditasStore.get());
  if (!commodity || !commodity.data || commodity.data.length < 2) {
    return {
      change: 0,
      trend: 'flat',
      tooltip: 'Data tidak cukup untuk menghitung perubahan harga 1 minggu.'
    };
  }

  const today = new Date();
  const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

  const recentPrices = commodity.data.filter(d => new Date(d.date) >= sevenDaysAgo && new Date(d.date) <= today);

  if (recentPrices.length < 2) {
    return {
      change: 0,
      trend: 'flat',
      tooltip: 'Tidak ada data harga dalam 7 hari terakhir.'
    };
  }

  const latestPrice = recentPrices[recentPrices.length - 1].price;
  const oldestPrice = recentPrices[0].price;

  const change = (((latestPrice - oldestPrice) / oldestPrice) * 100).toFixed(2);
  const trend = change > 0 ? 'up' : 'down';

  return {
    change,
    trend,
    tooltip: `Perubahan harga 1 minggu: ${change}%`
  };
}

// --- Icon and Color Helper Functions ---

const getTrendIcon = (trend) => {
  if (trend === 'TURUN') return 'trending_down';
  if (trend === 'NAIK') return 'trending_up';
  return 'trending_flat';
};

const getTrendColor = (trend) => {
  if (trend === 'TURUN') return 'positive';
  if (trend === 'NAIK') return 'negative';
  return 'grey';
};

const getVolatilityIcon = (volatility) => {
  if (volatility === 'TINGGI') return 'error_outline';
  if (volatility === 'SANGAT_TINGGI') return 'error_outline';
  if (volatility === 'SEDANG') return 'warning_amber';
  return 'check_circle_outline';
};

const getVolatilityColor = (volatility) => {
  if (volatility === 'TINGGI') return 'deep-orange';
  if (volatility === 'SANGAT_TINGGI') return 'negative';
  if (volatility === 'SEDANG') return 'orange';
  return 'green';
};

const getConditionIcon = (condition) => {
  return condition === 'BERGEJOLAK' ? 'flash_on' : 'shield';
};

const getConditionColor = (condition) => {
  return condition === 'BERGEJOLAK' ? 'purple' : 'blue-grey';
};

// --- Lifecycle Hooks ---

watch(analyses, (newAnalyses) => {
  if (newAnalyses) {
    newAnalyses.forEach(analysis => {
      // Set a default tab for each analysis card when data loads
      if (!analysis.tab) {
        analysis.tab = 'summary';
      }
    });
  }
}, { immediate: true });

onMounted(() => {
  analysisStore.fetchAnalyses();
});
</script>

<style scoped>
/* New Header Styles */
.ai-header .gemini-icon {
  background: linear-gradient(45deg, #4285F4, #9B59B6, #CF6398, #F4B400);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.ai-card {
  border-radius: 12px;
  transition: all 0.3s ease-in-out;
}

.ai-card.dark {
  background: #2E3A4D;
  color: #E0E0E0;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.ai-card.light {
  background: #FFFFFF;
  color: #2c3e50;
  border: 1px solid #E0E0E0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* Fixed height container to prevent layout shift */
.tab-panels-container {
  height: 350px;
  /* Fixed height for consistency */
  overflow: hidden;
}

.tab-panel-content {
  height: 100%;
  overflow-y: auto;
  padding: 24px !important;
}

/* Ensure scroll behavior is smooth */
.tab-panel-content::-webkit-scrollbar {
  width: 6px;
}

.tab-panel-content::-webkit-scrollbar-track {
  background: transparent;
}

.tab-panel-content::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.ai-card.dark .tab-panel-content::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
}

.q-item__label--overline {
  font-size: 0.8rem;
  font-weight: 500;
  color: #027BE3;
}

.ai-card.dark .q-item__label--overline {
  color: #90CAF9;
}

@media (max-width: 1023px) {
  .ai-card {
    border-radius: 0;
    box-shadow: none;
    border: none;
  }
}
</style>
