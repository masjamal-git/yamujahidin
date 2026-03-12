import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// POST /api/admin/settings - Update a setting
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const setting = await db.setting.upsert({
      where: { key: body.key },
      update: { value: body.value },
      create: {
        key: body.key,
        value: body.value,
        type: body.type || 'text',
        group: body.group || 'general',
      },
    })
    
    return NextResponse.json({ success: true, data: setting })
  } catch (error) {
    console.error('Error updating setting:', error)
    return NextResponse.json(
      { success: false, message: 'Gagal menyimpan pengaturan' },
      { status: 500 }
    )
  }
}
