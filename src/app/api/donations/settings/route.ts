import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/donations/settings - Get public donation settings
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

    // Parse JSON fields with defaults
    const bankAccounts = donationSettings.bankAccounts 
      ? JSON.parse(donationSettings.bankAccounts) 
      : [
          {
            bank: 'Bank Syariah Indonesia (BSI)',
            accountNumber: '7123456789',
            accountName: 'Yayasan Al Mujahidin Kaltim',
          },
          {
            bank: 'Bank Muamalat',
            accountNumber: '8123456789',
            accountName: 'Yayasan Al Mujahidin Kaltim',
          },
          {
            bank: 'Bank BRI',
            accountNumber: '0123456789',
            accountName: 'Yayasan Al Mujahidin Kaltim',
          },
        ]
    
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
        heroDescription: donationSettings.heroDescription || 'Jadilah bagian dari misi kami dalam mencerdaskan kehidupan bangsa melalui pendidikan Islam yang berkualitas. Setiap donasi Anda adalah investasi akhirat yang tak ternilai.',
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

