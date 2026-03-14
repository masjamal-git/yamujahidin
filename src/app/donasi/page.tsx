'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  Heart, Banknote, Building, Users, BookOpen,
  Phone, ChevronRight, CheckCircle2,
  Copy, CreditCard, QrCode, ArrowLeft, Shield,
  Clock, Gift, HandHeart, Sparkles, Mail
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'

const donationCategories = [
  {
    id: 'pendidikan',
    title: 'Pendidikan',
    icon: BookOpen,
    description: 'Bantu pendidikan santri dan siswa yang kurang mampu',
    color: 'bg-blue-500',
  },
  {
    id: 'pembangunan',
    title: 'Pembangunan',
    icon: Building,
    description: 'Pembangunan dan renovasi fasilitas pendidikan',
    color: 'bg-green-500',
  },
  {
    id: 'yatim',
    title: 'Anak Yatim',
    icon: Heart,
    description: 'Dukungan khusus untuk santri anak yatim',
    color: 'bg-purple-500',
  },
  {
    id: 'umum',
    title: 'Umum',
    icon: HandHeart,
    description: 'Donasi untuk kegiatan operasional yayasan',
    color: 'bg-amber-500',
  },
]

const bankAccounts = [
  {
    bank: 'Bank Syariah Indonesia (BSI)',
    accountNumber: '7123456789',
    accountName: 'Yayasan Al Mujahidin Kaltim',
  },
  {
    bank: 'Bank Muamalat',
    accountNumber: '8123456789',
    accountName: 'Yayasan Al Mujahidin Kaltim',
  },
  {
    bank: 'Bank BRI',
    accountNumber: '0123456789',
    accountName: 'Yayasan Al Mujahidin Kaltim',
  },
]

const suggestedAmounts = [50000, 100000, 250000, 500000, 1000000, 2000000]

