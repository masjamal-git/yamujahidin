import 'server-only'
import { db } from './db'
import { cache } from 'react'

// Get all settings as a key-value object
export const getSettings = cache(async () => {
  const settings = await db.setting.findMany()
  const result: Record<string, string> = {}
  for (const setting of settings) {
    result[setting.key] = setting.value
  }
  return result
})

// Get a single setting by key
export const getSetting = cache(async (key: string) => {
  const setting = await db.setting.findUnique({
    where: { key },
  })
  return setting?.value
})

// Get all news
export const getNews = cache(async (limit?: number) => {
  return db.news.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: 'desc' },
    take: limit,
  })
})

// Get featured news
export const getFeaturedNews = cache(async (limit?: number) => {
  return db.news.findMany({
    where: { isPublished: true, isFeatured: true },
    orderBy: { createdAt: 'desc' },
    take: limit,
  })
})

// Get news by slug
export const getNewsBySlug = cache(async (slug: string) => {
  return db.news.findUnique({
    where: { slug },
  })
})

// Get news by category
export const getNewsByCategory = cache(async (category: string, limit?: number) => {
  return db.news.findMany({
    where: { isPublished: true, category },
    orderBy: { createdAt: 'desc' },
    take: limit,
  })
})

// Get all gallery
export const getGallery = cache(async (limit?: number) => {
  return db.gallery.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
    take: limit,
  })
})

// Get gallery by category
export const getGalleryByCategory = cache(async (category: string, limit?: number) => {
  return db.gallery.findMany({
    where: { isActive: true, category },
    orderBy: { createdAt: 'desc' },
    take: limit,
  })
})

// Get all education units
export const getEducationUnits = cache(async () => {
  return db.educationUnit.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
  })
})

// Get education unit by type
export const getEducationUnitByType = cache(async (type: string) => {
  return db.educationUnit.findUnique({
    where: { type },
  })
})

// Get all scholarships
export const getScholarships = cache(async () => {
  return db.scholarship.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
  })
})

// Get scholarship by slug
export const getScholarshipBySlug = cache(async (slug: string) => {
  return db.scholarship.findUnique({
    where: { slug },
  })
})

// Get dashboard stats
export const getDashboardStats = cache(async () => {
  const [newsCount, galleryCount, studentCount, contactCount] = await Promise.all([
    db.news.count(),
    db.gallery.count(),
    db.student.count(),
    db.contact.count(),
  ])
  
  return {
    newsCount,
    galleryCount,
    studentCount,
    contactCount,
  }
})

// Get recent students (for dashboard)
export const getRecentStudents = cache(async (limit?: number) => {
  return db.student.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit || 10,
  })
})

// Get recent contacts (for dashboard)
export const getRecentContacts = cache(async (limit?: number) => {
  return db.contact.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit || 10,
  })
})

// Get all students
export const getStudents = cache(async () => {
  return db.student.findMany({
    orderBy: { createdAt: 'desc' },
  })
})

// Get student by id
export const getStudentById = cache(async (id: string) => {
  return db.student.findUnique({
    where: { id },
  })
})

// Get all admins
export const getAdmins = cache(async () => {
  return db.admin.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      avatar: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { createdAt: 'desc' },
  })
})

// Get all contacts
export const getContacts = cache(async () => {
  return db.contact.findMany({
    orderBy: { createdAt: 'desc' },
  })
})
