import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// PATCH /api/admin/students/[id] - Update student status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    const student = await db.student.update({
      where: { id },
      data: {
        status: body.status,
      },
    })
    
    return NextResponse.json({ success: true, data: student })
  } catch (error) {
    console.error('Error updating student:', error)
    return NextResponse.json(
      { success: false, message: 'Gagal mengupdate status siswa' },
      { status: 500 }
    )
  }
}
