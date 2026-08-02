/* eslint-env node */

/*
 * This file runs in a Node context (it's NOT transpiled by Babel), so use only
 * the ES6 features that are supported by your Node version. https://node.green/
 */

// Configuration for your app
// https://v2.quasar.dev/quasar-cli-vite/quasar-config-js
// Configuration for your app
// https://v2.quasar.dev/quasar-cli-vite/quasar-config-js
require("dotenv").config(); // Load .env file into process.env

const { configure } = require("quasar/wrappers");

module.exports = configure(function (/* ctx */) {
  const appName = process.env.VITE_APP_NAME || "Dashboard Harga Komoditas";
  const appDescription = process.env.VITE_APP_SUBTITLE || "Dashboard Harga Komoditas di Kabupaten Mempawah";

  return {
    // Top-level properties to override package.json
    productName: appName,
    description: appDescription,
    
    // https://v2.quasar.dev/quasar-cli-vite/prefetch-feature
    // preFetch: true,

    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    // https://v2.quasar.dev/quasar-cli-vite/boot-files
    boot: ["axios"],

    // https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#css
    css: ["app.scss", "tailwind.css"],

    // https://github.com/quasarframework/quasar/tree/dev/extras
    extras: [
      // 'ionicons-v4',
      // 'mdi-v7',
      "fontawesome-v6",
      // 'eva-icons',
      // 'themify',
      // 'line-awesome',
      // 'roboto-font-latin-ext', // this or either 'roboto-font', NEVER both!

      "roboto-font", // optional, you are not bound to it
      "material-icons", // optional, you are not bound to it
    ],

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#build
    build: {
      target: {
        browser: ["es2019", "edge88", "firefox78", "chrome87", "safari13.1"],
        node: "node20",
      },

      vueRouterMode: "history", // available values: 'hash', 'history'
      env: {
        VITE_API_BASE_URL: process.env.VITE_API_BASE_URL || process.env.API_BASE_URL || "http://localhost:8000/api",
        API_BASE_URL: process.env.API_BASE_URL || process.env.VITE_API_BASE_URL || "http://localhost:8000/api",
        VITE_APP_NAME: process.env.VITE_APP_NAME || "KOPI DEWA",
        VITE_APP_SUBTITLE: process.env.VITE_APP_SUBTITLE || "Kolaborasi Pengendalian Inflasi Daerah Kabupaten Mempawah",
        VITE_REGION_ID: process.env.VITE_REGION_ID || "mempawah",
        VITE_REGION_NAME: process.env.VITE_REGION_NAME || "Kabupaten Mempawah",
        VITE_REGION_DISTRICT: process.env.VITE_REGION_DISTRICT || "Mempawah Hilir",
        VITE_REGION_LAT: process.env.VITE_REGION_LAT || "0.36",
        VITE_REGION_LNG: process.env.VITE_REGION_LNG || "108.96",
        VITE_INSTITUTION_NAME: process.env.VITE_INSTITUTION_NAME || "Dinas Perdagangan, Perindustrian dan Tenaga Kerja Kabupaten Mempawah",
        VITE_INSTITUTION_ADDRESS: process.env.VITE_INSTITUTION_ADDRESS || "Jalan Raden Kusno, Kelurahan Tengah, Kecamatan Mempawah Hilir",
        VITE_INSTITUTION_CITY_ZIP: process.env.VITE_INSTITUTION_CITY_ZIP || "Kabupaten Mempawah, Kalimantan Barat 78912",
        VITE_INSTITUTION_PHONE: process.env.VITE_INSTITUTION_PHONE || "(0561) 691037",
        VITE_INSTITUTION_EMAIL: process.env.VITE_INSTITUTION_EMAIL || "perindagnakerdinas@gmail.com",
        VITE_COPYRIGHT_YEAR: process.env.VITE_COPYRIGHT_YEAR || "2024",
        VITE_LOGO_MAIN: process.env.VITE_LOGO_MAIN || "MPW.png",
        VITE_LOGO_PARTNER: process.env.VITE_LOGO_PARTNER || "BPS.png",
      },
      // rawDefine: {}
      // ignorePublicFolder: true,
      // minify: false,
      // polyfillModulePreload: true,
      // distDir

      // extendViteConf (viteConf) {},
      // viteVuePluginOptions: {},

      vitePlugins: [
        [
          "vite-plugin-checker",
          {
            eslint: {
              lintCommand: 'eslint "./**/*.{js,mjs,cjs,vue}"',
            },
          },
          { server: false },
        ],
      ],
      extendViteConf(viteConf) {
        if (process.env.CHOKIDAR_USEPOLLING === "true") {
          viteConf.server = {
            ...viteConf.server,
            watch: {
              usePolling: true,
              interval: 100,
            },
          };
        }
      },
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#devServer
    devServer: {
      // https: true
      port: process.env.PORT ? parseInt(process.env.PORT, 10) : 9100,
      host: process.env.HOST || "0.0.0.0",
      open: process.env.OPEN_BROWSER === "true", // set OPEN_BROWSER=true to auto-open
    },

    // https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#framework
    framework: {
      config: {},

      // iconSet: 'material-icons', // Quasar icon set
      // lang: 'en-US', // Quasar language pack

      // For special cases outside of where the auto-import strategy can have an impact
      // (like functional components as one of the examples),
      // you can manually specify Quasar components/directives to be available everywhere:
      //
      // components: [],
      // directives: [],

      // Quasar plugins
      plugins: [],
    },

    // animations: 'all', // --- includes all animations
    // https://v2.quasar.dev/options/animations
    animations: [],

    // https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#property-sourcefiles
    // sourceFiles: {
    //   rootComponent: 'src/App.vue',
    //   router: 'src/router/index',
    //   store: 'src/store/index',
    //   registerServiceWorker: 'src-pwa/register-service-worker',
    //   serviceWorker: 'src-pwa/custom-service-worker',
    pwaManifestFile: "src-pwa/manifest.json",
    //   electronMain: 'src-electron/electron-main',
    //   electronPreload: 'src-electron/electron-preload'
    // },

    // https://v2.quasar.dev/quasar-cli-vite/developing-ssr/configuring-ssr
    ssr: {
      // ssrPwaHtmlFilename: 'offline.html', // do NOT use index.html as name!
      // will mess up SSR

      // extendSSRWebserverConf (esbuildConf) {},
      // extendPackageJson (json) {},

      pwa: false,

      // manualStoreHydration: true,
      // manualPostHydrationTrigger: true,

      prodPort: 3000, // The default port that the production server should use
      // (gets superseded if process.env.PORT is specified at runtime)

      middlewares: [
        "render", // keep this as last one
      ],
    },

    // https://v2.quasar.dev/quasar-cli-vite/developing-pwa/configuring-pwa
    pwa: {
      workboxMode: "generateSW", // or 'injectManifest'
      injectPwaMetaTags: true,
      swFilename: "sw.js",
      manifestFilename: "manifest.json",
      useCredentialsForManifestTag: false,
      // useFilenameHashes: true,
      // extendGenerateSWOptions (cfg) {}
      // extendInjectManifestOptions (cfg) {},
      // extendManifestJson (json) {}
      // extendPWACustomSWConf (esbuildConf) {}
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-cordova-apps/configuring-cordova
    cordova: {
      // noIosLegacyBuildFlag: true, // uncomment only if you know what you are doing
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-capacitor-apps/configuring-capacitor
    capacitor: {
      hideSplashscreen: true,
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/configuring-electron
    electron: {
      // extendElectronMainConf (esbuildConf)
      // extendElectronPreloadConf (esbuildConf)

      // specify the debugging port to use for the Electron app when running in development mode
      inspectPort: 5858,

      bundler: "packager", // 'packager' or 'builder'

      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options
        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',
        // Windows only
        // win32metadata: { ... }
      },

      builder: {
        // https://www.electron.build/configuration/configuration

        appId: "front",
      },
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-browser-extensions/configuring-bex
    bex: {
      contentScripts: ["my-content-script"],

      // extendBexScriptsConf (esbuildConf) {}
      // extendBexManifestJson (json) {}
    },
  };
});
