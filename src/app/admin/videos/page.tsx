'use client'

import { useEffect, useState } from 'react'
import { Loader2, Video, Plus, Save, Trash2, Eye, EyeOff, GripVertical, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'

interface VideoItem {
  id: string
  title: string
  description: string | null
  youtubeUrl: string
  youtubeId: string | null
  thumbnail: string | null
  category: string
  isActive: boolean
  order: number
  createdAt: string
}

const categories = [
  { value: 'umum', label: 'Umum' },
  { value: 'kegiatan', label: 'Kegiatan' },
  { value: 'prestasi', label: 'Prestasi' },
  { value: 'pendidikan', label: 'Pendidikan' },
]

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<VideoItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  
  // Form state
  const [editingVideo, setEditingVideo] = useState<VideoItem | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    youtubeUrl: '',
    category: 'umum',
    isActive: true,
    order: 0,
  })

  useEffect(() => {
    fetchVideos()
  }, [])

  const fetchVideos = async () => {
    try {
      const res = await fetch('/api/admin/videos')
      const data = await res.json()
      if (data.success) {
        setVideos(data.data)
      }
    } catch (error) {
      console.error('Error fetching videos:', error)
      toast.error('Gagal mengambil data video')
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      youtubeUrl: '',
      category: 'umum',
      isActive: true,
      order: 0,
    })
    setEditingVideo(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.youtubeUrl) {
      toast.error('Judul dan URL YouTube wajib diisi')
      return
    }

    setIsSaving(true)
    
    try {
      if (editingVideo) {
        // Update existing video
        const res = await fetch('/api/admin/videos', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingVideo.id,
            ...formData,
          }),
        })
        const data = await res.json()
        if (data.success) {
          toast.success('Video berhasil diperbarui')
          fetchVideos()
          resetForm()
        } else {
          toast.error(data.message || 'Gagal memperbarui video')
        }
      } else {
        // Create new video
        const res = await fetch('/api/admin/videos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })
        const data = await res.json()
        if (data.success) {
          toast.success('Video berhasil ditambahkan')
          fetchVideos()
          resetForm()
        } else {
          toast.error(data.message || 'Gagal menambahkan video')
        }
      }
    } catch (error) {
      console.error('Error saving video:', error)
      toast.error('Gagal menyimpan video')
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = (video: VideoItem) => {
    setEditingVideo(video)
    setFormData({
      title: video.title,
      description: video.description || '',
      youtubeUrl: video.youtubeUrl,
      category: video.category,
      isActive: video.isActive,
      order: video.order,
    })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus video ini?')) return
    
    try {
      const res = await fetch(`/api/admin/videos?id=${id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Video berhasil dihapus')
        fetchVideos()
        if (editingVideo?.id === id) {
          resetForm()
        }
      } else {
        toast.error(data.message || 'Gagal menghapus video')
      }
    } catch (error) {
      console.error('Error deleting video:', error)
      toast.error('Gagal menghapus video')
    }
  }

  const toggleActive = async (video: VideoItem) => {
    try {
      const res = await fetch('/api/admin/videos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: video.id,
          isActive: !video.isActive,
        }),
      })
      const data = await res.json()
      if (data.success) {
        toast.success(video.isActive ? 'Video dinonaktifkan' : 'Video diaktifkan')
        fetchVideos()
      }
    } catch (error) {
      console.error('Error toggling video:', error)
      toast.error('Gagal mengubah status video')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Video YouTube</h1>
          <p className="text-muted-foreground">Kelola video YouTube yang ditampilkan di website</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5" />
                {editingVideo ? 'Edit Video' : 'Tambah Video'}
              </CardTitle>
              <CardDescription>
                {editingVideo ? 'Perbarui informasi video' : 'Tambahkan video YouTube baru'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Judul Video *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Judul video"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="youtubeUrl">URL YouTube *</Label>
                  <Input
                    id="youtubeUrl"
                    value={formData.youtubeUrl}
                    onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                    placeholder="https://www.youtube.com/watch?v=..."
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Contoh: https://www.youtube.com/watch?v=xxxxx atau https://youtu.be/xxxxx
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Deskripsi</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Deskripsi singkat video"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Kategori</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="order">Urutan</Label>
                    <Input
                      id="order"
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                      min="0"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="isActive" className="cursor-pointer">
                    Tampilkan di website
                  </Label>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        {editingVideo ? 'Perbarui' : 'Simpan'}
                      </>
                    )}
                  </Button>
                  {editingVideo && (
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Batal
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Video List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Daftar Video</CardTitle>
              <CardDescription>
                {videos.length} video terdaftar
              </CardDescription>
            </CardHeader>
            <CardContent>
              {videos.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Video className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Belum ada video. Tambahkan video pertama Anda.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {videos.map((video) => (
                    <div
                      key={video.id}
                      className={`flex gap-4 p-4 border rounded-lg ${
                        !video.isActive ? 'opacity-60 bg-muted/50' : ''
                      }`}
                    >
                      {/* Thumbnail */}
                      <div className="w-32 h-20 flex-shrink-0 rounded overflow-hidden bg-muted">
                        {video.thumbnail ? (
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23ccc"><rect width="24" height="24" fill="%23f0f0f0"/><text x="12" y="14" text-anchor="middle" fill="%23999" font-size="4">No Image</text></svg>'
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Video className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-medium line-clamp-1">{video.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {video.description || 'Tidak ada deskripsi'}
                            </p>
                          </div>
                          <Badge variant={video.isActive ? 'default' : 'secondary'}>
                            {video.isActive ? 'Aktif' : 'Nonaktif'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {categories.find(c => c.value === video.category)?.label || video.category}
                          </Badge>
                          <a
                            href={video.youtubeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline flex items-center gap-1"
                          >
                            <ExternalLink className="h-3 w-3" />
                            Lihat di YouTube
                          </a>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleActive(video)}
                          title={video.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                        >
                          {video.isActive ? (
                            <Eye className="h-4 w-4" />
                          ) : (
                            <EyeOff className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(video)}
                        >
                          <Video className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(video.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
