# Dashboard Harga Komoditas (Frontend)

Ini adalah repositori frontend untuk aplikasi Dashboard Harga Komoditas, sebuah aplikasi **ATM (Amati, Tiru, Modifikasi)** yang dirancang untuk membantu Tim Pengendali Inflasi Daerah (TPID) memantau harga pasar.

## 🚀 Panduan Instalasi & Replikasi

Untuk panduan lengkap mengenai cara menginstall, mengatur konfigurasi wilayah (nama daerah, logo, kontak), dan menghubungkan ke backend, silakan baca dokumen berikut:

👉 **[BACA PANDUAN INSTALASI (SETUP_GUIDE.md)](./SETUP_GUIDE.md)** 👈

## ⚡ Perintah Cepat (Quick Start)

Jika Anda sudah menyelesaikan konfigurasi di `SETUP_GUIDE.md`:

### Install Dependencies

```bash
npm install
```

### Jalankan Server Development

```bash
npm run dev
```

_Aplikasi berjalan di port 9100 secara default._

### Build untuk Production

```bash
npm run build
```

_Hasil build ada di folder `.dist/spa`_

## 🛠️ Tech Stack

- **Framework**: Quasar (Vue.js 3)
- **State Management**: Pinia
- **Charts**: Chart.js
- **Animation**: Anime.js
