import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query'] : [],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db

// Auto-seed function - runs only once when no admin exists
let seedingInProgress = false

export async function ensureSeedData() {
  if (seedingInProgress) return
  
  try {
    const existingAdmin = await db.admin.findFirst()
    
    if (!existingAdmin) {
      seedingInProgress = true
      console.log('No admin found, seeding database...')
      
      const hashedPassword = await bcrypt.hash('admin123', 10)
      
      await db.admin.create({
        data: {
          email: 'admin@yalmuja.sch.id',
          password: hashedPassword,
          name: 'Administrator',
          role: 'superadmin',
          isActive: true,
        },
      })
      
      // Create default settings
      const defaultSettings = [
        { key: 'site_name', value: 'Yayasan Al Mujahidin', type: 'text', group: 'general' },
        { key: 'site_tagline', value: 'Membangun Generasi Berilmu dan Berakhlak', type: 'text', group: 'general' },
        { key: 'site_description', value: 'Yayasan Pendidikan Islam Al Mujahidin Kalimantan Timur', type: 'textarea', group: 'general' },
        { key: 'site_address', value: 'Jl. Pendidikan No. 1, Samarinda, Kalimantan Timur', type: 'text', group: 'contact' },
        { key: 'site_phone', value: '(0541) 123456', type: 'text', group: 'contact' },
        { key: 'site_email', value: 'info@yalmuja.sch.id', type: 'text', group: 'contact' },
      ]
      
      for (const setting of defaultSettings) {
        await db.setting.create({ data: setting })
      }

      // Create sample news
      const sampleNews = [
        {
          title: 'Selamat Datang di Website Yayasan Al Mujahidin',
          slug: 'selamat-datang-website',
          content: `<p>Assalamualaikum Warahmatullahi Wabarakatuh,</p>
          <p>Selamat datang di website resmi Yayasan Al Mujahidin Kalimantan Timur. Website ini merupakan media informasi dan komunikasi antara yayasan dengan masyarakat.</p>
          <h2>Tentang Kami</h2>
          <p>Yayasan Al Mujahidin Kalimantan Timur didirikan pada tahun 1985 oleh para ulama dan tokoh masyarakat yang peduli terhadap pendidikan Islam. Selama hampir 40 tahun, yayasan ini telah mendidik ribuan alumni yang tersebar di seluruh Indonesia.</p>
          <h2>Unit Pendidikan</h2>
          <p>Kami mengelola beberapa unit pendidikan:</p>
          <ul>
            <li>Pondok Pesantren Al Mujahidin</li>
            <li>Madrasah Ibtidaiyah (MI)</li>
            <li>Madrasah Tsanawiyah (MTs)</li>
            <li>Madrasah Aliyah (MA)</li>
          </ul>
          <p>Semoga website ini dapat memberikan informasi yang bermanfaat bagi Anda.</p>`,
          excerpt: 'Selamat datang di website resmi Yayasan Al Mujahidin Kalimantan Timur.',
          category: 'pengumuman',
          isFeatured: true,
          isPublished: true,
        },
        {
          title: 'Pendaftaran Santri Baru Tahun Ajaran 2024/2025',
          slug: 'ppdb-2024-2025',
          content: `<p>Yayasan Al Mujahidin membuka pendaftaran santri/siswa baru untuk tahun ajaran 2024/2025.</p>
          <h2>Jadwal Pendaftaran</h2>
          <ul>
            <li><strong>Gelombang 1:</strong> 1 Januari - 28 Februari 2024</li>
            <li><strong>Gelombang 2:</strong> 1 Maret - 30 April 2024</li>
            <li><strong>Gelombang 3:</strong> 1 Mei - 30 Juni 2024</li>
          </ul>
          <h2>Persyaratan Umum</h2>
          <ul>
            <li>Mengisi formulir pendaftaran online</li>
            <li>Fotokopi akta kelahiran</li>
            <li>Fotokopi kartu keluarga</li>
            <li>Pas foto 3x4 (4 lembar)</li>
            <li>Surat keterangan sehat dari dokter</li>
          </ul>
          <h2>Kontak</h2>
          <p>Informasi lebih lanjut dapat menghubungi sekretariat yayasan.</p>`,
          excerpt: 'Pendaftaran santri/siswa baru tahun ajaran 2024/2025 telah dibuka.',
          category: 'pendidikan',
          isFeatured: true,
          isPublished: true,
        },
        {
          title: 'Santri Al Mujahidin Raih Juara MTQ Tingkat Provinsi',
          slug: 'juara-mtq-provinsi',
          content: `<p>Alhamdulillah, santri Pondok Pesantren Al Mujahidin berhasil meraih juara dalam Musabaqah Tilawatil Quran (MTQ) tingkat Provinsi Kalimantan Timur.</p>
          <h2>Prestasi yang Diraih</h2>
          <ul>
            <li>Juara 1 Tilawah Putra - Ahmad Fauzan</li>
            <li>Juara 2 Tilawah Putri - Fatimah Azzahra</li>
            <li>Juara 1 Hifdzil Quran 5 Juz - Muhammad Rizki</li>
          </ul>
          <h2>Apresiasi</h2>
          <p>Ketua Yayasan Al Mujahidin menyampaikan rasa bangga atas prestasi yang diraih oleh para santri.</p>`,
          excerpt: 'Santri Al Mujahidin berhasil meraih juara dalam MTQ tingkat Provinsi Kalimantan Timur.',
          category: 'prestasi',
          isFeatured: true,
          isPublished: true,
        },
      ]

      for (const news of sampleNews) {
        await db.news.create({ data: news })
      }
      
      console.log('Database seeded successfully!')
    }
  } catch (error) {
    console.error('Error seeding database:', error)
  } finally {
    seedingInProgress = false
  }
}
