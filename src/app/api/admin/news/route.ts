import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/admin/news - Get all news for admin
export async function GET() {
  try {
    const news = await db.news.findMany({
      orderBy: { createdAt: 'desc' },
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

// POST /api/admin/news - Create new news
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Generate slug from title
    const slug = body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    
    const news = await db.news.create({
      data: {
        title: body.title,
        slug: slug + '-' + Date.now(),
        content: body.content,
        excerpt: body.excerpt || null,
        image: body.image || null,
        category: body.category || 'umum',
        isPublished: body.isPublished ?? true,
        isFeatured: body.isFeatured ?? false,
        authorId: body.authorId || null,
      },
    })
    
    return NextResponse.json({ success: true, data: news })
  } catch (error) {
    console.error('Error creating news:', error)
    return NextResponse.json(
      { success: false, message: 'Gagal membuat berita' },
      { status: 500 }
    )
  }
}
