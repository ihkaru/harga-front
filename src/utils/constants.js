export function useConstants() {
  const Constants = {
    SELECTED_KOMODITAS: "SELECTED_KOMODITAS",
    SELECTED_PERIOD_CHART: "SELECTED_PERIOD_CHART",
    SELECTED_WILAYAH: "SELECTED_WILAYAH",
    WILAYAH_LABELS: {
      "090": "Sungai Pinyuh",
      "091": "Anjongan",
      100: "Mempawah Hilir",
      "080": "Jongkat",
    },
    DEFAULT_SELECTED_WILAYAH: "100",
    KECAMATAN_PASAR: {
      "090": "Usaha Bersama",
      "091": "Gunung Loncet",
      100: "Sebukit Rama",
      "080": "Pangkalan Mas",
    },
  };
  return Constants;
}
