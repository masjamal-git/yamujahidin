'use client'

import { useEffect, useState, useRef } from 'react'
import { Plus, Search, Trash2, Image as ImageIcon, MoreHorizontal, Upload, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

interface GalleryItem {
  id: string
  title: string
  description: string | null
  image: string | null
  category: string
  createdAt: string
}

export default function AdminGalleryPage() {
  const [gallery, setGallery] = useState<GalleryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [newGallery, setNewGallery] = useState({
    title: '',
    description: '',
    image: '',
    category: 'umum',
  })

  useEffect(() => {
    fetchGallery()
  }, [])

  const fetchGallery = async () => {
    try {
      const res = await fetch('/api/admin/gallery')
      const data = await res.json()
      if (data.success) {
        setGallery(data.data)
      }
    } catch (error) {
      console.error('Error fetching gallery:', error)
      toast.error('Gagal mengambil data galeri')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      toast.error('Tipe file tidak didukung. Gunakan JPG, PNG, GIF, atau WebP')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ukuran file terlalu besar. Maksimal 5MB')
      return
    }

    setIsUploading(true)

    try {
      // Convert to base64 directly
      const reader = new FileReader()
      reader.onload = (event) => {
        const base64 = event.target?.result as string
        setImagePreview(base64)
        setNewGallery({ ...newGallery, image: base64 })
        setIsUploading(false)
      }
      reader.onerror = () => {
        toast.error('Gagal membaca file')
        setIsUploading(false)
      }
      reader.readAsDataURL(file)
    } catch {
      toast.error('Gagal memproses gambar')
      setIsUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setImagePreview(null)
    setNewGallery({ ...newGallery, image: '' })
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    
    try {
      const res = await fetch(`/api/admin/gallery/${deleteId}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      
      if (data.success) {
        toast.success('Gambar berhasil dihapus')
        setGallery(gallery.filter(g => g.id !== deleteId))
      } else {
        toast.error('Gagal menghapus gambar')
      }
    } catch {
      toast.error('Terjadi kesalahan')
    } finally {
      setDeleteId(null)
    }
  }

  const handleAdd = async () => {
    if (!newGallery.title) {
      toast.error('Judul harus diisi')
      return
    }

    if (!newGallery.image) {
      toast.error('Gambar harus diupload')
      return
    }
    
    try {
      const res = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newGallery),
      })
      
      const data = await res.json()
      
      if (data.success) {
        toast.success('Gambar berhasil ditambahkan')
        setGallery([data.data, ...gallery])
        setIsAddDialogOpen(false)
        setNewGallery({ title: '', description: '', image: '', category: 'umum' })
        setImagePreview(null)
      } else {
        toast.error('Gagal menambahkan gambar')
      }
    } catch {
      toast.error('Terjadi kesalahan')
    }
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      fasilitas: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200',
      kegiatan: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200',
      prestasi: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200',
      umum: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200',
    }
    return colors[category] || colors.umum
  }

  const filteredGallery = gallery.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Manajemen Galeri</h1>
          <p className="text-muted-foreground">Kelola foto dan dokumentasi kegiatan</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Gambar
        </Button>
      </div>

      <Card className="border-0 shadow-none">
        <CardContent className="p-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari gambar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ImageIcon className="h-4 w-4" />
              <span>{filteredGallery.length} gambar</span>
            </div>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-video bg-muted rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : filteredGallery.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground">Tidak ada gambar ditemukan</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setIsAddDialogOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Tambah Gambar Pertama
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredGallery.map((item) => (
                <Card key={item.id} className="overflow-hidden group">
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/10 relative">
                    {item.image ? (
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <ImageIcon className="h-8 w-8 text-primary/30" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="secondary" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem 
                            onClick={() => setDeleteId(item.id)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <CardContent className="p-3">
                    <p className="text-sm font-medium line-clamp-1">{item.title}</p>
                    <Badge className={getCategoryColor(item.category) + ' mt-2'}>
                      {item.category}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Gambar?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Gambar akan dihapus secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
        setIsAddDialogOpen(open)
        if (!open) {
          setImagePreview(null)
          setNewGallery({ title: '', description: '', image: '', category: 'umum' })
        }
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Tambah Gambar Baru</DialogTitle>
            <DialogDescription>
              Upload gambar dan isi informasi yang diperlukan
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* Image Upload Area */}
            <div className="space-y-2">
              <Label>Gambar *</Label>
              {!imagePreview ? (
                <div 
                  className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {isUploading ? (
                    <div className="flex flex-col items-center">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Memproses...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Klik untuk upload gambar
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        JPG, PNG, GIF, WebP (max 5MB)
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8"
                    onClick={handleRemoveImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                className="hidden"
                onChange={handleFileSelect}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Judul *</Label>
              <Input
                id="title"
                placeholder="Judul gambar"
                value={newGallery.title}
                onChange={(e) => setNewGallery({ ...newGallery, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                placeholder="Deskripsi singkat..."
                value={newGallery.description}
                onChange={(e) => setNewGallery({ ...newGallery, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Kategori</Label>
              <Select
                value={newGallery.category}
                onValueChange={(value) => setNewGallery({ ...newGallery, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="umum">Umum</SelectItem>
                  <SelectItem value="kegiatan">Kegiatan</SelectItem>
                  <SelectItem value="fasilitas">Fasilitas</SelectItem>
                  <SelectItem value="prestasi">Prestasi</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsAddDialogOpen(false)
              setImagePreview(null)
              setNewGallery({ title: '', description: '', image: '', category: 'umum' })
            }}>
              Batal
            </Button>
            <Button onClick={handleAdd} disabled={!newGallery.image || !newGallery.title}>
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
