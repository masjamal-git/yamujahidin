import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/admin/donations - Get donation settings
export async function GET() {
  try {
    // Get all donation settings
    const settings = await db.setting.findMany({
      where: { group: 'donation' },
    })

    // Convert to object
    const donationSettings: Record<string, string> = {}
    settings.forEach((s) => {
      donationSettings[s.key] = s.value
    })

    // Parse JSON fields
    const bankAccounts = donationSettings.bankAccounts 
      ? JSON.parse(donationSettings.bankAccounts) 
      : []
    
    const stats = donationSettings.donationStats 
      ? JSON.parse(donationSettings.donationStats)
      : [
          { label: 'Santri Terbantu', value: '500+', description: 'Santri kurang mampu yang mendapat beasiswa' },
          { label: 'Gedung Dibangun', value: '10+', description: 'Fasilitas pendidikan yang dibangun' },
          { label: 'Alumni Berprestasi', value: '1000+', description: 'Alumni yang sukses di berbagai bidang' },
        ]

    return NextResponse.json({
      success: true,
      data: {
        heroTitle: donationSettings.heroTitle || 'Berdonasi untuk Pendidikan Islam',
        heroDescription: donationSettings.heroDescription || 'Jadilah bagian dari misi kami dalam mencerdaskan kehidupan bangsa melalui pendidikan Islam yang berkualitas.',
        heroImage: donationSettings.heroImage || '',
        bankAccounts,
        qrisImage: donationSettings.qrisImage || '',
        whatsappNumber: donationSettings.whatsappNumber || '6281234567890',
        donationEmail: donationSettings.donationEmail || 'donasi@yalmuja.sch.id',
        stats,
      },
    })
  } catch (error) {
    console.error('Error fetching donation settings:', error)
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil pengaturan donasi' },
      { status: 500 }
    )
  }
}

// POST /api/admin/donations - Update donation settings
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const settingsToUpdate = [
      { key: 'heroTitle', value: body.heroTitle || '', group: 'donation', type: 'text' },
      { key: 'heroDescription', value: body.heroDescription || '', group: 'donation', type: 'textarea' },
      { key: 'heroImage', value: body.heroImage || '', group: 'donation', type: 'image' },
      { key: 'bankAccounts', value: JSON.stringify(body.bankAccounts || []), group: 'donation', type: 'json' },
      { key: 'qrisImage', value: body.qrisImage || '', group: 'donation', type: 'image' },
      { key: 'whatsappNumber', value: body.whatsappNumber || '', group: 'donation', type: 'text' },
      { key: 'donationEmail', value: body.donationEmail || '', group: 'donation', type: 'text' },
      { key: 'donationStats', value: JSON.stringify(body.stats || []), group: 'donation', type: 'json' },
    ]

    for (const setting of settingsToUpdate) {
      await db.setting.upsert({
        where: { key: setting.key },
        update: { value: setting.value, type: setting.type, group: setting.group },
        create: setting,
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Pengaturan donasi berhasil disimpan',
    })
  } catch (error) {
    console.error('Error saving donation settings:', error)
    return NextResponse.json(
      { success: false, message: 'Gagal menyimpan pengaturan donasi' },
      { status: 500 }
    )
  }
}
