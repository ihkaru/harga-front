# Walkthrough - Development Environment & Dev Server Setup (KOPI DEWA Frontend)

Seluruh pengolahan dan konfigurasi development server berbasis Docker serta skrip dev runner lokal telah berhasil diselesaikan dengan praktik terbaik (best practices).

---

## Ringkasan Pekerjaan

### 1. Spec-Driven Documentation
- **Spesifikasi:** Berkas [spec/Development_Environment_Setup.md](file:///home/ihza/Projects/harga-front/spec/Development_Environment_Setup.md) telah dibuat, mendokumentasikan arsitektur development server, port, Docker setup, HMR, dan mekanisme penanganan proses orphan.
- **Panduan Instalasi & Penggunaan:** Berkas [SETUP_GUIDE.md](file:///home/ihza/Projects/harga-front/SETUP_GUIDE.md) diperbarui dengan panduan lengkap penggunaan skrip `dev.sh`, `npm run dev:clean`, serta Docker Compose.

### 2. Pengaturan Docker Compose & Instant Live Reload
- **`Dockerfile`:** Dibuat menggunakan Node 20 Alpine base image dengan expose port `9100`.
- **`docker-compose.yml`:** Dibuat dengan service `frontend` (`harga_frontend`), volume mount `./:/app` dan anonymous volume `/app/node_modules`, serta `CHOKIDAR_USEPOLLING=true` untuk instant live reload (HMR) yang stabil pada mounted volume.

### 3. Pengaturan Environment (`.env`)
- Berkas [.env](file:///home/ihza/Projects/harga-front/.env) di-setup dari `.env.example` dengan kredensial & koneksi ke backend Laravel API Server:
  - `VITE_API_BASE_URL="http://localhost:8000/api"`
  - `PORT=9100`
  - Identitas aplikasi KOPI DEWA & wilayah Kabupaten Mempawah.

### 4. Runner Script Auto-Clean & HMR (`dev.sh`)
- Berkas [dev.sh](file:///home/ihza/Projects/harga-front/dev.sh) dibuat dan diberi izin eksekusi (`chmod +x`). Skrip ini:
  - Memeriksa ketersediaan `.env` dan `node_modules` (menjalankan `npm install` otomatis bila belum ada).
  - Mendeteksi proses *orphan* pada port `9100` dan menghentikannya secara otomatis sebelum server dimulai.
  - Memasang *signal trap* (`SIGINT`, `SIGTERM`, `EXIT`) untuk memastikan ketika pengguna menekan `Ctrl+C`, seluruh proses turunan mati bersih tanpa meninggalkan orphan process.
- Berkas [quasar.config.js](file:///home/ihza/Projects/harga-front/quasar.config.js) diperbarui agar mendengarkan pada host `0.0.0.0` dan membaca dynamic `PORT`.
- Script `dev:clean` dan `dev:docker` ditambahkan ke [package.json](file:///home/ihza/Projects/harga-front/package.json).

### 5. Koreksi Endpoint API Backend Server
- Berkas [src/boot/axios.js](file:///home/ihza/Projects/harga-front/src/boot/axios.js) diperbarui agar mendeteksi `VITE_API_BASE_URL` dan `API_BASE_URL` dari environment, serta fallback ke `http://localhost:8000/api` pada mode development (menggantikan URL lama `http://harga.test/api`).
- Berkas [.env.development](file:///home/ihza/Projects/harga-front/.env.development), [.env](file:///home/ihza/Projects/harga-front/.env), dan [.env.example](file:///home/ihza/Projects/harga-front/.env.example) disesuaikan mengarahkan endpoint ke `http://localhost:8000/api`.

### 6. Integrasi Standard Quasar Framework & TailwindCSS v4
- **TailwindCSS v4 Setup (Best Practice 2026):**
  - Menginstall `@tailwindcss/postcss` & `tailwindcss` v4.
  - Memuat plugin `@tailwindcss/postcss` pada [postcss.config.cjs](file:///home/ihza/Projects/harga-front/postcss.config.cjs).
  - Membuat entry CSS khusus [src/css/tailwind.css](file:///home/ihza/Projects/harga-front/src/css/tailwind.css) berisi `@import "tailwindcss";`.
  - Daftarkan `tailwind.css` ke dalam array `css: ['app.scss', 'tailwind.css']` pada [quasar.config.js](file:///home/ihza/Projects/harga-front/quasar.config.js).
- **Perbaikan Format Tanggal (`utils.js`):** Memperbaiki padding bulan pada string tanggal (`item.bulan.padStart(2, "0")`) di [src/utils/utils.js](file:///home/ihza/Projects/harga-front/src/utils/utils.js). Mengatasi bug `Invalid Date` yang menyebabkan `MainChart.vue` tidak merender grafik dan menampilkan `Harga 1 bulan lalu (): Rp 0`.
- **Penanganan Bentrok CSS Preflight & Canvas Chart.js:**
  - Mengisolasi reset CSS Tailwind v4 melalui `@layer base` pada [src/css/tailwind.css](file:///home/ihza/Projects/harga-front/src/css/tailwind.css) agar tidak merusak style komponen bawaan Quasar (`<q-avatar>`, `<q-img>`, `<q-card>`, `<q-btn>`).
  - Menambahkan safeguard validasi koordianat `point.x` / `point.y` dan pembatasan `max-width: 100% !important` pada canvas Chart.js di [src/components/MainChart.vue](file:///home/ihza/Projects/harga-front/src/components/MainChart.vue) untuk mencegah ekspansi lingkaran hitam besar akibat gambar/canvas tanpa konteks path bersih.
  - Memodifikasi baris pemilih periode di [src/components/MainChart.vue](file:///home/ihza/Projects/harga-front/src/components/MainChart.vue) menggunakan komponen bawaan Quasar **`<q-btn-toggle>`** daripada tag `<button>` mentah, yang menghindari bentrok rendering font, fokus, dan styling tombol dari preflight reset.
  - Menghapus efek filter drop shadow (`feDropShadow`) dan linear gradient yang rumit dari [src/components/SparkLine.vue](file:///home/ihza/Projects/harga-front/src/components/SparkLine.vue) dan menyederhanakan path agar digambar secara solid. Hal ini memperbaiki masalah rendering spline/sparkline yang tidak terlihat di browser akibat bug evaluasi filter dimensi box di dalam flex container.
  - Mengubah latar belakang `.sparkline-wrapper` menjadi transparan (`background-color: transparent`) dan menghapus aturan `@media (prefers-color-scheme: dark)` di [src/components/SparkLine.vue](file:///home/ihza/Projects/harga-front/src/components/SparkLine.vue). Hal ini menghentikan pemaksaan kotak latar belakang abu-abu/hitam gelap ketika browser atau sistem operasi mendeteksi setelan dark mode, sehingga sparkline membaur bersih di atas kartu putih (light mode) dashboard.
  - **Optimalisasi Grafik Utama (Main Chart)**:
    - Merefaktor `chartOptions` pada [src/components/MainChart.vue](file:///home/ihza/Projects/harga-front/src/components/MainChart.vue) menjadi **`computed` property** dinamis.
    - Menangani kasus data harga yang flat (konstan/tidak berubah) dengan menambahkan toleransi batas Y-axis (`yMin` dan `yMax` sebesar ±5% dari harga flat). Hal ini mencegah garis grafik menempel kaku di dasar batas kanvas luar.
    - Mengaktifkan label sumbu Y (`ticks.display: true`) dengan format mata uang rupiah bersih agar pengguna memiliki acuan rentang nilai nominal harga yang jelas pada sumbu vertikal grafik.
    - Mendeklarasikan variabel `isMaxLabelDone` dan `isMinLabelDone` secara lokal di dalam fungsi `afterDraw` pada plugin `minMaxLabelsPlugin`. Hal ini menyelesaikan masalah `Uncaught ReferenceError: isMaxLabelDone is not defined` yang menghentikan render grafik di browser akibat cakupan variabel (*variable scope*) yang tidak terdefinisi.
    - **Pembersihan Data Kosong (Harga Rp 0)**:
      - Memodifikasi `filterByKecamatan` dan `getLastPrice` pada [src/utils/hargaUtils.js](file:///home/ihza/Projects/harga-front/src/utils/hargaUtils.js) serta `getSparklinePrices` pada [src/utils/utils.js](file:///home/ihza/Projects/harga-front/src/utils/utils.js) untuk secara aktif memfilter data bernilai `price > 0`. Hal ini mencegah data survei kosong/hilang (yang tercatat sebagai Rp 0 pada database dinas) merusak skala sumbu Y grafik utama dan sumbu grafik sparkline sidebar.
  - **Penyelarasan Running Cards (Carousel)**:
    - Merefaktor kontainer running card pada [src/pages/IndexPage.vue](file:///home/ihza/Projects/harga-front/src/pages/IndexPage.vue) untuk menghilangkan batasan tinggi statis (`height: 35vh`) dan lebar penuh (`100vw`), serta menggantinya dengan layout relatif responsif (`-mt-8 sm:-mt-14`).
    - Menghapus aturan offset vertikal kaku (`transform: translateY(-4em)`) di [src/components/CommodityDisplay.vue](file:///home/ihza/Projects/harga-front/src/components/CommodityDisplay.vue) yang menyebabkan running card tumpang-tindih (overlay) menutupi header grafik di bawahnya pada layar mobile.
    - Merefaktor kartu komoditas di [src/components/CommodityCard.vue](file:///home/ihza/Projects/harga-front/src/components/CommodityCard.vue) agar memiliki ukuran dinamis (`w-[170px]` pada mobile dan `w-[220px]` pada desktop), mengecilkan ukuran gambar bulat (`q-avatar` dari `64px` ke `size-20`), serta menyesuaikan ukuran font agar pas dan rapi tanpa terpotong di layar handphone.

---

## Hasil Verifikasi

1. **Struktur File & Sintaks Script:**
   - File `dev.sh` lolos pengujian sintaks shell (`bash -n ./dev.sh`).
   - File `docker-compose.yml`, `Dockerfile`, `.env`, dan `quasar.config.js` terverifikasi sesuai format standar.
2. **Orphan Process & Port Conflict Prevention:**
   - Skrip `dev.sh` berhasil memindai port `9100`, menghapus sisa proses bila ada, dan menghentikan server secara higienis saat menerima sinyal pembatalan.

---

## Panduan Perintah Ringkas

```bash
# Menjalankan Dev Server Lokal (Auto Clean Port 9100 & Seamless HMR)
npm run dev:clean
# atau
./dev.sh

# Menjalankan via Docker Compose
npm run dev:docker
# atau
docker compose up --build
```
