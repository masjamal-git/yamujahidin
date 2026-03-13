import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Default education units data with images
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
    facilities: JSON.stringify([
      { name: 'Masjid', image: '' },
      { name: 'Asrama Putra', image: '' },
      { name: 'Asrama Putri', image: '' },
      { name: 'Ruang Kelas', image: '' },
      { name: 'Perpustakaan', image: '' },
      { name: 'Lapangan Olahraga', image: '' },
      { name: 'Dapur Bersama', image: '' },
      { name: 'Klinik Kesehatan', image: '' }
    ]),
    programs: JSON.stringify([
      { name: 'Tahfidz Al-Quran', image: '' },
      { name: 'Kajian Kitab Kuning', image: '' },
      { name: 'Bahasa Arab', image: '' },
      { name: 'Bahasa Inggris', image: '' },
      { name: 'Pengajian Malam', image: '' }
    ]),
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
    facilities: JSON.stringify([
      { name: 'Ruang Kelas Ber-AC', image: '' },
      { name: 'Perpustakaan', image: '' },
      { name: 'Laboratorium Komputer', image: '' },
      { name: 'Lapangan Bermain', image: '' },
      { name: 'Kantin Sehat', image: '' },
      { name: 'UKS', image: '' }
    ]),
    programs: JSON.stringify([
      { name: 'Kurikulum Nasional', image: '' },
      { name: 'Tahfidz Al-Quran', image: '' },
      { name: 'Bahasa Arab', image: '' },
      { name: 'Praktek Ibadah', image: '' },
      { name: 'Ekstrakurikuler', image: '' }
    ]),
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
    facilities: JSON.stringify([
      { name: 'Ruang Kelas Ber-AC', image: '' },
      { name: 'Laboratorium IPA', image: '' },
      { name: 'Laboratorium Komputer', image: '' },
      { name: 'Perpustakaan', image: '' },
      { name: 'Masjid', image: '' },
      { name: 'Lapangan Olahraga', image: '' }
    ]),
    programs: JSON.stringify([
      { name: 'Kurikulum Nasional', image: '' },
      { name: 'Tahfidz Al-Quran', image: '' },
      { name: 'Bahasa Arab & Inggris', image: '' },
      { name: 'IPA & IPS', image: '' },
      { name: 'Ekstrakurikuler Lengkap', image: '' }
    ]),
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
    facilities: JSON.stringify([
      { name: 'Ruang Kelas Ber-AC', image: '' },
      { name: 'Laboratorium IPA', image: '' },
      { name: 'Laboratorium Komputer', image: '' },
      { name: 'Laboratorium Bahasa', image: '' },
      { name: 'Perpustakaan', image: '' },
      { name: 'Masjid', image: '' },
      { name: 'Aula Serbaguna', image: '' }
    ]),
    programs: JSON.stringify([
      { name: 'Jurusan IPA', image: '' },
      { name: 'Jurusan IPS', image: '' },
      { name: 'Jurusan Keagamaan', image: '' },
      { name: 'Tahfidz Al-Quran', image: '' },
      { name: 'Persiapan PTN', image: '' },
      { name: 'Bahasa Arab & Inggris', image: '' }
    ]),
    isActive: true,
  },
}

// GET /api/units/[type] - Get education unit by type
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
        // Migrate old format to new format if needed
        let facilities = unit.facilities
        let programs = unit.programs
        
        // Check if facilities is old format (array of strings)
        if (facilities) {
          try {
            const parsed = JSON.parse(facilities)
            if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'string') {
              facilities = JSON.stringify(parsed.map((f: string) => ({ name: f, image: '' })))
            }
          } catch {}
        }
        
        // Check if programs is old format (array of strings)
        if (programs) {
          try {
            const parsed = JSON.parse(programs)
            if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'string') {
              programs = JSON.stringify(parsed.map((p: string) => ({ name: p, image: '' })))
            }
          } catch {}
        }
        
        return NextResponse.json({ 
          success: true, 
          data: { ...unit, facilities, programs }
        })
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
