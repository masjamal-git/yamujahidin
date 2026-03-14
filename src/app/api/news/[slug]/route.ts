import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/news/[slug] - Get single news by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    
    if (!slug) {
      return NextResponse.json(
        { success: false, message: 'Slug berita tidak valid' },
        { status: 400 }
      )
    }

    const news = await db.news.findUnique({
      where: { slug: slug },
    })

    if (!news) {
      return NextResponse.json(
        { success: false, message: 'Berita tidak ditemukan' },
        { status: 404 }
      )
    }

    // Increment view count (non-blocking)
    db.news.update({
      where: { slug: slug },
      data: { viewCount: { increment: 1 } },
    }).catch(err => console.error('Error updating view count:', err))

    return NextResponse.json({ success: true, data: news })
  } catch (error) {
    console.error('Error fetching news:', error)
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil data berita', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
