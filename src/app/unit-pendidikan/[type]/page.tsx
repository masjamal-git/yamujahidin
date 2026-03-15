'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, Phone, Mail, MapPin, Users, BookOpen, Award,
  ChevronRight, CheckCircle2, GraduationCap, Home as HomeIcon,
  Image as ImageIcon
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

// Interface for items with images
interface FacilityItem {
  name: string
  image: string | null
}

interface ProgramItem {
  name: string
  image: string | null
}

// Static data for education units (fallback)
const staticEducationUnits: Record<string, {
  id: string
  name: string
  type: string
  description: string
  address: string
  phone: string
  email: string
  image: string | null
  facilities: FacilityItem[]
  programs: ProgramItem[]
}> = {
  ponpes: {
    id: '1',
    name: 'Pondok Pesantren Al Mujahidin',
    type: 'ponpes',
    description: 'Pondok Pesantren Al Mujahidin merupakan wadah pendidikan Islam intensif dengan sistem asrama. Santri dididik secara komprehensif dalam bidang ilmu agama, akhlak, dan kemandirian.',
    address: 'Jl. Pendidikan No. 1, Samarinda, Kalimantan Timur',
    phone: '(0541) 123456',
    email: 'ponpes@yalmuja.sch.id',
    image: null,
    facilities: [
      { name: 'Masjid', image: null },
      { name: 'Asrama Putra', image: null },
      { name: 'Asrama Putri', image: null },
      { name: 'Ruang Kelas', image: null },
      { name: 'Perpustakaan', image: null },
      { name: 'Lapangan Olahraga', image: null },
    ],
    programs: [
      { name: 'Tahfidz Al-Quran', image: null },
      { name: 'Kajian Kitab Kuning', image: null },
      { name: 'Bahasa Arab', image: null },
      { name: 'Bahasa Inggris', image: null },
    ],
  },
  mi: {
    id: '2',
    name: 'Madrasah Ibtidaiyah (MI)',
    type: 'mi',
    description: 'MI Al Mujahidin menyelenggarakan pendidikan dasar dengan kurikulum terpadu yang mengintegrasikan kurikulum nasional dan kurikulum pesantren.',
    address: 'Jl. Pendidikan No. 1, Samarinda, Kalimantan Timur',
    phone: '(0541) 123456',
    email: 'mi@yalmuja.sch.id',
    image: null,
    facilities: [
      { name: 'Ruang Kelas Ber-AC', image: null },
      { name: 'Perpustakaan', image: null },
      { name: 'Laboratorium Komputer', image: null },
      { name: 'Lapangan Bermain', image: null },
    ],
    programs: [
      { name: 'Kurikulum Nasional', image: null },
      { name: 'Tahfidz Al-Quran', image: null },
      { name: 'Bahasa Arab', image: null },
      { name: 'Praktek Ibadah', image: null },
    ],
  },
  mts: {
    id: '3',
    name: 'Madrasah Tsanawiyah (MTs)',
    type: 'mts',
    description: 'MTs Al Mujahidin menawarkan pendidikan menengah pertama dengan penguatan karakter Islami dan peningkatan kompetensi akademik.',
    address: 'Jl. Pendidikan No. 1, Samarinda, Kalimantan Timur',
    phone: '(0541) 123456',
    email: 'mts@yalmuja.sch.id',
    image: null,
    facilities: [
      { name: 'Ruang Kelas Ber-AC', image: null },
      { name: 'Laboratorium IPA', image: null },
      { name: 'Laboratorium Komputer', image: null },
      { name: 'Perpustakaan', image: null },
    ],
    programs: [
      { name: 'Kurikulum Nasional', image: null },
      { name: 'Tahfidz Al-Quran', image: null },
      { name: 'Bahasa Arab & Inggris', image: null },
      { name: 'IPA & IPS', image: null },
    ],
  },
  ma: {
    id: '4',
    name: 'Madrasah Aliyah (MA)',
    type: 'ma',
    description: 'MA Al Mujahidin menyiapkan lulusan yang siap melanjutkan ke perguruan tinggi dengan bekal ilmu agama dan ilmu umum.',
    address: 'Jl. Pendidikan No. 1, Samarinda, Kalimantan Timur',
    phone: '(0541) 123456',
    email: 'ma@yalmuja.sch.id',
    image: null,
    facilities: [
      { name: 'Ruang Kelas Ber-AC', image: null },
      { name: 'Laboratorium IPA', image: null },
      { name: 'Laboratorium Bahasa', image: null },
      { name: 'Aula Serbaguna', image: null },
    ],
    programs: [
      { name: 'Jurusan IPA', image: null },
      { name: 'Jurusan IPS', image: null },
      { name: 'Jurusan Keagamaan', image: null },
      { name: 'Persiapan PTN', image: null },
    ],
  },
}

