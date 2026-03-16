import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

// Fungsi untuk initialize database
async function initializeDatabase() {
  try {
    // Cek apakah admin sudah ada
    const existingAdmin = await db.admin.findFirst()

    if (existingAdmin) {
      return { success: true, message: 'Database sudah diinisialisasi', existing: true }
    }

    // Hash password default
    const hashedPassword = await bcrypt.hash('admin123', 10)

    // Buat admin default
    const admin = await db.admin.create({
      data: {
        email: 'admin@yalmuja.sch.id',
        password: hashedPassword,
        name: 'Administrator',
        role: 'superadmin',
        isActive: true,
      },
    })

    // Buat settings default
    const defaultSettings = [
      { key: 'site_name', value: 'Yayasan Al Mujahidin', type: 'text', group: 'general' },
      { key: 'site_tagline', value: 'Membangun Generasi Berilmu dan Berakhlak', type: 'text', group: 'general' },
      { key: 'site_description', value: 'Yayasan Pendidikan Islam Al Mujahidin Kalimantan Timur - Mendidik generasi muslim yang berilmu, berakhlak, dan berwawasan global.', type: 'textarea', group: 'general' },
      { key: 'site_address', value: 'Jl. Pendidikan No. 1, Samarinda, Kalimantan Timur', type: 'text', group: 'contact' },
      { key: 'site_phone', value: '(0541) 123456', type: 'text', group: 'contact' },
      { key: 'site_email', value: 'info@yalmuja.sch.id', type: 'text', group: 'contact' },
      { key: 'site_whatsapp', value: '6281234567890', type: 'text', group: 'contact' },
      { key: 'facebook_url', value: 'https://facebook.com/yalmuja', type: 'text', group: 'social' },
      { key: 'instagram_url', value: 'https://instagram.com/yalmuja', type: 'text', group: 'social' },
      { key: 'youtube_url', value: 'https://youtube.com/yalmuja', type: 'text', group: 'social' },
      { key: 'profile_vision', value: 'Menjadi lembaga pendidikan Islam terkemuka yang menghasilkan generasi berilmu, berakhlak, dan berwawasan global.', type: 'textarea', group: 'profile' },
      { key: 'profile_mission', value: '1. Menyelenggarakan pendidikan Islam yang berkualitas\n2. Mengembangkan potensi siswa secara optimal\n3. Membangun lingkungan belajar yang kondusif\n4. Menanamkan nilai-nilai Islami dalam kehidupan sehari-hari', type: 'textarea', group: 'profile' },
      { key: 'profile_history', value: 'Yayasan Al Mujahidin Kalimantan Timur didirikan pada tahun 1985 oleh para ulama dan tokoh masyarakat yang peduli terhadap pendidikan Islam. Selama hampir 40 tahun, yayasan ini telah mendidik ribuan alumni yang tersebar di seluruh Indonesia.', type: 'textarea', group: 'profile' },
      { key: 'ppdb_academic_year', value: '2024/2025', type: 'text', group: 'ppdb' },
      { key: 'ppdb_is_open', value: 'true', type: 'text', group: 'ppdb' },
    ]

    for (const setting of defaultSettings) {
      await db.setting.create({ data: setting })
    }

    // Buat education units default
    const educationUnits = [
      {
        name: 'Pondok Pesantren Al Mujahidin',
        type: 'ponpes',
        description: 'Pondok Pesantren Al Mujahidin merupakan wadah pendidikan Islam intensif dengan sistem asrama. Santri dididik secara komprehensif dalam bidang ilmu agama, akhlak, dan kemandirian.',
        facilities: '["Masjid", "Asrama Putra", "Asrama Putri", "Ruang Kelas", "Perpustakaan", "Lapangan Olahraga"]',
        programs: '["Tahfidz Al-Quran", "Kajian Kitab Kuning", "Bahasa Arab", "Bahasa Inggris"]',
        order: 1,
      },
      {
        name: 'Madrasah Ibtidaiyah (MI)',
        type: 'mi',
        description: 'MI Al Mujahidin menyelenggarakan pendidikan dasar dengan kurikulum terpadu yang mengintegrasikan kurikulum nasional dan kurikulum pesantren.',
        facilities: '["Ruang Kelas Ber-AC", "Perpustakaan", "Laboratorium Komputer", "Lapangan Bermain"]',
        programs: '["Kurikulum Nasional", "Tahfidz Al-Quran", "Bahasa Arab", "Praktek Ibadah"]',
        order: 2,
      },
      {
        name: 'Madrasah Tsanawiyah (MTs)',
        type: 'mts',
        description: 'MTs Al Mujahidin menawarkan pendidikan menengah pertama dengan penguatan karakter Islami dan peningkatan kompetensi akademik.',
        facilities: '["Ruang Kelas Ber-AC", "Laboratorium IPA", "Laboratorium Komputer", "Perpustakaan"]',
        programs: '["Kurikulum Nasional", "Tahfidz Al-Quran", "Bahasa Arab & Inggris", "IPA & IPS"]',
        order: 3,
      },
      {
        name: 'Madrasah Aliyah (MA)',
        type: 'ma',
        description: 'MA Al Mujahidin menyiapkan lulusan yang siap melanjutkan ke perguruan tinggi dengan bekal ilmu agama dan ilmu umum.',
        facilities: '["Ruang Kelas Ber-AC", "Laboratorium IPA", "Laboratorium Bahasa", "Aula Serbaguna"]',
        programs: '["Jurusan IPA", "Jurusan IPS", "Jurusan Keagamaan", "Persiapan PTN"]',
        order: 4,
      },
    ]

    for (const unit of educationUnits) {
      await db.educationUnit.create({ data: unit })
    }

    // Buat sample news
    const sampleNews = [
      {
        title: 'Selamat Datang di Website Yayasan Al Mujahidin',
        slug: 'selamat-datang-website',
        content: '<p>Assalamualaikum Warahmatullahi Wabarakatuh,</p><p>Selamat datang di website resmi Yayasan Al Mujahidin Kalimantan Timur. Website ini merupakan media informasi dan komunikasi antara yayasan dengan masyarakat.</p><p>Semoga website ini dapat memberikan informasi yang bermanfaat bagi Anda.</p>',
        excerpt: 'Selamat datang di website resmi Yayasan Al Mujahidin Kalimantan Timur.',
        category: 'pengumuman',
        isFeatured: true,
      },
      {
        title: 'Pendaftaran Santri Baru Tahun Ajaran 2024/2025',
        slug: 'ppdb-2024-2025',
        content: '<p>Yayasan Al Mujahidin membuka pendaftaran santri/siswa baru untuk tahun ajaran 2024/2025.</p><p>Informasi lebih lanjut dapat menghubungi sekretariat yayasan.</p>',
        excerpt: 'Pendaftaran santri/siswa baru tahun ajaran 2024/2025 telah dibuka.',
        category: 'pendidikan',
        isFeatured: true,
      },
    ]

    for (const news of sampleNews) {
      await db.news.create({ data: news })
    }

    // Buat sample scholarships
    const scholarships = [
      {
        title: 'Beasiswa Yatim Piatu',
        slug: 'beasiswa-yatim-piatu',
        description: 'Beasiswa khusus untuk santri/siswa yang berstatus yatim, piatu, atau yatim piatu.',
        requirements: '- Berstatus yatim/piatu/yatim piatu\n- Membawa surat keterangan dari desa/kelurahan\n- Nilai rata-rata minimal 70',
        benefits: 'Pembebasan 50-100% biaya pendidikan sesuai ketentuan',
        isActive: true,
      },
      {
        title: 'Beasiswa Prestasi Akademik',
        slug: 'beasiswa-prestasi-akademik',
        description: 'Beasiswa untuk santri/siswa berprestasi akademik.',
        requirements: '- Nilai rata-rata minimal 85\n- Tidak pernah melanggar tata tertib\n- Aktif dalam kegiatan sekolah',
        benefits: 'Pembebasan 25-50% biaya pendidikan',
        isActive: true,
      },
      {
        title: 'Beasiswa Tahfidz',
        slug: 'beasiswa-tahfidz',
        description: 'Beasiswa untuk santri/siswa yang telah hafal Al-Quran.',
        requirements: '- Hafal minimal 5 juz Al-Quran\n- Mampu membaca Al-Quran dengan tajwid yang baik\n- Bersedia mengikuti tes hafalan',
        benefits: 'Pembebasan 30-75% biaya pendidikan sesuai jumlah hafalan',
        isActive: true,
      },
    ]

    for (const scholarship of scholarships) {
      await db.scholarship.create({ data: scholarship })
    }

    return { 
      success: true, 
      message: 'Database berhasil diinisialisasi',
      admin: { email: admin.email, name: admin.name },
      existing: false 
    }
  } catch (error) {
    console.error('Seed error:', error)
    return { 
      success: false, 
      message: 'Gagal menginisialisasi database',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

export async function GET() {
  // Security check - hanya allow jika tidak ada admin
  try {
    const existingAdmin = await db.admin.findFirst()
    
    if (existingAdmin) {
      return NextResponse.json({
        success: true,
        message: 'Database sudah terinisialisasi. Untuk reset, hapus database terlebih dahulu.',
        hint: 'Login dengan email: admin@yalmuja.sch.id dan password: admin123',
        alreadyInitialized: true
      })
    }
    
    const result = await initializeDatabase()
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Error checking database',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { secret } = body

    // Security check - butuh secret key untuk POST
    if (secret !== process.env.NEXTAUTH_SECRET && secret !== 'yalmuja-seed-secret-2024') {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized - Invalid secret key'
      }, { status: 401 })
    }

    const result = await initializeDatabase()
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Error initializing database',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
