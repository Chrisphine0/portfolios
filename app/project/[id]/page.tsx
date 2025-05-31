"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Calendar, Users, Code, Zap } from "lucide-react"
import { useParams, useRouter } from "next/navigation"

interface ProjectDetail {
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
}

const mockProjects: Record<string, ProjectDetail> = {
  "1": {
    id: 1,
    title: "E-Commerce Platform",
    subtitle: "Full-Stack Shopping Experience",
    description: "A comprehensive e-commerce solution with modern design and powerful features",
    longDescription:
      "This project represents a complete overhaul of traditional e-commerce experiences. Built with modern technologies and user-centric design principles, it delivers exceptional performance and usability. The platform handles everything from product catalog management to secure payment processing, providing both customers and administrators with intuitive interfaces.",
    heroImage: "/placeholder.svg?height=600&width=1200",
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    technologies: [
      { name: "React", proficiency: 95 },
      { name: "Node.js", proficiency: 90 },
      { name: "MongoDB", proficiency: 85 },
      { name: "TypeScript", proficiency: 92 },
      { name: "Stripe API", proficiency: 88 },
      { name: "AWS", proficiency: 80 },
    ],
    features: [
      "Real-time inventory management",
      "Secure payment processing with Stripe",
      "Advanced search and filtering",
      "Admin dashboard with analytics",
      "Mobile-responsive design",
      "Email notifications and order tracking",
    ],
    challenges: [
      "Implementing real-time inventory updates across multiple users",
      "Ensuring PCI compliance for payment processing",
      "Optimizing database queries for large product catalogs",
      "Creating a scalable architecture for future growth",
    ],
    outcomes: [
      "40% increase in conversion rates",
      "99.9% uptime achieved",
      "50% reduction in page load times",
      "Positive user feedback on interface design",
    ],
    githubUrl: "https://github.com",
    liveUrl: "https://example.com",
    category: "Full Stack",
    duration: "4 months",
    teamSize: "3 developers",
    role: "Lead Developer",
    year: "2024",
  },
  "2": {
    id: 2,
    title: "AI Task Manager",
    subtitle: "Intelligent Productivity Assistant",
    description: "Smart task management with AI-powered prioritization and insights",
    longDescription:
      "An innovative approach to task management that leverages artificial intelligence to help users prioritize their work more effectively. The application uses natural language processing to understand task context and machine learning algorithms to suggest optimal scheduling and prioritization strategies.",
    heroImage: "/placeholder.svg?height=600&width=1200",
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    technologies: [
      { name: "Next.js", proficiency: 93 },
      { name: "OpenAI API", proficiency: 87 },
      { name: "Prisma", proficiency: 89 },
      { name: "PostgreSQL", proficiency: 85 },
      { name: "Tailwind CSS", proficiency: 95 },
      { name: "Vercel", proficiency: 90 },
    ],
    features: [
      "AI-powered task prioritization",
      "Natural language task creation",
      "Smart scheduling suggestions",
      "Team collaboration tools",
      "Progress analytics and insights",
      "Cross-platform synchronization",
    ],
    challenges: [
      "Training AI models for accurate task prioritization",
      "Handling natural language input variations",
      "Ensuring data privacy with AI processing",
      "Creating intuitive AI-human interaction patterns",
    ],
    outcomes: [
      "30% improvement in user productivity",
      "95% accuracy in task prioritization",
      "Positive feedback on AI suggestions",
      "Successful beta launch with 1000+ users",
    ],
    githubUrl: "https://github.com",
    liveUrl: "https://example.com",
    category: "AI/ML",
    duration: "6 months",
    teamSize: "2 developers",
    role: "Full Stack Developer",
    year: "2024",
  },
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
          // Animate the progress bar
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

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [scrollY, setScrollY] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [project, setProject] = useState<ProjectDetail | null>(null)

  const projectId = params.id as string

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      const projectData = mockProjects[projectId]
      if (projectData) {
        setProject(projectData)
      }
      setIsLoading(false)
    }, 500)
  }, [projectId])

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <Navigation />
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <Navigation />
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Project Not Found</h1>
          <Link href="/" className="text-purple-600 hover:text-purple-700">
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
            src={project.heroImage || "/placeholder.svg"}
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
              <span className="inline-block px-4 py-2 bg-purple-600 rounded-full text-sm font-semibold mb-4">
                {project.category}
              </span>
              <h1 className="text-5xl md:text-7xl font-bold mb-4">{project.title}</h1>
              <p className="text-xl md:text-2xl text-gray-200 mb-8">{project.subtitle}</p>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">{project.description}</p>
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
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Role</h3>
              <p className="text-gray-600 dark:text-gray-300">{project.role}</p>
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
          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed text-center">
            {project.longDescription}
          </p>
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

      {/* Features */}
      <ScrollSection className="py-16 px-6 bg-gray-50 dark:bg-gray-800" delay={400}>
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

      {/* Challenges & Outcomes */}
      <ScrollSection className="py-16 px-6" delay={500}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Challenges</h2>
              <div className="space-y-4">
                {project.challenges.map((challenge, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                    <p className="text-gray-600 dark:text-gray-300">{challenge}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Outcomes</h2>
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

      {/* Project Navigation */}
      <ScrollSection className="py-16 px-6 bg-gray-50 dark:bg-gray-800" delay={600}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Explore More Projects</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/project/1"
              className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105"
            >
              E-Commerce Platform
            </Link>
            <Link
              href="/project/2"
              className="px-8 py-4 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105"
            >
              AI Task Manager
            </Link>
          </div>
        </div>
      </ScrollSection>

      {/* Footer */}
      <Footer />
    </div>
  )
}