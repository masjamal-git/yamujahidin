import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { nanoid } from 'nanoid'

// GET /api/ppdb - Get all students
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const unitType = searchParams.get('unitType')
    
    const where: Record<string, unknown> = {}
    if (status) where.status = status
    if (unitType) where.unitType = unitType
    
    const students = await db.student.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })
    
    return NextResponse.json({ success: true, data: students })
  } catch (error) {
    console.error('Error fetching students:', error)
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil data siswa' },
      { status: 500 }
    )
  }
}

// POST /api/ppdb - Register new student
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Generate registration ID
    const registrationId = `PPDB-${new Date().getFullYear()}-${nanoid(8).toUpperCase()}`
    
    const student = await db.student.create({
      data: {
        registrationId,
        name: body.name,
        nisn: body.nisn || null,
        nik: body.nik || null,
        placeOfBirth: body.placeOfBirth || null,
        dateOfBirth: body.dateOfBirth || null,
        gender: body.gender || null,
        religion: body.religion || 'Islam',
        address: body.address || null,
        phone: body.phone || null,
        email: body.email || null,
        fatherName: body.fatherName || null,
        fatherJob: body.fatherJob || null,
        fatherPhone: body.fatherPhone || null,
        motherName: body.motherName || null,
        motherJob: body.motherJob || null,
        motherPhone: body.motherPhone || null,
        guardianName: body.guardianName || null,
        guardianJob: body.guardianJob || null,
        guardianPhone: body.guardianPhone || null,
        schoolOrigin: body.schoolOrigin || null,
        schoolAddress: body.schoolAddress || null,
        graduationYear: body.graduationYear || null,
        unitType: body.unitType,
        notes: body.notes || null,
        status: 'pending',
      },
    })
    
    return NextResponse.json({ 
      success: true, 
      message: 'Pendaftaran berhasil',
      data: student 
    })
  } catch (error) {
    console.error('Error creating student:', error)
    return NextResponse.json(
      { success: false, message: 'Gagal menyimpan data pendaftaran' },
      { status: 500 }
    )
  }
}
