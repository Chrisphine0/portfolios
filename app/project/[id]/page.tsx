"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Calendar, Users, Code, Zap, Star, GitFork, ExternalLink, Github } from "lucide-react"
import { useParams } from "next/navigation"
import { getGitHubConfig, GitHubRepo, techColors } from "@/utils/github"

interface GitHubProjectDetail {
  id: number
  title: string
  subtitle: string
  description: string
  longDescription: string
  heroImage: string
  images: string[]
  technologies: { name: string; proficiency: number }[]
  features: string[]
  challenges: string[]
  outcomes: string[]
  githubUrl: string
  liveUrl: string
  category: string
  duration: string
  teamSize: string
  role: string
  year: string
  stars: number
  forks: number
  language: string
  topics: string[]
  readmeContent: string
  lastUpdated: string
}

interface GitHubFile {
  name: string
  path: string
  download_url: string
  type: string
}

function ProgressBar({ skill, index }: { skill: { name: string; proficiency: number }; index: number }) {
  const [isVisible, setIsVisible] = useState(false)
  const [animatedValue, setAnimatedValue] = useState(0)
  const progressRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          setTimeout(() => {
            let current = 0
            const increment = skill.proficiency / 50
            const timer = setInterval(() => {
              current += increment
              if (current >= skill.proficiency) {
                current = skill.proficiency
                clearInterval(timer)
              }
              setAnimatedValue(Math.round(current))
            }, 20)
          }, index * 100)
        }
      },
      { threshold: 0.5 },
    )

    if (progressRef.current) {
      observer.observe(progressRef.current)
    }

    return () => observer.disconnect()
  }, [skill.proficiency, index])

  return (
    <div
      ref={progressRef}
      className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
    >
      <div className="flex justify-between items-center mb-2">
        <span className="text-gray-700 dark:text-gray-300 font-medium">{skill.name}</span>
        <span className="text-purple-600 font-bold">{animatedValue}%</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${animatedValue}%` }}
        />
      </div>
    </div>
  )
}

function ScrollSection({
  children,
  className = "",
  delay = 0,
}: { children: React.ReactNode; className?: string; delay?: number }) {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay)
        }
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [delay])

  return (
    <div
      ref={sectionRef}
      className={`transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
    >
      {children}
    </div>
  )
}

// Fetch repository details from GitHub
async function fetchGitHubRepoDetail(repoName: string): Promise<GitHubRepo | null> {
  const config = getGitHubConfig()
  
  if (!config.username) {
    throw new Error("GitHub username not configured")
  }

  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'Portfolio-Website',
  }

  if (config.token) {
    headers['Authorization'] = `token ${config.token}`
  }

  try {
    const response = await fetch(
      `https://api.github.com/repos/${config.username}/${repoName}`,
      { headers }
    )

    if (!response.ok) {
      return null
    }

    return await response.json()
  } catch (fetchError) {
    console.error('Error fetching repository details:', fetchError)
    return null
  }
}

// Fetch README content from GitHub
async function fetchReadmeContent(repoName: string): Promise<string> {
  const config = getGitHubConfig()
  
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'Portfolio-Website',
  }

  if (config.token) {
    headers['Authorization'] = `token ${config.token}`
  }

  try {
    const response = await fetch(
      `https://api.github.com/repos/${config.username}/${repoName}/contents/README.md`,
      { headers }
    )

    if (!response.ok) {
      return ""
    }

    const data = await response.json()
    
    // Decode base64 content
    if (data.content) {
      return atob(data.content.replace(/\n/g, ''))
    }
    
    return ""
  } catch (fetchError) {
    console.error('Error fetching README:', fetchError)
    return ""
  }
}

