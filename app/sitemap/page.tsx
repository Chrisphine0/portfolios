'use client'

import Navigation from '@/components/navigation'
import Footer from '@/components/footer'
import Link from 'next/link'
import { getGitHubProjects, type Project } from '@/utils/github'
import { useEffect, useState } from 'react'

interface SitemapEntry {
  url: string
  lastModified: string
  changeFrequency: 'daily' | 'weekly' | 'monthly' | 'yearly'
  priority: number
}

export default function Sitemap() {
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    const fetchProjects = async () => {
      const fetchedProjects = await getGitHubProjects()
      setProjects(fetchedProjects)
    }
    fetchProjects()
  }, [])

  const staticPages: SitemapEntry[] = [
    { url: '/', lastModified: new Date().toISOString(), changeFrequency: 'daily', priority: 1.0 },
    { url: '/about', lastModified: new Date().toISOString(), changeFrequency: 'monthly', priority: 0.8 },
    { url: '/contact', lastModified: new Date().toISOString(), changeFrequency: 'monthly', priority: 0.8 },
    {
      url: '/privacy-policy',
      lastModified: new Date().toISOString(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: '/terms-of-service',
      lastModified: new Date().toISOString(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ]

  const projectPages: SitemapEntry[] = projects.map((project) => ({
    url: `/project/${project.title.toLowerCase().replace(/\s+/g, '-')}`,
    lastModified: new Date(project.lastUpdated).toISOString(),
    changeFrequency: 'weekly',
    priority: 0.9,
  }))

  const allPages = [...staticPages, ...projectPages]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navigation />
      <main className="max-w-4xl mx-auto px-6 py-20">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Sitemap</h1>
        <ul className="space-y-4">
          {allPages.map((page) => (
            <li key={page.url}>
              <Link href={page.url} className="text-lg text-purple-600 hover:underline">
                {page.url}
              </Link>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                <span>Last Modified: {new Date(page.lastModified).toLocaleDateString()}</span>
                <span className="mx-2">|</span>
                <span>Change Frequency: {page.changeFrequency}</span>
                <span className="mx-2">|</span>
                <span>Priority: {page.priority}</span>
              </div>
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </div>
  )
}
