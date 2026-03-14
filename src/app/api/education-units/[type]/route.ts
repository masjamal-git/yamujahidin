import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

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

    const unit = await db.educationUnit.findUnique({
      where: { type: type },
    })

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
