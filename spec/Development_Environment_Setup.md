# Spesifikasi Lingkungan Pengembang (Development Environment Setup)

Dokumen ini menjelaskan spesifikasi arsitektur dan konfigurasi lingkungan pengembang (*development environment*) untuk aplikasi **KOPI DEWA Frontend** berbasis Quasar Framework (Vue 3 + Vite).

---

## 1. Arsitektur & Layanan Development

Aplikasi frontend berjalan sebagai Single Page Application (SPA) yang berkomunikasi dengan backend Laravel API Server.

| Layanan | Teknologi | URL / Port Lokal | Deskripsi |
| :--- | :--- | :--- | :--- |
| **Frontend Dev Server** | Quasar / Vite | `http://localhost:9100` | Server pengembang frontend dengan HMR |
| **Backend API Server** | Laravel (Docker) | `http://localhost:8000` | API Server penyedia data komoditas (`/api`) |
| **phpMyAdmin** | MySQL Web GUI | `http://localhost:8080` | Manajemen database backend |
| **MySQL Database** | MySQL 8.0 | `localhost:3306` | Database utama |

---

## 2. Pengaturan Docker Compose & HMR

### 2.1 Container Frontend (`Dockerfile`)
Container frontend dibangun menggunakan image `node:20-alpine` untuk memastikan konsistensi versi Node.js.
- **Port:** `9100` diekspos ke host lokal.
- **Volume Mount:** `./:/app` dan `/app/node_modules` (anonymous volume untuk mencegah konflik dependency antara host dan container).
- **Workdir:** `/app`.

### 2.2 Live Reload / HMR dalam Container
Untuk menjamin Instant Live Reload (Hot Module Replacement) berjalan secara *seamless* di Linux maupun dalam container Docker:
- `CHOKIDAR_USEPOLLING=true` diaktifkan pada lingkungan container untuk memantau perubahan berkas pada mounted volume.
- Server dev dikonfigurasi untuk mendengar pada `0.0.0.0` agar dapat diakses dari host luar container.

---

## 3. Pencegahan Proses Orphan & Skrip Runner (`dev.sh`)

Pengujian dev server sering kali meninggalkan proses *orphan* (proses `node` atau `quasar dev` yang masih menggantung) ketika terminal ditutup secara paksa, sehingga menyebabkan bentrok port `9100`.

### 3.1 Mekanisme `dev.sh`
Skrip [dev.sh](file:///home/ihza/Projects/harga-front/dev.sh) mengimplementasikan praktik terbaik manajemen proses:
1. **Pemeriksaan & Pembersihan Port Bentrok:**
   Sebelum memulai server, skrip memeriksa apakah port `9100` sedang digunakan. Jika ada proses *orphan*, skrip secara otomatis mengirim sinyal `SIGTERM` (dan `SIGKILL` jika diperlukan) untuk membebaskan port secara aman.
2. **Pemeriksaan File `.env`:**
   Memastikan file `.env` sudah tersedia dari `.env.example`.
3. **Signal Trapping (`SIGINT`, `SIGTERM`, `EXIT`):**
   Memasang *trap* sinyal pada skrip bash. Ketika pengguna menekan `Ctrl+C`, skrip akan secara otomatis menghentikan proses turunan (*child processes*) secara bersih sehingga tidak ada proses orphan yang tertinggal.

---

## 4. Konfigurasi Environment (`.env`)

Aplikasi menggunakan environment variables berikut untuk komunikasi dengan backend dan identitas aplikasi:

```env
# Identitas Aplikasi
VITE_APP_NAME="KOPI DEWA"
VITE_APP_SUBTITLE="Kolaborasi Pengendalian Inflasi Daerah Kabupaten Mempawah"

# Wilayah
VITE_REGION_ID="mempawah"
VITE_REGION_NAME="Kabupaten Mempawah"

# Connection to Backend API
VITE_API_BASE_URL="http://localhost:8000/api"

# Dev Server Port
PORT=9100
```

---

## 5. Perintah Penggunaan Ringkas

- **Menjalankan Dev Server Lokal (Bebas Orphan):**
  ```bash
  npm run dev:clean
  # atau
  ./dev.sh
  ```

- **Menjalankan via Docker Compose:**
  ```bash
  docker compose up --build
  ```
