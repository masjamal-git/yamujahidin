import { notFound } from 'next/navigation'
import EducationUnitClient from './client'

// Static data for education units
const educationUnitsData: Record<string, {
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
}> = {
  ponpes: {
    id: '1',
    name: 'Pondok Pesantren Al Mujahidin',
    type: 'ponpes',
    description: 'Pondok Pesantren Al Mujahidin merupakan wadah pendidikan Islam intensif dengan sistem asrama. Santri dididik secara komprehensif dalam bidang ilmu agama, akhlak, dan kemandirian.',
    address: 'Jl. Pendidikan No. 1, Samarinda, Kalimantan Timur',
    phone: '(0541) 123456',
    email: 'ponpes@yalmuja.sch.id',
    image: null,
    facilities: ['Masjid', 'Asrama Putra', 'Asrama Putri', 'Ruang Kelas', 'Perpustakaan', 'Lapangan Olahraga'],
    programs: ['Tahfidz Al-Quran', 'Kajian Kitab Kuning', 'Bahasa Arab', 'Bahasa Inggris'],
  },
  mi: {
    id: '2',
    name: 'Madrasah Ibtidaiyah (MI)',
    type: 'mi',
    description: 'MI Al Mujahidin menyelenggarakan pendidikan dasar dengan kurikulum terpadu yang mengintegrasikan kurikulum nasional dan kurikulum pesantren.',
    address: 'Jl. Pendidikan No. 1, Samarinda, Kalimantan Timur',
    phone: '(0541) 123456',
    email: 'mi@yalmuja.sch.id',
    image: null,
    facilities: ['Ruang Kelas Ber-AC', 'Perpustakaan', 'Laboratorium Komputer', 'Lapangan Bermain'],
    programs: ['Kurikulum Nasional', 'Tahfidz Al-Quran', 'Bahasa Arab', 'Praktek Ibadah'],
  },
  mts: {
    id: '3',
    name: 'Madrasah Tsanawiyah (MTs)',
    type: 'mts',
    description: 'MTs Al Mujahidin menawarkan pendidikan menengah pertama dengan penguatan karakter Islami dan peningkatan kompetensi akademik.',
    address: 'Jl. Pendidikan No. 1, Samarinda, Kalimantan Timur',
    phone: '(0541) 123456',
    email: 'mts@yalmuja.sch.id',
    image: null,
    facilities: ['Ruang Kelas Ber-AC', 'Laboratorium IPA', 'Laboratorium Komputer', 'Perpustakaan'],
    programs: ['Kurikulum Nasional', 'Tahfidz Al-Quran', 'Bahasa Arab & Inggris', 'IPA & IPS'],
  },
  ma: {
    id: '4',
    name: 'Madrasah Aliyah (MA)',
    type: 'ma',
    description: 'MA Al Mujahidin menyiapkan lulusan yang siap melanjutkan ke perguruan tinggi dengan bekal ilmu agama dan ilmu umum.',
    address: 'Jl. Pendidikan No. 1, Samarinda, Kalimantan Timur',
    phone: '(0541) 123456',
    email: 'ma@yalmuja.sch.id',
    image: null,
    facilities: ['Ruang Kelas Ber-AC', 'Laboratorium IPA', 'Laboratorium Bahasa', 'Aula Serbaguna'],
    programs: ['Jurusan IPA', 'Jurusan IPS', 'Jurusan Keagamaan', 'Persiapan PTN'],
  },
}

// Generate static params for all education units
export function generateStaticParams() {
  return [
    { type: 'ponpes' },
    { type: 'mi' },
    { type: 'mts' },
    { type: 'ma' },
  ]
}

// Server Component - fetches data and passes to client
export default async function EducationUnitPage({ 
  params 
}: { 
  params: Promise<{ type: string }> 
}) {
  const { type } = await params
  const unit = educationUnitsData[type]
  
  if (!unit) {
    notFound()
  }
  
  return <EducationUnitClient unit={unit} />
}
