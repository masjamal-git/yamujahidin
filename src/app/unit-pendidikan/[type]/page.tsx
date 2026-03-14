'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowLeft, Phone, Mail, MapPin, Users, BookOpen, Award,
  ChevronRight, CheckCircle2, GraduationCap, Home as HomeIcon
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

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
  facilities: string[]
  programs: string[]
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
    facilities: ['Masjid', 'Asrama Putra', 'Asrama Putri', 'Ruang Kelas', 'Perpustakaan', 'Lapangan Olahraga'],
    programs: ['Tahfidz Al-Quran', 'Kajian Kitab Kuning', 'Bahasa Arab', 'Bahasa Inggris'],
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
    facilities: ['Ruang Kelas Ber-AC', 'Perpustakaan', 'Laboratorium Komputer', 'Lapangan Bermain'],
    programs: ['Kurikulum Nasional', 'Tahfidz Al-Quran', 'Bahasa Arab', 'Praktek Ibadah'],
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
    facilities: ['Ruang Kelas Ber-AC', 'Laboratorium IPA', 'Laboratorium Komputer', 'Perpustakaan'],
    programs: ['Kurikulum Nasional', 'Tahfidz Al-Quran', 'Bahasa Arab & Inggris', 'IPA & IPS'],
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
    facilities: ['Ruang Kelas Ber-AC', 'Laboratorium IPA', 'Laboratorium Bahasa', 'Aula Serbaguna'],
    programs: ['Jurusan IPA', 'Jurusan IPS', 'Jurusan Keagamaan', 'Persiapan PTN'],
  },
}

const unitInfo: Record<string, { icon: React.ReactNode, color: string, gradient: string }> = {
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
  facilities: string[]
  programs: string[]
}

export default function EducationUnitDetailPage() {
  const params = useParams()
  const router = useRouter()
  const type = params.type as string
  
  const [isLoading, setIsLoading] = useState(true)
  const [unit, setUnit] = useState<EducationUnit | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Try to fetch from API first
        const res = await fetch(`/api/education-units/${type}`)
        const data = await res.json()
        
        if (data.success && data.data) {
          // Parse facilities and programs if they're strings
          let facilities = data.data.facilities
          let programs = data.data.programs
          
          if (typeof facilities === 'string') {
            try {
              facilities = JSON.parse(facilities)
            } catch {
              facilities = []
            }
          }
          
          if (typeof programs === 'string') {
            try {
              programs = JSON.parse(programs)
            } catch {
              programs = []
            }
          }
          
          setUnit({
            ...data.data,
            facilities: facilities || [],
            programs: programs || [],
          })
        } else {
          // Fallback to static data
          const staticUnit = staticEducationUnits[type]
          if (staticUnit) {
            setUnit(staticUnit)
          } else {
            setUnit(null)
          }
        }
      } catch (error) {
        console.error('Error fetching education unit:', error)
        // Fallback to static data
        const staticUnit = staticEducationUnits[type]
        if (staticUnit) {
          setUnit(staticUnit)
        } else {
          setUnit(null)
        }
      } finally {
        setIsLoading(false)
      }
    }

    if (type) {
      fetchData()
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <ArrowLeft className="h-10 w-10 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Unit Pendidikan Tidak Ditemukan</h1>
          <p className="text-muted-foreground mb-6">Unit pendidikan yang Anda cari tidak tersedia.</p>
          <Button onClick={() => router.push('/#unit-pendidikan')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Beranda
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className={`relative py-20 bg-gradient-to-br ${info.gradient} overflow-hidden`}>
        <div className="absolute inset-0 bg-black/20" />
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center text-white"
          >
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 text-white">
              {info.icon}
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              {unit.name}
            </h1>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              {unit.description}
            </p>
          </motion.div>
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
            {/* Image */}
            {unit.image && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="overflow-hidden">
                  <div className="aspect-video relative">
                    <Image
                      src={unit.image}
                      alt={unit.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Programs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Program Unggulan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {unit.programs.map((prog, i) => (
                      <div key={i} className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{prog}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Facilities */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Fasilitas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {unit.facilities.map((facility, i) => (
                      <Badge key={i} variant="secondary" className="px-4 py-2">
                        {facility}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Informasi Kontak</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Alamat</p>
                      <p className="text-sm text-muted-foreground">{unit.address}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Telepon</p>
                      <a href={`tel:${unit.phone}`} className="text-sm text-muted-foreground hover:text-primary">
                        {unit.phone}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <a href={`mailto:${unit.email}`} className="text-sm text-muted-foreground hover:text-primary">
                        {unit.email}
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
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
            </motion.div>

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
