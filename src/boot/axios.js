import { boot } from "quasar/wrappers";
import axios from "axios";
axios.defaults.headers.get["Content-Type"] = "application/json";
const api = axios.create({ baseURL: process.env.API_BASE_URL });
console.log("dev", process.env.DEV);
console.log("prod", process.env.PROD);
console.log("NODE_ENV", process.env.NODE_ENV);
console.log("API_BASE_URL", process.env.API_BASE_URL);
export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;
});

export { api };
