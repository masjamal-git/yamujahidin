import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const [newsCount, galleryCount, studentCount, contactCount] = await Promise.all([
      db.news.count(),
      db.gallery.count(),
      db.student.count(),
      db.contact.count(),
    ])
    
    return NextResponse.json({
      success: true,
      data: {
        newsCount,
        galleryCount,
        studentCount,
        contactCount,
      }
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil statistik' },
      { status: 500 }
    )
  }
}
