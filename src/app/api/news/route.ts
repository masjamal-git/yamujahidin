import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/news - Get all news
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    
    const where: Record<string, unknown> = { isPublished: true }
    if (category) where.category = category
    if (featured === 'true') where.isFeatured = true
    
    const news = await db.news.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
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
