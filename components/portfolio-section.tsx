"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { ExternalLink, Github, Star, GitFork, RefreshCw, Eye } from "lucide-react"
import { getGitHubProjects, techColors, type Project } from "../utils/github"

// Function to get image from GitHub repository
const getProjectImage = async (githubUrl: string, repoName: string): Promise<string | null> => {
  try {
    // Extract username and repo name from GitHub URL
    const urlParts = githubUrl.split('/')
    const username = urlParts[urlParts.length - 2]
    const repo = urlParts[urlParts.length - 1]
    
    // Common image extensions to check
    const imageExtensions = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg']
    const commonImageNames = ['screenshot', 'preview', 'demo', 'cover', 'banner', repoName.toLowerCase()]
    
    // GitHub API endpoint for repository contents
    const apiUrl = `https://api.github.com/repos/${username}/${repo}/contents/images/`
    
    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        ...(process.env.NEXT_PUBLIC_GITHUB_TOKEN && {
          'Authorization': `token ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`
        })
      }
    })
    
    if (!response.ok) {
      // If images folder doesn't exist, try root directory
      const rootResponse = await fetch(`https://api.github.com/repos/${username}/${repo}/contents`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          ...(process.env.NEXT_PUBLIC_GITHUB_TOKEN && {
            'Authorization': `token ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`
          })
        }
      })
      
      if (!rootResponse.ok) return null
      
      const rootFiles = await rootResponse.json()
      
      // Look for images in root directory
      for (const name of commonImageNames) {
        for (const ext of imageExtensions) {
          const file = rootFiles.find((f: any) => 
            f.name.toLowerCase() === `${name}.${ext}` && f.type === 'file'
          )
          if (file) {
            return `https://raw.githubusercontent.com/${username}/${repo}/main/${file.name}`
          }
        }
      }
      
      return null
    }
    
    const files = await response.json()
    
    if (!Array.isArray(files)) return null
    
    // First, try to find images with common names
    for (const name of commonImageNames) {
      for (const ext of imageExtensions) {
        const file = files.find((f: any) => 
          f.name.toLowerCase() === `${name}.${ext}` && f.type === 'file'
        )
        if (file) {
          return `https://raw.githubusercontent.com/${username}/${repo}/main/images/${file.name}`
        }
      }
    }
    
    // If no common names found, get the first image file
    const firstImage = files.find((f: any) => {
      const fileName = f.name.toLowerCase()
      return f.type === 'file' && imageExtensions.some(ext => fileName.endsWith(`.${ext}`))
    })
    
    if (firstImage) {
      return `https://raw.githubusercontent.com/${username}/${repo}/main/images/${firstImage.name}`
    }
    
    return null
  } catch (error) {
    console.error('Error fetching project image:', error)
    return null
  }
}

function ProjectSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg animate-pulse">
      <div className="h-48 bg-gray-300 dark:bg-gray-700"></div>
      <div className="p-6">
        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded mb-3"></div>
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-6 w-16 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
          ))}
        </div>
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-4">
            <div className="h-4 w-12 bg-gray-300 dark:bg-gray-700 rounded"></div>
            <div className="h-4 w-12 bg-gray-300 dark:bg-gray-700 rounded"></div>
          </div>
          <div className="h-4 w-20 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>
        <div className="flex gap-3">
          <div className="h-10 w-24 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="h-10 w-24 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    </div>
  )
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [isVisible, setIsVisible] = useState(false)
  const [projectImage, setProjectImage] = useState<string | null>(null)
  const [imageLoading, setImageLoading] = useState(true)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), index * 100)
        }
      },
      { threshold: 0.1 },
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => observer.disconnect()
  }, [index])

  // Fetch project image from GitHub
  useEffect(() => {
    const fetchImage = async () => {
      setImageLoading(true)
      const repoName = getRepoName(project.githubUrl)
      const imageUrl = await getProjectImage(project.githubUrl, repoName)
      setProjectImage(imageUrl)
      setImageLoading(false)
    }

    fetchImage()
  }, [project.githubUrl])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  // Extract repository name from GitHub URL for navigation
  const getRepoName = (githubUrl: string) => {
    const parts = githubUrl.split('/')
    return parts[parts.length - 1]
  }

  return (
    <div
      ref={cardRef}
      className={`group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      } hover:-translate-y-2`}
    >
      {/* Project Image/Header */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-purple-500 to-blue-600">
        {imageLoading ? (
          <div className="flex items-center justify-center h-full">
            <RefreshCw className="w-8 h-8 text-white opacity-80 animate-spin" />
          </div>
        ) : projectImage ? (
          <Image
            src="/background.png"
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            onError={() => setProjectImage(null)}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Github className="w-16 h-16 text-white opacity-80" />
          </div>
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
          <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Link
              href={`/project/${getRepoName(project.githubUrl)}`}
              className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors duration-200"
            >
              <Eye className="w-5 h-5 text-gray-800" />
            </Link>
            <Link
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors duration-200"
            >
              <Github className="w-5 h-5 text-gray-800" />
            </Link>
            {project.liveUrl && (
              <Link
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors duration-200"
              >
                <ExternalLink className="w-5 h-5 text-gray-800" />
              </Link>
            )}
          </div>
        </div>
        
        {/* Category Badge */}
        <div className="absolute top-3 right-3">
          <span className="px-3 py-1 bg-purple-600 text-white text-xs font-semibold rounded-full">
            {project.category}
          </span>
        </div>
      </div>

      {/* Project Content */}
      <div className="p-6">
        {/* Clickable Title */}
        <Link href={`/project/${getRepoName(project.githubUrl)}`}>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-purple-600 transition-colors duration-300 cursor-pointer hover:underline">
            {project.title}
          </h3>
        </Link>
        
        <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed line-clamp-3">
          {project.description || "No description available"}
        </p>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className={`px-3 py-1 text-xs font-medium text-white rounded-full transition-all duration-300 transform hover:scale-105 ${
                techColors[tech] || "bg-gray-500 hover:bg-gray-600"
              }`}
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Repository Stats */}
        <div className="flex justify-between items-center mb-4 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex gap-4">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4" />
              <span>{project.stars}</span>
            </div>
            <div className="flex items-center gap-1">
              <GitFork className="w-4 h-4" />
              <span>{project.forks}</span>
            </div>
          </div>
          <span>Updated {formatDate(project.lastUpdated)}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {/* <Link
            href={`/project/${getRepoName(project.githubUrl)}`}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all duration-300 hover:scale-105"
          >
            <Eye className="w-4 h-4" />
            View Details
          </Link> */}
          <Link
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-all duration-300 hover:scale-105"
          >
            <Github className="w-4 h-4" />
            View Code
          </Link>
          {project.liveUrl && (
            <Link
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:green-700 text-white rounded-lg transition-all duration-300 hover:scale-105"
            >
              <ExternalLink className="w-4 h-4" />
              Live Demo
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default function PortfolioSection() {
  const [isLoading, setIsLoading] = useState(true)
  const [projects, setProjects] = useState<Project[]>([])
  const [error, setError] = useState<string | null>(null)

  const fetchGitHubProjects = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const projects = await getGitHubProjects()
      setProjects(projects)
    } catch (err) {
      console.error('Error fetching GitHub projects:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch projects')
      setProjects([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchGitHubProjects()
  }, [])

  if (error) {
    return (
      <section className="py-20 px-6 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">Featured Projects</h2>
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 px-4 py-3 rounded mb-8">
            <p>Error loading projects: {error}</p>
            <p className="text-sm mt-2">Please check your GitHub configuration in the environment variables.</p>
          </div>
            <button 
              onClick={fetchGitHubProjects}
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-lg transition-colors duration-300"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Retrying...' : 'Retry'}
            </button>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 px-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">Featured Projects</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            A showcase of my recent work from GitHub, featuring modern web applications, mobile apps, and innovative solutions built
            with cutting-edge technologies.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading
            ? Array.from({ length: 6 }).map((_, index) => <ProjectSkeleton key={index} />)
            : projects.map((project, index) => <ProjectCard key={project.id} project={project} index={index} />)}
        </div>

        {/* View More Button */}
        {!isLoading && projects.length > 0 && (
          <div className="text-center mt-12">
            <Link
              href={`https://github.com/${process.env.NEXT_PUBLIC_GITHUB_USERNAME || 'your-username'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              View All Projects on GitHub
              <ExternalLink className="w-5 h-5" />
            </Link>
          </div>
        )}

        {/* No Projects Message */}
        {!isLoading && projects.length === 0 && !error && (
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-300">No projects found. Make sure your repositories are public and have descriptions.</p>
          </div>
        )}
      </div>
    </section>
  )
}