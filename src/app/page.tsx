'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Menu, X, Phone, Mail, MapPin, Clock, ChevronRight, ChevronLeft,
  Facebook, Instagram, Youtube, GraduationCap, BookOpen, Users,
  Award, Calendar, ArrowRight, Send, Eye, Heart, Building,
  School, Home as HomeIcon, Image as ImageIcon, FileText,
  UserPlus, Gift, MessageCircle, Sun, Moon
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { useTheme } from 'next-themes'
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel'
import { HeroSlider, defaultHeroSlides } from '@/components/ui/hero-slider'

// Types
interface NewsItem {
  id: string
  title: string
  slug: string
  excerpt: string | null
  image: string | null
  category: string
  createdAt: string
}

interface GalleryItem {
  id: string
  title: string
  description: string | null
  image: string | null
  category: string
}

interface EducationUnit {
  id: string
  name: string
  type: string
  description: string | null
  facilities: string | null
  programs: string | null
}

interface Scholarship {
  id: string
  title: string
  slug: string
  description: string
  benefits: string | null
  deadline: string | null
}

interface Settings {
  site_name: string
  site_tagline: string
  site_description: string
  site_address: string
  site_phone: string
  site_email: string
  site_whatsapp: string
  facebook_url: string
  instagram_url: string
  youtube_url: string
  profile_vision: string
  profile_mission: string
  profile_history: string
}

