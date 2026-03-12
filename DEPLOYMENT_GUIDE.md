# Panduan Deployment & Menjalankan Project

## 📁 Daftar File Project yang Perlu Diupload

### Struktur Folder Lengkap:
```
my-project/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── public/
│   └── images/
│       └── hero/
│           ├── slide-1.png
│           ├── slide-2.png
│           ├── slide-3.png
│           └── slide-4.png
├── src/
│   ├── app/
│   │   ├── admin/
│   │   ├── api/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   ├── lib/
│   └── ...
├── .env
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
└── bunfig.toml
```

---

## 🖥️ CARA 1: Menjalankan di MacBook (Lokal)

### Persyaratan Sistem:
- macOS 10.15 atau lebih baru
- RAM minimal 4GB (disarankan 8GB+)

### Langkah 1: Install Bun Runtime

Buka Terminal dan jalankan:

```bash
# Install Bun menggunakan curl
curl -fsSL https://bun.sh/install | bash

# Atau menggunakan Homebrew (jika sudah terinstall)
brew install bun

# Restart terminal, lalu verifikasi instalasi
bun --version
```

### Langkah 2: Copy Project ke MacBook

**Opsi A: Dari USB/External Drive**
```bash
# Copy folder project ke Documents
cp -R /path/ke/usb/my-project ~/Documents/my-project
cd ~/Documents/my-project
```

**Opsi B: Download dari Cloud (Google Drive, Dropbox, dll)**
```bash
# Extract file zip yang sudah didownload
unzip my-project.zip -d ~/Documents/
cd ~/Documents/my-project
```

### Langkah 3: Install Dependencies

```bash
# Masuk ke folder project
cd ~/Documents/my-project

# Install semua dependencies
bun install
```

### Langkah 4: Setup Database

```bash
# Generate Prisma Client
bun run db:generate

# Push schema ke database SQLite
bun run db:push

# (Opsional) Jalankan seed untuk data awal
bun run prisma db seed
```

### Langkah 5: Konfigurasi Environment

Edit file `.env`:

```env
# Database
DATABASE_URL="file:./db.sqlite"

# NextAuth Secret (generate random string)
NEXTAUTH_SECRET="ganti-dengan-random-string-yang-panjang"
NEXTAUTH_URL="http://localhost:3000"

# Admin Default (untuk seed)
ADMIN_EMAIL="admin@yalmuja.sch.id"
ADMIN_PASSWORD="admin123"
```

### Langkah 6: Jalankan Development Server

```bash
# Jalankan dalam mode development
bun run dev
```

Buka browser dan akses: **http://localhost:3000**

### Langkah 7: Build untuk Production (Opsional)

```bash
# Build project
bun run build

# Jalankan production server
bun run start
```

---

## 🌐 CARA 2: Upload ke Hosting

### Opsi A: Hosting dengan VPS/Cloud Server (Recommended)

#### Server yang Didukung:
- **VPS Linux** (Ubuntu, Debian, CentOS)
- **Cloud** (DigitalOcean, Vultr, Linode, AWS EC2, Google Cloud)
- **VPS Indonesia** (Niagahoster, Dewaweb, IDCloudHost)

#### Persyaratan Server:
- OS: Ubuntu 20.04+ / Debian 11+
- RAM: Minimal 1GB (disarankan 2GB+)
- Storage: Minimal 10GB
- Akses SSH root

#### Langkah 1: Connect ke Server via SSH

```bash
ssh root@alamat-ip-server-anda
```

#### Langkah 2: Install Bun di Server

```bash
# Update system
apt update && apt upgrade -y

# Install curl jika belum ada
apt install curl -y

# Install Bun
curl -fsSL https://bun.sh/install | bash

# Load Bun ke shell
source ~/.bashrc

# Verifikasi
bun --version
```

#### Langkah 3: Upload Project ke Server

**Metode A: Menggunakan SCP (dari komputer lokal)**

```bash
# Di komputer lokal, buka terminal
scp -r /path/ke/my-project root@alamat-ip-server:/root/
```

**Metode B: Menggunakan Git**

```bash
# Di server
cd /root
git clone https://github.com/username/my-project.git
cd my-project
```

**Metode C: Menggunakan SFTP (FileZilla, Cyberduck)**
- Host: alamat-ip-server
- Username: root
- Password: password-server
- Port: 22
- Upload folder `my-project` ke `/root/`

#### Langkah 4: Setup Project di Server

```bash
# Masuk ke folder project
cd /root/my-project

# Install dependencies
bun install

# Setup database
bun run db:generate
bun run db:push

# Build untuk production
bun run build
```

#### Langkah 5: Setup Environment

```bash
# Edit file .env
nano .env
```

Ubah menjadi:
```env
DATABASE_URL="file:./db.sqlite"
NEXTAUTH_SECRET="random-string-yang-sangat-panjang-dan-aman"
NEXTAUTH_URL="https://domain-anda.com"
ADMIN_EMAIL="admin@yalmuja.sch.id"
ADMIN_PASSWORD="password-yang-aman"
```

Simpan dengan `Ctrl+O`, lalu `Ctrl+X`

#### Langkah 6: Install PM2 (Process Manager)

```bash
# Install PM2 secara global
bun add -g pm2

# Jalankan aplikasi dengan PM2
pm2 start "bun run start" --name "yalmuja-website"

# Save PM2 configuration
pm2 save

# Setup PM2 untuk auto-start saat boot
pm2 startup
```

