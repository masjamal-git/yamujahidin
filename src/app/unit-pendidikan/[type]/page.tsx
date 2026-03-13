'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  ArrowLeft, GraduationCap, BookOpen, Award, Building,
  Home as HomeIcon, School, Phone, Mail, MapPin,
  ChevronRight, UserPlus, Check, AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

interface ProgramItem {
  name: string
  image?: string
}

interface FacilityItem {
  name: string
  image?: string
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
  facilities: string | null
  programs: string | null
  isActive: boolean
}

export default function EducationUnitDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [unit, setUnit] = useState<EducationUnit | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const unitType = params.type as string

  // Unit type labels and icons
  const unitInfo: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
    ponpes: { 
      label: 'Pondok Pesantren', 
      icon: <HomeIcon className="h-6 w-6" />,
      color: 'bg-emerald-500'
    },
    mi: { 
      label: 'Madrasah Ibtidaiyah', 
      icon: <GraduationCap className="h-6 w-6" />,
      color: 'bg-blue-500'
    },
    mts: { 
      label: 'Madrasah Tsanawiyah', 
      icon: <BookOpen className="h-6 w-6" />,
      color: 'bg-amber-500'
    },
    ma: { 
      label: 'Madrasah Aliyah', 
      icon: <Award className="h-6 w-6" />,
      color: 'bg-purple-500'
    },
  }

  useEffect(() => {
    if (unitType) {
      fetchUnit()
    }
  }, [unitType])

  const fetchUnit = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const res = await fetch(`/api/units/${unitType}`)
      const data = await res.json()
      
      if (data.success && data.data) {
        setUnit(data.data)
      } else {
        setError(data.message || 'Gagal memuat data unit pendidikan')
      }
    } catch (err) {
      console.error('Error fetching unit:', err)
      setError('Terjadi kesalahan saat memuat data')
    } finally {
      setIsLoading(false)
    }
  }

  // Parse programs and facilities
  const parseItems = (data: string | null): (ProgramItem | FacilityItem)[] => {
    if (!data) return []
    try {
      const parsed = JSON.parse(data)
      if (Array.isArray(parsed)) {
        if (parsed.length > 0 && typeof parsed[0] === 'string') {
          return parsed.map((item: string) => ({ name: item, image: '' }))
        }
        return parsed
      }
    } catch {}
    return []
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Memuat data...</p>
        </div>
      </div>
    )
  }

  if (error || !unit) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <AlertCircle className="h-16 w-16 text-destructive mb-4" />
        <h1 className="text-2xl font-bold mb-2 text-center">Unit Pendidikan Tidak Ditemukan</h1>
        <p className="text-muted-foreground mb-4 text-center">{error || 'Unit pendidikan yang Anda cari tidak tersedia.'}</p>
        <Button onClick={() => router.push('/#unit-pendidikan')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali ke Beranda
        </Button>
      </div>
    )
  }

  const info = unitInfo[unitType] || unitInfo.mi
  const programs: ProgramItem[] = parseItems(unit.programs)
  const facilities: FacilityItem[] = parseItems(unit.facilities)

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Background */}
        <div className={`absolute inset-0 ${info.color} opacity-10`} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Back Button */}
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => router.push('/#unit-pendidikan')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Button>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="mb-4">{info.label}</Badge>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                {unit.name}
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                {unit.description}
              </p>
              <div className="flex flex-wrap gap-3">
                <Button size="lg" onClick={() => router.push('/#ppdb')}>
                  <UserPlus className="mr-2 h-5 w-5" />
                  Daftar Sekarang
                </Button>
                <Button size="lg" variant="outline" onClick={() => document.getElementById('programs')?.scrollIntoView({ behavior: 'smooth' })}>
                  Lihat Program
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </motion.div>

            {/* Right Content - Image */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl">
                {unit.image ? (
                  <Image src={unit.image} alt={unit.name} fill className="object-cover" />
                ) : (
                  <div className={`absolute inset-0 ${info.color} flex items-center justify-center`}>
                    <div className="text-white scale-150">
                      {info.icon}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section id="programs" className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Program Unggulan</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Program pendidikan yang dirancang untuk mengembangkan potensi siswa secara optimal
            </p>
          </motion.div>

          {programs.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {programs.map((program, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1">
                    <div className="aspect-video relative bg-muted">
                      {program.image ? (
                        <img 
                          src={program.image} 
                          alt={program.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className={`absolute inset-0 ${info.color} flex items-center justify-center`}>
                          <Check className="h-12 w-12 text-white" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg">{program.name}</h3>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">Belum ada program tersedia</p>
          )}
        </div>
      </section>

      {/* Facilities Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Fasilitas</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Fasilitas lengkap untuk mendukung kegiatan belajar mengajar
            </p>
          </motion.div>

          {facilities.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {facilities.map((facility, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1">
                    <div className="aspect-video relative bg-muted">
                      {facility.image ? (
                        <img 
                          src={facility.image} 
                          alt={facility.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className={`absolute inset-0 ${info.color} flex items-center justify-center`}>
                          <Building className="h-12 w-12 text-white" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg">{facility.name}</h3>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">Belum ada data fasilitas</p>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" />
                  Hubungi Kami
                </CardTitle>
                <CardDescription>
                  Untuk informasi lebih lanjut tentang pendaftaran dan program
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {unit.address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Alamat</p>
                      <p className="text-muted-foreground">{unit.address}</p>
                    </div>
                  </div>
                )}
                {unit.phone && (
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Telepon</p>
                      <p className="text-muted-foreground">{unit.phone}</p>
                    </div>
                  </div>
                )}
                {unit.email && (
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-muted-foreground">{unit.email}</p>
                    </div>
                  </div>
                )}
                <Separator className="my-4" />
                <Button className="w-full" size="lg" onClick={() => router.push('/#ppdb')}>
                  <UserPlus className="mr-2 h-5 w-5" />
                  Daftar Sekarang
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Other Units */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl font-bold mb-2">Unit Pendidikan Lainnya</h2>
            <p className="text-muted-foreground">Lihat unit pendidikan lain di Yayasan Al Mujahidin</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(unitInfo)
              .filter(([type]) => type !== unitType)
              .map(([type, info]) => (
                <Link key={type} href={`/unit-pendidikan/${type}`}>
                  <Card className="h-full hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <div className={`w-14 h-14 ${info.color} rounded-xl flex items-center justify-center text-white mx-auto mb-3`}>
                        {info.icon}
                      </div>
                      <h3 className="font-semibold text-sm">{info.label}</h3>
                    </CardContent>
                  </Card>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </div>
  )
}
