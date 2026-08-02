import { boot } from "quasar/wrappers";
import axios from "axios";
axios.defaults.headers.get["Content-Type"] = "application/json";
const apiBaseUrl =
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_BASE_URL) ||
  process.env.VITE_API_BASE_URL ||
  process.env.API_BASE_URL ||
  (process.env.DEV ? "http://localhost:8000/api" : "https://harga-api.dvlp.asia/api");

const imageBaseUrl = apiBaseUrl.replace(/\/api\/?$/, "");

const getCommodityImageUrl = (nama) => {
  if (!nama) return "assets/MPW.png";
  return `${imageBaseUrl}/komoditas/${encodeURIComponent(nama.trim())}.webp`;
};

const api = axios.create({
  baseURL: apiBaseUrl,
});

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;
  app.config.globalProperties.$imageBaseUrl = imageBaseUrl;
  app.config.globalProperties.$getCommodityImageUrl = getCommodityImageUrl;
});

export { api, imageBaseUrl, getCommodityImageUrl };
