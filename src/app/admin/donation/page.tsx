'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import {
  ArrowLeft, Save, Loader2, Upload, X, Image as ImageIcon,
  Plus, Trash2, CreditCard, QrCode, Phone, Mail,
  Heart, Building, Users, BookOpen
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'

interface BankAccount {
  bank: string
  accountNumber: string
  accountName: string
}

interface Stat {
  label: string
  value: string
  description: string
}

interface DonationSettings {
  heroTitle: string
  heroDescription: string
  heroImage: string
  bankAccounts: BankAccount[]
  qrisImage: string
  whatsappNumber: string
  donationEmail: string
  stats: Stat[]
}

const defaultBankAccount: BankAccount = {
  bank: '',
  accountNumber: '',
  accountName: '',
}

const defaultStat: Stat = {
  label: '',
  value: '',
  description: '',
}

export default function DonationSettingsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploadingHero, setIsUploadingHero] = useState(false)
  const [isUploadingQris, setIsUploadingQris] = useState(false)
  const [settings, setSettings] = useState<DonationSettings>({
    heroTitle: '',
    heroDescription: '',
    heroImage: '',
    bankAccounts: [],
    qrisImage: '',
    whatsappNumber: '',
    donationEmail: '',
    stats: [],
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/donations')
      const data = await res.json()
      
      if (data.success) {
        setSettings(data.data)
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
      toast.error('Gagal memuat pengaturan')
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = async (file: File, type: 'hero' | 'qris') => {
    if (type === 'hero') {
      setIsUploadingHero(true)
    } else {
      setIsUploadingQris(true)
    }

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (data.success && data.url) {
        if (type === 'hero') {
          setSettings({ ...settings, heroImage: data.url })
        } else {
          setSettings({ ...settings, qrisImage: data.url })
        }
        toast.success('Gambar berhasil diupload')
      } else {
        toast.error('Gagal mengupload gambar')
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error('Terjadi kesalahan saat upload')
    } finally {
      if (type === 'hero') {
        setIsUploadingHero(false)
      } else {
        setIsUploadingQris(false)
      }
    }
  }

  const addBankAccount = () => {
    setSettings({
      ...settings,
      bankAccounts: [...settings.bankAccounts, { ...defaultBankAccount }],
    })
  }

  const removeBankAccount = (index: number) => {
    const newAccounts = settings.bankAccounts.filter((_, i) => i !== index)
    setSettings({ ...settings, bankAccounts: newAccounts })
  }

  const updateBankAccount = (index: number, field: keyof BankAccount, value: string) => {
    const newAccounts = [...settings.bankAccounts]
    newAccounts[index] = { ...newAccounts[index], [field]: value }
    setSettings({ ...settings, bankAccounts: newAccounts })
  }

  const addStat = () => {
    setSettings({
      ...settings,
      stats: [...settings.stats, { ...defaultStat }],
    })
  }

  const removeStat = (index: number) => {
    const newStats = settings.stats.filter((_, i) => i !== index)
    setSettings({ ...settings, stats: newStats })
  }

  const updateStat = (index: number, field: keyof Stat, value: string) => {
    const newStats = [...settings.stats]
    newStats[index] = { ...newStats[index], [field]: value }
    setSettings({ ...settings, stats: newStats })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const res = await fetch('/api/admin/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })

      const data = await res.json()

      if (data.success) {
        toast.success('Pengaturan donasi berhasil disimpan')
      } else {
        toast.error(data.message || 'Gagal menyimpan pengaturan')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      toast.error('Terjadi kesalahan')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Pengaturan Donasi</h1>
          <p className="text-muted-foreground">Kelola halaman dan informasi donasi</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Hero Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              Hero Section
            </CardTitle>
            <CardDescription>
              Tampilan bagian atas halaman donasi
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="heroTitle">Judul Hero</Label>
              <Input
                id="heroTitle"
                placeholder="Berdonasi untuk Pendidikan Islam"
                value={settings.heroTitle}
                onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="heroDescription">Deskripsi Hero</Label>
              <Textarea
                id="heroDescription"
                placeholder="Jadilah bagian dari misi kami..."
                rows={3}
                value={settings.heroDescription}
                onChange={(e) => setSettings({ ...settings, heroDescription: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Gambar Hero (Opsional)</Label>
              {settings.heroImage ? (
                <div className="relative inline-block">
                  <img
                    src={settings.heroImage}
                    alt="Hero"
                    className="max-h-48 rounded-lg border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => setSettings({ ...settings, heroImage: '' })}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground mb-4">
                    Upload gambar hero untuk halaman donasi
                  </p>
                  <label htmlFor="hero-upload">
                    <input
                      id="hero-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleImageUpload(file, 'hero')
                      }}
                      disabled={isUploadingHero}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      disabled={isUploadingHero}
                      asChild
                    >
                      <span className="cursor-pointer">
                        {isUploadingHero ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="mr-2 h-4 w-4" />
                            Pilih Gambar
                          </>
                        )}
                      </span>
                    </Button>
                  </label>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Bank Accounts */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Rekening Bank
                </CardTitle>
                <CardDescription>
                  Daftar rekening untuk menerima donasi
                </CardDescription>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={addBankAccount}>
                <Plus className="mr-2 h-4 w-4" />
                Tambah Rekening
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {settings.bankAccounts.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Belum ada rekening. Klik "Tambah Rekening" untuk menambahkan.
              </p>
            ) : (
              settings.bankAccounts.map((account, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Rekening #{index + 1}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeBankAccount(index)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Nama Bank</Label>
                      <Input
                        placeholder="Bank BSI"
                        value={account.bank}
                        onChange={(e) => updateBankAccount(index, 'bank', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Nomor Rekening</Label>
                      <Input
                        placeholder="1234567890"
                        value={account.accountNumber}
                        onChange={(e) => updateBankAccount(index, 'accountNumber', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Atas Nama</Label>
                      <Input
                        placeholder="Yayasan Al Mujahidin"
                        value={account.accountName}
                        onChange={(e) => updateBankAccount(index, 'accountName', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* QRIS Image */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5 text-primary" />
              QRIS
            </CardTitle>
            <CardDescription>
              Gambar QRIS untuk pembayaran via e-wallet
            </CardDescription>
          </CardHeader>
          <CardContent>
            {settings.qrisImage ? (
              <div className="relative inline-block">
                <img
                  src={settings.qrisImage}
                  alt="QRIS"
                  className="max-h-64 rounded-lg border"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => setSettings({ ...settings, qrisImage: '' })}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <QrCode className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground mb-4">
                  Upload gambar QRIS untuk pembayaran e-wallet
                </p>
                <label htmlFor="qris-upload">
                  <input
                    id="qris-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleImageUpload(file, 'qris')
                    }}
                    disabled={isUploadingQris}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isUploadingQris}
                    asChild
                  >
                    <span className="cursor-pointer">
                      {isUploadingQris ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          Upload QRIS
                        </>
                      )}
                    </span>
                  </Button>
                </label>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-primary" />
              Kontak Konfirmasi
            </CardTitle>
            <CardDescription>
              Informasi kontak untuk konfirmasi donasi
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="whatsappNumber">
                  <Phone className="h-4 w-4 inline mr-2" />
                  Nomor WhatsApp
                </Label>
                <Input
                  id="whatsappNumber"
                  placeholder="6281234567890"
                  value={settings.whatsappNumber}
                  onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Format: 628xxxxxxxxxx (tanpa +)
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="donationEmail">
                  <Mail className="h-4 w-4 inline mr-2" />
                  Email Donasi
                </Label>
                <Input
                  id="donationEmail"
                  type="email"
                  placeholder="donasi@yalmuja.sch.id"
                  value={settings.donationEmail}
                  onChange={(e) => setSettings({ ...settings, donationEmail: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Impact Stats */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Statistik Dampak
                </CardTitle>
                <CardDescription>
                  Tampilkan dampak donasi di halaman publik
                </CardDescription>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={addStat}>
                <Plus className="mr-2 h-4 w-4" />
                Tambah Statistik
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {settings.stats.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Belum ada statistik. Klik "Tambah Statistik" untuk menambahkan.
              </p>
            ) : (
              settings.stats.map((stat, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Statistik #{index + 1}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeStat(index)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Label</Label>
                      <Input
                        placeholder="Santri Terbantu"
                        value={stat.label}
                        onChange={(e) => updateStat(index, 'label', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Nilai</Label>
                      <Input
                        placeholder="500+"
                        value={stat.value}
                        onChange={(e) => updateStat(index, 'value', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Deskripsi</Label>
                      <Input
                        placeholder="Santri kurang mampu yang mendapat beasiswa"
                        value={stat.description}
                        onChange={(e) => updateStat(index, 'description', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Separator />

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Batal
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Simpan Pengaturan
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
