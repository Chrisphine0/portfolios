"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { ExternalLink, Github } from "lucide-react"

interface Project {
  id: number
  title: string
  description: string
  image: string
  technologies: string[]
  githubUrl: string
  liveUrl: string
  category: string
}

const mockProjects: Project[] = [
  {
    id: 1,
    title: "E-Commerce Platform",
    description:
      "A full-stack e-commerce solution with real-time inventory management, secure payments, and admin dashboard.",
    image: "/placeholder.svg?height=300&width=400",
    technologies: ["React", "Node.js", "MongoDB", "Stripe", "TypeScript"],
    githubUrl: "https://github.com",
    liveUrl: "https://example.com",
    category: "Full Stack",
  },
  {
    id: 2,
    title: "AI Task Manager",
    description:
      "Smart task management app with AI-powered prioritization, natural language processing, and team collaboration.",
    image: "/placeholder.svg?height=300&width=400",
    technologies: ["Next.js", "OpenAI", "Prisma", "PostgreSQL", "Tailwind"],
    githubUrl: "https://github.com",
    liveUrl: "https://example.com",
    category: "AI/ML",
  },
  {
    id: 3,
    title: "Real-time Chat App",
    description:
      "Modern chat application with real-time messaging, file sharing, video calls, and end-to-end encryption.",
    image: "/placeholder.svg?height=300&width=400",
    technologies: ["React", "Socket.io", "WebRTC", "Express", "Redis"],
    githubUrl: "https://github.com",
    liveUrl: "https://example.com",
    category: "Real-time",
  },
  {
    id: 4,
    title: "Data Visualization Dashboard",
    description:
      "Interactive dashboard for complex data analysis with real-time charts, filters, and export capabilities.",
    image: "/placeholder.svg?height=300&width=400",
    technologies: ["Vue.js", "D3.js", "Python", "FastAPI", "Docker"],
    githubUrl: "https://github.com",
    liveUrl: "https://example.com",
    category: "Data Science",
  },
  {
    id: 5,
    title: "Mobile Fitness Tracker",
    description:
      "Cross-platform mobile app for fitness tracking with workout plans, progress analytics, and social features.",
    image: "/placeholder.svg?height=300&width=400",
    technologies: ["React Native", "Firebase", "Redux", "Expo", "TypeScript"],
    githubUrl: "https://github.com",
    liveUrl: "https://example.com",
    category: "Mobile",
  },
  {
    id: 6,
    title: "Blockchain Voting System",
    description:
      "Secure and transparent voting platform built on blockchain technology with smart contracts and verification.",
    image: "/placeholder.svg?height=300&width=400",
    technologies: ["Solidity", "Web3.js", "Ethereum", "React", "MetaMask"],
    githubUrl: "https://github.com",
    liveUrl: "https://example.com",
    category: "Blockchain",
  },
]

const techColors: Record<string, string> = {
  React: "bg-blue-500 hover:bg-blue-600",
  "Next.js": "bg-black hover:bg-gray-800",
  "Node.js": "bg-green-500 hover:bg-green-600",
  TypeScript: "bg-blue-600 hover:bg-blue-700",
  JavaScript: "bg-yellow-500 hover:bg-yellow-600",
  Python: "bg-blue-400 hover:bg-blue-500",
  MongoDB: "bg-green-600 hover:bg-green-700",
  PostgreSQL: "bg-blue-700 hover:bg-blue-800",
  Firebase: "bg-orange-500 hover:bg-orange-600",
  Tailwind: "bg-cyan-500 hover:bg-cyan-600",
  "Vue.js": "bg-green-400 hover:bg-green-500",
  Express: "bg-gray-600 hover:bg-gray-700",
  "Socket.io": "bg-purple-500 hover:bg-purple-600",
  Redis: "bg-red-500 hover:bg-red-600",
  Docker: "bg-blue-500 hover:bg-blue-600",
  Stripe: "bg-indigo-500 hover:bg-indigo-600",
  OpenAI: "bg-emerald-500 hover:bg-emerald-600",
  Prisma: "bg-slate-700 hover:bg-slate-800",
  "D3.js": "bg-orange-600 hover:bg-orange-700",
  FastAPI: "bg-teal-500 hover:bg-teal-600",
  "React Native": "bg-cyan-600 hover:bg-cyan-700",
  Redux: "bg-purple-600 hover:bg-purple-700",
  Expo: "bg-gray-800 hover:bg-gray-900",
  Solidity: "bg-gray-500 hover:bg-gray-600",
  "Web3.js": "bg-orange-500 hover:bg-orange-600",
  Ethereum: "bg-blue-800 hover:bg-blue-900",
  MetaMask: "bg-orange-400 hover:bg-orange-500",
  WebRTC: "bg-red-600 hover:bg-red-700",
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

  return (
    <div
      ref={cardRef}
      className={`group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      } hover:-translate-y-2`}
    >
      {/* Project Image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={project.image || "/placeholder.svg"}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
          <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Link
              href={project.githubUrl}
              className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors duration-200"
            >
              <Github className="w-5 h-5 text-gray-800" />
            </Link>
            <Link
              href={project.liveUrl}
              className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors duration-200"
            >
              <ExternalLink className="w-5 h-5 text-gray-800" />
            </Link>
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
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-purple-600 transition-colors duration-300">
          {project.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">{project.description}</p>

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

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Link
            href={`/project/${project.id}`}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all duration-300 hover:scale-105"
          >
            View Details
          </Link>
          <Link
            href={project.liveUrl}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-all duration-300 hover:scale-105"
          >
            <ExternalLink className="w-4 h-4" />
            Live Demo
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function PortfolioSection() {
  const [isLoading, setIsLoading] = useState(true)
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setProjects(mockProjects)
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="py-20 px-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">Featured Projects</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            A showcase of my recent work, featuring modern web applications, mobile apps, and innovative solutions built
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
        {!isLoading && (
          <div className="text-center mt-12">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              View All Projects
              <ExternalLink className="w-5 h-5" />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}