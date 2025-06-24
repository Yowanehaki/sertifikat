# Certificate Generator Frontend

Frontend React untuk aplikasi generator sertifikat digital.

## Fitur
- Form input data peserta & preview sertifikat
- Zoom, pan, dan modal preview sertifikat
- Export/download sertifikat
- Validasi input

## Cara Menjalankan

1. Install dependencies:
   ```bash
   npm install
   ```

2. Jalankan aplikasi:
   ```bash
   npm run dev
   ```

3. Buka di browser:
   ```
   http://localhost:5173
   ```

## Struktur Folder
- `src/components/` — Komponen utama (form, preview, export, dsb)
- `src/services/` — API service untuk komunikasi ke backend
- `src/route/` — Routing aplikasi
- `public/` — File statis

## Konfigurasi
- Pastikan endpoint API backend sudah benar di file `src/services/api.js`.
