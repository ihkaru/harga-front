<template>
  <q-icon name="info_outline" color="grey-6" size="xs" class="q-ml-xs cursor-pointer">
    <q-tooltip
      anchor="top middle"
      self="bottom middle"
      :offset="[10, 10]"
      class="bg-grey-9 text-white shadow-2"
      style="max-width: 250px; font-size: 0.8rem;"
    >
      {{ text }}
    </q-tooltip>
  </q-icon>
</template>

<script setup>
defineProps({
  text: {
    type: String,
    required: true,
  },
});
</script>
