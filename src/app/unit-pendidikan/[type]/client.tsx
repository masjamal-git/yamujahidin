'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, Phone, Mail, MapPin, Users, BookOpen, Award,
  ChevronRight, CheckCircle2, GraduationCap, Home as HomeIcon
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

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

interface EducationUnitClientProps {
  unit: EducationUnit
}

export default function EducationUnitClient({ unit }: EducationUnitClientProps) {
  const router = useRouter()
  const info = unitInfo[unit.type] || unitInfo.ponpes

  // Check if image is base64
  const isBase64Image = unit.image?.startsWith('data:image')
  const isExternalUrl = unit.image?.startsWith('http')

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
            {/* Image */}
            {unit.image && (
              <Card className="overflow-hidden">
                <div className="aspect-video relative">
                  {/* Use regular img tag for base64 images */}
                  {isBase64Image ? (
                    <img
                      src={unit.image}
                      alt={unit.name}
                      className="w-full h-full object-cover"
                    />
                  ) : isExternalUrl ? (
                    <img
                      src={unit.image}
                      alt={unit.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={unit.image}
                      alt={unit.name}
                      className="w-full h-full object-cover"
                    />
                  )}
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
                <div className="grid md:grid-cols-2 gap-4">
                  {unit.programs && unit.programs.length > 0 ? (
                    unit.programs.map((prog, i) => (
                      <div key={i} className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{prog}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-sm">Tidak ada program</p>
                  )}
                </div>
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
                <div className="flex flex-wrap gap-2">
                  {unit.facilities && unit.facilities.length > 0 ? (
                    unit.facilities.map((facility, i) => (
                      <Badge key={i} variant="secondary" className="px-4 py-2">
                        {facility}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-sm">Tidak ada fasilitas</p>
                  )}
                </div>
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
