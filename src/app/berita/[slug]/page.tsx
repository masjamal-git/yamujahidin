'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowLeft, Calendar, User, Tag, Eye, Share2, Facebook,
  Twitter, Linkedin, ChevronRight, Clock, ArrowRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'

interface NewsDetail {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  image: string | null
  category: string
  viewCount: number
  createdAt: string
  authorId: string | null
}

interface RelatedNews {
  id: string
  title: string
  slug: string
  excerpt: string | null
  image: string | null
  category: string
  createdAt: string
}

const categoryColors: Record<string, string> = {
  umum: 'bg-gray-500',
  pendidikan: 'bg-blue-500',
  kegiatan: 'bg-green-500',
  pengumuman: 'bg-amber-500',
  prestasi: 'bg-purple-500',
}

const categoryLabels: Record<string, string> = {
  umum: 'Umum',
  pendidikan: 'Pendidikan',
  kegiatan: 'Kegiatan',
  pengumuman: 'Pengumuman',
  prestasi: 'Prestasi',
}

export default function NewsDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [news, setNews] = useState<NewsDetail | null>(null)
  const [relatedNews, setRelatedNews] = useState<RelatedNews[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const slug = params.slug as string

  useEffect(() => {
    if (slug) {
      fetchNews()
    }
  }, [slug])

  const fetchNews = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Fetch news detail
      const res = await fetch(`/api/news/${slug}`)
      const data = await res.json()
      
      if (data.success && data.data) {
        setNews(data.data)
        // Fetch related news
        fetchRelatedNews(data.data.category, data.data.id)
      } else {
        setError(data.message || 'Berita tidak ditemukan')
      }
    } catch (err) {
      console.error('Error fetching news:', err)
      setError('Terjadi kesalahan saat memuat berita')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchRelatedNews = async (category: string, currentId: string) => {
    try {
      const res = await fetch(`/api/news?limit=3`)
      const data = await res.json()
      if (data.success) {
        const filtered = data.data.filter((item: RelatedNews) => item.id !== currentId).slice(0, 3)
        setRelatedNews(filtered)
      }
    } catch (err) {
      console.error('Error fetching related news:', err)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''

  const handleShare = (platform: string) => {
    const text = news?.title || ''
    let url = ''
    
    switch (platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
        break
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`
        break
      case 'linkedin':
        url = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(text)}`
        break
      case 'copy':
        navigator.clipboard.writeText(shareUrl)
        return
    }
    
    if (url) {
      window.open(url, '_blank', 'width=600,height=400')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-32 mb-6" />
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-10 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/2 mb-6" />
            <Skeleton className="aspect-video w-full mb-6 rounded-lg" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !news) {
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
          <h1 className="text-2xl font-bold mb-2">Berita Tidak Ditemukan</h1>
          <p className="text-muted-foreground mb-6">{error || 'Berita yang Anda cari tidak tersedia.'}</p>
          <Button onClick={() => router.push('/#berita')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Beranda
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/#beranda" className="hover:text-primary">Beranda</Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/#berita" className="hover:text-primary">Berita</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground truncate max-w-[200px]">{news.title}</span>
        </nav>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Header */}
              <header className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <Badge className={categoryColors[news.category] || 'bg-gray-500'}>
                    {categoryLabels[news.category] || news.category}
                  </Badge>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(news.createdAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {news.viewCount} views
                    </span>
                  </div>
                </div>
                
                <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                  {news.title}
                </h1>
                
                {news.excerpt && (
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {news.excerpt}
                  </p>
                )}
              </header>

              {/* Featured Image */}
              {news.image && (
                <div className="relative aspect-video rounded-xl overflow-hidden mb-8 bg-muted">
                  <Image
                    src={news.image}
                    alt={news.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              )}

              {/* Content */}
              <div 
                className="prose prose-lg max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: news.content }}
              />

              {/* Share Buttons */}
              <Separator className="my-8" />
              
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Bagikan:</span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleShare('facebook')}
                    >
                      <Facebook className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleShare('twitter')}
                    >
                      <Twitter className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleShare('linkedin')}
                    >
                      <Linkedin className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleShare('copy')}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <Button variant="ghost" onClick={() => router.push('/#berita')}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Kembali ke Berita
                </Button>
              </div>
            </motion.article>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="sticky top-24"
            >
              {/* Related News */}
              {relatedNews.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Berita Lainnya</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {relatedNews.map((item) => (
                      <Link 
                        key={item.id} 
                        href={`/berita/${item.slug}`}
                        className="block group"
                      >
                        <div className="flex gap-3">
                          {item.image ? (
                            <div className="relative w-20 h-14 rounded overflow-hidden flex-shrink-0 bg-muted">
                              <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-20 h-14 rounded bg-muted flex-shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
                              {item.title}
                            </h4>
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatDate(item.createdAt)}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                    <Link href="/#berita">
                      <Button variant="ghost" className="w-full mt-2">
                        Lihat Semua Berita
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}

              {/* Categories */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">Kategori</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(categoryLabels).map(([key, label]) => (
                      <Badge 
                        key={key} 
                        variant={news.category === key ? 'default' : 'outline'}
                        className={news.category === key ? categoryColors[key] : ''}
                      >
                        {label}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
