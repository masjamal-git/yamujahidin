# 🌐 PANDUAN MENAMPILKAN WEBSITE KE PUBLIK

Setelah project di-push ke GitHub, ada beberapa cara untuk menampilkan website:

---

## 🚀 CARA 1: VERCEL (GRATIS - RECOMMENDED)

Vercel adalah platform hosting gratis untuk website Next.js. Website akan online dalam hitungan menit!

### Langkah 1: Buka Vercel

1. Buka browser
2. Kunjungi: **https://vercel.com**

### Langkah 2: Login dengan GitHub

1. Klik tombol **Sign Up** (pojok kanan atas)
2. Pilih **Continue with GitHub**
3. Akan muncul halaman otorisasi GitHub
4. Klik **Authorize Vercel**

### Langkah 3: Import Project

1. Setelah login, Anda akan diarahkan ke dashboard
2. Klik tombol **Add New...** → **Project**
3. Di bagian "Import Git Repository", Anda akan melihat list repository
4. Cari repository `yalmuja-website`
5. Klik **Import**

### Langkah 4: Konfigurasi Project

```
┌─────────────────────────────────────────────────────────────┐
│ Configure Project                                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Project Name: [yalmuja-website                    ]        │
│ Framework Preset: [Next.js ▼]  ← Otomatis terdeteksi       │
│                                                             │
│ Root Directory: [./ ▼]                                      │
│                                                             │
│ Build Command: [bun run build]                              │
│ Output Directory: [.next]                                   │
│ Install Command: [bun install]                              │
│                                                             │
│ Environment Variables:                                       │
│ ┌───────────────────────────────────────────────────────┐  │
│ │ Key                │ Value                            │  │
│ ├────────────────────┼──────────────────────────────────┤  │
│ │ DATABASE_URL       │ file:./db.sqlite                 │  │
│ │ NEXTAUTH_SECRET    │ random-string-yang-panjang-xxx   │  │
│ │ NEXTAUTH_URL       │ https://yalmuja-website.vercel.app│ │
│ └───────────────────────────────────────────────────────┘  │
│                                                             │
│              [Deploy]                                       │
└─────────────────────────────────────────────────────────────┘
```

#### Cara Menambah Environment Variables:

1. Klik **Environment Variables** untuk expand
2. Isi:
   - **Key**: `DATABASE_URL`
   - **Value**: `file:./db.sqlite`
   - Klik **Add**
3. Tambahkan lagi:
   - **Key**: `NEXTAUTH_SECRET`
   - **Value**: `yalmuja-al-mujahidin-secret-key-2024-random-string`
   - Klik **Add**
4. Tambahkan:
   - **Key**: `NEXTAUTH_URL`
   - **Value**: `https://yalmuja-website.vercel.app` (ganti dengan nama project Anda)
   - Klik **Add**

### Langkah 5: Deploy

1. Klik tombol **Deploy**
2. Tunggu proses build (biasanya 1-3 menit)
3. Akan muncul animasi dan progress

### Langkah 6: Selesai!

Setelah berhasil, Anda akan melihat:

```
┌─────────────────────────────────────────────────────────────┐
│ 🎉 Congratulations!                                         │
│                                                             │
│ Your project has been deployed!                             │
│                                                             │
│ 🔗 https://yalmuja-website.vercel.app                       │
│                                                             │
│ [Visit] [Go to Dashboard]                                   │
└─────────────────────────────────────────────────────────────┘
```

4. Klik **Visit** untuk membuka website Anda
5. Atau copy URL tersebut ke browser

### Langkah 7: Custom Domain (Opsional)

Jika Anda punya domain sendiri (misal: yalmuja.sch.id):

1. Di dashboard Vercel, buka project Anda
2. Klik **Settings** → **Domains**
3. Masukkan domain: `yalmuja.sch.id`
4. Klik **Add**
5. Ikuti instruksi untuk setting DNS di tempat beli domain

---

## 🖥️ CARA 2: JALANKAN DI KOMPUTER LOKAL

Jika ingin melihat website di komputer sendiri tanpa hosting:

### Di MacBook:

```bash
# 1. Buka Terminal

# 2. Masuk ke folder project
cd ~/Documents/my-project

# 3. Install dependencies
bun install

# 4. Setup database
bun run db:generate
bun run db:push

# 5. Jalankan development server
bun run dev
```

### Buka di Browser:

```
http://localhost:3000
```

---

## 🖥️ CARA 3: DEPLOY KE VPS

Jika Anda punya VPS (server):

### Persyaratan:
- VPS dengan OS Ubuntu/Debian
- Akses SSH

### Langkah Singkat:

```bash
# Di server VPS Anda

# 1. Install Bun
curl -fsSL https://bun.sh/install | bash
source ~/.bashrc

# 2. Clone dari GitHub
git clone https://github.com/username-anda/yalmuja-website.git
cd yalmuja-website

# 3. Setup
bun install
bun run db:generate
bun run db:push
bun run build

# 4. Install PM2
bun add -g pm2

# 5. Jalankan
pm2 start "bun run start" --name yalmuja

# 6. Setup Nginx reverse proxy (lihat panduan lengkap)
```

---

## ✅ PERBANDINGAN METODE

| Metode | Kecepatan | Biaya | Kesulitan |
|--------|-----------|-------|-----------|
| **Vercel** | ⚡ Cepat | 🆓 Gratis | ⭐ Mudah |
| **Lokal** | ⚡ Cepat | 🆓 Gratis | ⭐ Mudah |
| **VPS** | 🐢 Perlu setup | 💰 Berbayar | ⭐⭐⭐ Sulit |

---

## 🎯 REKOMENDASI

**Gunakan Vercel** karena:
- ✅ Gratis selamanya untuk project kecil
- ✅ Otomatis deploy setiap push ke GitHub
- ✅ SSL gratis (HTTPS)
- ✅ Cepat dan reliable
- ✅ Support custom domain

---

## 📞 BUTUH BANTUAN?

Jika mengalami masalah saat deploy ke Vercel:
1. Cek error di build logs
2. Pastikan environment variables sudah benar
3. Coba deploy ulang

Silakan beritahu jika ada kendala! 🚀
