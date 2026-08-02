# Panduan Replikasi & Instalasi Frontend (KOPI DEWA)

Dokumen ini menjelaskan cara menduplikasi (replikasi), mengonfigurasi, dan menjalankan frontend aplikasi **KOPI DEWA** (Kolaborasi Pengendalian Inflasi Daerah Kabupaten Mempawah). Spesifikasi teknis rinci pengembang tersedia di [spec/Development_Environment_Setup.md](file:///home/ihza/Projects/harga-front/spec/Development_Environment_Setup.md).

---

## 📋 Prasyarat

Pastikan komputer Anda sudah terinstall salah satu dari opsi berikut:

**Opsi A: Pengembangan Lokal**
- **Node.js** (Versi 18 atau 20)
- **NPM** (Bawaan Node.js)
- **Backend API Server** berjalan di `http://localhost:8000`

**Opsi B: Pengembangan via Docker**
- **Docker** & **Docker Compose**
- **Backend API Server** berjalan di `http://localhost:8000`

---

## 🚀 Langkah 1: Instalasi & Environment Setup

1.  **Clone Repository** (atau download source code).
2.  Buka terminal di folder project ini.
3.  Install dependencies (untuk opsi lokal):
    ```bash
    npm install
    ```
4.  **Buat File Environment (`.env`)**
    ```bash
    cp .env.example .env
    ```

5.  **Edit `.env`**
    Sesuaikan variabel identitas dan URL backend API:

    ```env
    # --- Identitas Aplikasi ---
    VITE_APP_NAME="KOPI DEWA"
    VITE_APP_SUBTITLE="Kolaborasi Pengendalian Inflasi Daerah Kabupaten Mempawah"

    # --- Konfigurasi Wilayah ---
    VITE_REGION_ID="mempawah"
    VITE_REGION_NAME="Kabupaten Mempawah"
    VITE_REGION_DISTRICT="Mempawah Hilir"
    VITE_REGION_LAT=0.36
    VITE_REGION_LNG=108.96

    # --- Kontak Instansi ---
    VITE_INSTITUTION_NAME="Dinas Perdagangan, Perindustrian dan Tenaga Kerja Kabupaten Mempawah"
    VITE_INSTITUTION_ADDRESS="Jalan Raden Kusno, Kelurahan Tengah, Kecamatan Mempawah Hilir"

    # --- Koneksi ke Backend API Server ---
    VITE_API_BASE_URL="http://localhost:8000/api"

    # --- Port Dev Server ---
    PORT=9100
    ```

---

## 🖼️ Langkah 2: Ganti Aset (Logo)

Letakkan file logo instansi/daerah Anda di folder `public/assets/`.
Update nama file di `.env`:
```env
VITE_LOGO_MAIN="MPW.png"
VITE_LOGO_PARTNER="BPS.png"
```

---

## ▶️ Langkah 3: Jalankan Dev Server

### Cara 1: Menggunakan Script Auto-Clean (Rekomendasi Utama)

Skrip ini otomatis mendeteksi dan menghentikan sisa proses *orphan* di port `9100` sebelum server dimulai, serta menghentikan seluruh proses turunan secara bersih ketika `Ctrl+C` ditekan.

```bash
npm run dev:clean
# atau jalankan skrip langsung:
./dev.sh
```

Aplikasi akan berjalan di `http://localhost:9100` dengan HMR (Hot Module Replacement) yang *seamless*.

---

### Cara 2: Menggunakan Docker Compose

Jika Anda ingin menjalankan dev server di lingkungan container yang terisolasi dengan *Instant Live Reload*:

```bash
docker compose up --build
```

Container frontend `harga_frontend` akan berjalan di `http://localhost:9100`. Setiap perubahan kode lokal akan langsung ter-update di server dev secara instan.

---

## 🔨 Build untuk Production

Jika sudah siap untuk di-deploy ke server hosting (cPanel, VPS, Nginx):

```bash
npm run build
```

Hasil build akan tersimpan di folder `dist/spa`.

---

## ❓ FAQ & Troubleshooting

**Q: Port 9100 sudah digunakan / error EADDRINUSE?**
A: Jalankan `npm run dev:clean` atau `./dev.sh`. Skrip akan otomatis membersihkan proses orphan yang masih menggantung di port 9100.

**Q: Data komoditas/grafik tidak muncul?**
A: Pastikan backend Laravel API Server sudah berjalan di `http://localhost:8000` dan endpoint `http://localhost:8000/api/komoditas` memberikan respon JSON yang valid.
