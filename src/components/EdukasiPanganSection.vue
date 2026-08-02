<template>
  <div id="edukasi-pangan" class="w-full bg-white rounded-3xl border border-slate-100 shadow-sm p-4 sm:p-6 space-y-4">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
      <div class="space-y-1">
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
          <q-icon name="verified_user" size="14px" />
          <span>Dukungan BPOM & Disperindagnaker Kab. Mempawah</span>
        </div>
        <h2 class="text-lg sm:text-xl font-bold text-slate-800 tracking-tight">
          Edukasi & Tips Keamanan Pangan
        </h2>
      </div>

      <!-- Quick Nav Buttons for Carousel -->
      <div class="flex items-center gap-1.5 self-start sm:self-auto">
        <button
          v-for="(item, idx) in infographics"
          :key="item.id"
          @click="currentSlide = idx"
          :class="[
            currentSlide === idx
              ? 'bg-emerald-600 text-white font-bold shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200 font-medium',
            'px-3 py-1 rounded-full text-xs transition-all duration-200 cursor-pointer'
          ]"
        >
          {{ item.shortTitle }}
        </button>
      </div>
    </div>

    <!-- Full-Width Banner Carousel Card -->
    <div class="relative w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 group shadow-sm">
      <q-carousel
        v-model="currentSlide"
        animated
        infinite
        :autoplay="5000"
        transition-prev="slide-right"
        transition-next="slide-left"
        swipeable
        arrows
        class="w-full h-[280px] xs:h-[340px] sm:h-[480px] md:h-[580px] lg:h-[650px] bg-slate-950"
      >
        <q-carousel-slide
          v-for="(item, index) in infographics"
          :name="index"
          :key="item.id"
          class="q-pa-none relative w-full h-full flex items-center justify-center cursor-pointer"
          @click="openLightbox(index)"
        >
          <!-- Background Image with HTML5 <picture> -->
          <picture class="w-full h-full flex items-center justify-center p-1 sm:p-2">
            <source :srcset="item.webp" type="image/webp" />
            <img
              :src="item.jpg"
              :alt="item.title"
              loading="lazy"
              class="w-full h-full object-contain rounded-lg"
            />
          </picture>

          <!-- Banner Overlay Gradient & Info Badge -->
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

          <!-- Bottom Banner Title & Action -->
          <div class="absolute bottom-3 left-3 right-3 sm:bottom-5 sm:left-6 sm:right-6 flex items-center justify-between gap-3 text-white pointer-events-auto">
            <div class="min-w-0 flex-1">
              <span class="inline-block px-2.5 py-0.5 rounded-md bg-emerald-600/90 text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-1">
                {{ item.category }}
              </span>
              <h3 class="text-xs sm:text-lg font-bold truncate drop-shadow-md">
                {{ item.title }}
              </h3>
            </div>

            <button
              @click.stop="openLightbox(index)"
              class="shrink-0 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-white/90 hover:bg-white text-slate-900 text-xs font-bold shadow-md backdrop-blur-xs flex items-center gap-1.5 transition-all hover:scale-105"
            >
              <q-icon name="fullscreen" size="16px" />
              <span>Perbesar</span>
            </button>
          </div>
        </q-carousel-slide>
      </q-carousel>
    </div>

    <!-- Lightbox Modal Dialog -->
    <q-dialog v-model="isLightboxOpen" maximized transition-show="fade" transition-hide="fade">
      <div class="bg-slate-950/95 text-white flex flex-col h-full w-full relative">
        <!-- Dialog Header -->
        <div class="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md">
          <div class="flex items-center gap-2">
            <q-avatar size="28px" color="emerald-6" text-color="white">
              <q-icon name="shield" size="16px" />
            </q-avatar>
            <div>
              <div class="text-xs font-bold text-slate-200">Edukasi Pangan Aman BPOM</div>
              <div class="text-[10px] text-slate-400 font-medium">{{ activeItem.title }}</div>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <a
              :href="activeItem.webp"
              :download="activeItem.title + '.webp'"
              target="_blank"
              class="px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white flex items-center gap-1 border border-slate-700 transition-colors"
            >
              <q-icon name="download" size="14px" />
              <span class="hidden sm:inline">Unduh</span>
            </a>
            <q-btn flat round dense icon="close" color="white" v-close-popup size="sm" />
          </div>
        </div>

        <!-- Infographic Navigation Tabs -->
        <div class="flex justify-center p-2 bg-slate-900/50 border-b border-slate-800">
          <div class="inline-flex p-1 bg-slate-800/80 rounded-full gap-1">
            <button
              v-for="(item, idx) in infographics"
              :key="item.id"
              @click="currentSlide = idx"
              :class="[
                currentSlide === idx
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'text-slate-400 hover:text-white font-medium',
                'px-3 py-1 rounded-full text-xs transition-all cursor-pointer'
              ]"
            >
              {{ item.shortTitle }}
            </button>
          </div>
        </div>

        <!-- Active Infographic Full Image View -->
        <div class="flex-1 overflow-auto p-4 flex items-center justify-center relative">
          <picture class="max-w-4xl w-full h-auto max-h-[82vh] flex items-center justify-center">
            <source :srcset="activeItem.webp" type="image/webp" />
            <img
              :src="activeItem.jpg"
              :alt="activeItem.title"
              class="max-w-full max-h-[82vh] object-contain rounded-xl shadow-2xl border border-slate-800"
            />
          </picture>

          <!-- Prev/Next Navigation Buttons -->
          <button
            @click="prevImage"
            class="absolute left-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-700 shadow-lg cursor-pointer transition-colors"
          >
            <q-icon name="chevron_left" size="24px" />
          </button>
          <button
            @click="nextImage"
            class="absolute right-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-700 shadow-lg cursor-pointer transition-colors"
          >
            <q-icon name="chevron_right" size="24px" />
          </button>
        </div>
      </div>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const currentSlide = ref(0);
const isLightboxOpen = ref(false);

const infographics = ref([
  {
    id: 1,
    category: 'Pangan Siap Saji',
    shortTitle: 'Siap Saji',
    title: 'Tips Memilih Pangan Siap Saji Yang Aman',
    webp: 'assets/edukasi/tips-pangan-1.webp',
    jpg: 'assets/edukasi/tips-pangan-1.jpeg',
  },
  {
    id: 2,
    category: 'Pangan Olahan',
    shortTitle: 'Pangan Olahan',
    title: 'Tips Memilih Pangan Olahan Yang Aman',
    webp: 'assets/edukasi/tips-pangan-2.webp',
    jpg: 'assets/edukasi/tips-pangan-2.jpeg',
  },
  {
    id: 3,
    category: 'Pangan Segar',
    shortTitle: 'Pangan Segar',
    title: 'Tips Memilih Pangan Segar Yang Aman',
    webp: 'assets/edukasi/tips-pangan-3.webp',
    jpg: 'assets/edukasi/tips-pangan-3.jpeg',
  },
]);

const activeItem = computed(() => infographics.value[currentSlide.value] || infographics.value[0]);

const openLightbox = (index) => {
  currentSlide.value = index;
  isLightboxOpen.value = true;
};

const nextImage = () => {
  currentSlide.value = (currentSlide.value + 1) % infographics.value.length;
};

const prevImage = () => {
  currentSlide.value = (currentSlide.value - 1 + infographics.value.length) % infographics.value.length;
};
</script>
