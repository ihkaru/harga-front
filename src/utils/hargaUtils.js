import { useConstants } from "./constants";

export function useHargaUtils() {
  const Constants = useConstants();
  const filterByKecamatan = (commodity, kodeKecamatan) => {
    const result = { ...commodity };

    result.data = commodity.data.filter(
      (entry) =>
        entry.kecamatan === Constants.WILAYAH_LABELS[kodeKecamatan] &&
        entry.price > 0 &&
        !isNaN(entry.price)
    );

    return result;
  };

  const getLastPrice = (commodity, kodeKecamatan) => {
    let data = commodity.data;
    const filteredData = data.filter(
      (entry) =>
        entry.kecamatan === Constants.WILAYAH_LABELS[kodeKecamatan] &&
        entry.price > 0 &&
        !isNaN(entry.price)
    );

    if (filteredData.length === 0) {
      return 0;
    }

    filteredData.sort((a, b) => new Date(b.date) - new Date(a.date));

    return filteredData[0].price * 1;
  };
  return { getLastPrice, filterByKecamatan };
}
