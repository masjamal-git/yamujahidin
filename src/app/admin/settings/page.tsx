'use client'

import { useEffect, useState } from 'react'
import { Save, Loader2, Building, Phone, Mail, Globe, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'

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

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    site_name: '',
    site_tagline: '',
    site_description: '',
    site_address: '',
    site_phone: '',
    site_email: '',
    site_whatsapp: '',
    facebook_url: '',
    instagram_url: '',
    youtube_url: '',
    profile_vision: '',
    profile_mission: '',
    profile_history: '',
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings')
      const data = await res.json()
      if (data.success) {
        setSettings(data.data as Settings)
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
      toast.error('Gagal mengambil pengaturan')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    
    try {
      // Save each setting
      const updates = Object.entries(settings).map(([key, value]) =>
        fetch('/api/admin/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key, value }),
        })
      )
      
      await Promise.all(updates)
      toast.success('Pengaturan berhasil disimpan')
    } catch {
      toast.error('Gagal menyimpan pengaturan')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Pengaturan</h1>
          <p className="text-muted-foreground">Kelola pengaturan website yayasan</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
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

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">Umum</TabsTrigger>
          <TabsTrigger value="contact">Kontak</TabsTrigger>
          <TabsTrigger value="social">Media Sosial</TabsTrigger>
          <TabsTrigger value="profile">Profil</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Pengaturan Umum
              </CardTitle>
              <CardDescription>
                Informasi dasar tentang website yayasan
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="site_name">Nama Yayasan</Label>
                <Input
                  id="site_name"
                  value={settings.site_name}
                  onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="site_tagline">Tagline</Label>
                <Input
                  id="site_tagline"
                  value={settings.site_tagline}
                  onChange={(e) => setSettings({ ...settings, site_tagline: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="site_description">Deskripsi</Label>
                <Textarea
                  id="site_description"
                  rows={4}
                  value={settings.site_description}
                  onChange={(e) => setSettings({ ...settings, site_description: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Informasi Kontak
              </CardTitle>
              <CardDescription>
                Kontak yang ditampilkan di website
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="site_address">Alamat</Label>
                <Textarea
                  id="site_address"
                  rows={2}
                  value={settings.site_address}
                  onChange={(e) => setSettings({ ...settings, site_address: e.target.value })}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="site_phone">Telepon</Label>
                  <Input
                    id="site_phone"
                    value={settings.site_phone}
                    onChange={(e) => setSettings({ ...settings, site_phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="site_email">Email</Label>
                  <Input
                    id="site_email"
                    type="email"
                    value={settings.site_email}
                    onChange={(e) => setSettings({ ...settings, site_email: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="site_whatsapp">WhatsApp</Label>
                <Input
                  id="site_whatsapp"
                  placeholder="628xxxxxxxxxx"
                  value={settings.site_whatsapp}
                  onChange={(e) => setSettings({ ...settings, site_whatsapp: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Media Sosial
              </CardTitle>
              <CardDescription>
                Tautan ke akun media sosial yayasan
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="facebook_url">Facebook</Label>
                <Input
                  id="facebook_url"
                  placeholder="https://facebook.com/..."
                  value={settings.facebook_url}
                  onChange={(e) => setSettings({ ...settings, facebook_url: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagram_url">Instagram</Label>
                <Input
                  id="instagram_url"
                  placeholder="https://instagram.com/..."
                  value={settings.instagram_url}
                  onChange={(e) => setSettings({ ...settings, instagram_url: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="youtube_url">YouTube</Label>
                <Input
                  id="youtube_url"
                  placeholder="https://youtube.com/..."
                  value={settings.youtube_url}
                  onChange={(e) => setSettings({ ...settings, youtube_url: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Profil Yayasan
              </CardTitle>
              <CardDescription>
                Informasi profil yayasan
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="profile_vision">Visi</Label>
                <Textarea
                  id="profile_vision"
                  rows={3}
                  value={settings.profile_vision}
                  onChange={(e) => setSettings({ ...settings, profile_vision: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile_mission">Misi</Label>
                <Textarea
                  id="profile_mission"
                  rows={5}
                  placeholder="Pisahkan dengan baris baru..."
                  value={settings.profile_mission}
                  onChange={(e) => setSettings({ ...settings, profile_mission: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile_history">Sejarah</Label>
                <Textarea
                  id="profile_history"
                  rows={5}
                  value={settings.profile_history}
                  onChange={(e) => setSettings({ ...settings, profile_history: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
