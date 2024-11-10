import { defineStore } from "pinia";

export const useKomoditasStore = defineStore("komoditas", {
  state: () => ({
    komoditas: {},
    lastUpdate: null,
  }),
  getters: {
    get: (state) => () => state.komoditas,
    getLastUpdate: (state) => () => state.lastUpdate,
  },
  actions: {
    set(komoditas) {
      this.komoditas = komoditas;
    },
    setLastUpdate(lastUpdate) {
      this.lastUpdate = lastUpdate;
    },
  },
});
