import { api } from "src/boot/axios";
import { useKomoditasStore } from "src/stores/komoditasStore";
import { useUtils } from "src/utils/utils";
import { ref } from "vue";

export function useSyncService() {
  const komoditas = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const Utils = useUtils();
  const lastUpdate = ref(null);
  const komoditasStore = useKomoditasStore();

  const loadingUpdate = ref(false);
  const errodUpdate = ref(null);
  const dataUpdate = ref({});
  const updateBackend = async () => {
    try {
      loadingUpdate.value = true;
      await api.get("/update_komoditas").then((res) => {
        dataUpdate.value = res.data;
      });
      await fetchKomoditas();
    } catch (err) {
      error.value = err.message;
    } finally {
      loadingUpdate.value = false;
    }
  };
  const fetchKomoditas = async () => {
    let apiUrl = "/komoditas";
    loading.value = true;
    error.value = null;
    try {
      await api.get(apiUrl).then((res) => {
        const transformedData = Utils.transformDataArray(res.data);
        komoditasStore.set(transformedData);
        const lastUpdate = Utils.getCurrentDateTime();
        komoditasStore.setLastUpdate(lastUpdate);
      });
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };
  return {
    fetchKomoditas,
    loading,
    error,
    updateBackend,
    errodUpdate,
    loadingUpdate,
    dataUpdate,
    lastUpdate,
  };
}
