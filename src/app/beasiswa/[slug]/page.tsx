'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  ArrowLeft, Gift, Calendar, CheckCircle, Heart, Phone, Mail, MapPin,
  ChevronRight, GraduationCap, Users, Award, BookOpen, Home as HomeIcon,
  School, FileText, Image as ImageIcon, UserPlus, MessageCircle, Menu, X,
  Sun, Moon, Play, HandHeart, Building
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { useTheme } from 'next-themes'

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

interface Settings {
  site_name: string
  site_tagline: string
  site_address: string
  site_phone: string
  site_email: string
  site_whatsapp: string
  facebook_url: string
  instagram_url: string
  youtube_url: string
}

const navItems = [
  { name: 'Beranda', href: '/', icon: HomeIcon },
  { name: 'Profil', href: '/#profil', icon: Building },
  { name: 'Unit Pendidikan', href: '/#unit-pendidikan', icon: School },
  { name: 'Berita', href: '/#berita', icon: FileText },
  { name: 'Galeri', href: '/#galeri', icon: ImageIcon },
  { name: 'Video', href: '/#video', icon: Play },
  { name: 'PPDB', href: '/#ppdb', icon: UserPlus },
  { name: 'Beasiswa', href: '/#beasiswa', icon: Gift },
  { name: 'Kontak', href: '/#kontak', icon: MessageCircle },
]

