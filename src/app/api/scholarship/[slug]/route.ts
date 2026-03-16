import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/scholarship/[slug] - Get a single scholarship by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    
    const scholarship = await db.scholarship.findUnique({
      where: { slug, isActive: true },
    })
    
    if (!scholarship) {
      return NextResponse.json(
        { success: false, message: 'Beasiswa tidak ditemukan' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ success: true, data: scholarship })
  } catch (error) {
    console.error('Error fetching scholarship:', error)
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil data beasiswa' },
      { status: 500 }
    )
  }
}

