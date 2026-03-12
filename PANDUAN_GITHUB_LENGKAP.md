# 📚 PANDUAN LENGKAP PUSH KE GITHUB

## Daftar Isi
1. [Membuat Akun GitHub](#1-membuat-akun-github)
2. [Membuat Repository Baru](#2-membuat-repository-baru)
3. [Generate Personal Access Token](#3-generate-personal-access-token)
4. [Install dan Setup Git](#4-install-dan-setup-git)
5. [Push Project ke GitHub](#5-push-project-ke-github)
6. [Verifikasi dan Update](#6-verifikasi-dan-update)
7. [Troubleshooting](#7-troubleshooting)

---

## 1. Membuat Akun GitHub

### Jika Belum Punya Akun:

1. Buka browser (Chrome/Firefox/Safari)
2. Ketik alamat: **https://github.com**
3. Klik tombol **Sign up** (pojok kanan atas)
4. Isi form pendaftaran:
   - **Email**: masukkan email aktif Anda
   - **Password**: buat password yang kuat (huruf besar, kecil, angka, simbol)
   - **Username**: pilih username yang unik (contoh: yalmuja2024)
5. Klik **Create account**
6. GitHub akan mengirim kode verifikasi ke email Anda
7. Buka email, copy kode verifikasi
8. Paste kode di halaman GitHub
9. Pilih **Free** plan (gratis)
10. Klik **Complete setup**

### Jika Sudah Punya Akun:

1. Buka **https://github.com**
2. Klik **Sign in** (pojok kanan atas)
3. Masukkan username/email dan password
4. Klik **Sign in**

---

## 2. Membuat Repository Baru

### Langkah Detail:

1. **Login ke GitHub** (ikuti langkah di atas)

2. **Klik tombol + di pojok kanan atas**
   - Lihat di sebelah tombol profil Anda
   - Akan muncul dropdown

3. **Pilih "New repository"**
   - Klik opsi tersebut dari dropdown

4. **Isi form pembuatan repository:**

   ```
   ┌─────────────────────────────────────────────────────────┐
   │ Create a new repository                                │
   ├─────────────────────────────────────────────────────────┤
   │                                                         │
   │ Owner: [username-anda ▼]  /  [yalmuja-website    ]     │
   │                            Repository name *           │
   │                                                         │
   │ Description (optional):                                │
   │ [Website Yayasan Al Mujahidin Kalimantan Timur      ] │
   │                                                         │
   │ ☐ Public  ← PILIH INI (gratis, bisa deploy Vercel)    │
   │ ☐ Private                                             │
   │                                                         │
   │ ☐ Add a README file          ← JANGAN DICENTANG       │
   │ ☐ Add .gitignore             ← JANGAN DICENTANG       │
   │ ☐ Choose a license           ← JANGAN DICENTANG       │
   │                                                         │
   │              [Create repository]                       │
   └─────────────────────────────────────────────────────────┘
   ```

5. **Klik tombol hijau "Create repository"**

6. **CATAT URL repository Anda**
   - Contoh: `https://github.com/username-anda/yalmuja-website`
   - URL ini akan digunakan nanti

---

## 3. Generate Personal Access Token

> ⚠️ **PENTING**: GitHub tidak lagi menerima password biasa untuk push.
> Anda HARUS menggunakan Personal Access Token.

### Langkah Membuat Token:

1. **Login ke GitHub**

2. **Klik foto profil Anda** (pojok kanan atas)

3. **Klik "Settings"** (dari dropdown)

4. **Scroll ke bawah**, cari menu di sidebar kiri

5. **Klik "Developer settings"** (di bagian bawah sidebar)

6. **Klik "Personal access tokens"**

7. **Pilih "Tokens (classic)"**
   ```
   Personal access tokens
   ├── Fine-grained tokens    ← JANGAN ini
   └── Tokens (classic)       ← PILIH ini
   ```

8. **Klik "Generate new token"**

9. **Pilih "Generate new token (classic)"**

10. **Isi form:**
    ```
    Note: [Token untuk push project yalmuja    ]
          (nama token, bebas)

    Expiration: [No expiration ▼]
                (pilih "No expiration" agar tidak expired)

    Select scopes:
    ☑ repo              ← CENTANG INI (wajib!)
      ☑ repo:status
      ☑ repo_deployment
      ☑ public_repo
      ☑ repo:invite
      ☑ security_events
    
    (Scopes lain tidak perlu dicentang)
    ```

11. **Klik tombol hijau "Generate token"**

12. **⚠️ COPY TOKEN SEGERA!**
    ```
    Token: ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    ```
    
    > 🔴 **SANGAT PENTING**: 
    > - Copy token ini dan simpan di tempat aman
    > - Token hanya ditampilkan SEKALI
    > - Jika lupa, harus generate token baru
    > - Simpan di Notes/Notepad untuk sementara

---

## 4. Install dan Setup Git

### A. Install Git di MacBook

```bash
# Buka Terminal (Command + Space, ketik "Terminal")

# Cek apakah Git sudah terinstall
git --version

# Jika belum, akan muncul prompt untuk install
# Klik "Install" dan tunggu proses selesai
```

Atau install via Homebrew:

```bash
# Install Homebrew dulu (jika belum)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Git
brew install git
```

### B. Konfigurasi Git

```bash
# Set nama (ganti dengan nama Anda)
git config --global user.name "Nama Anda"

# Set email (ganti dengan email GitHub Anda)
git config --global user.email "email-anda@gmail.com"

# Verifikasi konfigurasi
git config --global --list
```

### C. Setup Credential (Agar Tidak Login Terus-Menerus)

```bash
# macOS (simpan credential di Keychain)
git config --global credential.helper osxkeychain
```

---

## 5. Push Project ke GitHub

### A. Buka Terminal

```bash
# Tekan Command + Space
# Ketik "Terminal"
# Tekan Enter
```

### B. Masuk ke Folder Project

```bash
# Masuk ke folder project
cd /path/ke/folder/my-project

# Contoh jika di Documents:
cd ~/Documents/my-project
```

### C. Inisialisasi Git

```bash
# Cek apakah sudah ada git
git status

# Jika error "not a git repository", jalankan:
git init
```

### D. Tambahkan Semua File

```bash
# Tambahkan semua file ke staging
git add .

# Cek status (akan muncul list file hijau = staged)
git status
```

### E. Commit Pertama

```bash
# Buat commit pertama
git commit -m "Initial commit: Website Yayasan Al Mujahidin"
```

### F. Tambahkan Remote Repository

```bash
# GANTI username-anda dengan username GitHub Anda!
git remote add origin https://github.com/username-anda/yalmuja-website.git

# Verifikasi remote
git remote -v
```

### G. Push ke GitHub

```bash
# Rename branch ke main
git branch -M main

# Push ke GitHub
git push -u origin main
```

### H. Login Saat Push

Ketika push pertama kali, akan muncul prompt login:

```
Username for 'https://github.com': username-anda
Password for 'https://username-anda@github.com': 
```

**PENTING:**
- **Username**: Masukkan username GitHub Anda
- **Password**: PASTE Personal Access Token (BUKAN password GitHub)

> 💡 Password tidak akan terlihat saat diketik (normal, jangan khawatir)

### I. Jika Berhasil

```
Enumerating objects: XXX, done.
Counting objects: 100% (XXX/XXX), done.
Delta compression using up to X threads
Compressing objects: 100% (XXX/XXX), done.
Writing objects: 100% (XXX/XXX), XXX KiB | XXX KiB/s, done.
Total XXX (delta XXX), reused XXX (delta XXX), pack-reused 0
remote: Resolving deltas: 100% (XXX/XXX), done.
To https://github.com/username-anda/yalmuja-website.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

---

## 6. Verifikasi dan Update

### A. Verifikasi di GitHub

1. Buka browser
2. Kunjungi: `https://github.com/username-anda/yalmuja-website`
3. Pastikan semua file sudah ada

### B. Update Code Selanjutnya

Setiap kali ada perubahan code:

```bash
# 1. Lihat perubahan apa saja
git status

# 2. Tambahkan file yang berubah
git add .

# 3. Commit dengan pesan deskriptif
git commit -m "Tambah fitur X" atau "Perbaiki bug Y"

# 4. Push ke GitHub
git push
```

### C. Command Git yang Sering Digunakan

```bash
# Lihat status
git status

# Lihat history commit
git log --oneline

# Lihat perubahan sebelum commit
git diff

# Undo perubahan yang belum di-add
git restore nama-file

# Undo file yang sudah di-add (tapi belum commit)
git restore --staged nama-file

# Lihat remote
git remote -v

# Update dari GitHub (jika ada perubahan di GitHub)
git pull
```

---

## 7. Troubleshooting

### Error: "remote origin already exists"

```bash
# Hapus remote yang ada
git remote remove origin

# Tambahkan ulang
git remote add origin https://github.com/username-anda/yalmuja-website.git
```

### Error: "Authentication failed"

**Penyebab**: Password salah atau menggunakan password GitHub (bukan token)

**Solusi**:
1. Pastikan menggunakan Personal Access Token, bukan password
2. Generate token baru jika lupa
3. Push ulang

### Error: "Updates were rejected because the remote contains work"

**Penyebab**: Ada file di GitHub yang tidak ada di lokal (misal README)

**Solusi**:
```bash
# Pull dan merge
git pull origin main --allow-unrelated-histories

# Jika muncul editor, simpan dan keluar (:wq di vim)

# Push ulang
git push -u origin main
```

### Error: "src refspec main does not match any"

**Penyebab**: Belum ada commit sama sekali

**Solusi**:
```bash
# Pastikan sudah commit
git add .
git commit -m "Initial commit"

# Lalu push
git push -u origin main
```

### Error: "Permission denied (publickey)"

**Penyebab**: Menggunakan SSH tapi belum setup SSH key

**Solusi**: Gunakan HTTPS saja (lebih mudah)
```bash
git remote set-url origin https://github.com/username-anda/yalmuja-website.git
git push -u origin main
```

### Error: "LF will be replaced by CRLF"

**Ini warning, bukan error** - tidak perlu dikhawatirkan

Untuk menghilangkan warning:
```bash
git config --global core.autocrlf input
```

---

## 📋 CHEAT SHEET

### Command Lengkap (Copy-Paste)

```bash
# === SETUP AWAL ===
cd /path/ke/my-project
git init
git config --global user.name "Nama Anda"
git config --global user.email "email@gmail.com"

# === COMMIT ===
git add .
git commit -m "Initial commit: Website Yayasan Al Mujahidin"

# === PUSH ===
# GANTI username-anda dengan username GitHub Anda!
git remote add origin https://github.com/username-anda/yalmuja-website.git
git branch -M main
git push -u origin main

# Saat diminta:
# Username: username-anda
# Password: [paste Personal Access Token]
```

### Command Update Selanjutnya

```bash
git add .
git commit -m "Deskripsi perubahan"
git push
```

---

## 🎯 Tips Penting

1. **Simpan Token di Tempat Aman**
   - Simpan di Notes, Notion, atau password manager
   - Jangan share ke siapapun

2. **Commit Sering-Sering**
   - Jangan menumpuk terlalu banyak perubahan
   - Commit setiap selesai satu fitur

3. **Pesan Commit yang Baik**
   - ✅ "Tambah fitur hero slider"
   - ✅ "Perbaiki bug login admin"
   - ✅ "Update tampilan galeri"
   - ❌ "Update" (terlalu singkat)
   - ❌ "Fix bug" (tidak jelas bug apa)

4. **Sebelum Push, Selalu Pull**
   ```bash
   git pull
   git push
   ```

---

## 🔗 Link Penting

- GitHub: https://github.com
- Generate Token: https://github.com/settings/tokens
- Dokumentasi Git: https://git-scm.com/doc

---

**Selamat! Project Anda sudah berhasil di-push ke GitHub! 🎉**
