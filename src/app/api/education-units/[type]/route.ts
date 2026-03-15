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
  facilities: string[]
  programs: string[]
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
    facilities: ['Masjid', 'Asrama Putra', 'Asrama Putri', 'Ruang Kelas', 'Perpustakaan', 'Lapangan Olahraga'],
    programs: ['Tahfidz Al-Quran', 'Kajian Kitab Kuning', 'Bahasa Arab', 'Bahasa Inggris'],
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
    facilities: ['Ruang Kelas Ber-AC', 'Perpustakaan', 'Laboratorium Komputer', 'Lapangan Bermain'],
    programs: ['Kurikulum Nasional', 'Tahfidz Al-Quran', 'Bahasa Arab', 'Praktek Ibadah'],
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
    facilities: ['Ruang Kelas Ber-AC', 'Laboratorium IPA', 'Laboratorium Komputer', 'Perpustakaan'],
    programs: ['Kurikulum Nasional', 'Tahfidz Al-Quran', 'Bahasa Arab & Inggris', 'IPA & IPS'],
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
    facilities: ['Ruang Kelas Ber-AC', 'Laboratorium IPA', 'Laboratorium Bahasa', 'Aula Serbaguna'],
    programs: ['Jurusan IPA', 'Jurusan IPS', 'Jurusan Keagamaan', 'Persiapan PTN'],
  },
}

// Helper function to parse JSON array safely
function parseJsonArray(value: string | null | undefined): string[] {
  if (!value) return []
  if (Array.isArray(value)) return value
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
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

    // Validate type
    const validTypes = ['ponpes', 'mi', 'mts', 'ma']
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { success: false, message: 'Tipe unit pendidikan tidak valid' },
        { status: 400 }
      )
    }

    // Get static data as fallback
    const staticUnit = staticEducationUnits[type]

    // Try to get from database first
    let dbUnit = null
    try {
      dbUnit = await db.educationUnit.findUnique({
        where: { type: type },
      })
    } catch (dbError) {
      console.log('Database not available, using static data')
    }

    // If database has data, use it; otherwise use static data
    let responseData: {
      id: string
      name: string
      type: string
      description: string | null
      address: string | null
      phone: string | null
      email: string | null
      image: string | null
      facilities: string[]
      programs: string[]
    }

    if (dbUnit) {
      responseData = {
        id: dbUnit.id,
        name: dbUnit.name || staticUnit?.name || '',
        type: dbUnit.type,
        description: dbUnit.description || staticUnit?.description || null,
        address: dbUnit.address || staticUnit?.address || null,
        phone: dbUnit.phone || staticUnit?.phone || null,
        email: dbUnit.email || staticUnit?.email || null,
        image: dbUnit.image || null,
        facilities: parseJsonArray(dbUnit.facilities),
        programs: parseJsonArray(dbUnit.programs),
      }
    } else {
      responseData = staticUnit || {
        id: '',
        name: '',
        type: type,
        description: null,
        address: null,
        phone: null,
        email: null,
        image: null,
        facilities: [],
        programs: [],
      }
    }

    return NextResponse.json({ 
      success: true, 
      data: responseData 
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      }
    })
  } catch (error) {
    console.error('Error fetching education unit:', error)
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil data unit pendidikan', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
