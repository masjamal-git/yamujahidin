# Panduan Push Project ke GitHub

## Langkah 1: Buat Repository di GitHub

1. Login ke https://github.com
2. Klik **+** → **New repository**
3. Isi nama: `yalmuja-website`
4. Klik **Create repository**

---

## Langkah 2: Jalankan Command di Terminal

```bash
# Masuk ke folder project
cd /home/z/my-project

# Initialize git (jika belum)
git init

# Tambahkan semua file
git add .

# Commit pertama
git commit -m "Initial commit: Yayasan Al Mujahidin Website"

# Tambahkan remote repository (GANTI dengan username GitHub Anda)
git remote add origin https://github.com/USERNAME-ANDA/yalmuja-website.git

# Push ke GitHub
git branch -M main
git push -u origin main
```

---

## Langkah 3: Jika Mintai Login GitHub

### Opsi A: Menggunakan Personal Access Token (Recommended)

1. Buka GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Klik **Generate new token**
3. Pilih scope: `repo` (full control)
4. Copy token yang dihasilkan
5. Saat push, gunakan token sebagai password:
   - Username: username-github-anda
   - Password: paste-token-disini

### Opsi B: Menggunakan SSH Key

```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "email-anda@gmail.com"

# Tampilkan public key
cat ~/.ssh/id_ed25519.pub

# Copy output, lalu tambahkan ke GitHub:
# Settings → SSH and GPG keys → New SSH key

# Gunakan SSH URL
git remote set-url origin git@github.com:USERNAME-ANDA/yalmuja-website.git
git push -u origin main
```

### Opsi C: Menggunakan GitHub CLI

```bash
# Install GitHub CLI
# Di Ubuntu/Debian: sudo apt install gh
# Di macOS: brew install gh

# Login
gh auth login

# Push
git push -u origin main
```

---

## Command Lengkap (Copy-Paste)

Ganti `USERNAME-ANDA` dengan username GitHub Anda:

```bash
cd /home/z/my-project

git init
git add .
git commit -m "Initial commit: Yayasan Al Mujahidin Website"
git remote add origin https://github.com/USERNAME-ANDA/yalmuja-website.git
git branch -M main
git push -u origin main
```

---

## Update Selanjutnya

Setiap ada perubahan:

```bash
git add .
git commit -m "Deskripsi perubahan"
git push
```

---

## Troubleshooting

### Error: "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/USERNAME-ANDA/yalmuja-website.git
```

### Error: "Authentication failed"
Gunakan Personal Access Token (lihat Langkah 3)

### Error: "Updates were rejected"
```bash
git pull origin main --allow-unrelated-histories
git push -u origin main
```
