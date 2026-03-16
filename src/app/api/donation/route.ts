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
    
    // Validate required fields
    if (!body.name || typeof body.name !== 'string' || body.name.trim() === '') {
      return NextResponse.json(
        { success: false, message: 'Nama lengkap wajib diisi' },
        { status: 400 }
      )
    }

    // Validate amount
    const amount = parseFloat(body.amount)
    if (isNaN(amount) || amount < 10000) {
      return NextResponse.json(
        { success: false, message: 'Nominal donasi minimal Rp 10.000' },
        { status: 400 }
      )
    }
    
    const donation = await db.donation.create({
      data: {
        name: body.name.trim(),
        email: body.email?.trim() || null,
        phone: body.phone?.trim() || null,
        amount: amount,
        message: body.message?.trim() || null,
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
    
    // Check for specific database errors
    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, message: 'Gagal menyimpan data donasi: ' + error.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { success: false, message: 'Gagal menyimpan data donasi. Silakan coba lagi.' },
      { status: 500 }
    )
  }
}
