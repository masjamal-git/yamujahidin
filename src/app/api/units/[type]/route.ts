import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Default education units data
const defaultUnits: Record<string, any> = {
  ponpes: {
    id: 'default-ponpes',
    name: 'Pondok Pesantren Al Mujahidin',
    type: 'ponpes',
    description: 'Pondok Pesantren Al Mujahidin merupakan wadah pendidikan Islam intensif dengan sistem asrama. Santri dididik secara komprehensif dalam bidang ilmu agama, akhlak, dan kemandirian.',
    address: 'Jl. Pondok Pesantren No. 1, Samarinda, Kalimantan Timur',
    phone: '(0541) 123456',
    email: 'ponpes@yalmuja.sch.id',
    image: null,
    facilities: '["Masjid", "Asrama Putra", "Asrama Putri", "Ruang Kelas", "Perpustakaan", "Lapangan Olahraga", "Dapur Bersama", "Klinik Kesehatan"]',
    programs: '["Tahfidz Al-Quran", "Kajian Kitab Kuning", "Bahasa Arab", "Bahasa Inggris", "Pengajian Malam"]',
    isActive: true,
  },
  mi: {
    id: 'default-mi',
    name: 'Madrasah Ibtidaiyah (MI) Al Mujahidin',
    type: 'mi',
    description: 'MI Al Mujahidin menyelenggarakan pendidikan dasar dengan kurikulum terpadu yang mengintegrasikan kurikulum nasional dan kurikulum pesantren.',
    address: 'Jl. Pondok Pesantren No. 1, Samarinda, Kalimantan Timur',
    phone: '(0541) 123457',
    email: 'mi@yalmuja.sch.id',
    image: null,
    facilities: '["Ruang Kelas Ber-AC", "Perpustakaan", "Laboratorium Komputer", "Lapangan Bermain", "Kantin Sehat", "UKS"]',
    programs: '["Kurikulum Nasional", "Tahfidz Al-Quran", "Bahasa Arab", "Praktek Ibadah", "Ekstrakurikuler"]',
    isActive: true,
  },
  mts: {
    id: 'default-mts',
    name: 'Madrasah Tsanawiyah (MTs) Al Mujahidin',
    type: 'mts',
    description: 'MTs Al Mujahidin menawarkan pendidikan menengah pertama dengan penguatan karakter Islami dan peningkatan kompetensi akademik.',
    address: 'Jl. Pondok Pesantren No. 1, Samarinda, Kalimantan Timur',
    phone: '(0541) 123458',
    email: 'mts@yalmuja.sch.id',
    image: null,
    facilities: '["Ruang Kelas Ber-AC", "Laboratorium IPA", "Laboratorium Komputer", "Perpustakaan", "Masjid", "Lapangan Olahraga"]',
    programs: '["Kurikulum Nasional", "Tahfidz Al-Quran", "Bahasa Arab & Inggris", "IPA & IPS", "Ekstrakurikuler Lengkap"]',
    isActive: true,
  },
  ma: {
    id: 'default-ma',
    name: 'Madrasah Aliyah (MA) Al Mujahidin',
    type: 'ma',
    description: 'MA Al Mujahidin menyiapkan lulusan yang siap melanjutkan ke perguruan tinggi atau terjun ke masyarakat dengan bekal ilmu agama dan ilmu umum.',
    address: 'Jl. Pondok Pesantren No. 1, Samarinda, Kalimantan Timur',
    phone: '(0541) 123459',
    email: 'ma@yalmuja.sch.id',
    image: null,
    facilities: '["Ruang Kelas Ber-AC", "Laboratorium IPA", "Laboratorium Komputer", "Laboratorium Bahasa", "Perpustakaan", "Masjid", "Aula Serbaguna"]',
    programs: '["Jurusan IPA", "Jurusan IPS", "Jurusan Keagamaan", "Tahfidz Al-Quran", "Persiapan PTN", "Bahasa Arab & Inggris"]',
    isActive: true,
  },
}

export async function GET(
  request: NextRequest,
-  { params }: { params: { type: string } }
+  { params }: { params: Promise<{ type: string }> }
) {
  try {
-    const { type } = params
+    const { type } = await params
    
    // Validate type
    if (!type || !['ponpes', 'mi', 'mts', 'ma'].includes(type)) {
      return NextResponse.json(
        { success: false, message: 'Tipe unit pendidikan tidak valid' },
        { status: 400 }
      )
    }

    // Try to get from database
    try {
      const unit = await db.educationUnit.findUnique({
        where: { type: type },
      })

      if (unit) {
        return NextResponse.json({ success: true, data: unit })
      }
    } catch (dbError) {
      console.error('Database error, using default data:', dbError)
    }

    // Return default data if not found in database
    const defaultUnit = defaultUnits[type]
    if (defaultUnit) {
      return NextResponse.json({ success: true, data: defaultUnit })
    }

    return NextResponse.json(
      { success: false, message: 'Unit pendidikan tidak ditemukan' },
      { status: 404 }
    )
  } catch (error) {
    console.error('Error fetching education unit:', error)
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil data unit pendidikan' },
      { status: 500 }
    )
  }
}