// Fetch images from GitHub repository
async function fetchRepoImages(repoName: string): Promise<string[]> {
  const config = getGitHubConfig()
  
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'Portfolio-Website',
  }

  if (config.token) {
    headers['Authorization'] = `token ${config.token}`
  }

  try {
    const response = await fetch(
      `https://api.github.com/repos/${config.username}/${repoName}/contents`,
      { headers }
    )

    if (!response.ok) {
      return []
    }

    const files: GitHubFile[] = await response.json()
    
    // Look for images in common directories
    const imagePaths = ['images', 'assets', 'screenshots', 'docs']
    const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg']
    const images: string[] = []

    // Check root directory for images
    files.forEach(file => {
      if (file.type === 'file') {
        const hasImageExt = imageExtensions.some(ext => 
          file.name.toLowerCase().endsWith(ext)
        )
        if (hasImageExt) {
          images.push(file.download_url)
        }
      }
    })

    // Check image directories
    for (const path of imagePaths) {
      try {
        const dirResponse = await fetch(
          `https://api.github.com/repos/${config.username}/${repoName}/contents/${path}`,
          { headers }
        )
        
        if (dirResponse.ok) {
          const dirFiles: GitHubFile[] = await dirResponse.json()
          dirFiles.forEach(file => {
            if (file.type === 'file') {
              const hasImageExt = imageExtensions.some(ext => 
                file.name.toLowerCase().endsWith(ext)
              )
              if (hasImageExt) {
                images.push(file.download_url)
              }
            }
          })
        }
      } catch (dirError) {
        // Continue if directory doesn't exist
        console.log('Directory not found:', path, dirError)
        continue
      }
    }

    return images.slice(0, 6) // Limit to 6 images
  } catch (fetchError) {
    console.error('Error fetching repository images:', fetchError)
    return []
  }
}

// Parse README content to extract sections
function parseReadmeContent(readmeContent: string) {
  const sections = {
    description: '',
    features: [] as string[],
    challenges: [] as string[],
    outcomes: [] as string[],
    installation: '',
    usage: ''
  }

  if (!readmeContent) return sections

  const lines = readmeContent.split('\n')
  let currentSection = ''
  let currentContent: string[] = []

  for (const line of lines) {
    const lowerLine = line.toLowerCase().trim()
    
    // Detect sections
    if (lowerLine.startsWith('# ') || lowerLine.startsWith('## ')) {
      // Save previous section
      if (currentSection && currentContent.length > 0) {
        const content = currentContent.join('\n').trim()
        if (currentSection.includes('feature')) {
          sections.features = currentContent.filter(l => l.trim().startsWith('-') || l.trim().startsWith('*'))
                              .map(l => l.replace(/^[-*]\s*/, '').trim())
        } else if (currentSection.includes('challenge')) {
          sections.challenges = content.split('\n').filter(l => l.trim())
        } else if (currentSection.includes('description') || currentSection.includes('about')) {
          sections.description = content
        }
      }
      
      currentSection = lowerLine
      currentContent = []
    } else if (line.trim()) {
      currentContent.push(line)
    }
  }

  // Handle last section
  if (currentSection && currentContent.length > 0) {
    const content = currentContent.join('\n').trim()
    if (currentSection.includes('feature')) {
      sections.features = currentContent.filter(l => l.trim().startsWith('-') || l.trim().startsWith('*'))
                          .map(l => l.replace(/^[-*]\s*/, '').trim())
    } else if (currentSection.includes('description') || currentSection.includes('about')) {
      sections.description = content
    }
  }

  return sections
}

