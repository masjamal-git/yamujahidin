import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Default education units data
const defaultEducationUnits = [
  {
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
    isActive: true,
    order: 0,
  },
  {
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
    isActive: true,
    order: 1,
  },
  {
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
    isActive: true,
    order: 2,
  },
  {
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
    isActive: true,
    order: 3,
  },
]

// GET - Get all education units
export async function GET() {
  try {
    let units = []
    try {
      units = await db.educationUnit.findMany({
        orderBy: { order: 'asc' },
      })
    } catch (dbError) {
      console.log('Database not available, using default data')
    }

    // If no data in database, return default data
    if (!units || units.length === 0) {
      return NextResponse.json({ 
        success: true, 
        data: defaultEducationUnits 
      })
    }

    return NextResponse.json({ 
      success: true, 
      data: units 
    })
  } catch (error) {
    console.error('Error fetching education units:', error)
    return NextResponse.json({ 
      success: true, 
      data: defaultEducationUnits 
    })
  }
}

// PUT - Update an education unit
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, name, description, address, phone, email, image, facilities, programs, isActive } = body

    if (!type) {
      return NextResponse.json(
        { success: false, message: 'Tipe unit pendidikan diperlukan' },
        { status: 400 }
      )
    }

    // Try to update in database
    try {
      // Check if unit exists
      const existingUnit = await db.educationUnit.findUnique({
        where: { type },
      })

      if (existingUnit) {
        // Update existing unit
        const updated = await db.educationUnit.update({
          where: { type },
          data: {
            name,
            description,
            address,
            phone,
            email,
            image,
            facilities,
            programs,
            isActive,
          },
        })
        return NextResponse.json({ 
          success: true, 
          data: updated,
          message: 'Unit pendidikan berhasil diperbarui' 
        })
      } else {
        // Create new unit
        const created = await db.educationUnit.create({
          data: {
            type,
            name,
            description,
            address,
            phone,
            email,
            image,
            facilities,
            programs,
            isActive,
            order: defaultEducationUnits.findIndex(u => u.type === type),
          },
        })
        return NextResponse.json({ 
          success: true, 
          data: created,
          message: 'Unit pendidikan berhasil dibuat' 
        })
      }
    } catch (dbError) {
      console.log('Database not available, returning success without persistence')
      // Return success even without database
      return NextResponse.json({ 
        success: true, 
        data: body,
        message: 'Data berhasil disimpan (mode offline)' 
      })
    }
  } catch (error) {
    console.error('Error updating education unit:', error)
    return NextResponse.json(
      { success: false, message: 'Gagal menyimpan data unit pendidikan' },
      { status: 500 }
    )
  }
}

// POST - Create a new education unit or seed default data
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // If seeding all default data
    if (body.seed === true) {
      try {
        for (const unit of defaultEducationUnits) {
          const existing = await db.educationUnit.findUnique({
            where: { type: unit.type },
          })
          
          if (!existing) {
            await db.educationUnit.create({ data: unit })
          }
        }
        return NextResponse.json({ 
          success: true, 
          message: 'Data default berhasil disimpan' 
        })
      } catch (dbError) {
        return NextResponse.json({ 
          success: true, 
          message: 'Mode offline - data tidak disimpan ke database' 
        })
      }
    }

    // Single unit creation
    const { type, name, description, address, phone, email, image, facilities, programs, isActive } = body

    if (!type || !name) {
      return NextResponse.json(
        { success: false, message: 'Tipe dan nama unit pendidikan diperlukan' },
        { status: 400 }
      )
    }

    try {
      const created = await db.educationUnit.create({
        data: {
          type,
          name,
          description,
          address,
          phone,
          email,
          image,
          facilities,
          programs,
          isActive,
          order: 0,
        },
      })
      return NextResponse.json({ 
        success: true, 
        data: created,
        message: 'Unit pendidikan berhasil dibuat' 
      })
    } catch (dbError) {
      return NextResponse.json({ 
        success: true, 
        data: body,
        message: 'Mode offline - data tidak disimpan ke database' 
      })
    }
  } catch (error) {
    console.error('Error creating education unit:', error)
    return NextResponse.json(
      { success: false, message: 'Gagal membuat unit pendidikan' },
      { status: 500 }
    )
  }
}