const unitInfo: Record<string, { icon: React.ReactNode; color: string; gradient: string }> = {
  ponpes: {
    icon: <HomeIcon className="h-8 w-8" />,
    color: 'text-emerald-600',
    gradient: 'from-emerald-500 to-emerald-600',
  },
  mi: {
    icon: <GraduationCap className="h-8 w-8" />,
    color: 'text-blue-600',
    gradient: 'from-blue-500 to-blue-600',
  },
  mts: {
    icon: <BookOpen className="h-8 w-8" />,
    color: 'text-purple-600',
    gradient: 'from-purple-500 to-purple-600',
  },
  ma: {
    icon: <Award className="h-8 w-8" />,
    color: 'text-amber-600',
    gradient: 'from-amber-500 to-amber-600',
  },
}

interface EducationUnit {
  id: string
  name: string
  type: string
  description: string
  address: string
  phone: string
  email: string
  image: string | null
  facilities: FacilityItem[]
  programs: ProgramItem[]
}

// Helper function to safely parse JSON array with backward compatibility
function safeParseItems(value: unknown): (FacilityItem | ProgramItem)[] {
  if (!value) return []
  if (Array.isArray(value)) {
    // Check if it's old format (string array) or new format (object array)
    if (value.length > 0 && typeof value[0] === 'string') {
      return value.map((name: string) => ({ name, image: null }))
    }
    return value
  }
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      if (Array.isArray(parsed)) {
        if (parsed.length > 0 && typeof parsed[0] === 'string') {
          return parsed.map((name: string) => ({ name, image: null }))
        }
        return parsed
      }
      return []
    } catch {
      return []
    }
  }
  return []
}

