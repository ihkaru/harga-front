<template>
  <div id="edukasi-pangan" class="w-full py-6 sm:py-8 bg-white rounded-3xl border border-slate-100/80 shadow-xs p-4 sm:p-6 space-y-6">
    <!-- Header Section -->
    <div class="flex flex-col items-center text-center space-y-2 max-w-2xl mx-auto">
      <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
        <q-icon name="verified_user" size="14px" />
        <span>Dukungan BPOM & Disperindagnaker Kab. Mempawah</span>
      </div>
      <h2 class="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
        Edukasi Keamanan Pangan
      </h2>
      <p class="text-xs sm:text-sm text-slate-500 font-medium">
        Panduan praktis memilih pangan siap saji, olahan, dan segar yang aman, sehat, serta layak konsumsi untuk keluarga Anda.
      </p>
    </div>

    <!-- Infographics Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
      <div
        v-for="(item, index) in infographics"
        :key="item.id"
        @click="openLightbox(index)"
        class="group relative bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between"
      >
        <!-- Image Container with HTML5 <picture> WebP best practice -->
        <div class="relative aspect-4/3 w-full bg-slate-100 overflow-hidden">
          <picture>
            <source :srcset="item.webp" type="image/webp" />
            <img
              :src="item.jpg"
              :alt="item.title"
              loading="lazy"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </picture>
          <div class="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/0 transition-colors" />
          <div class="absolute top-2.5 right-2.5 bg-slate-900/70 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
            <q-icon name="zoom_in" size="12px" />
            <span>Perbesar</span>
          </div>
        </div>

        <!-- Content Info -->
        <div class="p-3.5 flex flex-col justify-between flex-1">
          <div>
            <div class="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-0.5">
              {{ item.category }}
            </div>
            <h3 class="text-xs sm:text-sm font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
              {{ item.title }}
            </h3>
          </div>
          <div class="mt-3 flex items-center justify-between text-[11px] font-medium text-slate-500 pt-2 border-t border-slate-200/60">
            <span>Tips BPOM</span>
            <span class="text-blue-600 group-hover:underline font-semibold flex items-center gap-0.5">
              <span>Lihat Detail</span>
              <q-icon name="arrow_forward" size="12px" />
            </span>
          </div>
        </div>
      </div>
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
              @click="activeIndex = idx"
              :class="[
                activeIndex === idx
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
          <picture class="max-w-4xl w-full h-auto max-h-[80vh] flex items-center justify-center">
            <source :srcset="activeItem.webp" type="image/webp" />
            <img
              :src="activeItem.jpg"
              :alt="activeItem.title"
              class="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl border border-slate-800"
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

const isLightboxOpen = ref(false);
const activeIndex = ref(0);

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

const activeItem = computed(() => infographics.value[activeIndex.value] || infographics.value[0]);

const openLightbox = (index) => {
  activeIndex.value = index;
  isLightboxOpen.value = true;
};

const nextImage = () => {
  activeIndex.value = (activeIndex.value + 1) % infographics.value.length;
};

const prevImage = () => {
  activeIndex.value = (activeIndex.value - 1 + infographics.value.length) % infographics.value.length;
};
</script>
