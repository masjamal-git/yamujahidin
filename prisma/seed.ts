import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create default admin
  const hashedPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@yalmuja.sch.id' },
    update: {},
    create: {
      email: 'admin@yalmuja.sch.id',
      password: hashedPassword,
      name: 'Administrator',
      role: 'superadmin',
      isActive: true,
    },
  })

  console.log('Created admin:', admin.email)

  // Create settings
  const settings = [
    { key: 'site_name', value: 'Yayasan Al Mujahidin Kalimantan Timur', type: 'text', group: 'general' },
    { key: 'site_tagline', value: 'Membangun Generasi Berilmu dan Berakhlak', type: 'text', group: 'general' },
    { key: 'site_description', value: 'Yayasan Pendidikan Al Mujahidin Kalimantan Timur mengelola Pondok Pesantren, MI, MTs, dan MA dengan kurikulum terpadu yang mengintegrasikan ilmu agama dan ilmu umum.', type: 'textarea', group: 'general' },
    { key: 'site_address', value: 'Jl. Pondok Pesantren No. 1, Samarinda, Kalimantan Timur', type: 'text', group: 'contact' },
    { key: 'site_phone', value: '(0541) 123456', type: 'text', group: 'contact' },
    { key: 'site_email', value: 'info@yalmuja.sch.id', type: 'text', group: 'contact' },
    { key: 'site_whatsapp', value: '6281234567890', type: 'text', group: 'contact' },
    { key: 'facebook_url', value: 'https://facebook.com/yalmuja', type: 'text', group: 'social' },
    { key: 'instagram_url', value: 'https://instagram.com/yalmuja', type: 'text', group: 'social' },
    { key: 'youtube_url', value: 'https://youtube.com/yalmuja', type: 'text', group: 'social' },
    { key: 'profile_vision', value: 'Menjadi lembaga pendidikan Islam terkemuka yang menghasilkan generasi berilmu, berakhlak, dan berwawasan global.', type: 'textarea', group: 'profile' },
    { key: 'profile_mission', value: '1. Menyelenggarakan pendidikan Islam yang berkualitas dan berkarakter\n2. Mengembangkan potensi siswa secara optimal\n3. Membangun lingkungan belajar yang kondusif\n4. Menyiapkan kader umat yang siap menghadapi tantangan zaman', type: 'textarea', group: 'profile' },
    { key: 'profile_history', value: 'Yayasan Al Mujahidin Kalimantan Timur didirikan pada tahun 1985 oleh para ulama dan tokoh masyarakat yang peduli terhadap pendidikan Islam. Berawal dari sebuah pondok pesantren sederhana, kini yayasan telah berkembang menjadi lembaga pendidikan Islam terpadu yang mengelola Pondok Pesantren, Madrasah Ibtidaiyah (MI), Madrasah Tsanawiyah (MTs), dan Madrasah Aliyah (MA).', type: 'textarea', group: 'profile' },
  ]

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: { value: setting.value, type: setting.type, group: setting.group },
      create: setting,
    })
  }

  console.log('Created settings')

  // Create education units
  const units = [
    {
      name: 'Pondok Pesantren Al Mujahidin',
      type: 'ponpes',
      description: 'Pondok Pesantren Al Mujahidin merupakan wadah pendidikan Islam intensif dengan sistem asrama. Santri dididik secara komprehensif dalam bidang ilmu agama, akhlak, dan kemandirian.',
      address: 'Jl. Pondok Pesantren No. 1, Samarinda',
      phone: '(0541) 123456',
      email: 'ponpes@yalmuja.sch.id',
      facilities: JSON.stringify(['Masjid', 'Asrama Putra', 'Asrama Putri', 'Ruang Kelas', 'Perpustakaan', 'Lapangan Olahraga', 'Dapur Bersama', 'Klinik Kesehatan']),
      programs: JSON.stringify(['Tahfidz Al-Quran', 'Kajian Kitab Kuning', 'Bahasa Arab', 'Bahasa Inggris', 'Pengajian Malam']),
      order: 1,
    },
    {
      name: 'Madrasah Ibtidaiyah (MI) Al Mujahidin',
      type: 'mi',
      description: 'MI Al Mujahidin menyelenggarakan pendidikan dasar dengan kurikulum terpadu yang mengintegrasikan kurikulum nasional dan kurikulum pesantren.',
      address: 'Jl. Pondok Pesantren No. 1, Samarinda',
      phone: '(0541) 123457',
      email: 'mi@yalmuja.sch.id',
      facilities: JSON.stringify(['Ruang Kelas Ber-AC', 'Perpustakaan', 'Laboratorium Komputer', 'Lapangan Bermain', 'Kantin Sehat', 'UKS']),
      programs: JSON.stringify(['Kurikulum Nasional', 'Tahfidz Al-Quran', 'Bahasa Arab', 'Praktek Ibadah', 'Ekstrakurikuler']),
      order: 2,
    },
    {
      name: 'Madrasah Tsanawiyah (MTs) Al Mujahidin',
      type: 'mts',
      description: 'MTs Al Mujahidin menawarkan pendidikan menengah pertama dengan penguatan karakter Islami dan peningkatan kompetensi akademik.',
      address: 'Jl. Pondok Pesantren No. 1, Samarinda',
      phone: '(0541) 123458',
      email: 'mts@yalmuja.sch.id',
      facilities: JSON.stringify(['Ruang Kelas Ber-AC', 'Laboratorium IPA', 'Laboratorium Komputer', 'Perpustakaan', 'Masjid', 'Lapangan Olahraga']),
      programs: JSON.stringify(['Kurikulum Nasional', 'Tahfidz Al-Quran', 'Bahasa Arab & Inggris', 'IPA & IPS', 'Ekstrakurikuler Lengkap']),
      order: 3,
    },
    {
      name: 'Madrasah Aliyah (MA) Al Mujahidin',
      type: 'ma',
      description: 'MA Al Mujahidin menyiapkan lulusan yang siap melanjutkan ke perguruan tinggi atau terjun ke masyarakat dengan bekal ilmu agama dan ilmu umum.',
      address: 'Jl. Pondok Pesantren No. 1, Samarinda',
      phone: '(0541) 123459',
      email: 'ma@yalmuja.sch.id',
      facilities: JSON.stringify(['Ruang Kelas Ber-AC', 'Laboratorium IPA', 'Laboratorium Komputer', 'Laboratorium Bahasa', 'Perpustakaan', 'Masjid', 'Aula Serbaguna']),
      programs: JSON.stringify(['Jurusan IPA', 'Jurusan IPS', 'Jurusan Keagamaan', 'Tahfidz Al-Quran', 'Persiapan PTN', 'Bahasa Arab & Inggris']),
      order: 4,
    },
  ]

  for (const unit of units) {
    await prisma.educationUnit.upsert({
      where: { type: unit.type },
      update: unit,
      create: unit,
    })
  }

  console.log('Created education units')

  // Create sample news
  const news = [
    {
      title: 'Pendaftaran Peserta Didik Baru Tahun Ajaran 2024/2025 Dibuka',
      slug: 'ppdb-2024-2025-dibuka',
      content: `<p>Yayasan Al Mujahidin Kalimantan Timur dengan ini membuka pendaftaran peserta didik baru untuk tahun ajaran 2024/2025.</p>
<p>Program pendidikan yang tersedia:</p>
<ul>
<li>Pondok Pesantren (Putra/Putri)</li>
<li>Madrasah Ibtidaiyah (MI)</li>
<li>Madrasah Tsanawiyah (MTs)</li>
<li>Madrasah Aliyah (MA)</li>
</ul>
<p>Pendaftaran dapat dilakukan secara online melalui website ini atau langsung ke sekretariat yayasan.</p>`,
      excerpt: 'Yayasan Al Mujahidin Kalimantan Timur membuka pendaftaran peserta didik baru untuk tahun ajaran 2024/2025.',
      category: 'pengumuman',
      isPublished: true,
      isFeatured: true,
    },
    {
      title: 'Santri Al Mujahidin Raih Juara MTQ Tingkat Provinsi',
      slug: 'santri-raih-juara-mtq',
      content: `<p>Alhamdulillah, santri Pondok Pesantren Al Mujahidin berhasil meraih prestasi membanggakan dalam Musabaqah Tilawatil Quran (MTQ) tingkat Provinsi Kalimantan Timur.</p>
<p>Prestasi yang diraih:</p>
<ul>
<li>Juara 1 Cabang Tilawah Putra</li>
<li>Juara 2 Cabang Hifzhil Quran 5 Juz</li>
<li>Juara 3 Cabang Tilawah Putri</li>
</ul>
<p>Selamat kepada para santri atas prestasinya. Semoga menjadi motivasi untuk terus berkembang.</p>`,
      excerpt: 'Santri Pondok Pesantren Al Mujahidin berhasil meraih prestasi membanggakan dalam MTQ tingkat Provinsi Kaltim.',
      category: 'prestasi',
      isPublished: true,
      isFeatured: true,
    },
    {
      title: 'Peringatan Maulid Nabi Muhammad SAW 1446 H',
      slug: 'maulid-nabi-1446h',
      content: `<p>Dalam rangka memperingati Maulid Nabi Muhammad SAW 1446 H, Yayasan Al Mujahidin mengadakan serangkaian kegiatan:</p>
<ul>
<li>Tabligh Akbar</li>
<li>Prosesi Safari Maulid</li>
<li>Lomba-lomba keagamaan</li>
<li>Pengajian bersama masyarakat</li>
</ul>
<p>Seluruh kegiatan akan berlangsung pada tanggal 15-17 Rabiul Awal 1446 H di kompleks Pondok Pesantren Al Mujahidin.</p>`,
      excerpt: 'Yayasan Al Mujahidin mengadakan peringatan Maulid Nabi Muhammad SAW 1446 H dengan berbagai kegiatan.',
      category: 'kegiatan',
      isPublished: true,
      isFeatured: false,
    },
    {
      title: 'Workshop Pengembangan Kurikulum Merdeka',
      slug: 'workshop-kurikulum-merdeka',
      content: `<p>Para guru dan tenaga pendidik Yayasan Al Mujahidin mengikuti workshop pengembangan Kurikulum Merdeka yang diselenggarakan selama 3 hari.</p>
<p>Workshop ini bertujuan untuk:</p>
<ul>
<li>Memahami konsep Kurikulum Merdeka</li>
<li>Menyusun modul ajar yang sesuai</li>
<li>Mengembangkan asesmen berbasis kompetensi</li>
<li>Meningkatkan kualitas pembelajaran</li>
</ul>
<p>Kegiatan ini merupakan bagian dari upaya peningkatan kualitas pendidikan di lingkungan yayasan.</p>`,
      excerpt: 'Para guru Yayasan Al Mujahidin mengikuti workshop pengembangan Kurikulum Merdeka selama 3 hari.',
      category: 'pendidikan',
      isPublished: true,
      isFeatured: false,
    },
  ]

  for (const item of news) {
    await prisma.news.upsert({
      where: { slug: item.slug },
      update: item,
      create: { ...item, authorId: admin.id },
    })
  }

  console.log('Created sample news')

  // Create sample gallery
  const gallery = [
    { title: 'Masjid Utama Al Mujahidin', description: 'Masjid utama yang menjadi pusat kegiatan ibadah di kompleks yayasan', category: 'fasilitas' },
    { title: 'Kegiatan Tahfidz', description: 'Santri sedang menghafal Al-Quran di musholla', category: 'kegiatan' },
    { title: 'Ruang Kelas Modern', description: 'Ruang kelas yang nyaman dan lengkap dengan fasilitas pendukung', category: 'fasilitas' },
    { title: 'Wisuda Santri', description: 'Pelepasan santri kelulusan angkatan ke-35', category: 'kegiatan' },
    { title: 'Lapangan Olahraga', description: 'Lapangan serbaguna untuk kegiatan olahraga dan upacara', category: 'fasilitas' },
    { title: 'Perpustakaan', description: 'Perpustakaan dengan koleksi buku lengkap', category: 'fasilitas' },
    { title: 'Pengajian Malam', description: 'Kegiatan rutin pengajian malam Jumat', category: 'kegiatan' },
    { title: 'Laboratorium Komputer', description: 'Lab komputer untuk mendukung pembelajaran TIK', category: 'fasilitas' },
  ]

  for (const item of gallery) {
    await prisma.gallery.create({
      data: item,
    })
  }

  console.log('Created sample gallery')

  // Create scholarships
  const scholarships = [
    {
      title: 'Beasiswa Yatim Piatu',
      slug: 'beasiswa-yatim-piatu',
      description: 'Beasiswa khusus untuk santri/siswi yang berstatus yatim, piatu, atau yatim piatu.',
      requirements: '1. Berstatus yatim/piatu/yatim piatu\n2. Berminat untuk belajar di Yayasan Al Mujahidin\n3. Bersedia mengikuti seluruh aturan pesantren\n4. Melampirkan surat keterangan dari kelurahan',
      benefits: '1. Bebas biaya pendidikan\n2. Bebas biaya asrama\n3. Uang saku bulanan\n4. Perlengkapan sekolah',
      deadline: '31 Juli 2024',
      isActive: true,
    },
    {
      title: 'Beasiswa Tahfidz',
      slug: 'beasiswa-tahfidz',
      description: 'Beasiswa untuk santri yang telah hafal Al-Quran minimal 5 juz.',
      requirements: '1. Hafal Al-Quran minimal 5 juz\n2. Bersedia mengikuti tes tahfidz\n3. Berminat melanjutkan hafalan\n4. Berkomitmen menyelesaikan hafalan 30 juz',
      benefits: '1. Potongan biaya pendidikan 50%\n2. Uang saku tambahan\n3. Bimbingan tahfidz intensif\n4. Kesempatan ikut MTQ tingkat nasional',
      deadline: '30 Juni 2024',
      isActive: true,
    },
    {
      title: 'Beasiswa Prestasi Akademik',
      slug: 'beasiswa-prestasi-akademik',
      description: 'Beasiswa untuk siswa berprestasi akademik tinggi.',
      requirements: '1. Nilai rata-rata rapor minimal 85\n2. Memiliki prestasi akademik tingkat kabupaten/kota minimal\n3. Bersedia mengikuti seleksi\n4. Aktif dalam kegiatan sekolah',
      benefits: '1. Potongan biaya pendidikan 25-75%\n2. Bimbingan olimpiade\n3. Kesempatan studi tour\n4. Sertifikat prestasi',
      deadline: '15 Agustus 2024',
      isActive: true,
    },
  ]

  for (const item of scholarships) {
    await prisma.scholarship.upsert({
      where: { slug: item.slug },
      update: item,
      create: item,
    })
  }

  console.log('Created scholarships')

  console.log('Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
