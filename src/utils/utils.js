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

  return {
    priceData,
    generatePriceData,
  };
}
