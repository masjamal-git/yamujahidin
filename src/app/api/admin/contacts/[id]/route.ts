import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// PATCH /api/admin/contacts/[id] - Update contact status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    const contact = await db.contact.update({
      where: { id },
      data: {
        status: body.status,
        reply: body.reply || null,
      },
    })
    
    return NextResponse.json({ success: true, data: contact })
  } catch (error) {
    console.error('Error updating contact:', error)
    return NextResponse.json(
      { success: false, message: 'Gagal mengupdate status kontak' },
      { status: 500 }
    )
  }
}
