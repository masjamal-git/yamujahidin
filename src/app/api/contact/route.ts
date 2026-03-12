import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/contact - Get all contacts
export async function GET(request: NextRequest) {
  try {
    const contacts = await db.contact.findMany({
      orderBy: { createdAt: 'desc' },
    })
    
    return NextResponse.json({ success: true, data: contacts })
  } catch (error) {
    console.error('Error fetching contacts:', error)
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil data kontak' },
      { status: 500 }
    )
  }
}

// POST /api/contact - Submit contact form
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const contact = await db.contact.create({
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone || null,
        subject: body.subject,
        message: body.message,
        status: 'unread',
      },
    })
    
    return NextResponse.json({ 
      success: true, 
      message: 'Pesan berhasil dikirim',
      data: contact 
    })
  } catch (error) {
    console.error('Error creating contact:', error)
    return NextResponse.json(
      { success: false, message: 'Gagal mengirim pesan' },
      { status: 500 }
    )
  }
}
