'use client'

import { useEffect, useState } from 'react'
import { Save, Loader2, Building, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
}

const unitTypes = [
  { value: 'ponpes', label: 'Pondok Pesantren' },
  { value: 'mi', label: 'Madrasah Ibtidaiyah' },
  { value: 'mts', label: 'Madrasah Tsanawiyah' },
  { value: 'ma', label: 'Madrasah Aliyah' },
]

const defaultData: Record<string, EducationUnit> = {
  ponpes: {
    id: '',
    name: 'Pondok Pesantren Al Mujahidin',
    type: 'ponpes',
    description: 'Pondok Pesantren Al Mujahidin merupakan wadah pendidikan Islam intensif dengan sistem asrama.',
    address: 'Jl. Pendidikan No. 1, Samarinda, Kalimantan Timur',
    phone: '(0541) 123456',
    email: 'ponpes@yalmuja.sch.id',
    image: '',
    facilities: 'Masjid\nAsrama Putra\nAsrama Putri\nRuang Kelas\nPerpustakaan\nLapangan Olahraga',
    programs: 'Tahfidz Al-Quran\nKajian Kitab Kuning\nBahasa Arab\nBahasa Inggris',
  },
  mi: {
    id: '',
    name: 'Madrasah Ibtidaiyah (MI) Al Mujahidin',
    type: 'mi',
    description: 'MI Al Mujahidin menyelenggarakan pendidikan dasar dengan kurikulum terpadu.',
    address: 'Jl. Pendidikan No. 1, Samarinda, Kalimantan Timur',
    phone: '(0541) 123456',
    email: 'mi@yalmuja.sch.id',
    image: '',
    facilities: 'Ruang Kelas Ber-AC\nPerpustakaan\nLaboratorium Komputer\nLapangan Bermain',
    programs: 'Kurikulum Nasional\nTahfidz Al-Quran\nBahasa Arab\nPraktek Ibadah',
  },
  mts: {
    id: '',
    name: 'Madrasah Tsanawiyah (MTs) Al Mujahidin',
    type: 'mts',
    description: 'MTs Al Mujahidin menawarkan pendidikan menengah pertama dengan penguatan karakter Islami.',
    address: 'Jl. Pendidikan No. 1, Samarinda, Kalimantan Timur',
    phone: '(0541) 123456',
    email: 'mts@yalmuja.sch.id',
    image: '',
    facilities: 'Ruang Kelas Ber-AC\nLaboratorium IPA\nLaboratorium Komputer\nPerpustakaan',
    programs: 'Kurikulum Nasional\nTahfidz Al-Quran\nBahasa Arab & Inggris\nIPA & IPS',
  },
  ma: {
    id: '',
    name: 'Madrasah Aliyah (MA) Al Mujahidin',
    type: 'ma',
    description: 'MA Al Mujahidin menyiapkan lulusan yang siap melanjutkan ke perguruan tinggi.',
    address: 'Jl. Pendidikan No. 1, Samarinda, Kalimantan Timur',
    phone: '(0541) 123456',
    email: 'ma@yalmuja.sch.id',
    image: '',
    facilities: 'Ruang Kelas Ber-AC\nLaboratorium IPA\nLaboratorium Bahasa\nAula Serbaguna',
    programs: 'Jurusan IPA\nJurusan IPS\nJurusan Keagamaan\nPersiapan PTN',
  },
}

export default function AdminUnitsPage() {
  const [units, setUnits] = useState<Record<string, EducationUnit>>(defaultData)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState<string | null>(null)

  useEffect(() => {
    fetchUnits()
  }, [])

  const fetchUnits = async () => {
    try {
      const res = await fetch('/api/admin/units')
      const data = await res.json()
      if (data.success) {
        const unitsMap: Record<string, EducationUnit> = { ...defaultData }
        data.data.forEach((unit: EducationUnit) => {
          unitsMap[unit.type] = {
            ...unit,
            facilities: unit.facilities ? JSON.parse(unit.facilities).join('\n') : '',
            programs: unit.programs ? JSON.parse(unit.programs).join('\n') : '',
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

  const handleSave = async (type: string) => {
    setIsSaving(type)
    
    const unit = units[type]
    
    try {
      const res = await fetch('/api/admin/units', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...unit,
          facilities: JSON.stringify(unit.facilities?.split('\n').filter(f => f.trim()) || []),
          programs: JSON.stringify(unit.programs?.split('\n').filter(p => p.trim()) || []),
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  {unitType.label}
                </CardTitle>
                <CardDescription>
                  Edit informasi {unitType.label} Al Mujahidin
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic Info */}
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

                {/* Image URL */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    URL Gambar
                  </Label>
                  <Input
                    placeholder="https://example.com/image.jpg"
                    value={units[unitType.value]?.image || ''}
                    onChange={(e) => updateUnit(unitType.value, 'image', e.target.value)}
                  />
                  {units[unitType.value]?.image && (
                    <div className="mt-2 aspect-video relative rounded-lg overflow-hidden bg-muted max-w-md">
                      <img 
                        src={units[unitType.value]?.image || ''} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>

                {/* Facilities */}
                <div className="space-y-2">
                  <Label>Fasilitas (satu per baris)</Label>
                  <Textarea
                    rows={4}
                    placeholder="Masjid&#10;Ruang Kelas&#10;Perpustakaan"
                    value={units[unitType.value]?.facilities || ''}
                    onChange={(e) => updateUnit(unitType.value, 'facilities', e.target.value)}
                  />
                </div>

                {/* Programs */}
                <div className="space-y-2">
                  <Label>Program Unggulan (satu per baris)</Label>
                  <Textarea
                    rows={4}
                    placeholder="Tahfidz Al-Quran&#10;Bahasa Arab&#10;Kurikulum Nasional"
                    value={units[unitType.value]?.programs || ''}
                    onChange={(e) => updateUnit(unitType.value, 'programs', e.target.value)}
                  />
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                  <Button 
                    onClick={() => handleSave(unitType.value)}
                    disabled={isSaving === unitType.value}
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
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
