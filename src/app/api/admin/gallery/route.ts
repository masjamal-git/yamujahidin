import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/admin/gallery - Get all gallery items
export async function GET() {
  try {
    const gallery = await db.gallery.findMany({
      orderBy: { createdAt: 'desc' },
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

// POST /api/admin/gallery - Create new gallery item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const gallery = await db.gallery.create({
      data: {
        title: body.title,
        description: body.description || null,
        image: body.image || null,
        category: body.category || 'umum',
      },
    })
    
    return NextResponse.json({ success: true, data: gallery })
  } catch (error) {
    console.error('Error creating gallery item:', error)
    return NextResponse.json(
      { success: false, message: 'Gagal menambahkan gambar' },
      { status: 500 }
    )
  }
}
