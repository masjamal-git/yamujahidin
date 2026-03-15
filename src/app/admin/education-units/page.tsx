'use client'

import { useEffect, useState } from 'react'
import { Loader2, Building, Save, Image as ImageIcon, Plus, X, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

interface EducationUnit {
  id: string
  name: string
  type: string
  description: string | null
  address: string | null
  phone: string | null
  email: string | null
  image: string | null
  facilities: string | null
  programs: string | null
  isActive: boolean
}

const unitTypes = [
  { value: 'ponpes', label: 'Pondok Pesantren' },
  { value: 'mi', label: 'Madrasah Ibtidaiyah (MI)' },
  { value: 'mts', label: 'Madrasah Tsanawiyah (MTs)' },
  { value: 'ma', label: 'Madrasah Aliyah (MA)' },
]

const defaultUnits: EducationUnit[] = [
  {
    id: '1',
    name: 'Pondok Pesantren Al Mujahidin',
    type: 'ponpes',
    description: 'Pondok Pesantren Al Mujahidin merupakan wadah pendidikan Islam intensif dengan sistem asrama. Santri dididik secara komprehensif dalam bidang ilmu agama, akhlak, dan kemandirian.',
    address: 'Jl. Pendidikan No. 1, Samarinda, Kalimantan Timur',
    phone: '(0541) 123456',
    email: 'ponpes@yalmuja.sch.id',
    image: null,
    facilities: '["Masjid", "Asrama Putra", "Asrama Putri", "Ruang Kelas", "Perpustakaan", "Lapangan Olahraga"]',
    programs: '["Tahfidz Al-Quran", "Kajian Kitab Kuning", "Bahasa Arab", "Bahasa Inggris"]',
    isActive: true,
  },
  {
    id: '2',
    name: 'Madrasah Ibtidaiyah (MI)',
    type: 'mi',
    description: 'MI Al Mujahidin menyelenggarakan pendidikan dasar dengan kurikulum terpadu yang mengintegrasikan kurikulum nasional dan kurikulum pesantren.',
    address: 'Jl. Pendidikan No. 1, Samarinda, Kalimantan Timur',
    phone: '(0541) 123456',
    email: 'mi@yalmuja.sch.id',
    image: null,
    facilities: '["Ruang Kelas Ber-AC", "Perpustakaan", "Laboratorium Komputer", "Lapangan Bermain"]',
    programs: '["Kurikulum Nasional", "Tahfidz Al-Quran", "Bahasa Arab", "Praktek Ibadah"]',
    isActive: true,
  },
  {
    id: '3',
    name: 'Madrasah Tsanawiyah (MTs)',
    type: 'mts',
    description: 'MTs Al Mujahidin menawarkan pendidikan menengah pertama dengan penguatan karakter Islami dan peningkatan kompetensi akademik.',
    address: 'Jl. Pendidikan No. 1, Samarinda, Kalimantan Timur',
    phone: '(0541) 123456',
    email: 'mts@yalmuja.sch.id',
    image: null,
    facilities: '["Ruang Kelas Ber-AC", "Laboratorium IPA", "Laboratorium Komputer", "Perpustakaan"]',
    programs: '["Kurikulum Nasional", "Tahfidz Al-Quran", "Bahasa Arab & Inggris", "IPA & IPS"]',
    isActive: true,
  },
  {
    id: '4',
    name: 'Madrasah Aliyah (MA)',
    type: 'ma',
    description: 'MA Al Mujahidin menyiapkan lulusan yang siap melanjutkan ke perguruan tinggi dengan bekal ilmu agama dan ilmu umum.',
    address: 'Jl. Pendidikan No. 1, Samarinda, Kalimantan Timur',
    phone: '(0541) 123456',
    email: 'ma@yalmuja.sch.id',
    image: null,
    facilities: '["Ruang Kelas Ber-AC", "Laboratorium IPA", "Laboratorium Bahasa", "Aula Serbaguna"]',
    programs: '["Jurusan IPA", "Jurusan IPS", "Jurusan Keagamaan", "Persiapan PTN"]',
    isActive: true,
  },
]

export default function AdminEducationUnitsPage() {
  const [units, setUnits] = useState<EducationUnit[]>([])
  const [activeUnit, setActiveUnit] = useState<EducationUnit | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [facilities, setFacilities] = useState<string[]>([])
  const [programs, setPrograms] = useState<string[]>([])
  const [newFacility, setNewFacility] = useState('')
  const [newProgram, setNewProgram] = useState('')
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  useEffect(() => {
    fetchUnits()
  }, [])

  const fetchUnits = async () => {
    try {
      const res = await fetch('/api/admin/education-units')
      const data = await res.json()
      if (data.success && data.data && data.data.length > 0) {
        setUnits(data.data)
        setActiveUnit(data.data[0])
        parseJsonFields(data.data[0])
      } else {
        // Use default data if no database data
        setUnits(defaultUnits)
        setActiveUnit(defaultUnits[0])
        parseJsonFields(defaultUnits[0])
      }
    } catch (error) {
      console.error('Error fetching units:', error)
      // Use default data on error
      setUnits(defaultUnits)
      setActiveUnit(defaultUnits[0])
      parseJsonFields(defaultUnits[0])
    } finally {
      setIsLoading(false)
    }
  }

  const parseJsonFields = (unit: EducationUnit) => {
    try {
      setFacilities(unit.facilities ? JSON.parse(unit.facilities) : [])
    } catch {
      setFacilities([])
    }
    try {
      setPrograms(unit.programs ? JSON.parse(unit.programs) : [])
    } catch {
      setPrograms([])
    }
    setImagePreview(unit.image)
  }

  const handleUnitChange = (type: string) => {
    const unit = units.find(u => u.type === type)
    if (unit) {
      setActiveUnit(unit)
      parseJsonFields(unit)
    }
  }

  const handleInputChange = (field: keyof EducationUnit, value: string | boolean) => {
    if (activeUnit) {
      setActiveUnit({ ...activeUnit, [field]: value })
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Ukuran file maksimal 5MB')
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = reader.result as string
        setImagePreview(base64)
        if (activeUnit) {
          setActiveUnit({ ...activeUnit, image: base64 })
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const addFacility = () => {
    if (newFacility.trim()) {
      setFacilities([...facilities, newFacility.trim()])
      setNewFacility('')
    }
  }

  const removeFacility = (index: number) => {
    setFacilities(facilities.filter((_, i) => i !== index))
  }

  const addProgram = () => {
    if (newProgram.trim()) {
      setPrograms([...programs, newProgram.trim()])
      setNewProgram('')
    }
  }

  const removeProgram = (index: number) => {
    setPrograms(programs.filter((_, i) => i !== index))
  }

  const handleSave = async () => {
    if (!activeUnit) return
    
    setIsSaving(true)
    try {
      const updatedUnit = {
        ...activeUnit,
        facilities: JSON.stringify(facilities),
        programs: JSON.stringify(programs),
      }

      const res = await fetch('/api/admin/education-units', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUnit),
      })

      const data = await res.json()
      if (data.success) {
        // Update local state
        setUnits(units.map(u => u.type === activeUnit.type ? updatedUnit : u))
        setActiveUnit(updatedUnit)
        toast.success('Data unit pendidikan berhasil disimpan')
      } else {
        toast.error(data.message || 'Gagal menyimpan data')
      }
    } catch (error) {
      console.error('Error saving unit:', error)
      toast.error('Gagal menyimpan data unit pendidikan')
    } finally {
      setIsSaving(false)
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
          <h1 className="text-2xl font-bold">Unit Pendidikan</h1>
          <p className="text-muted-foreground">Kelola informasi unit pendidikan yayasan</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Menyimpan...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Simpan Perubahan
            </>
          )}
        </Button>
      </div>

      <Tabs value={activeUnit?.type || 'ponpes'} onValueChange={handleUnitChange}>
        <TabsList className="grid w-full grid-cols-4">
          {unitTypes.map(type => (
            <TabsTrigger key={type.value} value={type.value}>
              {type.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {activeUnit && unitTypes.map(type => (
          <TabsContent key={type.value} value={type.value}>
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Main Info */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="h-5 w-5" />
                      Informasi Umum
                    </CardTitle>
                    <CardDescription>
                      Informasi dasar unit pendidikan
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nama Unit</Label>
                      <Input
                        id="name"
                        value={activeUnit.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Deskripsi</Label>
                      <Textarea
                        id="description"
                        rows={4}
                        value={activeUnit.description || ''}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Alamat</Label>
                      <Textarea
                        id="address"
                        rows={2}
                        value={activeUnit.address || ''}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Telepon</Label>
                        <Input
                          id="phone"
                          value={activeUnit.phone || ''}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={activeUnit.email || ''}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Image */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ImageIcon className="h-5 w-5" />
                      Gambar
                    </CardTitle>
                    <CardDescription>
                      Upload gambar unit pendidikan (maks. 5MB)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {imagePreview && (
                        <div className="relative aspect-video rounded-lg overflow-hidden border">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => {
                              setImagePreview(null)
                              if (activeUnit) {
                                setActiveUnit({ ...activeUnit, image: null })
                              }
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Programs */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5" />
                      Program Unggulan
                    </CardTitle>
                    <CardDescription>
                      Daftar program yang ditawarkan
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {programs.map((prog, i) => (
                          <Badge key={i} variant="secondary" className="px-3 py-1">
                            {prog}
                            <button
                              onClick={() => removeProgram(i)}
                              className="ml-2 hover:text-destructive"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Tambah program baru..."
                          value={newProgram}
                          onChange={(e) => setNewProgram(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addProgram()}
                        />
                        <Button type="button" variant="outline" onClick={addProgram}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Facilities */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="h-5 w-5" />
                      Fasilitas
                    </CardTitle>
                    <CardDescription>
                      Daftar fasilitas yang tersedia
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {facilities.map((facility, i) => (
                          <Badge key={i} variant="secondary" className="px-3 py-1">
                            {facility}
                            <button
                              onClick={() => removeFacility(i)}
                              className="ml-2 hover:text-destructive"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Tambah fasilitas baru..."
                          value={newFacility}
                          onChange={(e) => setNewFacility(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addFacility()}
                        />
                        <Button type="button" variant="outline" onClick={addFacility}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Preview</CardTitle>
                    <CardDescription>
                      Tampilan singkat di halaman depan
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="border rounded-lg overflow-hidden">
                      {imagePreview ? (
                        <div className="aspect-video relative">
                          <img
                            src={imagePreview}
                            alt={activeUnit.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="aspect-video bg-muted flex items-center justify-center">
                          <Building className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="font-semibold">{activeUnit.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {activeUnit.description || 'Tidak ada deskripsi'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Badge variant={activeUnit.isActive ? 'default' : 'secondary'}>
                        {activeUnit.isActive ? 'Aktif' : 'Nonaktif'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
