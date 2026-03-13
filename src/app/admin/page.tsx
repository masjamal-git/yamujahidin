'use client'

import { useState, useEffect } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { data: session, status } = useSession()
  const router = useRouter()

  // Redirect if already authenticated
  useEffect(() => {
    if (status === 'authenticated' && session) {
      router.replace('/admin/dashboard')
    }
  }, [status, session, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        toast.error('Email atau password salah')
        setIsLoading(false)
      } else {
        toast.success('Login berhasil!')
        // Use replace instead of push to avoid back button issues
        router.replace('/admin/dashboard')
        router.refresh()
      }
    } catch {
      toast.error('Terjadi kesalahan')
      setIsLoading(false)
    }
  }

  // Show loading while checking session
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0d5c3d] via-[#178a58] to-[#1ba067]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    )
  }

  // Don't render login form if already authenticated
  if (status === 'authenticated' && session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0d5c3d] via-[#178a58] to-[#1ba067]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0d5c3d] via-[#178a58] to-[#1ba067] p-4">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      
      <Card className="w-full max-w-md relative z-10">
        <CardHeader className="text-center">
          <div className="mx-auto w-24 h-24 relative rounded-2xl overflow-hidden bg-white mb-4 shadow-lg">
  <Image
    src="/images/logo-yayasan.png"
    alt="Logo Yayasan Al Mujahidin"
    fill
    className="object-contain"
  />
</div>
          <CardTitle className="text-2xl">Panel Admin</CardTitle>
          <CardDescription>
            Yayasan Al Mujahidin Kalimantan Timur
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@yalmuja.sch.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Masuk...
                </>
              ) : (
                'Masuk'
              )}
            </Button>
          </form>
          <div className="mt-6 pt-6 border-t text-center text-sm text-muted-foreground">
            <p>Demo login:</p>
            <p className="font-mono">admin@yalmuja.sch.id / admin123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
