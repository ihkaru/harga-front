<template>
  <q-card @click="$emit('click')" class="commodity-card border border-slate-100 bg-white rounded-2xl shadow-xs p-3.5 sm:p-4 flex flex-col items-center justify-between text-center select-none w-[170px] sm:w-[220px] shrink-0 cursor-pointer hover:border-blue-400 hover:shadow-md active:scale-[0.98] transition-all duration-200 group">
    <q-card-section class="q-pa-none flex flex-col items-center w-full">
      <q-avatar size="64px" class="sm:size-20 border border-slate-200 shadow-3xs mb-2.5">
        <q-img :src="src" fit="cover" />
      </q-avatar>
      <div class="text-xs sm:text-sm font-bold text-slate-800 line-clamp-1 truncate w-full">
        {{ name }}
      </div>
    </q-card-section>

    <q-card-section class="q-pa-none mt-2 w-full">
      <div class="text-base sm:text-lg font-black text-slate-900 tracking-tight">
        Rp {{ price.toLocaleString('id-ID') }}
      </div>
      <div class="text-[10px] text-slate-400 font-semibold mt-0.5">Harga Saat Ini</div>
    </q-card-section>

    <q-card-section class="q-pa-none mt-2 w-full" v-if="priceDifference !== null">
      <div
        :class="[
          'inline-block px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold border',
          priceDifference > 0
            ? 'bg-rose-50 text-rose-700 border-rose-200'
            : priceDifference < 0
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
            : 'bg-slate-50 text-slate-600 border-slate-200'
        ]"
      >
        {{ priceDifference > 0 ? '+' : '' }}{{ formatCurrency(priceDifference) }}
        ({{ priceChangePercentage > 0 ? '+' : '' }}{{ priceChangePercentage }}%)
      </div>
    </q-card-section>

    <q-card-section class="q-pa-none mt-2.5 w-full text-[10px] sm:text-xs text-slate-500 font-medium truncate">
      {{ location ?? "" }}
    </q-card-section>
  </q-card>
</template>

<script setup>
import { computed } from "vue";

// import { computed } from "vue";

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  data: {
    type: Array,
    required: true,
  },
  src: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
});

function formatCurrency(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(value);
}

const priceDifference = computed(() => {
  if (!Array.isArray(props.data)) return null;
  if (props.data?.length < 2) return null;
  const latestPrice = props.data[props.data.length - 1].price;
  const previousPrice = props.data[props.data.length - 2].price;
  return latestPrice - previousPrice;
});

const priceChangePercentage = computed(() => {
  if (!Array.isArray(props.data)) return null;

  if (props.data.length < 2) return null;
  const previousPrice = props.data[props.data.length - 2].price;
  return previousPrice === 0
    ? 0
    : ((priceDifference.value / previousPrice) * 100).toFixed(2);
});
</script>

<style scoped>
</style>
