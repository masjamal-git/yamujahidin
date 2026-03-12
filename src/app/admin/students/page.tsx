'use client'

import { useEffect, useState } from 'react'
import { Search, Users, Eye, Download, MoreHorizontal, CheckCircle, XCircle, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'

interface Student {
  id: string
  registrationId: string
  name: string
  nisn: string | null
  nik: string | null
  placeOfBirth: string | null
  dateOfBirth: string | null
  gender: string | null
  religion: string | null
  address: string | null
  phone: string | null
  email: string | null
  fatherName: string | null
  fatherJob: string | null
  fatherPhone: string | null
  motherName: string | null
  motherJob: string | null
  motherPhone: string | null
  guardianName: string | null
  guardianJob: string | null
  guardianPhone: string | null
  schoolOrigin: string | null
  schoolAddress: string | null
  graduationYear: string | null
  unitType: string | null
  status: string
  notes: string | null
  createdAt: string
}

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      const res = await fetch('/api/ppdb')
      const data = await res.json()
      if (data.success) {
        setStudents(data.data)
      }
    } catch (error) {
      console.error('Error fetching students:', error)
      toast.error('Gagal mengambil data siswa')
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/students/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      
      const data = await res.json()
      
      if (data.success) {
        toast.success('Status berhasil diupdate')
        setStudents(students.map(s => s.id === id ? { ...s, status } : s))
      } else {
        toast.error('Gagal mengupdate status')
      }
    } catch {
      toast.error('Terjadi kesalahan')
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200',
      accepted: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200',
      rejected: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200',
    }
    return colors[status] || colors.pending
  }

  const getStatusIcon = (status: string) => {
    const icons: Record<string, React.ReactNode> = {
      pending: <Clock className="h-3 w-3" />,
      accepted: <CheckCircle className="h-3 w-3" />,
      rejected: <XCircle className="h-3 w-3" />,
    }
    return icons[status] || icons.pending
  }

  const getUnitLabel = (type: string | null) => {
    const labels: Record<string, string> = {
      ponpes: 'Pondok Pesantren',
      mi: 'Madrasah Ibtidaiyah',
      mts: 'Madrasah Tsanawiyah',
      ma: 'Madrasah Aliyah',
    }
    return type ? labels[type] || type : '-'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  const filteredStudents = students.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.registrationId.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: students.length,
    pending: students.filter(s => s.status === 'pending').length,
    accepted: students.filter(s => s.status === 'accepted').length,
    rejected: students.filter(s => s.status === 'rejected').length,
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Data Siswa (PPDB)</h1>
          <p className="text-muted-foreground">Kelola pendaftaran peserta didik baru</p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Excel
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-sm text-muted-foreground">Total Pendaftar</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <p className="text-sm text-muted-foreground">Menunggu</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{stats.accepted}</div>
            <p className="text-sm text-muted-foreground">Diterima</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
            <p className="text-sm text-muted-foreground">Ditolak</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari nama atau ID pendaftaran..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="pending">Menunggu</SelectItem>
                <SelectItem value="accepted">Diterima</SelectItem>
                <SelectItem value="rejected">Ditolak</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 animate-pulse">
                  <div className="h-10 w-10 bg-muted rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-1/3"></div>
                    <div className="h-3 bg-muted rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground">Tidak ada data siswa ditemukan</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No. Pendaftaran</TableHead>
                    <TableHead>Nama</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Kontak</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead className="w-[70px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-mono text-sm">
                        {student.registrationId}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {student.email || student.phone}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{getUnitLabel(student.unitType)}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{student.phone || '-'}</span>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(student.status)}>
                          {getStatusIcon(student.status)}
                          <span className="ml-1">{student.status}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(student.createdAt)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setSelectedStudent(student)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Lihat Detail
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusUpdate(student.id, 'accepted')}>
                              <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                              Terima
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusUpdate(student.id, 'rejected')}>
                              <XCircle className="mr-2 h-4 w-4 text-red-600" />
                              Tolak
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Student Detail Dialog */}
      <Dialog open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detail Pendaftaran</DialogTitle>
            <DialogDescription>
              No. Pendaftaran: {selectedStudent?.registrationId}
            </DialogDescription>
          </DialogHeader>
          
          {selectedStudent && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{selectedStudent.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {getUnitLabel(selectedStudent.unitType)}
                  </p>
                </div>
                <Badge className={getStatusColor(selectedStudent.status)}>
                  {selectedStudent.status}
                </Badge>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Data Pribadi</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">NISN</span>
                      <span>{selectedStudent.nisn || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">NIK</span>
                      <span>{selectedStudent.nik || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">TTL</span>
                      <span>{selectedStudent.placeOfBirth}, {selectedStudent.dateOfBirth || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Jenis Kelamin</span>
                      <span>{selectedStudent.gender === 'L' ? 'Laki-laki' : selectedStudent.gender === 'P' ? 'Perempuan' : '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Agama</span>
                      <span>{selectedStudent.religion || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Alamat</span>
                      <span className="text-right max-w-[200px]">{selectedStudent.address || '-'}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Data Orang Tua</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Ayah</span>
                      <span>{selectedStudent.fatherName || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Pekerjaan Ayah</span>
                      <span>{selectedStudent.fatherJob || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Ibu</span>
                      <span>{selectedStudent.motherName || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Pekerjaan Ibu</span>
                      <span>{selectedStudent.motherJob || '-'}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Asal Sekolah</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sekolah</span>
                      <span>{selectedStudent.schoolOrigin || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tahun Lulus</span>
                      <span>{selectedStudent.graduationYear || '-'}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Kontak</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">HP/WhatsApp</span>
                      <span>{selectedStudent.phone || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email</span>
                      <span>{selectedStudent.email || '-'}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {selectedStudent.notes && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Catatan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{selectedStudent.notes}</p>
                  </CardContent>
                </Card>
              )}

              <div className="flex gap-2">
                <Button
                  className="flex-1"
                  onClick={() => {
                    handleStatusUpdate(selectedStudent.id, 'accepted')
                    setSelectedStudent(null)
                  }}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Terima
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => {
                    handleStatusUpdate(selectedStudent.id, 'rejected')
                    setSelectedStudent(null)
                  }}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Tolak
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
