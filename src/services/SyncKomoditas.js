import { api } from "src/boot/axios";
import { useUtils } from "src/utils/utils";
import { ref } from "vue";

export function useSyncService() {
  const komoditas = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const Utils = useUtils();

  const loadingUpdate = ref(false);
  const errodUpdate = ref(null);
  const updateBackend = async () => {
    try {
      loadingUpdate.value = true;
      await api.get("/update_komoditas");
      await fetchKomoditas();
    } catch (error) {
      console.log("error updating", error.message);
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
        komoditas.value = Utils.transformDataArray(res.data);
      });
      console.log("komo", komoditas.value);
    } catch (err) {
      error.value = err.message;
      console.log("err:", err.message);
    } finally {
      loading.value = false;
      console.log("loading", loading.value);
    }
  };
  return {
    komoditas,
    fetchKomoditas,
    loading,
    error,
    updateBackend,
    errodUpdate,
    loadingUpdate,
  };
}
