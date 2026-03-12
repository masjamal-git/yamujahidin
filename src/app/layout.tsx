import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from 'next-themes'
import { Toaster } from '@/components/ui/sonner'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  title: 'Yayasan Al Mujahidin Kalimantan Timur',
  description: 'Website resmi Yayasan Pendidikan Al Mujahidin Kalimantan Timur - Membangun Generasi Berilmu dan Berakhlak',
  keywords: ['yayasan', 'pendidikan', 'islam', 'pesantren', 'madrasah', 'kalimantan timur', 'samarinda'],
  authors: [{ name: 'Yayasan Al Mujahidin' }],
  openGraph: {
    title: 'Yayasan Al Mujahidin Kalimantan Timur',
    description: 'Membangun Generasi Berilmu dan Berakhlak',
    type: 'website',
    locale: 'id_ID',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${poppins.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster position="top-center" richColors />
        </ThemeProvider>
      </body>
    </html>
  )
}
