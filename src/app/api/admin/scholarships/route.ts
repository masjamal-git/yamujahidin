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

// PUT /api/admin/scholarships - Update scholarship
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    
    if (!body.id) {
      return NextResponse.json(
        { success: false, message: 'ID beasiswa diperlukan' },
        { status: 400 }
      )
    }
    
    const scholarship = await db.scholarship.update({
      where: { id: body.id },
      data: {
        title: body.title,
        slug: body.slug,
        description: body.description,
        requirements: body.requirements || null,
        benefits: body.benefits || null,
        deadline: body.deadline || null,
        image: body.image || null,
        isActive: body.isActive,
      },
    })
    
    return NextResponse.json({ success: true, data: scholarship })
  } catch (error) {
    console.error('Error updating scholarship:', error)
    return NextResponse.json(
      { success: false, message: 'Gagal memperbarui beasiswa' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/scholarships - Delete scholarship
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'ID beasiswa diperlukan' },
        { status: 400 }
      )
    }
    
    await db.scholarship.delete({
      where: { id },
    })
    
    return NextResponse.json({ success: true, message: 'Beasiswa berhasil dihapus' })
  } catch (error) {
    console.error('Error deleting scholarship:', error)
    return NextResponse.json(
      { success: false, message: 'Gagal menghapus beasiswa' },
      { status: 500 }
    )
  }
}