#### Langkah 7: Setup Nginx Reverse Proxy

```bash
# Install Nginx
apt install nginx -y

# Buat konfigurasi site
nano /etc/nginx/sites-available/yalmuja
```

Paste konfigurasi berikut:

```nginx
server {
    listen 80;
    server_name domain-anda.com www.domain-anda.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Aktifkan site:

```bash
# Enable site
ln -s /etc/nginx/sites-available/yalmuja /etc/nginx/sites-enabled/

# Test konfigurasi
nginx -t

# Restart Nginx
systemctl restart nginx
```

#### Langkah 8: Setup SSL dengan Let's Encrypt

```bash
# Install Certbot
apt install certbot python3-certbot-nginx -y

# Generate SSL certificate
certbot --nginx -d domain-anda.com -d www.domain-anda.com

# Follow the prompts
```

---

### Opsi B: Hosting dengan Shared Hosting (Cpanel)

> ⚠️ **Catatan**: Shared hosting biasanya TIDAK mendukung Next.js dengan baik.
> Disarankan menggunakan VPS atau platform cloud seperti Vercel.

#### Jika hosting mendukung Node.js:

1. Login ke cPanel
2. Buka **Setup Node.js App**
3. Klik **Create Application**
4. Isi form:
   - Node.js version: 18.x atau lebih baru
   - Application mode: Production
   - Application root: `/home/username/my-project`
   - Application URL: domain-anda.com
   - Application startup file: `server.js`
5. Upload semua file project via File Manager atau FTP
6. Buka terminal dari cPanel dan jalankan:
   ```bash
   cd ~/my-project
   npm install
   npm run build
   ```
7. Restart aplikasi dari cPanel

---

### Opsi C: Deploy ke Vercel (Paling Mudah - GRATIS!)

#### Langkah 1: Push ke GitHub

```bash
# Di komputer lokal
cd ~/Documents/my-project

# Initialize git jika belum
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit"

# Add remote repository
git remote add origin https://github.com/username/yalmuja-website.git

# Push ke GitHub
git push -u origin main
```

#### Langkah 2: Deploy di Vercel

1. Buka **https://vercel.com**
2. Login dengan akun GitHub
3. Klik **Add New Project**
4. Import repository dari GitHub
5. Configure:
   - Framework Preset: **Next.js**
   - Root Directory: `./`
   - Build Command: `bun run build`
   - Output Directory: `.next`
6. Tambahkan Environment Variables:
   - `DATABASE_URL` = `file:./db.sqlite`
   - `NEXTAUTH_SECRET` = (generate random string)
   - `NEXTAUTH_URL` = `https://project-name.vercel.app`
7. Klik **Deploy**

> ✅ Website akan otomatis online dalam beberapa menit!

---

## 🔄 Command Lengkap untuk Deployment VPS

```bash
# === SETUP AWAL SERVER ===

# 1. Update system
apt update && apt upgrade -y

# 2. Install dependencies
apt install curl git nginx -y

# 3. Install Bun
curl -fsSL https://bun.sh/install | bash
source ~/.bashrc

# 4. Upload/copy project ke /root/my-project

# === SETUP PROJECT ===

# 5. Masuk ke project
cd /root/my-project

# 6. Install dependencies
bun install

# 7. Setup database
bun run db:generate
bun run db:push

# 8. Build project
bun run build

# === SETUP PRODUCTION ===

# 9. Install PM2
bun add -g pm2

# 10. Jalankan dengan PM2
pm2 start "bun run start" --name yalmuja
pm2 save
pm2 startup

# 11. Setup Nginx
nano /etc/nginx/sites-available/yalmuja
# (paste konfigurasi nginx di atas)

ln -s /etc/nginx/sites-available/yalmuja /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx

# 12. Setup SSL
apt install certbot python3-certbot-nginx -y
certbot --nginx -d domain-anda.com

# SELESAI!
```

---

## 🔧 Command untuk Maintenance

### Restart Aplikasi

```bash
pm2 restart yalmuja
```

### Lihat Logs

```bash
pm2 logs yalmuja
```

### Update Aplikasi

```bash
cd /root/my-project
git pull                    # Jika menggunakan git
bun install                 # Install dependencies baru
bun run build              # Build ulang
pm2 restart yalmuja        # Restart aplikasi
```

### Backup Database

```bash
cp /root/my-project/prisma/db.sqlite /root/backup/db-$(date +%Y%m%d).sqlite
```

---

## ❓ FAQ

### Q: Apakah bisa pakai hosting biasa (shared hosting)?
**A:** Sebagian besar shared hosting tidak mendukung Next.js. Disarankan menggunakan VPS atau Vercel (gratis).

### Q: Berapa biaya VPS?
**A:** 
- VPS Indonesia: Rp 50.000 - 200.000/bulan
- DigitalOcean: $4-6/bulan
- Vercel: GRATIS untuk project kecil

### Q: Bagaimana kalau website lambat?
**A:** 
- Gunakan server dengan lokasi terdekat dengan pengguna
- Enable caching di Nginx
- Optimize gambar

### Q: Bagaimana cara ganti password admin?
**A:** Jalankan seed ulang atau edit langsung di database SQLite.

---

## 📞 Bantuan

Jika mengalami masalah:
1. Cek logs: `pm2 logs yalmuja`
2. Cek status: `pm2 status`
3. Cek Nginx: `nginx -t`
4. Cek port: `netstat -tlnp | grep 3000`
