import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// POST /api/admin/scholarships - Create new scholarship
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const scholarship = await db.scholarship.create({
      data: {
        title: body.title,
        slug: body.slug,
        description: body.description,
        requirements: body.requirements || null,
        benefits: body.benefits || null,
        deadline: body.deadline || null,
        image: body.image || null,
        isActive: body.isActive ?? true,
      },
    })
    
    return NextResponse.json({ success: true, data: scholarship })
  } catch (error) {
    console.error('Error creating scholarship:', error)
    return NextResponse.json(
      { success: false, message: 'Gagal menambahkan beasiswa' },
      { status: 500 }
    )
  }
}
