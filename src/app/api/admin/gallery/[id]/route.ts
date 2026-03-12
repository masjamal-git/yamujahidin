import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// DELETE /api/admin/gallery/[id] - Delete gallery item
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await db.gallery.delete({
      where: { id },
    })
    
    return NextResponse.json({ success: true, message: 'Gambar berhasil dihapus' })
  } catch (error) {
    console.error('Error deleting gallery item:', error)
    return NextResponse.json(
      { success: false, message: 'Gagal menghapus gambar' },
      { status: 500 }
    )
  }
}
