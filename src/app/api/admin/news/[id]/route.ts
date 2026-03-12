import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/admin/news/[id] - Get single news
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const news = await db.news.findUnique({
      where: { id },
    })
    
    if (!news) {
      return NextResponse.json(
        { success: false, message: 'Berita tidak ditemukan' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ success: true, data: news })
  } catch (error) {
    console.error('Error fetching news:', error)
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil data berita' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/news/[id] - Update news
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    const news = await db.news.update({
      where: { id },
      data: {
        title: body.title,
        content: body.content,
        excerpt: body.excerpt || null,
        image: body.image || null,
        category: body.category,
        isPublished: body.isPublished,
        isFeatured: body.isFeatured,
      },
    })
    
    return NextResponse.json({ success: true, data: news })
  } catch (error) {
    console.error('Error updating news:', error)
    return NextResponse.json(
      { success: false, message: 'Gagal mengupdate berita' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/news/[id] - Delete news
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await db.news.delete({
      where: { id },
    })
    
    return NextResponse.json({ success: true, message: 'Berita berhasil dihapus' })
  } catch (error) {
    console.error('Error deleting news:', error)
    return NextResponse.json(
      { success: false, message: 'Gagal menghapus berita' },
      { status: 500 }
    )
  }
}
