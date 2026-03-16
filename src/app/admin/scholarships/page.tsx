'use client'

import { useEffect, useState } from 'react'
import { Plus, Search, Gift, MoreHorizontal, Edit, Trash2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'

interface Scholarship {
  id: string
  title: string
  slug: string
  description: string
  requirements: string | null
  benefits: string | null
  deadline: string | null
  image: string | null
  isActive: boolean
  createdAt: string
}

export default function AdminScholarshipsPage() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingScholarship, setEditingScholarship] = useState<Scholarship | null>(null)
  const [deletingScholarship, setDeletingScholarship] = useState<Scholarship | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    benefits: '',
    deadline: '',
    isActive: true,
  })

  useEffect(() => {
    fetchScholarships()
  }, [])

  const fetchScholarships = async () => {
    try {
      const res = await fetch('/api/scholarship')
      const data = await res.json()
      if (data.success) {
        setScholarships(data.data)
      }
    } catch (error) {
      console.error('Error fetching scholarships:', error)
      toast.error('Gagal mengambil data beasiswa')
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      requirements: '',
      benefits: '',
      deadline: '',
      isActive: true,
    })
    setEditingScholarship(null)
  }

  const handleAdd = async () => {
    if (!formData.title || !formData.description) {
      toast.error('Judul dan deskripsi harus diisi')
      return
    }
    
    setIsSaving(true)
    
    try {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      
      const res = await fetch('/api/admin/scholarships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, slug: slug + '-' + Date.now() }),
      })
      
      const data = await res.json()
      
      if (data.success) {
        toast.success('Beasiswa berhasil ditambahkan')
        setScholarships([data.data, ...scholarships])
        setIsAddDialogOpen(false)
        resetForm()
      } else {
        toast.error(data.message || 'Gagal menambahkan beasiswa')
      }
    } catch {
      toast.error('Terjadi kesalahan')
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = (scholarship: Scholarship) => {
    setEditingScholarship(scholarship)
    setFormData({
      title: scholarship.title,
      description: scholarship.description,
      requirements: scholarship.requirements || '',
      benefits: scholarship.benefits || '',
      deadline: scholarship.deadline || '',
      isActive: scholarship.isActive,
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdate = async () => {
    if (!editingScholarship || !formData.title || !formData.description) {
      toast.error('Judul dan deskripsi harus diisi')
      return
    }
    
    setIsSaving(true)
    
    try {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      
      const res = await fetch('/api/admin/scholarships', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingScholarship.id,
          ...formData,
          slug: slug + '-' + Date.now(),
        }),
      })
      
      const data = await res.json()
      
      if (data.success) {
        toast.success('Beasiswa berhasil diperbarui')
        setScholarships(scholarships.map(s => s.id === editingScholarship.id ? data.data : s))
        setIsEditDialogOpen(false)
        resetForm()
      } else {
        toast.error(data.message || 'Gagal memperbarui beasiswa')
      }
    } catch {
      toast.error('Terjadi kesalahan')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteClick = (scholarship: Scholarship) => {
    setDeletingScholarship(scholarship)
    setIsDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!deletingScholarship) return
    
    setIsSaving(true)
    
    try {
      const res = await fetch(`/api/admin/scholarships?id=${deletingScholarship.id}`, {
        method: 'DELETE',
      })
      
      const data = await res.json()
      
      if (data.success) {
        toast.success('Beasiswa berhasil dihapus')
        setScholarships(scholarships.filter(s => s.id !== deletingScholarship.id))
        setIsDeleteDialogOpen(false)
        setDeletingScholarship(null)
      } else {
        toast.error(data.message || 'Gagal menghapus beasiswa')
      }
    } catch {
      toast.error('Terjadi kesalahan')
    } finally {
      setIsSaving(false)
    }
  }

  const filteredScholarships = scholarships.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Form component to be reused
  const ScholarshipForm = () => (
    <div className="grid gap-4">
      <div className="space-y-2">
        <Label htmlFor="title">Judul *</Label>
        <Input
          id="title"
          placeholder="Nama program beasiswa"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Deskripsi *</Label>
        <Textarea
          id="description"
          placeholder="Deskripsi program beasiswa..."
          rows={3}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="requirements">Persyaratan</Label>
          <Textarea
            id="requirements"
            placeholder="Pisahkan dengan baris baru..."
            rows={4}
            value={formData.requirements}
            onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="benefits">Keuntungan</Label>
          <Textarea
            id="benefits"
            placeholder="Pisahkan dengan baris baru..."
            rows={4}
            value={formData.benefits}
            onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
          />
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="deadline">Deadline</Label>
          <Input
            id="deadline"
            placeholder="31 Desember 2024"
            value={formData.deadline}
            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
          />
        </div>
        <div className="flex items-center justify-between pt-6">
          <div>
            <Label>Status</Label>
            <p className="text-xs text-muted-foreground">Aktifkan beasiswa</p>
          </div>
          <Switch
            checked={formData.isActive}
            onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
          />
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Manajemen Beasiswa</h1>
          <p className="text-muted-foreground">Kelola program beasiswa yayasan</p>
        </div>
        <Button onClick={() => { resetForm(); setIsAddDialogOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Beasiswa
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari beasiswa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Gift className="h-4 w-4" />
              <span>{filteredScholarships.length} beasiswa</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-muted rounded w-3/4"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 bg-muted rounded w-full mb-2"></div>
                    <div className="h-4 bg-muted rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredScholarships.length === 0 ? (
            <div className="text-center py-12">
              <Gift className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground">Tidak ada beasiswa ditemukan</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredScholarships.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                        <CardDescription className="line-clamp-2 mt-1">
                          {item.description}
                        </CardDescription>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(item)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600 focus:text-red-600"
                            onClick={() => handleDeleteClick(item)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      {item.deadline && (
                        <span className="text-xs text-muted-foreground">
                          Deadline: {item.deadline}
                        </span>
                      )}
                      <Badge variant={item.isActive ? 'default' : 'secondary'}>
                        {item.isActive ? 'Aktif' : 'Nonaktif'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={(open) => { setIsAddDialogOpen(open); if (!open) resetForm(); }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Tambah Beasiswa Baru</DialogTitle>
            <DialogDescription>
              Masukkan informasi program beasiswa
            </DialogDescription>
          </DialogHeader>
          <ScholarshipForm />
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsAddDialogOpen(false); resetForm(); }}>
              Batal
            </Button>
            <Button onClick={handleAdd} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : 'Simpan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={(open) => { setIsEditDialogOpen(open); if (!open) resetForm(); }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Beasiswa</DialogTitle>
            <DialogDescription>
              Perbarui informasi program beasiswa
            </DialogDescription>
          </DialogHeader>
          <ScholarshipForm />
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsEditDialogOpen(false); resetForm(); }}>
              Batal
            </Button>
            <Button onClick={handleUpdate} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : 'Simpan Perubahan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Beasiswa</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus beasiswa "{deletingScholarship?.title}"? 
              Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menghapus...
                </>
              ) : 'Hapus'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
