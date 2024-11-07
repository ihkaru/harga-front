import { ref } from "vue";

export function useUtils() {
  const priceData = ref([]);
  function generatePriceData(startDate, endDate, averageIncreasePercent) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    priceData.value = [];
    let currentPrice = 15000; // harga awal

    // Hitung total hari antara startDate dan endDate
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    for (let i = 0; i <= days; i++) {
      const currentDate = new Date(start);
      currentDate.setDate(start.getDate() + i);

      // Randomize percentage change around averageIncreasePercent
      const randomFactor = Math.random() * 0.2 - 0.115; // -10% to +10%
      const dailyIncrease = averageIncreasePercent / 100 + randomFactor;

      // Update price with daily increase
      currentPrice *= 1 + dailyIncrease;

      priceData.value.push({
        date: currentDate.toISOString().split("T")[0], // Format: YYYY-MM-DD
        price: Math.round(currentPrice),
      });
    }
  }
  function isWithinDays(dateString, days) {
    const today = new Date();
    const date = new Date(dateString);
    // console.log(dateString, date);
    const diffTime = Math.abs(today - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= days;
  }
  function transformDataArray(dataArray) {
    const today = new Date();

    // Buat kamus simbol dan ikon untuk setiap komoditas
    const komoditasInfo = {
      "Beras Cap Burung Hong (Medium)": {
        symbol: "BCHM",
        icon: "fas fa-seedling",
      },
      "Beras Cap Anggrek (Medium)": { symbol: "BCAM", icon: "fas fa-seedling" },
      "Beras Cap CK (Premium)": { symbol: "BCCK", icon: "fas fa-seedling" },
      "Beras Cap Madu Tupai (Premium)": {
        symbol: "BCMT",
        icon: "fas fa-seedling",
      },
      "Beras SPHP Bulog": { symbol: "BSB", icon: "fas fa-seedling" },
      "Kedelai Impor,1 kg": { symbol: "KDL", icon: "fas fa-seedling" },
      "Cabai Merah Keriting,1 kg": { symbol: "CMK", icon: "fas fa-pepper-hot" },
      "Cabai Merah Besar,1 kg": { symbol: "CMB", icon: "fas fa-pepper-hot" },
      "Cabai Rawit Merah,1 kg": { symbol: "CRM", icon: "fas fa-pepper-hot" },
      "Bawang Merah,1 kg": { symbol: "BM", icon: "fas fa-leaf" },
      "Gula Pasir Curah, 1kg": { symbol: "GPC", icon: "fas fa-cubes" },
      "Gula Pasir Kemasan, 1kg": { symbol: "GPK", icon: "fas fa-cubes" },
      "Minyak Goreng Curah,1 lt": { symbol: "MGC", icon: "fas fa-oil-can" },
      "Minyak Goreng Kemasan Premium,1 lt": {
        symbol: "MGK",
        icon: "fas fa-oil-can",
      },
      "Minyakita,1 lt": { symbol: "MINYAKITA", icon: "fas fa-oil-can" },
      "Tepung Terigu,1 kg": { symbol: "TT", icon: "fas fa-bread-slice" },
      "Daging Ayam Ras Karkas,1 kg": {
        symbol: "DARK",
        icon: "fas fa-drumstick-bite",
      },
      "Telur Ayam Ras,1 kg": { symbol: "TAR", icon: "fas fa-egg" },
      "Daging Sapi Paha Belakang,1 kg": {
        symbol: "DSPB",
        icon: "fas fa-drumstick-bite",
      },
      "Daging Sapi Paha Depan,1 kg": {
        symbol: "DSPD",
        icon: "fas fa-drumstick-bite",
      },
      "Daging Sapi Sandung Lamur,1 kg": {
        symbol: "DSSL",
        icon: "fas fa-drumstick-bite",
      },
      "Daging Sapi Tetelan,1 kg": {
        symbol: "DST",
        icon: "fas fa-drumstick-bite",
      },
      "Ikan Tongkol,1 kg": { symbol: "IT", icon: "fas fa-fish" },
      "Ikan Teri,1 kg": { symbol: "ITERI", icon: "fas fa-fish" },
      "Mie Instan, 1 bks": { symbol: "MI", icon: "fas fa-box" },
      "Bawang Putih Honan,1 kg": { symbol: "BPH", icon: "fas fa-leaf" },
      "Bawang Bombai,1 kg": { symbol: "BB", icon: "fas fa-leaf" },
      "Garam Halus,1 kg": { symbol: "GH", icon: "fas fa-cubes" },
      "Susu Kental Manis, 370 gr": { symbol: "SKM", icon: "fas fa-tint" },
      "Susu Bubuk (Setara Dancow),400 gr": {
        symbol: "SBD",
        icon: "fas fa-tint",
      },
      "Susu Bubuk Balita (Setara SGM),400 gr": {
        symbol: "SBB",
        icon: "fas fa-tint",
      },
      "Tempe Bungkus,1 kg": { symbol: "TB", icon: "fas fa-leaf" },
      "Tahu Putih,1 kg": { symbol: "TP", icon: "fas fa-leaf" },
      "Udang Basah,1 kg": { symbol: "UB", icon: "fas fa-fish" },
      "Pisang Lokal,1 kg": { symbol: "PL", icon: "fas fa-apple-alt" },
      "Jeruk Lokal,1 kg": { symbol: "JL", icon: "fas fa-lemon" },
      "Tomat,1 kg": { symbol: "TOMAT", icon: "fas fa-apple-alt" },
      "Kentang Sedang,1 kg": { symbol: "KS", icon: "fas fa-apple-alt" },
      "Sawi Hijau,1 kg": { symbol: "SH", icon: "fas fa-leaf" },
      "Kangkung,1 kg": { symbol: "KANGKUNG", icon: "fas fa-leaf" },
      "Ketimun Sedang,1 kg": { symbol: "KTS", icon: "fas fa-leaf" },
      "Kacang Panjang,1 kg": { symbol: "KP", icon: "fas fa-leaf" },
      "Ketela Pohon,1 kg": { symbol: "KTP", icon: "fas fa-leaf" },
      "Ayam Kampung Utuh,1 ekor": {
        symbol: "AKU",
        icon: "fas fa-drumstick-bite",
      },
      "Telur Ayam Kampung,1 kg": { symbol: "TAK", icon: "fas fa-egg" },
      "Kacang Hijau,1 kg": { symbol: "KH", icon: "fas fa-seedling" },
      "Kacang Tanah,1 kg": { symbol: "KT", icon: "fas fa-seedling" },
    };

    return dataArray.map((data) => {
      const prices = data.hargas.map((item) => ({
        date: `${item.tahun}-${item.bulan.padStart(
          2,
          "0"
        )}-${item.tanggal_angka.padStart(2, "0")}`,
        price: parseFloat(item.harga),
      }));
      console.log(prices);

      // Get the current price as the last price in the list
      const currentPrice = prices[prices.length - 1]?.price || 0;

      // Filter prices based on date ranges
      const sparklineData = {
        "1W": prices
          .filter((item) => isWithinDays(item.date, 7))
          .map((item) => item.price),
        "1M": prices
          .filter((item) => isWithinDays(item.date, 30))
          .map((item) => item.price),
        "3M": prices
          .filter((item) => isWithinDays(item.date, 90))
          .map((item) => item.price),
        YTD: prices
          .filter(
            (item) => new Date(item.date).getFullYear() === today.getFullYear()
          )
          .map((item) => item.price),
        "1Y": prices
          .filter((item) => isWithinDays(item.date, 365))
          .map((item) => item.price),
        ALL: prices.map((item) => item.price),
      };

      const { symbol, icon } = komoditasInfo[data.nama] || {
        symbol: "UNK",
        icon: "fas fa-box",
      };

      return {
        nama: data.nama,
        symbol: symbol,
        icon: icon,
        currentPrice: currentPrice,
        data: data.hargas.map((item) => ({
          date: `${item.tahun}-${item.bulan}-${item.tanggal_angka.padStart(
            2,
            "0"
          )}`,
          price: parseFloat(item.harga),
        })),
        sparklineData: sparklineData,
      };
    });
  }
  function formatCurrency(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
  const Constants = {
    SELECTED_KOMODITAS: "SELECTED_KOMODITAS",
    SELECTED_PERIOD_CHART: "SELECTED_PERIOD_CHART",
  };
  return {
    priceData,
    generatePriceData,
    transformDataArray,
    formatCurrency,
    Constants,
  };
}