export default function ScholarshipDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [scholarship, setScholarship] = useState<Scholarship | null>(null)
  const [settings, setSettings] = useState<Settings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [scholarshipRes, settingsRes] = await Promise.all([
          fetch(`/api/scholarship/${params.slug}`),
          fetch('/api/settings'),
        ])
        
        const scholarshipData = await scholarshipRes.json()
        const settingsData = await settingsRes.json()
        
        if (scholarshipData.success) {
          setScholarship(scholarshipData.data)
        } else {
          toast.error('Beasiswa tidak ditemukan')
          router.push('/')
        }
        
        if (settingsData.success) {
          setSettings(settingsData.data as Settings)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        toast.error('Gagal memuat data beasiswa')
      } finally {
        setIsLoading(false)
      }
    }
    
    if (params.slug) {
      fetchData()
    }
  }, [params.slug, router])

  if (!mounted) return null

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-muted animate-pulse rounded-lg" />
              <div className="hidden sm:block">
                <div className="h-5 w-40 bg-muted animate-pulse rounded" />
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="h-8 w-32 bg-muted animate-pulse rounded" />
              <div className="h-12 w-full bg-muted animate-pulse rounded" />
              <div className="h-64 w-full bg-muted animate-pulse rounded" />
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (!scholarship) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Gift className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Beasiswa tidak ditemukan</h2>
          <p className="text-muted-foreground mb-4">Beasiswa yang Anda cari tidak tersedia</p>
          <Link href="/#beasiswa">
            <Button>Kembali ke Beranda</Button>
          </Link>
        </div>
      </div>
    )
  }

  const requirements = scholarship.requirements?.split('\n').filter(Boolean) || []
  const benefits = scholarship.benefits?.split('\n').filter(Boolean) || []

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 relative rounded-lg overflow-hidden bg-white">
              <Image
                src="/images/logo-yayasan.png"
                alt="Logo Yayasan Al Mujahidin"
                fill
                className="object-contain"
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-bold text-lg leading-tight">{settings?.site_name || 'Yayasan Al Mujahidin'}</h1>
              <p className="text-xs text-muted-foreground">Kalimantan Timur</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="px-3 py-2 text-sm font-medium rounded-md transition-colors text-muted-foreground hover:text-primary hover:bg-primary/5"
              >
                {item.name}
              </Link>
            ))}
            <Link href="/donasi">
              <Button variant="default" size="sm" className="gap-2 ml-2">
                <Heart className="h-4 w-4" />
                Donasi
              </Button>
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="lg:hidden"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="hidden lg:flex"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button
              className="lg:hidden"
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t bg-background"
          >
            <nav className="container mx-auto py-4 px-4 grid gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-md transition-colors text-muted-foreground hover:text-primary hover:bg-primary/5"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              ))}
              <Link
                href="/donasi"
                className="flex items-center gap-3 px-4 py-3 rounded-md transition-colors text-muted-foreground hover:text-primary hover:bg-primary/5"
                onClick={() => setIsMenuOpen(false)}
              >
                <HandHeart className="h-5 w-5" />
                <span className="font-medium">Donasi</span>
              </Link>
            </nav>
          </motion.div>
        )}
      </header>

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
              <Link href="/" className="hover:text-primary">Beranda</Link>
              <ChevronRight className="h-4 w-4" />
              <Link href="/#beasiswa" className="hover:text-primary">Beasiswa</Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground">{scholarship.title}</span>
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link href="/#beasiswa" className="inline-flex items-center gap-2 text-primary hover:underline mb-6">
                <ArrowLeft className="h-4 w-4" />
                Kembali ke Daftar Beasiswa
              </Link>

              <Card className="overflow-hidden">
                {/* Header Image */}
                {scholarship.image && (
                  <div className="aspect-video relative bg-muted">
                    <Image
                      src={scholarship.image}
                      alt={scholarship.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                )}

                <CardHeader className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
                      <Gift className="h-8 w-8" />
                    </div>
                    <div className="flex-1">
                      <Badge className="mb-2">Program Beasiswa</Badge>
                      <CardTitle className="text-2xl md:text-3xl">{scholarship.title}</CardTitle>
                    </div>
                  </div>
                  
                  {scholarship.deadline && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-5 w-5 text-primary" />
                      <span>Batas Pendaftaran: <strong>{scholarship.deadline}</strong></span>
                    </div>
                  )}
                </CardHeader>

                <CardContent className="space-y-8">
                  {/* Description */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Deskripsi</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {scholarship.description}
                    </p>
                  </div>

                  <Separator />

                  {/* Requirements */}
                  {requirements.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-primary" />
                        Persyaratan
                      </h3>
                      <ul className="space-y-3">
                        {requirements.map((req, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-xs font-medium text-primary">{index + 1}</span>
                            </div>
                            <span className="text-muted-foreground">{req.replace(/^[\d\.\-\*]+\s*/, '')}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {requirements.length > 0 && benefits.length > 0 && <Separator />}

                  {/* Benefits */}
                  {benefits.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <Heart className="h-5 w-5 text-primary" />
                        Keuntungan
                      </h3>
                      <ul className="space-y-3">
                        {benefits.map((benefit, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                            </div>
                            <span className="text-muted-foreground">{benefit.replace(/^[\d\.\-\*]+\s*/, '')}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <Separator />

                  {/* CTA */}
                  <div className="bg-muted/50 rounded-xl p-6 text-center">
                    <h3 className="text-lg font-semibold mb-2">Tertarik dengan Beasiswa Ini?</h3>
                    <p className="text-muted-foreground mb-4">
                      Hubungi kami untuk informasi lebih lanjut tentang pendaftaran beasiswa
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                      {settings?.site_whatsapp && (
                        <Button asChild>
                          <a 
                            href={`https://wa.me/${settings.site_whatsapp}?text=Halo, saya ingin bertanya tentang beasiswa ${scholarship.title}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Hubungi via WhatsApp
                          </a>
                        </Button>
                      )}
                      <Link href="/#kontak">
                        <Button variant="outline">
                          Form Kontak
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-muted/50 border-t py-12 mt-auto">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 relative rounded-lg overflow-hidden bg-white">
                  <Image
                    src="/images/logo-yayasan.png"
                    alt="Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <h3 className="font-bold">{settings?.site_name || 'Yayasan Al Mujahidin'}</h3>
                  <p className="text-sm text-muted-foreground">Kalimantan Timur</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground max-w-md">
                {settings?.site_tagline || 'Membangun Generasi Berilmu dan Berakhlak'}
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Kontak</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                {settings?.site_address && (
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5" />
                    <span>{settings.site_address}</span>
                  </div>
                )}
                {settings?.site_phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>{settings.site_phone}</span>
                  </div>
                )}
                {settings?.site_email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>{settings.site_email}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Tautan Cepat</h4>
              <div className="space-y-2 text-sm">
                <Link href="/#ppdb" className="block text-muted-foreground hover:text-primary">
                  Pendaftaran
                </Link>
                <Link href="/#beasiswa" className="block text-muted-foreground hover:text-primary">
                  Beasiswa
                </Link>
                <Link href="/donasi" className="block text-muted-foreground hover:text-primary">
                  Donasi
                </Link>
              </div>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} {settings?.site_name || 'Yayasan Al Mujahidin'}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
