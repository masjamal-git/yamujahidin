import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    
    const news = await db.news.findUnique({
      where: { slug: slug },
    })

    if (!news) {
      return NextResponse.json(
        { success: false, message: 'Berita tidak ditemukan' },
        { status: 404 }
      )
    }

    await db.news.update({
      where: { slug: slug },
      data: { viewCount: { increment: 1 } },
    })

    return NextResponse.json({ success: true, data: news })
  } catch (error) {
    console.error('Error fetching news:', error)
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil data berita' },
      { status: 500 }
    )
  }
}
