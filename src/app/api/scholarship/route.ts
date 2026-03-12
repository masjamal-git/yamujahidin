import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/scholarship - Get all scholarships
export async function GET(request: NextRequest) {
  try {
    const scholarships = await db.scholarship.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    })
    
    return NextResponse.json({ success: true, data: scholarships })
  } catch (error) {
    console.error('Error fetching scholarships:', error)
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil data beasiswa' },
      { status: 500 }
    )
  }
}
