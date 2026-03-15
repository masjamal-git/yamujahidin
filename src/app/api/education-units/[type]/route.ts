import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Interface for items with images
interface FacilityItem {
  name: string
  image: string | null
}

interface ProgramItem {
  name: string
  image: string | null
}

// Static fallback data for education units (new format with images)
const staticEducationUnits: Record<string, {
  id: string
  name: string
  type: string
  description: string | null
  address: string | null
  phone: string | null
  email: string | null
  image: string | null
  facilities: FacilityItem[]
  programs: ProgramItem[]
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
    facilities: [
      { name: 'Masjid', image: null },
      { name: 'Asrama Putra', image: null },
      { name: 'Asrama Putri', image: null },
      { name: 'Ruang Kelas', image: null },
      { name: 'Perpustakaan', image: null },
      { name: 'Lapangan Olahraga', image: null },
    ],
    programs: [
      { name: 'Tahfidz Al-Quran', image: null },
      { name: 'Kajian Kitab Kuning', image: null },
      { name: 'Bahasa Arab', image: null },
      { name: 'Bahasa Inggris', image: null },
    ],
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
    facilities: [
      { name: 'Ruang Kelas Ber-AC', image: null },
      { name: 'Perpustakaan', image: null },
      { name: 'Laboratorium Komputer', image: null },
      { name: 'Lapangan Bermain', image: null },
    ],
    programs: [
      { name: 'Kurikulum Nasional', image: null },
      { name: 'Tahfidz Al-Quran', image: null },
      { name: 'Bahasa Arab', image: null },
      { name: 'Praktek Ibadah', image: null },
    ],
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
    facilities: [
      { name: 'Ruang Kelas Ber-AC', image: null },
      { name: 'Laboratorium IPA', image: null },
      { name: 'Laboratorium Komputer', image: null },
      { name: 'Perpustakaan', image: null },
    ],
    programs: [
      { name: 'Kurikulum Nasional', image: null },
      { name: 'Tahfidz Al-Quran', image: null },
      { name: 'Bahasa Arab & Inggris', image: null },
      { name: 'IPA & IPS', image: null },
    ],
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
    facilities: [
      { name: 'Ruang Kelas Ber-AC', image: null },
      { name: 'Laboratorium IPA', image: null },
      { name: 'Laboratorium Bahasa', image: null },
      { name: 'Aula Serbaguna', image: null },
    ],
    programs: [
      { name: 'Jurusan IPA', image: null },
      { name: 'Jurusan IPS', image: null },
      { name: 'Jurusan Keagamaan', image: null },
      { name: 'Persiapan PTN', image: null },
    ],
  },
}

// Helper function to parse JSON array safely with backward compatibility
function parseItems(value: string | null | undefined): (FacilityItem | ProgramItem)[] {
  if (!value) return []
  try {
    const parsed = JSON.parse(value)
    if (Array.isArray(parsed)) {
      // Check if it's old format (string array) or new format (object array)
      if (parsed.length > 0 && typeof parsed[0] === 'string') {
        // Convert old format to new format
        return parsed.map((name: string) => ({ name, image: null }))
      }
      return parsed
    }
    return []
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
      facilities: (FacilityItem | ProgramItem)[]
      programs: (FacilityItem | ProgramItem)[]
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
        facilities: parseItems(dbUnit.facilities),
        programs: parseItems(dbUnit.programs),
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
