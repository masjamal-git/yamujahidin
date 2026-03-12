import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/settings - Get all settings
export async function GET(request: NextRequest) {
  try {
    const settings = await db.setting.findMany()
    const result: Record<string, string> = {}
    for (const setting of settings) {
      result[setting.key] = setting.value
    }
    
    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil pengaturan' },
      { status: 500 }
    )
  }
}
