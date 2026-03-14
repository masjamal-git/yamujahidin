import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Static fallback data for education units
const staticEducationUnits: Record<string, {
  id: string
  name: string
  type: string
  description: string | null
  address: string | null
  phone: string | null
  email: string | null
  image: string | null
  facilities: string | null
  programs: string | null
}> = {
  ponpes: {
    id: '1',
    name: 'Pondok Pesantren Al Mujahidin',
    type: 'ponpes',
    description: 'Pondok Pesantren Al Mujahidin merupakan wadah pendidikan Islam intensif dengan sistem asrama. Santri dididik secara komprehensif dalam bidang ilmu agama, akhlak, dan kemandirian.',
    address: 'Jl. Pendidikan No. 1, Samarinda, Kalimantan Timur',
    phone: '(0541) 123456',
    email: 'ponpes@yalmuja.sch.id',
    image: null,
    facilities: '["Masjid", "Asrama Putra", "Asrama Putri", "Ruang Kelas", "Perpustakaan", "Lapangan Olahraga"]',
    programs: '["Tahfidz Al-Quran", "Kajian Kitab Kuning", "Bahasa Arab", "Bahasa Inggris"]',
  },
  mi: {
    id: '2',
    name: 'Madrasah Ibtidaiyah (MI)',
    type: 'mi',
    description: 'MI Al Mujahidin menyelenggarakan pendidikan dasar dengan kurikulum terpadu yang mengintegrasikan kurikulum nasional dan kurikulum pesantren.',
    address: 'Jl. Pendidikan No. 1, Samarinda, Kalimantan Timur',
    phone: '(0541) 123456',
    email: 'mi@yalmuja.sch.id',
    image: null,
    facilities: '["Ruang Kelas Ber-AC", "Perpustakaan", "Laboratorium Komputer", "Lapangan Bermain"]',
    programs: '["Kurikulum Nasional", "Tahfidz Al-Quran", "Bahasa Arab", "Praktek Ibadah"]',
  },
  mts: {
    id: '3',
    name: 'Madrasah Tsanawiyah (MTs)',
    type: 'mts',
    description: 'MTs Al Mujahidin menawarkan pendidikan menengah pertama dengan penguatan karakter Islami dan peningkatan kompetensi akademik.',
    address: 'Jl. Pendidikan No. 1, Samarinda, Kalimantan Timur',
    phone: '(0541) 123456',
    email: 'mts@yalmuja.sch.id',
    image: null,
    facilities: '["Ruang Kelas Ber-AC", "Laboratorium IPA", "Laboratorium Komputer", "Perpustakaan"]',
    programs: '["Kurikulum Nasional", "Tahfidz Al-Quran", "Bahasa Arab & Inggris", "IPA & IPS"]',
  },
  ma: {
    id: '4',
    name: 'Madrasah Aliyah (MA)',
    type: 'ma',
    description: 'MA Al Mujahidin menyiapkan lulusan yang siap melanjutkan ke perguruan tinggi dengan bekal ilmu agama dan ilmu umum.',
    address: 'Jl. Pendidikan No. 1, Samarinda, Kalimantan Timur',
    phone: '(0541) 123456',
    email: 'ma@yalmuja.sch.id',
    image: null,
    facilities: '["Ruang Kelas Ber-AC", "Laboratorium IPA", "Laboratorium Bahasa", "Aula Serbaguna"]',
    programs: '["Jurusan IPA", "Jurusan IPS", "Jurusan Keagamaan", "Persiapan PTN"]',
  },
}

// GET /api/education-units/[type] - Get education unit by type
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  try {
    const { type } = await params
    
    if (!type) {
      return NextResponse.json(
        { success: false, message: 'Tipe unit pendidikan tidak valid' },
        { status: 400 }
      )
    }

    // Try to get from database first
    let unit = null
    try {
      unit = await db.educationUnit.findUnique({
        where: { type: type },
      })
    } catch (dbError) {
      console.log('Database not available, using static data')
    }

    // If not in database, use static data
    if (!unit) {
      unit = staticEducationUnits[type] || null
    }

    if (!unit) {
      return NextResponse.json(
        { success: false, message: 'Unit pendidikan tidak ditemukan' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: unit })
  } catch (error) {
    console.error('Error fetching education unit:', error)
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil data unit pendidikan', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
