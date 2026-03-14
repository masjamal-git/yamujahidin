'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowLeft, Phone, Mail, MapPin, Clock, Users, BookOpen, Award,
  ChevronRight, CheckCircle2, GraduationCap, Home as HomeIcon
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'

interface EducationUnitDetail {
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

interface PageProps {
  params: Promise<{ type: string }>
}

export default function EducationUnitDetailPage({ params }: PageProps) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [unit, setUnit] = useState<EducationUnitDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const type = resolvedParams.type

  useEffect(() => {
    if (type) {
      fetchUnit()
    }
  }, [type])

  const fetchUnit = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const res = await fetch(`/api/education-units/${type}`, {
        cache: 'no-store',
      })
      const data = await res.json()
      
      if (data.success && data.data) {
        setUnit(data.data)
      } else {
        setError(data.message || 'Unit pendidikan tidak ditemukan')
      }
    } catch (err) {
      console.error('Error fetching unit:', err)
      setError('Terjadi kesalahan saat memuat data')
    } finally {
      setIsLoading(false)
    }
  }

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

  if (error || !unit) {
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
          <p className="text-muted-foreground mb-6">{error || 'Unit pendidikan yang Anda cari tidak tersedia.'}</p>
          <Button onClick={() => router.push('/#unit-pendidikan')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Beranda
          </Button>
        </motion.div>
      </div>
    )
  }

  const facilities = unit.facilities ? JSON.parse(unit.facilities) : []
  const programs = unit.programs ? JSON.parse(unit.programs) : []

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
            {unit.description && (
              <p className="text-lg opacity-90 max-w-2xl mx-auto">
                {unit.description}
              </p>
            )}
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
                  {programs.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-4">
                      {programs.map((prog: string, i: number) => (
                        <div key={i} className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                          <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{prog}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Informasi program belum tersedia</p>
                  )}
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
                  {facilities.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {facilities.map((facility: string, i: number) => (
                        <Badge key={i} variant="secondary" className="px-4 py-2">
                          {facility}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Informasi fasilitas belum tersedia</p>
                  )}
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
                  {unit.address && (
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium">Alamat</p>
                        <p className="text-sm text-muted-foreground">{unit.address}</p>
                      </div>
                    </div>
                  )}
                  {unit.phone && (
                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium">Telepon</p>
                        <a href={`tel:${unit.phone}`} className="text-sm text-muted-foreground hover:text-primary">
                          {unit.phone}
                        </a>
                      </div>
                    </div>
                  )}
                  {unit.email && (
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium">Email</p>
                        <a href={`mailto:${unit.email}`} className="text-sm text-muted-foreground hover:text-primary">
                          {unit.email}
                        </a>
                      </div>
                    </div>
                  )}
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