// Convert GitHub repo to project detail
function convertRepoToProjectDetail(repo: GitHubRepo, readmeContent: string, images: string[]): GitHubProjectDetail {
  const parsedReadme = parseReadmeContent(readmeContent)
  
  // Generate technology proficiencies based on usage
  const technologies = [
    { name: repo.language || 'JavaScript', proficiency: 95 },
    ...repo.topics.slice(0, 5).map(topic => {
      const techName = Object.keys(techColors).find(tech => 
        tech.toLowerCase() === topic.toLowerCase() ||
        tech.toLowerCase().replace(/[.\s]/g, "") === topic.toLowerCase()
      ) || topic
      return { name: techName, proficiency: Math.floor(Math.random() * 20) + 75 }
    })
  ].slice(0, 6)

  return {
    id: repo.id,
    title: repo.name.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    subtitle: repo.description || 'GitHub Repository',
    description: repo.description || '',
    longDescription: parsedReadme.description || repo.description || 'A comprehensive project showcasing modern development practices and innovative solutions.',
    heroImage: images[0] || `/api/placeholder/1200/600?text=${encodeURIComponent(repo.name)}`,
    images: images.slice(1, 4),
    technologies,
    features: parsedReadme.features.length > 0 ? parsedReadme.features : [
      'Modern architecture and design patterns',
      'Responsive and user-friendly interface',
      'Comprehensive documentation',
      'Active development and maintenance'
    ],
    challenges: parsedReadme.challenges.length > 0 ? parsedReadme.challenges : [
      'Implementing scalable architecture',
      'Ensuring cross-platform compatibility',
      'Optimizing for performance',
      'Maintaining code quality standards'
    ],
    outcomes: [
      `${repo.stargazers_count} GitHub stars`,
      `${repo.forks_count} community forks`,
      'Active community engagement',
      'Continuous improvement and updates'
    ],
    githubUrl: repo.html_url,
    liveUrl: repo.homepage || '',
    category: getCategoryFromTopics(repo.topics, repo.language),
    duration: calculateDuration(repo.created_at, repo.updated_at),
    teamSize: '1-3 developers',
    role: 'Developer',
    year: new Date(repo.created_at).getFullYear().toString(),
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    language: repo.language || 'JavaScript',
    topics: repo.topics,
    readmeContent,
    lastUpdated: repo.updated_at
  }
}

function getCategoryFromTopics(topics: string[], language: string | null): string {
  const topicStr = topics.join(' ').toLowerCase()
  
  if (topicStr.includes('ai') || topicStr.includes('ml') || topicStr.includes('machine-learning')) return 'AI/ML'
  if (topicStr.includes('mobile') || topicStr.includes('react-native') || topicStr.includes('flutter')) return 'Mobile'
  if (topicStr.includes('blockchain') || topicStr.includes('web3')) return 'Blockchain'
  if (topicStr.includes('game') || topicStr.includes('unity')) return 'Game Development'
  if (topicStr.includes('data') || topicStr.includes('analytics')) return 'Data Science'
  if (language === 'javascript' || language === 'typescript') return 'Web Development'
  
  return 'Software Development'
}

function calculateDuration(createdAt: string, updatedAt: string): string {
  const created = new Date(createdAt)
  const updated = new Date(updatedAt)
  const diffInMonths = (updated.getTime() - created.getTime()) / (1000 * 60 * 60 * 24 * 30)
  
  if (diffInMonths < 1) return '< 1 month'
  if (diffInMonths < 12) return `${Math.floor(diffInMonths)} months`
  return `${Math.floor(diffInMonths / 12)} years`
}

