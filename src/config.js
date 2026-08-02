const getEnv = (key, fallback) => {
  if (typeof process !== "undefined" && process && process.env && process.env[key] !== undefined && process.env[key] !== "") {
    return process.env[key];
  }
  if (typeof import.meta !== "undefined" && import.meta && import.meta.env && import.meta.env[key] !== undefined && import.meta.env[key] !== "") {
    return import.meta.env[key];
  }
  return fallback;
};

export default {
  // App Identifiers
  appName: getEnv("VITE_APP_NAME", "KOPI DEWA"),
  appSubtitle: getEnv("VITE_APP_SUBTITLE", "Kolaborasi Pengendalian Inflasi Daerah Kabupaten Mempawah"),

  // Region Details
  region: {
    id: getEnv("VITE_REGION_ID", "mempawah"),
    name: getEnv("VITE_REGION_NAME", "Kabupaten Mempawah"),
    district: getEnv("VITE_REGION_DISTRICT", "Mempawah Hilir"),
    coordinates: {
      lat: parseFloat(getEnv("VITE_REGION_LAT", "0.36")),
      lng: parseFloat(getEnv("VITE_REGION_LNG", "108.96")),
    },
  },

  // Institution Details
  institution: {
    name: getEnv("VITE_INSTITUTION_NAME", "Dinas Perdagangan, Perindustrian dan Tenaga Kerja Kabupaten Mempawah"),
    address: getEnv("VITE_INSTITUTION_ADDRESS", "Jalan Raden Kusno, Kelurahan Tengah, Kecamatan Mempawah Hilir"),
    cityStateZip: getEnv("VITE_INSTITUTION_CITY_ZIP", "Kabupaten Mempawah, Kalimantan Barat 78912"),
    phone: getEnv("VITE_INSTITUTION_PHONE", "(0561) 691037"),
    email: getEnv("VITE_INSTITUTION_EMAIL", "perindagnakerdinas@gmail.com"),
    copyrightYear: getEnv("VITE_COPYRIGHT_YEAR", new Date().getFullYear()),
  },

  // Asset Paths (Relative to public/assets or served via URL)
  assets: {
    logoMain: getEnv("VITE_LOGO_MAIN", "MPW.png"),
    logoPartner: getEnv("VITE_LOGO_PARTNER", "BPS.png"),
  },

  // Connection to API Server
  apiBaseUrl: getEnv("VITE_API_BASE_URL", getEnv("API_BASE_URL", "http://localhost:8000/api")),
};
