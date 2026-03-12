import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query'] : [],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db

// Auto-seed function - runs only once when no admin exists
let seedingInProgress = false

export async function ensureSeedData() {
  if (seedingInProgress) return
  
  try {
    const existingAdmin = await db.admin.findFirst()
    
    if (!existingAdmin) {
      seedingInProgress = true
      console.log('No admin found, seeding database...')
      
      const hashedPassword = await bcrypt.hash('admin123', 10)
      
      await db.admin.create({
        data: {
          email: 'admin@yalmuja.sch.id',
          password: hashedPassword,
          name: 'Administrator',
          role: 'superadmin',
          isActive: true,
        },
      })
      
      // Create default settings
      const defaultSettings = [
        { key: 'site_name', value: 'Yayasan Al Mujahidin', type: 'text', group: 'general' },
        { key: 'site_tagline', value: 'Membangun Generasi Berilmu dan Berakhlak', type: 'text', group: 'general' },
        { key: 'site_description', value: 'Yayasan Pendidikan Islam Al Mujahidin Kalimantan Timur', type: 'textarea', group: 'general' },
        { key: 'site_address', value: 'Jl. Pendidikan No. 1, Samarinda, Kalimantan Timur', type: 'text', group: 'contact' },
        { key: 'site_phone', value: '(0541) 123456', type: 'text', group: 'contact' },
        { key: 'site_email', value: 'info@yalmuja.sch.id', type: 'text', group: 'contact' },
      ]
      
      for (const setting of defaultSettings) {
        await db.setting.create({ data: setting })
      }
      
      console.log('Database seeded successfully!')
    }
  } catch (error) {
    console.error('Error seeding database:', error)
  } finally {
    seedingInProgress = false
  }
}