export default function ProjectDetailPage() {
  const params = useParams()
  const [scrollY, setScrollY] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [project, setProject] = useState<GitHubProjectDetail | null>(null)
  const [error, setError] = useState<string | null>(null)

  const repoName = params.id as string

  useEffect(() => {
    async function fetchProjectData() {
      try {
        setIsLoading(true)
        setError(null)

        // Fetch repository details
        const repo = await fetchGitHubRepoDetail(repoName)
        if (!repo) {
          setError('Repository not found')
          return
        }

        // Fetch README and images in parallel
        const [readmeContent, images] = await Promise.all([
          fetchReadmeContent(repoName),
          fetchRepoImages(repoName)
        ])

        // Convert to project detail
        const projectDetail = convertRepoToProjectDetail(repo, readmeContent, images)
        setProject(projectDetail)

      } catch (fetchError) {
        console.error('Error fetching project data:', fetchError)
        setError('Failed to load project data')
      } finally {
        setIsLoading(false)
      }
    }

    if (repoName) {
      fetchProjectData()
    }
  }, [repoName])

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <Navigation />
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading project details...</p>
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <Navigation />
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {error || 'Project Not Found'}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            The requested repository could not be found or accessed.
          </p>
          <Link 
            href="/" 
            className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-all duration-500">
      {/* Navigation */}
      <Navigation />

      {/* Hero Section with Parallax */}
      <section className="relative h-screen overflow-hidden">
        <div
          className="absolute inset-0 w-full h-[120%]"
          style={{
            transform: `translateY(${scrollY * 0.5}px)`,
          }}
        >
          <Image
            src="/background.png"
            alt={project.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 h-full flex items-center justify-center text-center text-white px-6">
          <div className="max-w-4xl mx-auto">
            <ScrollSection>
              <div className="flex items-center justify-center gap-4 mb-4">
                <span className="inline-block px-4 py-2 bg-purple-600 rounded-full text-sm font-semibold">
                  {project.category}
                </span>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    <span>{project.stars}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <GitFork className="w-4 h-4" />
                    <span>{project.forks}</span>
                  </div>
                </div>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold mb-4">{project.title}</h1>
              <p className="text-xl md:text-2xl text-gray-200 mb-8">{project.subtitle}</p>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">{project.description}</p>
              
              <div className="flex justify-center gap-4">
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Github className="w-5 h-5 mr-2" />
                  View on GitHub
                </a>
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                  >
                    <ExternalLink className="w-5 h-5 mr-2" />
                    Live Demo
                  </a>
                )}
              </div>
            </ScrollSection>
          </div>
        </div>
      </section>

      {/* Project Info */}
      <ScrollSection className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
            <div className="text-center">
              <Calendar className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Duration</h3>
              <p className="text-gray-600 dark:text-gray-300">{project.duration}</p>
            </div>
            <div className="text-center">
              <Users className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Team Size</h3>
              <p className="text-gray-600 dark:text-gray-300">{project.teamSize}</p>
            </div>
            <div className="text-center">
              <Code className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Language</h3>
              <p className="text-gray-600 dark:text-gray-300">{project.language}</p>
            </div>
            <div className="text-center">
              <Zap className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Year</h3>
              <p className="text-gray-600 dark:text-gray-300">{project.year}</p>
            </div>
          </div>
        </div>
      </ScrollSection>

      {/* Project Overview */}
      <ScrollSection className="py-16 px-6 bg-gray-50 dark:bg-gray-800" delay={200}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Project Overview
          </h2>
          <div className="prose prose-lg max-w-none text-gray-600 dark:text-gray-300">
            <p className="text-center leading-relaxed">
              {project.longDescription}
            </p>
          </div>
        </div>
      </ScrollSection>

      {/* Tech Stack */}
      <ScrollSection className="py-16 px-6" delay={300}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-12 text-center">
            Technology Stack
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {project.technologies.map((tech, index) => (
              <ProgressBar key={tech.name} skill={tech} index={index} />
            ))}
          </div>
        </div>
      </ScrollSection>

      {/* Images Gallery */}
      {project.images.length > 0 && (
        <ScrollSection className="py-16 px-6 bg-gray-50 dark:bg-gray-800" delay={350}>
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-12 text-center">
              Project Gallery
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {project.images.map((image, index) => (
                <div key={index} className="aspect-video relative rounded-lg overflow-hidden">
                  <Image
                    src={image}
                    alt={`${project.title} screenshot ${index + 1}`}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </ScrollSection>
      )}

      {/* Features */}
      <ScrollSection className="py-16 px-6" delay={400}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-12 text-center">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {project.features.map((feature, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-purple-600" />
                </div>
                <p className="text-gray-700 dark:text-gray-300">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </ScrollSection>

      {/* Topics */}
      {project.topics.length > 0 && (
        <ScrollSection className="py-16 px-6 bg-gray-50 dark:bg-gray-800" delay={450}>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Topics & Tags</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {project.topics.map((topic, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm font-medium"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        </ScrollSection>
      )}

      {/* Challenges & Outcomes */}
      <ScrollSection className="py-16 px-6" delay={500}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Development Insights</h2>
              <div className="space-y-4">
                {project.challenges.map((challenge, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                    <p className="text-gray-600 dark:text-gray-300">{challenge}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Key Achievements</h2>
              <div className="space-y-4">
                {project.outcomes.map((outcome, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    <p className="text-gray-600 dark:text-gray-300">{outcome}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </ScrollSection>

      {/* Back to Projects */}
      <ScrollSection className="py-16 px-6 bg-gray-50 dark:bg-gray-800" delay={600}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Explore More Projects</h2>
          <Link
            href="/#projects"
            className="inline-flex items-center px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105"
          >
            View All Projects
          </Link>
        </div>
      </ScrollSection>

      {/* Footer */}
      <Footer />
    </div>
  )
}