import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/donation - Get all donations
export async function GET(request: NextRequest) {
  try {
    const donations = await db.donation.findMany({
      orderBy: { createdAt: 'desc' },
    })
    
    return NextResponse.json({ success: true, data: donations })
  } catch (error) {
    console.error('Error fetching donations:', error)
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil data donasi' },
      { status: 500 }
    )
  }
}

// POST /api/donation - Submit donation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const donation = await db.donation.create({
      data: {
        name: body.name,
        email: body.email || null,
        phone: body.phone || null,
        amount: parseFloat(body.amount),
        message: body.message || null,
        paymentMethod: body.paymentMethod || null,
        status: 'pending',
      },
    })
    
    return NextResponse.json({ 
      success: true, 
      message: 'Terima kasih atas donasi Anda',
      data: donation 
    })
  } catch (error) {
    console.error('Error creating donation:', error)
    return NextResponse.json(
      { success: false, message: 'Gagal menyimpan data donasi' },
      { status: 500 }
    )
  }
}
