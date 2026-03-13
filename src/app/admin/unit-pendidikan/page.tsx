'use client'

import { useEffect, useState, useRef } from 'react'
import { Save, Loader2, Building, Image as ImageIcon, Plus, Trash2, Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'

interface ProgramItem {
  name: string
  image: string
}

interface FacilityItem {
  name: string
  image: string
}

interface EducationUnit {
  id: string
  name: string
  type: string
  description: string | null
  address: string | null
  phone: string | null
  email: string | null
  image: string | null
  facilities: FacilityItem[]
  programs: ProgramItem[]
}

const unitTypes = [
  { value: 'ponpes', label: 'Pondok Pesantren' },
  { value: 'mi', label: 'Madrasah Ibtidaiyah' },
  { value: 'mts', label: 'Madrasah Tsanawiyah' },
  { value: 'ma', label: 'Madrasah Aliyah' },
]

const defaultUnits: Record<string, EducationUnit> = {
  ponpes: {
    id: '',
    name: 'Pondok Pesantren Al Mujahidin',
    type: 'ponpes',
    description: 'Pondok Pesantren Al Mujahidin merupakan wadah pendidikan Islam intensif dengan sistem asrama.',
    address: 'Jl. Pondok Pesantren No. 1, Samarinda, Kalimantan Timur',
    phone: '(0541) 123456',
    email: 'ponpes@yalmuja.sch.id',
    image: '',
    facilities: [
      { name: 'Masjid', image: '' },
      { name: 'Asrama Putra', image: '' },
      { name: 'Asrama Putri', image: '' },
      { name: 'Ruang Kelas', image: '' },
      { name: 'Perpustakaan', image: '' },
      { name: 'Lapangan Olahraga', image: '' },
    ],
    programs: [
      { name: 'Tahfidz Al-Quran', image: '' },
      { name: 'Kajian Kitab Kuning', image: '' },
      { name: 'Bahasa Arab', image: '' },
      { name: 'Bahasa Inggris', image: '' },
    ],
  },
  mi: {
    id: '',
    name: 'Madrasah Ibtidaiyah (MI) Al Mujahidin',
    type: 'mi',
    description: 'MI Al Mujahidin menyelenggarakan pendidikan dasar dengan kurikulum terpadu.',
    address: 'Jl. Pondok Pesantren No. 1, Samarinda, Kalimantan Timur',
    phone: '(0541) 123457',
    email: 'mi@yalmuja.sch.id',
    image: '',
    facilities: [
      { name: 'Ruang Kelas Ber-AC', image: '' },
      { name: 'Perpustakaan', image: '' },
      { name: 'Laboratorium Komputer', image: '' },
      { name: 'Lapangan Bermain', image: '' },
    ],
    programs: [
      { name: 'Kurikulum Nasional', image: '' },
      { name: 'Tahfidz Al-Quran', image: '' },
      { name: 'Bahasa Arab', image: '' },
      { name: 'Praktek Ibadah', image: '' },
    ],
  },
  mts: {
    id: '',
    name: 'Madrasah Tsanawiyah (MTs) Al Mujahidin',
    type: 'mts',
    description: 'MTs Al Mujahidin menawarkan pendidikan menengah pertama dengan penguatan karakter Islami.',
    address: 'Jl. Pondok Pesantren No. 1, Samarinda, Kalimantan Timur',
    phone: '(0541) 123458',
    email: 'mts@yalmuja.sch.id',
    image: '',
    facilities: [
      { name: 'Ruang Kelas Ber-AC', image: '' },
      { name: 'Laboratorium IPA', image: '' },
      { name: 'Laboratorium Komputer', image: '' },
      { name: 'Perpustakaan', image: '' },
    ],
    programs: [
      { name: 'Kurikulum Nasional', image: '' },
      { name: 'Tahfidz Al-Quran', image: '' },
      { name: 'Bahasa Arab & Inggris', image: '' },
      { name: 'IPA & IPS', image: '' },
    ],
  },
  ma: {
    id: '',
    name: 'Madrasah Aliyah (MA) Al Mujahidin',
    type: 'ma',
    description: 'MA Al Mujahidin menyiapkan lulusan yang siap melanjutkan ke perguruan tinggi.',
    address: 'Jl. Pondok Pesantren No. 1, Samarinda, Kalimantan Timur',
    phone: '(0541) 123459',
    email: 'ma@yalmuja.sch.id',
    image: '',
    facilities: [
      { name: 'Ruang Kelas Ber-AC', image: '' },
      { name: 'Laboratorium IPA', image: '' },
      { name: 'Laboratorium Bahasa', image: '' },
      { name: 'Aula Serbaguna', image: '' },
    ],
    programs: [
      { name: 'Jurusan IPA', image: '' },
      { name: 'Jurusan IPS', image: '' },
      { name: 'Jurusan Keagamaan', image: '' },
      { name: 'Persiapan PTN', image: '' },
    ],
  },
}

export default function AdminUnitsPage() {
  const [units, setUnits] = useState<Record<string, EducationUnit>>(defaultUnits)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState<string | null>(null)
  const [uploadingField, setUploadingField] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [currentUploadTarget, setCurrentUploadTarget] = useState<{type: string, field: string, index?: number} | null>(null)

  useEffect(() => {
    fetchUnits()
  }, [])

  const fetchUnits = async () => {
    try {
      const res = await fetch('/api/admin/units')
      const data = await res.json()
      if (data.success) {
        const unitsMap: Record<string, EducationUnit> = { ...defaultUnits }
        data.data.forEach((unit: any) => {
          let facilities: FacilityItem[] = defaultUnits[unit.type]?.facilities || []
          let programs: ProgramItem[] = defaultUnits[unit.type]?.programs || []
          
          // Parse facilities
          if (unit.facilities) {
            try {
              const parsed = JSON.parse(unit.facilities)
              if (Array.isArray(parsed) && parsed.length > 0) {
                if (typeof parsed[0] === 'string') {
                  facilities = parsed.map((f: string) => ({ name: f, image: '' }))
                } else {
                  facilities = parsed
                }
              }
            } catch {}
          }
          
          // Parse programs
          if (unit.programs) {
            try {
              const parsed = JSON.parse(unit.programs)
              if (Array.isArray(parsed) && parsed.length > 0) {
                if (typeof parsed[0] === 'string') {
                  programs = parsed.map((p: string) => ({ name: p, image: '' }))
                } else {
                  programs = parsed
                }
              }
            } catch {}
          }
          
          unitsMap[unit.type] = {
            ...unit,
            facilities,
            programs,
          }
        })
        setUnits(unitsMap)
      }
    } catch (error) {
      console.error('Error fetching units:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !currentUploadTarget) return

    setUploadingField(`${currentUploadTarget.type}-${currentUploadTarget.field}-${currentUploadTarget.index ?? 'main'}`)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      if (data.success) {
        const imageUrl = data.url
        
        if (currentUploadTarget.index !== undefined) {
          // Upload for program or facility item
          const field = currentUploadTarget.field as 'programs' | 'facilities'
          setUnits(prev => ({
            ...prev,
            [currentUploadTarget.type]: {
              ...prev[currentUploadTarget.type],
              [field]: prev[currentUploadTarget.type][field].map((item, idx) => 
                idx === currentUploadTarget.index ? { ...item, image: imageUrl } : item
              )
            }
          }))
        } else {
          // Upload for main image
          setUnits(prev => ({
            ...prev,
            [currentUploadTarget.type]: {
              ...prev[currentUploadTarget.type],
              [currentUploadTarget.field]: imageUrl
            }
          }))
        }
        toast.success('Gambar berhasil diupload')
      } else {
        toast.error('Gagal mengupload gambar')
      }
    } catch {
      toast.error('Terjadi kesalahan saat upload')
    } finally {
      setUploadingField(null)
      setCurrentUploadTarget(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const triggerUpload = (type: string, field: string, index?: number) => {
    setCurrentUploadTarget({ type, field, index })
    fileInputRef.current?.click()
  }

  const handleSave = async (type: string) => {
    setIsSaving(type)
    
    const unit = units[type]
    
    try {
      const res = await fetch('/api/admin/units', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...unit,
          facilities: JSON.stringify(unit.facilities),
          programs: JSON.stringify(unit.programs),
        }),
      })
      
      const data = await res.json()
      
      if (data.success) {
        toast.success('Data berhasil disimpan')
        fetchUnits()
      } else {
        toast.error('Gagal menyimpan data')
      }
    } catch {
      toast.error('Terjadi kesalahan')
    } finally {
      setIsSaving(null)
    }
  }

  const updateUnit = (type: string, field: keyof EducationUnit, value: string) => {
    setUnits(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value,
      }
    }))
  }

  const addProgram = (type: string) => {
    setUnits(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        programs: [...prev[type].programs, { name: '', image: '' }]
      }
    }))
  }

  const updateProgram = (type: string, index: number, field: 'name' | 'image', value: string) => {
    setUnits(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        programs: prev[type].programs.map((p, i) => 
          i === index ? { ...p, [field]: value } : p
        )
      }
    }))
  }

  const removeProgram = (type: string, index: number) => {
    setUnits(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        programs: prev[type].programs.filter((_, i) => i !== index)
      }
    }))
  }

  const addFacility = (type: string) => {
    setUnits(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        facilities: [...prev[type].facilities, { name: '', image: '' }]
      }
    }))
  }

  const updateFacility = (type: string, index: number, field: 'name' | 'image', value: string) => {
    setUnits(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        facilities: prev[type].facilities.map((f, i) => 
          i === index ? { ...f, [field]: value } : f
        )
      }
    }))
  }

  const removeFacility = (type: string, index: number) => {
    setUnits(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        facilities: prev[type].facilities.filter((_, i) => i !== index)
      }
    }))
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />
      
      <div>
        <h1 className="text-2xl font-bold">Manajemen Unit Pendidikan</h1>
        <p className="text-muted-foreground">Kelola informasi unit pendidikan yayasan</p>
      </div>

      <Tabs defaultValue="ponpes">
        <TabsList className="grid w-full grid-cols-4">
          {unitTypes.map(unit => (
            <TabsTrigger key={unit.value} value={unit.value}>
              {unit.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {unitTypes.map(unitType => (
          <TabsContent key={unitType.value} value={unitType.value}>
            <div className="space-y-6">
              {/* Basic Info Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    {unitType.label}
                  </CardTitle>
                  <CardDescription>
                    Edit informasi dasar {unitType.label} Al Mujahidin
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nama Unit</Label>
                      <Input
                        value={units[unitType.value]?.name || ''}
                        onChange={(e) => updateUnit(unitType.value, 'name', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={units[unitType.value]?.email || ''}
                        onChange={(e) => updateUnit(unitType.value, 'email', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Deskripsi</Label>
                    <Textarea
                      rows={3}
                      value={units[unitType.value]?.description || ''}
                      onChange={(e) => updateUnit(unitType.value, 'description', e.target.value)}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Alamat</Label>
                      <Input
                        value={units[unitType.value]?.address || ''}
                        onChange={(e) => updateUnit(unitType.value, 'address', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Telepon</Label>
                      <Input
                        value={units[unitType.value]?.phone || ''}
                        onChange={(e) => updateUnit(unitType.value, 'phone', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Main Image */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <ImageIcon className="h-4 w-4" />
                      Gambar Utama Unit
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="URL gambar atau upload file"
                        value={units[unitType.value]?.image || ''}
                        onChange={(e) => updateUnit(unitType.value, 'image', e.target.value)}
                      />
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => triggerUpload(unitType.value, 'image')}
                        disabled={uploadingField === `${unitType.value}-image-main`}
                      >
                        {uploadingField === `${unitType.value}-image-main` ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Upload className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {units[unitType.value]?.image && (
                      <div className="mt-2 relative aspect-video rounded-lg overflow-hidden bg-muted max-w-md">
                        <img 
                          src={units[unitType.value]?.image || ''} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => updateUnit(unitType.value, 'image', '')}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Programs Card */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Program Unggulan</CardTitle>
                      <CardDescription>Kelola program unggulan dengan gambar</CardDescription>
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={() => addProgram(unitType.value)}>
                      <Plus className="h-4 w-4 mr-1" />
                      Tambah
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {units[unitType.value]?.programs.map((program, index) => (
                      <div key={index} className="flex gap-4 p-4 border rounded-lg items-start">
                        <div className="flex-1 space-y-2">
                          <Label>Nama Program</Label>
                          <Input
                            placeholder="Nama program"
                            value={program.name}
                            onChange={(e) => updateProgram(unitType.value, index, 'name', e.target.value)}
                          />
                        </div>
                        <div className="flex-1 space-y-2">
                          <Label>Gambar Program</Label>
                          <div className="flex gap-2">
                            <Input
                              placeholder="URL gambar"
                              value={program.image}
                              onChange={(e) => updateProgram(unitType.value, index, 'image', e.target.value)}
                            />
                            <Button 
                              type="button" 
                              variant="outline"
                              onClick={() => triggerUpload(unitType.value, 'programs', index)}
                              disabled={uploadingField === `${unitType.value}-programs-${index}`}
                            >
                              {uploadingField === `${unitType.value}-programs-${index}` ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Upload className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                          {program.image && (
                            <div className="relative aspect-video rounded-lg overflow-hidden bg-muted max-w-xs">
                              <img 
                                src={program.image} 
                                alt={program.name} 
                                className="w-full h-full object-cover"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute top-1 right-1 h-6 w-6 p-0"
                                onClick={() => updateProgram(unitType.value, index, 'image', '')}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => removeProgram(unitType.value, index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    {units[unitType.value]?.programs.length === 0 && (
                      <p className="text-center text-muted-foreground py-4">
                        Belum ada program. Klik tombol "Tambah" untuk menambahkan.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Facilities Card */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Fasilitas</CardTitle>
                      <CardDescription>Kelola fasilitas dengan gambar</CardDescription>
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={() => addFacility(unitType.value)}>
                      <Plus className="h-4 w-4 mr-1" />
                      Tambah
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {units[unitType.value]?.facilities.map((facility, index) => (
                      <div key={index} className="flex gap-4 p-4 border rounded-lg items-start">
                        <div className="flex-1 space-y-2">
                          <Label>Nama Fasilitas</Label>
                          <Input
                            placeholder="Nama fasilitas"
                            value={facility.name}
                            onChange={(e) => updateFacility(unitType.value, index, 'name', e.target.value)}
                          />
                        </div>
                        <div className="flex-1 space-y-2">
                          <Label>Gambar Fasilitas</Label>
                          <div className="flex gap-2">
                            <Input
                              placeholder="URL gambar"
                              value={facility.image}
                              onChange={(e) => updateFacility(unitType.value, index, 'image', e.target.value)}
                            />
                            <Button 
                              type="button" 
                              variant="outline"
                              onClick={() => triggerUpload(unitType.value, 'facilities', index)}
                              disabled={uploadingField === `${unitType.value}-facilities-${index}`}
                            >
                              {uploadingField === `${unitType.value}-facilities-${index}` ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Upload className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                          {facility.image && (
                            <div className="relative aspect-video rounded-lg overflow-hidden bg-muted max-w-xs">
                              <img 
                                src={facility.image} 
                                alt={facility.name} 
                                className="w-full h-full object-cover"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute top-1 right-1 h-6 w-6 p-0"
                                onClick={() => updateFacility(unitType.value, index, 'image', '')}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => removeFacility(unitType.value, index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    {units[unitType.value]?.facilities.length === 0 && (
                      <p className="text-center text-muted-foreground py-4">
                        Belum ada fasilitas. Klik tombol "Tambah" untuk menambahkan.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Save Button */}
              <div className="flex justify-end">
                <Button 
                  onClick={() => handleSave(unitType.value)}
                  disabled={isSaving === unitType.value}
                  size="lg"
                >
                  {isSaving === unitType.value ? (
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
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
