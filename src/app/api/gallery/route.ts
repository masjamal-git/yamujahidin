import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/gallery - Get all gallery items
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const category = searchParams.get('category')
    
    const where: Record<string, unknown> = { isActive: true }
    if (category) where.category = category
    
    const gallery = await db.gallery.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
    })
    
    return NextResponse.json({ success: true, data: gallery })
  } catch (error) {
    console.error('Error fetching gallery:', error)
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil data galeri' },
      { status: 500 }
    )
  }
}