export default function DonasiPage() {
  const [selectedCategory, setSelectedCategory] = useState('umum')
  const [amount, setAmount] = useState('')
  const [customAmount, setCustomAmount] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleAmountSelect = (value: string) => {
    setAmount(value)
    if (value !== 'custom') {
      setCustomAmount('')
    }
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} berhasil disalin!`)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const finalAmount = amount === 'custom' ? customAmount : amount
    
    if (!finalAmount || parseInt(finalAmount) < 10000) {
      toast.error('Minimal donasi Rp 10.000')
      return
    }

    if (!formData.name) {
      toast.error('Nama lengkap wajib diisi')
      return
    }

    setIsSubmitting(true)

    try {
      const res = await fetch('/api/donation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email || null,
          phone: formData.phone || null,
          amount: finalAmount,
          message: formData.message || null,
          paymentMethod: selectedCategory,
        }),
      })

      const data = await res.json()

      if (data.success) {
        setShowSuccess(true)
        toast.success('Terima kasih atas donasi Anda!')
      } else {
        toast.error('Gagal memproses donasi')
      }
    } catch {
      toast.error('Terjadi kesalahan')
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value)
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
        >
          <Card className="border-green-200 dark:border-green-800">
            <CardContent className="pt-8 pb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
              </motion.div>
              <h2 className="text-2xl font-bold mb-2">Terima Kasih!</h2>
              <p className="text-muted-foreground mb-6">
                Donasi Anda telah tercatat. Silakan lakukan transfer sesuai nominal yang Anda pilih ke rekening yayasan.
              </p>
              <div className="bg-muted rounded-lg p-4 mb-6">
                <p className="text-sm text-muted-foreground mb-2">Total Donasi</p>
                <p className="text-2xl font-bold text-primary">
                  {formatCurrency(parseInt(amount === 'custom' ? customAmount : amount))}
                </p>
              </div>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Konfirmasi pembayaran via WhatsApp:
                </p>
                <Button asChild className="w-full">
                  <a href="https://wa.me/6281234567890?text=Assalamualaikum, saya ingin konfirmasi donasi" target="_blank" rel="noopener noreferrer">
                    <Phone className="mr-2 h-4 w-4" />
                    Konfirmasi via WhatsApp
                  </a>
                </Button>
                <Button variant="outline" asChild className="w-full">
                  <Link href="/">Kembali ke Beranda</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center px-4">
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
          <div className="ml-auto">
            <Button variant="ghost" asChild>
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-primary/10 via-background to-primary/5 overflow-hidden">
          <div className="container mx-auto px-4 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto text-center"
            >
              <Badge className="mb-4 bg-primary/10 text-primary">
                <Heart className="mr-2 h-3 w-3" />
                Berbagi Kebaikan
              </Badge>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Berdonasi untuk Pendidikan Islam
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Jadilah bagian dari misi kami dalam mencerdaskan kehidupan bangsa melalui pendidikan Islam yang berkualitas. Setiap donasi Anda adalah investasi akhirat yang tak ternilai.
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="h-5 w-5 text-green-500" />
                  <span>Amanah & Transparan</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-5 w-5 text-blue-500" />
                  <span>Konfirmasi Cepat</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Gift className="h-5 w-5 text-purple-500" />
                  <span>Laporan Berkala</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Donation Categories */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-8"
            >
              <h2 className="text-2xl font-bold mb-2">Pilih Program Donasi</h2>
              <p className="text-muted-foreground">Salurkan donasi Anda untuk program yang sesuai</p>
            </motion.div>
            <div className="grid md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {donationCategories.map((cat, index) => (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedCategory === cat.id
                        ? 'ring-2 ring-primary border-primary'
                        : ''
                    }`}
                    onClick={() => setSelectedCategory(cat.id)}
                  >
                    <CardContent className="p-4 text-center">
                      <div className={`w-12 h-12 ${cat.color} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                        <cat.icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="font-semibold mb-1">{cat.title}</h3>
                      <p className="text-xs text-muted-foreground">{cat.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Main Donation Form */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Form */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="lg:col-span-2"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Banknote className="h-5 w-5 text-primary" />
                      Formulir Donasi
                    </CardTitle>
                    <CardDescription>
                      Isi data diri dan nominal donasi Anda
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Amount Selection */}
                      <div className="space-y-4">
                        <Label className="text-base font-semibold">Nominal Donasi</Label>
                        <RadioGroup
                          value={amount}
                          onValueChange={handleAmountSelect}
                          className="grid grid-cols-3 gap-3"
                        >
                          {suggestedAmounts.map((amt) => (
                            <div key={amt}>
                              <RadioGroupItem
                                value={amt.toString()}
                                id={`amt-${amt}`}
                                className="peer sr-only"
                              />
                              <Label
                                htmlFor={`amt-${amt}`}
                                className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary cursor-pointer transition-all"
                              >
                                <span className="font-semibold text-sm">
                                  {formatCurrency(amt).replace('Rp', '').trim()}
                                </span>
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                        <div>
                          <Label htmlFor="customAmount" className="text-sm mb-2 block">
                            Atau masukkan nominal lain:
                          </Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">Rp</span>
                            <Input
                              id="customAmount"
                              type="number"
                              placeholder="Minimal 10.000"
                              className="pl-12"
                              value={customAmount}
                              onChange={(e) => {
                                setCustomAmount(e.target.value)
                                setAmount('custom')
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Personal Info */}
                      <div className="space-y-4">
                        <Label className="text-base font-semibold">Data Donatur</Label>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Nama Lengkap *</Label>
                            <Input
                              id="name"
                              placeholder="Nama Anda"
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">No. HP/WhatsApp</Label>
                            <Input
                              id="phone"
                              placeholder="08xxxxxxxxxx"
                              value={formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="email@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="message">Pesan / Doa (Opsional)</Label>
                          <Textarea
                            id="message"
                            placeholder="Tulis pesan atau doa Anda..."
                            rows={3}
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          />
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                            Memproses...
                          </>
                        ) : (
                          <>
                            <Heart className="mr-2 h-4 w-4" />
                            Donasi Sekarang
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Sidebar - Bank Info */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                {/* Bank Accounts */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <CreditCard className="h-5 w-5 text-primary" />
                      Rekening Donasi
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {bankAccounts.map((bank, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-lg border bg-muted/50"
                      >
                        <p className="font-semibold text-sm mb-1">{bank.bank}</p>
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-lg font-bold tracking-wide">
                            {bank.accountNumber}
                          </p>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => copyToClipboard(bank.accountNumber, 'Nomor rekening')}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          a.n. {bank.accountName}
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* QRIS */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <QrCode className="h-5 w-5 text-primary" />
                      QRIS
                    </CardTitle>
                    <CardDescription>
                      Scan untuk donasi via e-wallet
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-square bg-white rounded-lg p-4 flex items-center justify-center">
                      <div className="w-full h-full bg-muted rounded flex items-center justify-center">
                        <QrCode className="h-24 w-24 text-muted-foreground" />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground text-center mt-3">
                      Scan QRIS dengan GoPay, OVO, Dana, dll
                    </p>
                  </CardContent>
                </Card>

                {/* Contact */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Konfirmasi Donasi</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Setelah transfer, konfirmasi donasi Anda melalui:
                    </p>
                    <Button asChild variant="outline" className="w-full">
                      <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer">
                        <Phone className="mr-2 h-4 w-4" />
                        WhatsApp Admin
                      </a>
                    </Button>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span>donasi@yalmuja.sch.id</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Impact Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <Badge className="mb-4">Dampak Donasi</Badge>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Donasi Anda Sungguh Berarti
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Dengan donasi Anda, kami dapat terus menjalankan program pendidikan dan membantu lebih banyak santri
              </p>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[
                {
                  icon: Users,
                  value: '500+',
                  label: 'Santri Terbantu',
                  description: 'Santri kurang mampu yang mendapat beasiswa',
                },
                {
                  icon: Building,
                  value: '10+',
                  label: 'Gedung Dibangun',
                  description: 'Fasilitas pendidikan yang dibangun',
                },
                {
                  icon: BookOpen,
                  value: '1000+',
                  label: 'Alumni Berprestasi',
                  description: 'Alumni yang sukses di berbagai bidang',
                },
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="text-center h-full">
                    <CardContent className="pt-8 pb-6">
                      <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <item.icon className="h-7 w-7 text-primary" />
                      </div>
                      <p className="text-3xl font-bold text-primary mb-1">{item.value}</p>
                      <p className="font-semibold mb-1">{item.label}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 relative rounded-lg overflow-hidden bg-white">
                <Image
                  src="/images/logo-yayasan.png"
                  alt="Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <p className="font-semibold">Yayasan Al Mujahidin</p>
                <p className="text-xs opacity-80">Kalimantan Timur</p>
              </div>
            </div>
            <p className="text-sm opacity-80">
              &copy; {new Date().getFullYear()} Yayasan Al Mujahidin Kaltim. Semua hak dilindungi.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