// Navigation items
const navItems = [
  { name: 'Beranda', href: '#beranda', icon: HomeIcon },
  { name: 'Profil', href: '#profil', icon: Building },
  { name: 'Unit Pendidikan', href: '#unit-pendidikan', icon: School },
  { name: 'Berita', href: '#berita', icon: FileText },
  { name: 'Galeri', href: '#galeri', icon: ImageIcon },
  { name: 'PPDB', href: '#ppdb', icon: UserPlus },
  { name: 'Beasiswa', href: '#beasiswa', icon: Gift },
  { name: 'Kontak', href: '#kontak', icon: MessageCircle },
]

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('beranda')
  const [news, setNews] = useState<NewsItem[]>([])
  const [gallery, setGallery] = useState<GalleryItem[]>([])
  const [educationUnits, setEducationUnits] = useState<EducationUnit[]>([])
  const [scholarships, setScholarships] = useState<Scholarship[]>([])
  const [settings, setSettings] = useState<Settings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [newsRes, galleryRes, unitsRes, scholarshipsRes, settingsRes] = await Promise.all([
          fetch('/api/news?limit=6'),
          fetch('/api/gallery?limit=12'),
          fetch('/api/settings'),
          fetch('/api/scholarship'),
          fetch('/api/settings'),
        ])
        
        const newsData = await newsRes.json()
        const galleryData = await galleryRes.json()
        const unitsData = await unitsRes.json()
        const scholarshipsData = await scholarshipsRes.json()
        const settingsData = await settingsRes.json()
        
        if (newsData.success) setNews(newsData.data)
        if (galleryData.success) setGallery(galleryData.data)
        if (scholarshipsData.success) setScholarships(scholarshipsData.data)
        if (settingsData.success) setSettings(settingsData.data as Settings)
        
        // For education units, we'll use the settings data or fetch separately
        // For now, let's set static data
        setEducationUnits([
          {
            id: '1',
            name: 'Pondok Pesantren Al Mujahidin',
            type: 'ponpes',
            description: 'Pondok Pesantren Al Mujahidin merupakan wadah pendidikan Islam intensif dengan sistem asrama. Santri dididik secara komprehensif dalam bidang ilmu agama, akhlak, dan kemandirian.',
            facilities: '["Masjid", "Asrama Putra", "Asrama Putri", "Ruang Kelas", "Perpustakaan", "Lapangan Olahraga"]',
            programs: '["Tahfidz Al-Quran", "Kajian Kitab Kuning", "Bahasa Arab", "Bahasa Inggris"]'
          },
          {
            id: '2',
            name: 'Madrasah Ibtidaiyah (MI)',
            type: 'mi',
            description: 'MI Al Mujahidin menyelenggarakan pendidikan dasar dengan kurikulum terpadu yang mengintegrasikan kurikulum nasional dan kurikulum pesantren.',
            facilities: '["Ruang Kelas Ber-AC", "Perpustakaan", "Laboratorium Komputer", "Lapangan Bermain"]',
            programs: '["Kurikulum Nasional", "Tahfidz Al-Quran", "Bahasa Arab", "Praktek Ibadah"]'
          },
          {
            id: '3',
            name: 'Madrasah Tsanawiyah (MTs)',
            type: 'mts',
            description: 'MTs Al Mujahidin menawarkan pendidikan menengah pertama dengan penguatan karakter Islami dan peningkatan kompetensi akademik.',
            facilities: '["Ruang Kelas Ber-AC", "Laboratorium IPA", "Laboratorium Komputer", "Perpustakaan"]',
            programs: '["Kurikulum Nasional", "Tahfidz Al-Quran", "Bahasa Arab & Inggris", "IPA & IPS"]'
          },
          {
            id: '4',
            name: 'Madrasah Aliyah (MA)',
            type: 'ma',
            description: 'MA Al Mujahidin menyiapkan lulusan yang siap melanjutkan ke perguruan tinggi dengan bekal ilmu agama dan ilmu umum.',
            facilities: '["Ruang Kelas Ber-AC", "Laboratorium IPA", "Laboratorium Bahasa", "Aula Serbaguna"]',
            programs: '["Jurusan IPA", "Jurusan IPS", "Jurusan Keagamaan", "Persiapan PTN"]'
          }
        ])
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchData()
  }, [])

  // Intersection Observer for active section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { threshold: 0.3 }
    )

    navItems.forEach((item) => {
      const section = document.getElementById(item.href.slice(1))
      if (section) observer.observe(section)
    })

    return () => observer.disconnect()
  }, [])

  const scrollToSection = (href: string) => {
    const element = document.getElementById(href.slice(1))
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMenuOpen(false)
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  // Get category badge color
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      pengumuman: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200',
      kegiatan: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200',
      pendidikan: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200',
      prestasi: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200',
      umum: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200',
    }
    return colors[category] || colors.umum
  }

  // Get unit icon
  const getUnitIcon = (type: string) => {
    const icons: Record<string, React.ReactNode> = {
      ponpes: <HomeIcon className="h-8 w-8" />,
      mi: <GraduationCap className="h-8 w-8" />,
      mts: <BookOpen className="h-8 w-8" />,
      ma: <Award className="h-8 w-8" />,
    }
    return icons[type] || <School className="h-8 w-8" />
  }

  // Contact form submit
  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          phone: formData.get('phone'),
          subject: formData.get('subject'),
          message: formData.get('message'),
        }),
      })
      
      const data = await res.json()
      if (data.success) {
        toast.success('Pesan berhasil dikirim!', {
          description: 'Kami akan segera menghubungi Anda.'
        })
        ;(e.target as HTMLFormElement).reset()
      } else {
        toast.error('Gagal mengirim pesan')
      }
    } catch {
      toast.error('Terjadi kesalahan')
    }
  }

  // PPDB form submit
  const handlePPDBSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    try {
      const res = await fetch('/api/ppdb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          nisn: formData.get('nisn'),
          nik: formData.get('nik'),
          placeOfBirth: formData.get('placeOfBirth'),
          dateOfBirth: formData.get('dateOfBirth'),
          gender: formData.get('gender'),
          religion: formData.get('religion'),
          address: formData.get('address'),
          phone: formData.get('phone'),
          email: formData.get('email'),
          fatherName: formData.get('fatherName'),
          fatherJob: formData.get('fatherJob'),
          fatherPhone: formData.get('fatherPhone'),
          motherName: formData.get('motherName'),
          motherJob: formData.get('motherJob'),
          motherPhone: formData.get('motherPhone'),
          schoolOrigin: formData.get('schoolOrigin'),
          schoolAddress: formData.get('schoolAddress'),
          graduationYear: formData.get('graduationYear'),
          unitType: formData.get('unitType'),
          notes: formData.get('notes'),
        }),
      })
      
      const data = await res.json()
      if (data.success) {
        toast.success('Pendaftaran berhasil!', {
          description: `Nomor pendaftaran: ${data.data.registrationId}`
        })
        ;(e.target as HTMLFormElement).reset()
      } else {
        toast.error('Gagal mendaftar')
      }
    } catch {
      toast.error('Terjadi kesalahan')
    }
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Bar */}
      <div className="bg-primary text-primary-foreground py-2 px-4 text-sm hidden md:block">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              {settings?.site_phone || '(0541) 123456'}
            </span>
            <span className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              {settings?.site_email || 'info@yalmuja.sch.id'}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Senin - Sabtu: 08:00 - 16:00
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a href={settings?.facebook_url} target="_blank" rel="noopener noreferrer" className="hover:opacity-80">
              <Facebook className="h-4 w-4" />
            </a>
            <a href={settings?.instagram_url} target="_blank" rel="noopener noreferrer" className="hover:opacity-80">
              <Instagram className="h-4 w-4" />
            </a>
            <a href={settings?.youtube_url} target="_blank" rel="noopener noreferrer" className="hover:opacity-80">
              <Youtube className="h-4 w-4" />
            </a>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="text-primary-foreground hover:bg-primary-foreground/10"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>

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
              <h1 className="font-bold text-lg leading-tight">Yayasan Al Mujahidin</h1>
              <p className="text-xs text-muted-foreground">Kalimantan Timur</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeSection === item.href.slice(1)
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
                }`}
              >
                {item.name}
              </button>
            ))}
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
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t bg-background"
            >
              <nav className="container mx-auto py-4 px-4 grid gap-1">
                {navItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => scrollToSection(item.href)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                      activeSection === item.href.slice(1)
                        ? 'text-primary bg-primary/10'
                        : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.name}</span>
                  </button>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1">
        {/* Hero Section with Image Slider */}
        <section id="beranda" className="relative min-h-[90vh] flex items-center overflow-hidden">
          {/* Image Slider Background */}
          <HeroSlider
            slides={defaultHeroSlides}
            autoPlay={true}
            interval={6000}
            showArrows={true}
            showDots={true}
            className="absolute inset-0"
          />

          {/* Content overlay */}
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center text-white">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Badge className="mb-6 bg-white/20 text-white border-white/30 text-sm backdrop-blur-sm">
                  Selamat Datang di
                </Badge>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 drop-shadow-lg"
              >
                {settings?.site_name || 'Yayasan Al Mujahidin'}
                <br />
                <span className="text-3xl md:text-4xl lg:text-5xl opacity-90">Kalimantan Timur</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg md:text-xl opacity-90 mb-8 max-w-2xl mx-auto drop-shadow-md"
              >
                {settings?.site_tagline || 'Membangun Generasi Berilmu dan Berakhlak'}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-wrap justify-center gap-4"
              >
                <Button
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg"
                  onClick={() => scrollToSection('#ppdb')}
                >
                  <UserPlus className="mr-2 h-5 w-5" />
                  Daftar Sekarang
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 backdrop-blur-sm"
                  onClick={() => scrollToSection('#profil')}
                >
                  Pelajari Lebih Lanjut
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 animate-bounce z-20">
            <ChevronLeft className="h-8 w-8 text-white rotate-[-90deg] opacity-70" />
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: Users, label: 'Santri Aktif', value: '1.200+' },
                { icon: GraduationCap, label: 'Alumni', value: '5.000+' },
                { icon: Award, label: 'Penghargaan', value: '50+' },
                { icon: Calendar, label: 'Tahun Berdiri', value: '1985' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <stat.icon className="h-10 w-10 mx-auto mb-3 text-primary" />
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Profile Section */}
        <section id="profil" className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <Badge className="mb-4">Tentang Kami</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Profil Yayasan</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Mengenal lebih dekat Yayasan Al Mujahidin Kalimantan Timur
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-70 h-70 relative rounded-2xl overflow-hidden bg-white mx-auto mb-4">
  <Image
    src="/images/logo-yayasan.png"
    alt="Logo Yayasan Al Mujahidin"
    fill
    className="object-contain p-2"
  />
</div>
                    <p className="text-muted-foreground">Yayasan Al Mujahidin Kaltim</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <Eye className="h-5 w-5 text-primary" />
                    Visi
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {settings?.profile_vision || 'Menjadi lembaga pendidikan Islam terkemuka yang menghasilkan generasi berilmu, berakhlak, dan berwawasan global.'}
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    Misi
                  </h3>
                  <ul className="text-muted-foreground space-y-2">
                    {(settings?.profile_mission || '1. Menyelenggarakan pendidikan Islam yang berkualitas\n2. Mengembangkan potensi siswa secara optimal\n3. Membangun lingkungan belajar yang kondusif').split('\n').map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <ChevronRight className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>{item.replace(/^\d+\.\s*/, '')}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <Building className="h-5 w-5 text-primary" />
                    Sejarah Singkat
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {settings?.profile_history || 'Yayasan Al Mujahidin Kalimantan Timur didirikan pada tahun 1985 oleh para ulama dan tokoh masyarakat yang peduli terhadap pendidikan Islam.'}
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Education Units Section */}
        <section id="unit-pendidikan" className="py-20 bg-muted/50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <Badge className="mb-4">Program Pendidikan</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Unit Pendidikan</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Empat jenjang pendidikan yang dikelola dengan kurikulum terpadu
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {educationUnits.map((unit, index) => (
                <motion.div
                  key={unit.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <CardHeader>
                      <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4">
                        {getUnitIcon(unit.type)}
                      </div>
                      <CardTitle className="text-lg">{unit.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                        {unit.description}
                      </p>
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-foreground">Program:</p>
                        <div className="flex flex-wrap gap-1">
                          {JSON.parse(unit.programs || '[]').slice(0, 3).map((prog: string, i: number) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {prog}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* News Section */}
        <section id="berita" className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <Badge className="mb-4">Informasi Terkini</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Berita & Kegiatan</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Update terbaru seputar kegiatan dan informasi yayasan
              </p>
            </motion.div>

            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <div className="aspect-video bg-muted animate-pulse" />
                    <CardHeader>
                      <div className="h-4 bg-muted rounded animate-pulse mb-2" />
                      <div className="h-4 bg-muted rounded animate-pulse w-2/3" />
                    </CardHeader>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {news.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="overflow-hidden h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group cursor-pointer">
                      <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/10 relative overflow-hidden">
                        {item.image ? (
                          <Image src={item.image} alt={item.title} fill className="object-cover" />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <FileText className="h-12 w-12 text-primary/30" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors" />
                      </div>
                      <CardHeader>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getCategoryColor(item.category)}>
                            {item.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(item.createdAt)}
                          </span>
                        </div>
                        <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                          {item.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {item.excerpt || item.content?.replace(/<[^>]*>/g, '').slice(0, 150)}
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button variant="ghost" className="text-primary group-hover:bg-primary/5">
                          Baca Selengkapnya
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Gallery Section */}
        <section id="galeri" className="py-20 bg-muted/50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <Badge className="mb-4">Dokumentasi</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Galeri Kegiatan</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Momen-momen penting dalam perjalanan yayasan
              </p>
            </motion.div>

            <Carousel
              opts={{
                align: 'start',
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent>
                {gallery.map((item, index) => (
                  <CarouselItem key={item.id} className="md:basis-1/2 lg:basis-1/3">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                      viewport={{ once: true }}
                    >
                      <Card className="overflow-hidden group cursor-pointer">
                        <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/10 relative">
                          {item.image ? (
                            <Image src={item.image} alt={item.title} fill className="object-cover" />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <ImageIcon className="h-12 w-12 text-primary/30" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                            <Eye className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <h4 className="font-medium line-clamp-1">{item.title}</h4>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {item.description}
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-4" />
              <CarouselNext className="right-4" />
            </Carousel>
          </div>
        </section>

        {/* PPDB Section */}
        <section id="ppdb" className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <Badge className="mb-4">Tahun Ajaran 2024/2025</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Pendaftaran Peserta Didik Baru</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Daftarkan diri Anda untuk bergabung bersama keluarga besar Al Mujahidin
              </p>
            </motion.div>

            <div className="max-w-4xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Formulir Pendaftaran</CardTitle>
                  <CardDescription>
                    Silakan isi data dengan lengkap dan benar
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePPDBSubmit} className="space-y-6">
                    {/* Data Pribadi */}
                    <div>
                      <h4 className="font-semibold mb-4 flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        Data Pribadi
                      </h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Nama Lengkap *</Label>
                          <Input id="name" name="name" required placeholder="Masukkan nama lengkap" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="nisn">NISN</Label>
                          <Input id="nisn" name="nisn" placeholder="Nomor Induk Siswa Nasional" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="nik">NIK</Label>
                          <Input id="nik" name="nik" placeholder="Nomor Induk Kependudukan" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="placeOfBirth">Tempat Lahir</Label>
                          <Input id="placeOfBirth" name="placeOfBirth" placeholder="Kota kelahiran" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="dateOfBirth">Tanggal Lahir</Label>
                          <Input id="dateOfBirth" name="dateOfBirth" type="date" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="gender">Jenis Kelamin *</Label>
                          <Select name="gender" required>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih jenis kelamin" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="L">Laki-laki</SelectItem>
                              <SelectItem value="P">Perempuan</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="religion">Agama</Label>
                          <Select name="religion" defaultValue="Islam">
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih agama" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Islam">Islam</SelectItem>
                              <SelectItem value="Kristen">Kristen</SelectItem>
                              <SelectItem value="Katolik">Katolik</SelectItem>
                              <SelectItem value="Hindu">Hindu</SelectItem>
                              <SelectItem value="Buddha">Buddha</SelectItem>
                              <SelectItem value="Konghucu">Konghucu</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="address">Alamat</Label>
                          <Textarea id="address" name="address" placeholder="Alamat lengkap" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">No. HP/WhatsApp</Label>
                          <Input id="phone" name="phone" placeholder="08xxxxxxxxxx" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" name="email" type="email" placeholder="email@example.com" />
                        </div>
                      </div>
                    </div>

                    {/* Data Orang Tua */}
                    <div>
                      <h4 className="font-semibold mb-4 flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        Data Orang Tua/Wali
                      </h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="fatherName">Nama Ayah</Label>
                          <Input id="fatherName" name="fatherName" placeholder="Nama ayah kandung" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="fatherJob">Pekerjaan Ayah</Label>
                          <Input id="fatherJob" name="fatherJob" placeholder="Pekerjaan ayah" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="fatherPhone">No. HP Ayah</Label>
                          <Input id="fatherPhone" name="fatherPhone" placeholder="08xxxxxxxxxx" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="motherName">Nama Ibu</Label>
                          <Input id="motherName" name="motherName" placeholder="Nama ibu kandung" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="motherJob">Pekerjaan Ibu</Label>
                          <Input id="motherJob" name="motherJob" placeholder="Pekerjaan ibu" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="motherPhone">No. HP Ibu</Label>
                          <Input id="motherPhone" name="motherPhone" placeholder="08xxxxxxxxxx" />
                        </div>
                      </div>
                    </div>

                    {/* Data Pendidikan */}
                    <div>
                      <h4 className="font-semibold mb-4 flex items-center gap-2">
                        <GraduationCap className="h-5 w-5 text-primary" />
                        Data Pendidikan
                      </h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="schoolOrigin">Asal Sekolah</Label>
                          <Input id="schoolOrigin" name="schoolOrigin" placeholder="Nama sekolah asal" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="graduationYear">Tahun Lulus</Label>
                          <Input id="graduationYear" name="graduationYear" placeholder="2024" />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="schoolAddress">Alamat Sekolah Asal</Label>
                          <Textarea id="schoolAddress" name="schoolAddress" placeholder="Alamat sekolah asal" />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="unitType">Unit Pendidikan yang Dituju *</Label>
                          <Select name="unitType" required>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih unit pendidikan" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ponpes">Pondok Pesantren</SelectItem>
                              <SelectItem value="mi">Madrasah Ibtidaiyah (MI)</SelectItem>
                              <SelectItem value="mts">Madrasah Tsanawiyah (MTs)</SelectItem>
                              <SelectItem value="ma">Madrasah Aliyah (MA)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Catatan */}
                    <div className="space-y-2">
                      <Label htmlFor="notes">Catatan Tambahan</Label>
                      <Textarea id="notes" name="notes" placeholder="Informasi tambahan jika ada" />
                    </div>

                    <Button type="submit" className="w-full" size="lg">
                      <Send className="mr-2 h-5 w-5" />
                      Kirim Pendaftaran
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Scholarship Section */}
        <section id="beasiswa" className="py-20 bg-muted/50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <Badge className="mb-4">Program Bantuan</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Beasiswa</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Kesempatan beasiswa untuk santri/siswi berprestasi
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {scholarships.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <CardHeader>
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4">
                        <Gift className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {item.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm font-medium mb-2">Keuntungan:</p>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {item.benefits?.split('\n').slice(0, 3).map((benefit, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <Heart className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                              <span>{benefit.replace(/^\d+\.\s*/, '')}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      {item.deadline && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>Deadline: {item.deadline}</span>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        Lihat Detail
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="kontak" className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <Badge className="mb-4">Hubungi Kami</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Kontak</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Silakan hubungi kami untuk informasi lebih lanjut
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Informasi Kontak</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary flex-shrink-0">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">Alamat</p>
                        <p className="text-sm text-muted-foreground">
                          {settings?.site_address || 'Jl. Pondok Pesantren No. 1, Samarinda, Kalimantan Timur'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary flex-shrink-0">
                        <Phone className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">Telepon</p>
                        <p className="text-sm text-muted-foreground">
                          {settings?.site_phone || '(0541) 123456'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary flex-shrink-0">
                        <Mail className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">Email</p>
                        <p className="text-sm text-muted-foreground">
                          {settings?.site_email || 'info@yalmuja.sch.id'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center text-green-600 dark:text-green-400 flex-shrink-0">
                        <MessageCircle className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">WhatsApp</p>
                        <a 
                          href={`https://wa.me/${settings?.site_whatsapp || '6281234567890'}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-green-600 dark:text-green-400 hover:underline"
                        >
                          +{settings?.site_whatsapp || '62 812 3456 7890'}
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Map placeholder */}
                <Card className="overflow-hidden">
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="h-12 w-12 text-primary/30 mx-auto mb-2" />
                      <p className="text-muted-foreground">Peta Lokasi</p>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Kirim Pesan</CardTitle>
                    <CardDescription>
                      Kami akan merespons pesan Anda secepatnya
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleContactSubmit} className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="contact-name">Nama *</Label>
                          <Input id="contact-name" name="name" required placeholder="Nama Anda" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="contact-email">Email *</Label>
                          <Input id="contact-email" name="email" type="email" required placeholder="email@example.com" />
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="contact-phone">No. HP</Label>
                          <Input id="contact-phone" name="phone" placeholder="08xxxxxxxxxx" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="contact-subject">Subjek *</Label>
                          <Input id="contact-subject" name="subject" required placeholder="Subjek pesan" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contact-message">Pesan *</Label>
                        <Textarea 
                          id="contact-message" 
                          name="message" 
                          required 
                          placeholder="Tulis pesan Anda di sini..."
                          rows={5}
                        />
                      </div>
                      <Button type="submit" className="w-full">
                        <Send className="mr-2 h-4 w-4" />
                        Kirim Pesan
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d5c3d] via-[#178a58] to-[#0a4a32]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#052e1d]/80 via-transparent to-transparent" />
        <div className="absolute inset-0 hero-pattern opacity-20" />
        
        <div className="relative z-10 py-12 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* About */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 relative rounded-lg overflow-hidden bg-white">
  <Image
    src="/images/logo-yayasan.png"
    alt="Logo Yayasan Al Mujahidin"
    fill
    className="object-contain"
  />
</div>
                <div>
                  <h3 className="font-bold">Yayasan Al Mujahidin</h3>
                  <p className="text-sm opacity-80">Kalimantan Timur</p>
                </div>
              </div>
              <p className="text-sm opacity-80 leading-relaxed">
                {settings?.site_description?.slice(0, 150) || 'Yayasan Pendidikan Al Mujahidin Kalimantan Timur mengelola Pondok Pesantren, MI, MTs, dan MA dengan kurikulum terpadu.'}
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4">Tautan Cepat</h4>
              <ul className="space-y-2">
                {navItems.slice(0, 5).map((item) => (
                  <li key={item.name}>
                    <button
                      onClick={() => scrollToSection(item.href)}
                      className="text-sm opacity-80 hover:opacity-100 transition-opacity"
                    >
                      {item.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Education Units */}
            <div>
              <h4 className="font-semibold mb-4">Unit Pendidikan</h4>
              <ul className="space-y-2">
                <li><span className="text-sm opacity-80">Pondok Pesantren</span></li>
                <li><span className="text-sm opacity-80">Madrasah Ibtidaiyah (MI)</span></li>
                <li><span className="text-sm opacity-80">Madrasah Tsanawiyah (MTs)</span></li>
                <li><span className="text-sm opacity-80">Madrasah Aliyah (MA)</span></li>
              </ul>
            </div>

            {/* Social Media */}
            <div>
              <h4 className="font-semibold mb-4">Media Sosial</h4>
              <div className="flex gap-3">
                <a
                  href={settings?.facebook_url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href={settings?.instagram_url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href={settings?.youtube_url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <Youtube className="h-5 w-5" />
                </a>
              </div>
              <div className="mt-4">
                <p className="text-sm opacity-80">{settings?.site_email}</p>
                <p className="text-sm opacity-80">{settings?.site_phone}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-white/20 pt-8 text-center">
            <p className="text-sm opacity-80">
              © {new Date().getFullYear()} Yayasan Al Mujahidin Kalimantan Timur. All rights reserved.
            </p>
          </div>
        </div>
        </div>
      </footer>
    </div>
  )
}
