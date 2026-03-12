# 🔧 CARA MENGGANTI PLACEHOLDER

## Apa itu Placeholder?

Placeholder adalah teks contoh yang HARUS Anda ganti dengan data asli Anda.

Contoh:
- `username-anda` → harus diganti dengan username GitHub Anda yang asli
- `email-anda@gmail.com` → harus diganti dengan email Anda yang asli

---

## 📝 Langkah Mengganti Placeholder

### Contoh Command dengan Placeholder:

```bash
git remote add origin https://github.com/username-anda/yalmuja-website.git
```

### Cara Mengganti:

**Jika username GitHub Anda adalah: `budi123`**

Maka command diubah menjadi:
```bash
git remote add origin https://github.com/budi123/yalmuja-website.git
```

---

## 📋 DAFTAR PLACEHOLDER YANG HARUS DIGANTI

Silakan isi data Anda di bawah ini terlebih dahulu:

```
┌─────────────────────────────────────────────────────┐
│  ISI DATA ANDA DI BAWAH INI:                        │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Username GitHub: _______________________           │
│  (contoh: budi123, ahmad2024, yalmuja)              │
│                                                     │
│  Email GitHub:   _______________________            │
│  (contoh: budi@gmail.com)                           │
│                                                     │
│  Nama Lengkap:   _______________________            │
│  (contoh: Budi Santoso)                             │
│                                                     │
│  Token:          _______________________            │
│  (paste token dari GitHub)                          │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## ✅ COMMAND SIAP SALIN (Setelah Mengisi Data)

Setelah Anda mengisi data di atas, copy command di bawah ini:

### Command 1: Konfigurasi Git

```bash
# GANTI dengan nama dan email Anda yang sudah diisi di atas
git config --global user.name "NAMA_LENGKAP_ANDA"
git config --global user.email "EMAIL_ANDA@gmail.com"
```

**Contoh jika nama Anda "Ahmad Fauzi" dan email "ahmad@gmail.com":**
```bash
git config --global user.name "Ahmad Fauzi"
git config --global user.email "ahmad@gmail.com"
```

---

### Command 2: Tambah Remote Repository

```bash
# GANTI username-anda dengan username GitHub Anda
git remote add origin https://github.com/USERNAME_ANDA/yalmuja-website.git
```

**Contoh jika username Anda "ahmad2024":**
```bash
git remote add origin https://github.com/ahmad2024/yalmuja-website.git
```

---

## 🎯 CONTOH LENGKAP

### Skenario:
- Username GitHub: `yalmuja2024`
- Email: `admin@yalmuja.sch.id`
- Nama: `Admin Yayasan Al Mujahidin`
- Repository: `yalmuja-website`

### Command Lengkap yang Dijalankan:

```bash
# 1. Masuk ke folder project
cd /home/z/my-project

# 2. Konfigurasi git (sudah diganti dengan data asli)
git config --global user.name "Admin Yayasan Al Mujahidin"
git config --global user.email "admin@yalmuja.sch.id"

# 3. Init git (jika belum)
git init

# 4. Tambahkan semua file
git add .

# 5. Commit
git commit -m "Initial commit: Website Yayasan Al Mujahidin"

# 6. Tambahkan remote (sudah diganti dengan username asli)
git remote add origin https://github.com/yalmuja2024/yalmuja-website.git

# 7. Push
git branch -M main
git push -u origin main
```

### Saat Push, Masukkan:
```
Username: yalmuja2024
Password: ghp_xxxxxxxxxxxxxxxxxxxx (token Anda)
```

---

## 🔍 CARA MELIHAT USERNAME GITHUB ANDA

1. Login ke **https://github.com**
2. Klik foto profil (pojok kanan atas)
3. Lihat di URL browser: `https://github.com/USERNAME-ANDA`
4. Atau lihat nama di bawah foto profil Anda

---

## 📞 CONTOH KONKRET

Berikut command yang **LANGSUNG BISA ANDA SALIN** jika:

### Username GitHub = yalmuja2024

```bash
cd /home/z/my-project
git init
git config --global user.name "Admin Yayasan"
git config --global user.email "admin@yalmuja.sch.id"
git add .
git commit -m "Initial commit: Website Yayasan Al Mujahidin"
git remote add origin https://github.com/yalmuja2024/yalmuja-website.git
git branch -M main
git push -u origin main
```

---

## ❓ MASIH BINGUNG?

Silakan beritahu saya:
1. **Username GitHub Anda**: ?
2. **Email GitHub Anda**: ?
3. **Nama Anda**: ?

Nanti saya akan buatkan command yang **SIAP COPY-PASTE** tanpa placeholder!
