# IPM SMKM 1 – Admin & Halaman Utama

> Dashboard admin terhubung Firestore + landing page dinamis untuk PR IPM SMK Muhammadiyah 1 Sangatta Utara.

## ✨ Fitur Utama
- **Dashboard Admin**: Overview, CMS konten, database kader, E-Surat (template editable & PDF), E-Finance, E-Advokasi, manajemen event.
- **Halaman Utama Dinamis**: Hero, CTA, banner info, statistik, berita/galeri/event tersinkron Firestore, struktur kepemimpinan realtime.
- **Kepemimpinan**: Edit data langsung dari koleksi `HalamanUtama` (urutan otomatis per jabatan).
- **Template Surat**: Placeholder `{number, perihal, lampiran, tujuan, hariTanggal, waktu, tempat, acara, penandaTangan, jabatan}` disimpan di Firestore dan dipakai untuk preview/PDF.

## 🛠️ Tech Stack
- React 19 + Vite
- Tailwind utility classes (kelas prebuilt)
- Firebase (Firestore, Analytics)
- Lucide Icons, Recharts

## 🔧 Persiapan
1. **Environment**: salin `.env.local` → isi kredensial Firebase (prefiks `VITE_`).
2. **Install**: `npm install`
3. **Jalankan**: `npm run dev`
4. **Build**: `npm run build`

## 📂 Struktur Data (Firestore)
- `site_settings/homepage` – konfigurasi hero, CTA, banner, statistik.
- `site_settings/letterTemplate` – template surat kustom.
- `HalamanUtama` – struktur kepemimpinan (doc id contoh: `ketua-umum`, `sekretaris-umum`, dll).
- `cms_news`, `cms_gallery`, `members`, `events`, `finance_transactions`, `aspirations`, `cms_profiles`, `mail_archives`.

## 🧭 Navigasi Admin
- **Overview**: ringkasan kader, saldo, event, aspirasi.
- **Tampilan Utama**: edit hero/CTA/banner/statistik + kepemimpinan (preview langsung).
- **CMS Konten**: profil pimpinan, berita, galeri.
- **Database Kader**: tambah, filter, edit, hapus anggota.
- **E-Surat**: isi form, edit arsip, ubah template, export PDF.
- **E-Finance**: catat transaksi, ekspor CSV.
- **E-Advokasi**: ubah status aspirasi.
- **Event**: tambah/edit/hapus event, absen cepat.

## 🎨 Desain & UX
- Light/dark mode toggle.
- Preview komponen (CTA, banner, statistik, kepemimpinan, surat).
- Angka format lokal (`id-ID`), warna aksen dapat diatur.

## 🚀 Tips Produksi
- Pastikan aturan Firestore sesuai (read publik halaman utama, write terbatas admin).
- Update logo di `public/logo.png` bila perlu.
- Pantau ukuran bundle; gunakan code-splitting jika dibutuhkan di masa depan.

---
Crafted for PR IPM SMKM 1 – fokus pada keandalan data dan kemudahan operasional.
