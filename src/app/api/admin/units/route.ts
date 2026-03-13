import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/admin/units - Get all education units
export async function GET() {
  try {
    const units = await db.educationUnit.findMany({
      orderBy: { order: 'asc' },
    })
    
    return NextResponse.json({ success: true, data: units })
  } catch (error) {
    console.error('Error fetching education units:', error)
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil data unit pendidikan' },
      { status: 500 }
    )
  }
}

// POST /api/admin/units - Create or update education unit
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Upsert education unit
    const unit = await db.educationUnit.upsert({
      where: { type: body.type },
      update: {
        name: body.name,
        description: body.description,
        address: body.address,
        phone: body.phone,
        email: body.email,
        image: body.image,
        facilities: body.facilities,
        programs: body.programs,
      },
      create: {
        name: body.name,
        type: body.type,
        description: body.description,
        address: body.address,
        phone: body.phone,
        email: body.email,
        image: body.image,
        facilities: body.facilities,
        programs: body.programs,
      },
    })
    
    return NextResponse.json({ success: true, data: unit })
  } catch (error) {
    console.error('Error saving education unit:', error)
    return NextResponse.json(
      { success: false, message: 'Gagal menyimpan data unit pendidikan' },
      { status: 500 }
    )
  }
}
