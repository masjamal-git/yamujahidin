import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Helper function to extract YouTube video ID from URL
function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ]
  
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) {
      return match[1]
    }
  }
  return null
}

// GET /api/admin/videos - Get all videos (including inactive)
export async function GET() {
  try {
    const videos = await db.video.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    })
    
    return NextResponse.json({ success: true, data: videos })
  } catch (error) {
    console.error('Error fetching videos:', error)
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil data video' },
      { status: 500 }
    )
  }
}

// POST /api/admin/videos - Create a new video
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const youtubeId = extractYouTubeId(body.youtubeUrl)
    const thumbnail = youtubeId 
      ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`
      : null
    
    const video = await db.video.create({
      data: {
        title: body.title,
        description: body.description || null,
        youtubeUrl: body.youtubeUrl,
        youtubeId: youtubeId,
        thumbnail: thumbnail,
        category: body.category || 'umum',
        isActive: body.isActive ?? true,
        order: body.order || 0,
      },
    })
    
    return NextResponse.json({ success: true, data: video, message: 'Video berhasil ditambahkan' })
  } catch (error) {
    console.error('Error creating video:', error)
    return NextResponse.json(
      { success: false, message: 'Gagal membuat video' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/videos - Update a video
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    
    if (!body.id) {
      return NextResponse.json(
        { success: false, message: 'ID video diperlukan' },
        { status: 400 }
      )
    }
    
    // Build update data object
    const updateData: Record<string, unknown> = {}
    
    if (body.title !== undefined) updateData.title = body.title
    if (body.description !== undefined) updateData.description = body.description || null
    if (body.youtubeUrl !== undefined) {
      updateData.youtubeUrl = body.youtubeUrl
      const youtubeId = extractYouTubeId(body.youtubeUrl)
      updateData.youtubeId = youtubeId
      updateData.thumbnail = youtubeId 
        ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`
        : null
    }
    if (body.category !== undefined) updateData.category = body.category
    if (body.isActive !== undefined) updateData.isActive = body.isActive
    if (body.order !== undefined) updateData.order = body.order
    
    const video = await db.video.update({
      where: { id: body.id },
      data: updateData,
    })
    
    return NextResponse.json({ success: true, data: video, message: 'Video berhasil diperbarui' })
  } catch (error) {
    console.error('Error updating video:', error)
    return NextResponse.json(
      { success: false, message: 'Gagal mengupdate video' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/videos - Delete a video
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'ID video diperlukan' },
        { status: 400 }
      )
    }
    
    await db.video.delete({
      where: { id },
    })
    
    return NextResponse.json({ success: true, message: 'Video berhasil dihapus' })
  } catch (error) {
    console.error('Error deleting video:', error)
    return NextResponse.json(
      { success: false, message: 'Gagal menghapus video' },
      { status: 500 }
    )
  }
}
