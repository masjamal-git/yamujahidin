# 🔧 SOLUSI LOGIN ADMIN DI VERCEL

## ❌ Masalah

Database SQLite di Vercel bersifat **ephemeral** (sementara), artinya:
- Data akan hilang setiap kali ada deployment baru
- Data admin yang ada di lokal tidak ada di Vercel
- Perlu setup khusus agar data bisa tersimpan

---

## ✅ SOLUSI YANG SUDAH DITERAPKAN

Saya sudah melakukan perubahan berikut:

### 1. Auto-Seed saat Login
Sistem sekarang akan otomatis membuat admin default jika belum ada:
- **Email**: `admin@yalmuja.sch.id`
- **Password**: `admin123`

### 2. API Endpoint untuk Seed
Tersedia endpoint `/api/seed` untuk inisialisasi manual.

---

## 📋 LANGKAH-LANGKAH FIX

### Langkah 1: Update Kode di GitHub

Jalankan command berikut di terminal lokal:

```bash
cd /home/z/my-project

# Tambahkan semua perubahan
git add .

# Commit
git commit -m "Fix: Auto-seed admin user for Vercel deployment"

# Push ke GitHub
git push
```

### Langkah 2: Tunggu Vercel Deploy

1. Buka **https://vercel.com**
2. Login dengan akun Anda
3. Klik project `yalmuja-website`
4. Lihat tab **Deployments**
5. Tunggu hingga deployment selesai (1-2 menit)

### Langkah 3: Inisialisasi Database

Buka browser dan akses URL berikut:

```
https://NAMA-PROJECT-ANDA.vercel.app/api/seed
```

Contoh: `https://yalmuja-website.vercel.app/api/seed`

Jika berhasil, akan muncul response JSON:

```json
{
  "success": true,
  "message": "Database berhasil diinisialisasi",
  "admin": {
    "email": "admin@yalmuja.sch.id",
    "name": "Administrator"
  }
}
```

### Langkah 4: Login Admin

1. Buka: `https://NAMA-PROJECT-ANDA.vercel.app/admin`
2. Login dengan:
   - **Email**: `admin@yalmuja.sch.id`
   - **Password**: `admin123`

---

## ⚠️ PENTING: KETERBATASAN SQLITE DI VERCEL

### Masalah yang Akan Terjadi:

1. **Data Akan Hilang** setiap kali Vercel melakukan redeploy
   - Berita baru akan hilang
   - Data pendaftaran PPDB akan hilang
   - Perubahan settings akan hilang

2. **Data Tidak Persisten**
   - SQLite file tidak tersimpan permanen
   - Setiap function invocation bisa menggunakan file system yang berbeda

---

## 🚀 SOLUSI PERMANEN: GUNAKAN DATABASE CLOUD

Untuk website yang benar-benar digunakan, **WAJIB** gunakan database cloud:

### Opsi 1: Vercel Postgres (Recommended)

1. Di dashboard Vercel, buka project Anda
2. Klik **Storage** → **Create Database**
3. Pilih **Postgres**
4. Ikuti instruksi setup
5. Update `.env`:
   ```
   DATABASE_URL="postgres://..."
   ```
6. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

### Opsi 2: Supabase (Gratis)

1. Buka **https://supabase.com**
2. Buat akun dan project baru
3. Copy connection string dari Settings → Database
4. Update `.env` dengan connection string tersebut

### Opsi 3: PlanetScale (Gratis)

1. Buka **https://planetscale.com**
2. Buat database baru
3. Copy connection string
4. Update `.env`

---

## 📝 LANGKAH MIGRASI KE VERCEL POSTGRES

### Step 1: Buat Database di Vercel

1. Buka project di Vercel
2. Klik tab **Storage**
3. Klik **Create Database**
4. Pilih **Neon Postgres** atau **Vercel Postgres**
5. Beri nama: `yalmuja-db`
6. Pilih region terdekat (Singapore)
7. Klik **Create**

### Step 2: Connect ke Project

1. Di halaman database, klik **Connect to Project**
2. Pilih project `yalmuja-website`
3. Environment variables akan otomatis ditambahkan

### Step 3: Update Prisma Schema

Edit `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"  // Ganti dari "sqlite"
  url      = env("DATABASE_URL")
}
```

### Step 4: Update dan Push

```bash
git add .
git commit -m "Migrate to PostgreSQL for Vercel"
git push
```

### Step 5: Seed Database

Buka: `https://NAMA-PROJECT.vercel.app/api/seed`

---

## 🔑 KREDENSIAL ADMIN

| Field | Value |
|-------|-------|
| Email | `admin@yalmuja.sch.id` |
| Password | `admin123` |

> ⚠️ **Ganti password segera setelah login pertama!**

---

## 📞 BUTUH BANTUAN?

Jika masih ada masalah:

1. Cek **Build Logs** di Vercel untuk error
2. Cek **Function Logs** di Vercel untuk runtime error
3. Pastikan environment variables sudah benar:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`
