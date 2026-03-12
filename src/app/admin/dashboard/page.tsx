'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Newspaper, Image as ImageIcon, Users, MessageCircle, TrendingUp, Calendar, Clock, Eye, ArrowUpRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface DashboardStats {
  newsCount: number
  galleryCount: number
  studentCount: number
  contactCount: number
}

interface RecentStudent {
  id: string
  registrationId: string
  name: string
  unitType: string
  status: string
  createdAt: string
}

interface RecentNews {
  id: string
  title: string
  category: string
  viewCount: number
  createdAt: string
}

export default function AdminDashboardPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentStudents, setRecentStudents] = useState<RecentStudent[]>([])
  const [recentNews, setRecentNews] = useState<RecentNews[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, studentsRes, newsRes] = await Promise.all([
          fetch('/api/admin/stats'),
          fetch('/api/ppdb?limit=5'),
          fetch('/api/news?limit=5'),
        ])
        
        const statsData = await statsRes.json()
        const studentsData = await studentsRes.json()
        const newsData = await newsRes.json()
        
        if (statsData.success) setStats(statsData.data)
        if (studentsData.success) setRecentStudents(studentsData.data)
        if (newsData.success) setRecentNews(newsData.data)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchData()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200',
      accepted: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200',
      rejected: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200',
    }
    return colors[status] || colors.pending
  }

  const getUnitLabel = (type: string) => {
    const labels: Record<string, string> = {
      ponpes: 'Ponpes',
      mi: 'MI',
      mts: 'MTs',
      ma: 'MA',
    }
    return labels[type] || type
  }

  const statCards = [
    { title: 'Total Berita', value: stats?.newsCount || 0, icon: Newspaper, color: 'text-blue-600', bgColor: 'bg-blue-100 dark:bg-blue-900' },
    { title: 'Galeri', value: stats?.galleryCount || 0, icon: ImageIcon, color: 'text-purple-600', bgColor: 'bg-purple-100 dark:bg-purple-900' },
    { title: 'Pendaftar', value: stats?.studentCount || 0, icon: Users, color: 'text-green-600', bgColor: 'bg-green-100 dark:bg-green-900' },
    { title: 'Pesan', value: stats?.contactCount || 0, icon: MessageCircle, color: 'text-orange-600', bgColor: 'bg-orange-100 dark:bg-orange-900' },
  ]

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-muted rounded w-24"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-16"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Selamat Datang, {session?.user?.name}!</h1>
          <p className="text-muted-foreground">Berikut ringkasan aktivitas yayasan</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs text-green-600 mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                <span>+12% dari bulan lalu</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Registrations */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Pendaftaran Terbaru</CardTitle>
              <CardDescription>Siswa yang baru mendaftar PPDB</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => router.push('/admin/students')}>
              Lihat Semua
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentStudents.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">Belum ada pendaftaran</p>
              ) : (
                recentStudents.map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-medium">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {student.registrationId} • {getUnitLabel(student.unitType)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(student.status)}>
                        {student.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground hidden sm:block">
                        {formatDate(student.createdAt)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent News */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Berita Terbaru</CardTitle>
              <CardDescription>Artikel yang baru dipublikasi</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => router.push('/admin/news')}>
              Lihat Semua
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentNews.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">Belum ada berita</p>
              ) : (
                recentNews.map((news) => (
                  <div key={news.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <div>
                      <p className="font-medium line-clamp-1">{news.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {news.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {news.viewCount}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground hidden sm:block">
                      {formatDate(news.createdAt)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Aksi Cepat</CardTitle>
          <CardDescription>Akses fitur yang sering digunakan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: 'Tambah Berita', icon: Newspaper, href: '/admin/news/add' },
              { title: 'Upload Galeri', icon: ImageIcon, href: '/admin/gallery/add' },
              { title: 'Data Siswa', icon: Users, href: '/admin/students' },
              { title: 'Pengaturan', icon: Calendar, href: '/admin/settings' },
            ].map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-auto py-4 flex flex-col gap-2"
                onClick={() => router.push(action.href)}
              >
                <action.icon className="h-6 w-6" />
                <span>{action.title}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
