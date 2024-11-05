import { defineStore } from "pinia";
import { useUtils } from "src/utils/utils";
const Constants = useUtils().Constants;
export const useSelectionStore = defineStore("selection", {
  state: () => ({
    selectedItems: {},
  }),
  actions: {
    setSelection(key, item) {
      this.selectedItems[key] = item;
    },
    clearSelection(key) {
      delete this.selectedItems[key];
    },
  },
  getters: {
    getSelectionByKey: (state) => (key) => {
      return state.selectedItems[key];
    },
  },
});
