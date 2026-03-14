'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Loader2, Upload, X, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'

export default function AddNewsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    image: '',
    category: 'umum',
    isPublished: true,
    isFeatured: false,
  })

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('File harus berupa gambar')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 5MB')
      return
    }

    setIsUploading(true)

    try {
      const formDataUpload = new FormData()
      formDataUpload.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      })

      const data = await res.json()

      if (data.success && data.url) {
        setFormData({ ...formData, image: data.url })
        toast.success('Gambar berhasil diupload')
      } else {
        toast.error('Gagal mengupload gambar')
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error('Terjadi kesalahan saat upload')
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setFormData({ ...formData, image: '' })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.content) {
      toast.error('Judul dan konten harus diisi')
      return
    }
    
    setIsLoading(true)
    
    try {
      const res = await fetch('/api/admin/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      
      const data = await res.json()
      
      if (data.success) {
        toast.success('Berita berhasil ditambahkan')
        router.push('/admin/news')
      } else {
        toast.error(data.message || 'Gagal menambahkan berita')
      }
    } catch (error) {
      console.error('Error creating news:', error)
      toast.error('Terjadi kesalahan')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Tambah Berita</h1>
          <p className="text-muted-foreground">Buat artikel berita baru</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Konten Berita</CardTitle>
                <CardDescription>Isi judul dan konten berita</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Judul *</Label>
                  <Input
                    id="title"
                    placeholder="Masukkan judul berita"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="excerpt">Ringkasan</Label>
                  <Textarea
                    id="excerpt"
                    placeholder="Ringkasan singkat berita..."
                    rows={3}
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Konten *</Label>
                  <Textarea
                    id="content"
                    placeholder="Tulis konten berita..."
                    rows={15}
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  />
                </div>
                
                {/* Image Upload Section */}
                <div className="space-y-2">
                  <Label>Gambar Berita</Label>
                  <div className="space-y-4">
                    {formData.image ? (
                      <div className="relative inline-block">
                        <img
                          src={formData.image}
                          alt="Preview"
                          className="max-h-64 rounded-lg border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2"
                          onClick={handleRemoveImage}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed rounded-lg p-8 text-center">
                        <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-sm text-muted-foreground mb-4">
                          Upload gambar untuk berita
                        </p>
                        <label htmlFor="image-upload">
                          <input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                            disabled={isUploading}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            disabled={isUploading}
                            asChild
                          >
                            <span className="cursor-pointer">
                              {isUploading ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Uploading...
                                </>
                              ) : (
                                <>
                                  <Upload className="mr-2 h-4 w-4" />
                                  Pilih Gambar
                                </>
                              )}
                            </span>
                          </Button>
                        </label>
                        <p className="text-xs text-muted-foreground mt-2">
                          Format: JPG, PNG, GIF. Maks 5MB
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pengaturan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
                      <SelectItem value="umum">Umum</SelectItem>
                      <SelectItem value="pengumuman">Pengumuman</SelectItem>
                      <SelectItem value="kegiatan">Kegiatan</SelectItem>
                      <SelectItem value="pendidikan">Pendidikan</SelectItem>
                      <SelectItem value="prestasi">Prestasi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Publikasi</Label>
                    <p className="text-xs text-muted-foreground">Tampilkan di website</p>
                  </div>
                  <Switch
                    checked={formData.isPublished}
                    onCheckedChange={(checked) => setFormData({ ...formData, isPublished: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Featured</Label>
                    <p className="text-xs text-muted-foreground">Tampilkan di halaman utama</p>
                  </div>
                  <Switch
                    checked={formData.isFeatured}
                    onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Simpan Berita
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