export default function EducationUnitDetailPage() {
  const params = useParams()
  const router = useRouter()
  const type = params?.type as string || 'ponpes'
  
  const [isLoading, setIsLoading] = useState(true)
  const [unit, setUnit] = useState<EducationUnit | null>(null)

  useEffect(() => {
    let isMounted = true
    
    const fetchData = async () => {
      setIsLoading(true)
      
      // Get static data as fallback
      const staticUnit = staticEducationUnits[type]
      
      try {
        const res = await fetch(`/api/education-units/${type}`, {
          cache: 'no-store',
        })
        const data = await res.json()
        
        if (!isMounted) return
        
        if (data.success && data.data) {
          setUnit({
            id: data.data.id || staticUnit?.id || '',
            name: data.data.name || staticUnit?.name || '',
            type: data.data.type || type,
            description: data.data.description || staticUnit?.description || '',
            address: data.data.address || staticUnit?.address || '',
            phone: data.data.phone || staticUnit?.phone || '',
            email: data.data.email || staticUnit?.email || '',
            image: data.data.image || null,
            facilities: safeParseItems(data.data.facilities) as FacilityItem[],
            programs: safeParseItems(data.data.programs) as ProgramItem[],
          })
        } else {
          setUnit(staticUnit || null)
        }
      } catch (error) {
        console.error('Error fetching education unit:', error)
        if (isMounted) {
          setUnit(staticUnit || null)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    if (type) {
      fetchData()
    }
    
    return () => {
      isMounted = false
    }
  }, [type])

  const info = unitInfo[type] || unitInfo.ponpes

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-32 mb-6" />
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-10 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/2 mb-6" />
            <Skeleton className="aspect-video w-full mb-6 rounded-lg" />
          </div>
        </div>
      </div>
    )
  }

  if (!unit) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <ArrowLeft className="h-10 w-10 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Unit Pendidikan Tidak Ditemukan</h1>
          <p className="text-muted-foreground mb-6">Unit pendidikan yang Anda cari tidak tersedia.</p>
          <Button onClick={() => router.push('/#unit-pendidikan')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Beranda
          </Button>
        </div>
      </div>
    )
  }

  // Check if programs have images
  const hasProgramImages = unit.programs.some(p => p.image)
  // Check if facilities have images
  const hasFacilityImages = unit.facilities.some(f => f.image)

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className={`relative py-20 bg-gradient-to-br ${info.gradient} overflow-hidden`}>
        <div className="absolute inset-0 bg-black/20" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center text-white">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 text-white">
              {info.icon}
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              {unit.name}
            </h1>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              {unit.description}
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href="/#beranda" className="hover:text-primary">Beranda</Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/#unit-pendidikan" className="hover:text-primary">Unit Pendidikan</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">{unit.name}</span>
        </nav>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image - Use regular img tag for base64 support */}
            {unit.image && (
              <Card className="overflow-hidden">
                <div className="aspect-video relative">
                  <img
                    src={unit.image}
                    alt={unit.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </Card>
            )}

            {/* Programs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Program Unggulan
                </CardTitle>
              </CardHeader>
              <CardContent>
                {unit.programs && unit.programs.length > 0 ? (
                  hasProgramImages ? (
                    // Grid layout when there are images
                    <div className="grid sm:grid-cols-2 gap-4">
                      {unit.programs.map((prog, i) => (
                        <div key={i} className="rounded-lg border overflow-hidden bg-card">
                          {prog.image ? (
                            <div className="aspect-video relative">
                              <img
                                src={prog.image}
                                alt={prog.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="aspect-video bg-muted flex items-center justify-center">
                              <ImageIcon className="h-8 w-8 text-muted-foreground" />
                            </div>
                          )}
                          <div className="p-3">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                              <span className="text-sm font-medium">{prog.name}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    // Simple list layout when no images
                    <div className="grid md:grid-cols-2 gap-4">
                      {unit.programs.map((prog, i) => (
                        <div key={i} className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                          <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{prog.name}</span>
                        </div>
                      ))}
                    </div>
                  )
                ) : (
                  <p className="text-muted-foreground text-sm">Tidak ada program</p>
                )}
              </CardContent>
            </Card>

            {/* Facilities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Fasilitas
                </CardTitle>
              </CardHeader>
              <CardContent>
                {unit.facilities && unit.facilities.length > 0 ? (
                  hasFacilityImages ? (
                    // Grid layout when there are images
                    <div className="grid sm:grid-cols-2 gap-4">
                      {unit.facilities.map((facility, i) => (
                        <div key={i} className="rounded-lg border overflow-hidden bg-card">
                          {facility.image ? (
                            <div className="aspect-video relative">
                              <img
                                src={facility.image}
                                alt={facility.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="aspect-video bg-muted flex items-center justify-center">
                              <ImageIcon className="h-8 w-8 text-muted-foreground" />
                            </div>
                          )}
                          <div className="p-3">
                            <span className="text-sm font-medium">{facility.name}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    // Simple badges layout when no images
                    <div className="flex flex-wrap gap-2">
                      {unit.facilities.map((facility, i) => (
                        <Badge key={i} variant="secondary" className="px-4 py-2">
                          {facility.name}
                        </Badge>
                      ))}
                    </div>
                  )
                ) : (
                  <p className="text-muted-foreground text-sm">Tidak ada fasilitas</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informasi Kontak</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Alamat</p>
                    <p className="text-sm text-muted-foreground">{unit.address || '-'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Telepon</p>
                    {unit.phone ? (
                      <a href={`tel:${unit.phone}`} className="text-sm text-muted-foreground hover:text-primary">
                        {unit.phone}
                      </a>
                    ) : (
                      <span className="text-sm text-muted-foreground">-</span>
                    )}
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    {unit.email ? (
                      <a href={`mailto:${unit.email}`} className="text-sm text-muted-foreground hover:text-primary">
                        {unit.email}
                      </a>
                    ) : (
                      <span className="text-sm text-muted-foreground">-</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CTA */}
            <Card className="bg-primary text-primary-foreground">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Tertarik Bergabung?</h3>
                <p className="text-sm opacity-90 mb-4">
                  Daftarkan diri Anda untuk bergabung dengan {unit.name}
                </p>
                <Button 
                  variant="secondary" 
                  className="w-full"
                  onClick={() => router.push('/#ppdb')}
                >
                  Daftar Sekarang
                </Button>
              </CardContent>
            </Card>

            {/* Back Button */}
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => router.push('/#unit-pendidikan')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Unit Pendidikan
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
