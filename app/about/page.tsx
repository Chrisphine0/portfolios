"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Download, Mail, MapPin, Calendar, Award, Briefcase, GraduationCap } from "lucide-react"

interface Skill {
  name: string
  percentage: number
  category: string
}

interface TimelineItem {
  id: number
  year: string
  title: string
  company: string
  description: string
  type: "work" | "education" | "achievement"
  icon: React.ReactNode
}

const skills: Skill[] = [
  { name: "JavaScript/TypeScript", percentage: 95, category: "Frontend" },
  { name: "React/Next.js", percentage: 92, category: "Frontend" },
  { name: "Node.js", percentage: 88, category: "Backend" },
  { name: "Python", percentage: 85, category: "Backend" },
  { name: "UI/UX Design", percentage: 80, category: "Design" },
  { name: "Database Design", percentage: 87, category: "Backend" },
  { name: "Cloud Services", percentage: 83, category: "DevOps" },
  { name: "Mobile Development", percentage: 78, category: "Mobile" },
]

const timelineData: TimelineItem[] = [
  {
    id: 1,
    year: "2024",
    title: "Volunteer",
    company: "Tuifathi Muchanga Initiative.",
    description:
      "Leading development of Workflow applications, mentoring junior developers, and architecting scalable solutions.",
    type: "work",
    icon: <Briefcase className="w-4 h-4" />,
  },
  {
    id: 2,
    year: "2023",
    title: "Online Child Protection",
    company: "COK in partnership with AFTARI",
    description: "Achieved professional certification in Child Online Protection.",
    type: "achievement",
    icon: <Award className="w-4 h-4" />,
  },
  {
    id: 3,
    year: "2022",
    title: "ICT Officer Intern",
    company: "Ministry of Fisheries, Livestock and Blue Economy",
    description:
      "Manage the ICT infrastructures and fix issues for better productivity.",
    type: "work",
    icon: <Briefcase className="w-4 h-4" />,
  },
  {
    id: 4,
    year: "2019 - 2023",
    title: "Computer Science Degree",
    company: "Masinde Muliro University of Science and Technology",
    description:
      "Bachelor's degree in Computer Science with focus on software engineering and artificial intelligence.",
    type: "education",
    icon: <GraduationCap className="w-4 h-4" />,
  },
  {
    id: 5,
    year: "2019",
    title: "Computer College",
    company: "Vocational Training Centre",
    description:
      "Here I learned design and basic computer skills.",
    type: "achievement",
    icon: <Award className="w-4 h-4" />,
  },
]

const biographyLines = [
  "Hello! I'm Chrisphine Miyawa, a passionate software developer with over 4 years of experience",
  "creating digital solutions that make a difference. My journey began with a curiosity",
  "about how things work, which led me to discover the world of programming.",
  "",
  "I specialize in full-stack development, with expertise in modern JavaScript frameworks,",
  "cloud technologies, and user experience design. I believe in writing clean, maintainable",
  "code and creating applications that are both functional and beautiful.",
  "",
  "When I'm not coding, you can find me exploring new technologies, contributing to",
  "open-source projects, or sharing knowledge through technical writing and mentoring.",
  "I'm always excited to take on new challenges and collaborate with amazing teams.",
]

function MouseTrackingPhoto() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const photoRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const photoElement = photoRef.current

    const handleMouseMove = (e: MouseEvent) => {
      if (photoElement) {
        const rect = photoElement.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2

        const deltaX = (e.clientX - centerX) / rect.width
        const deltaY = (e.clientY - centerY) / rect.height

        setMousePosition({ x: deltaX * 15, y: deltaY * 15 })
      }
    }

    const handleMouseLeave = () => {
      setMousePosition({ x: 0, y: 0 })
    }

    if (photoElement) {
      photoElement.addEventListener("mousemove", handleMouseMove)
      photoElement.addEventListener("mouseleave", handleMouseLeave)
    }

    return () => {
      if (photoElement) {
        photoElement.removeEventListener("mousemove", handleMouseMove)
        photoElement.removeEventListener("mouseleave", handleMouseLeave)
      }
    }
  }, [])

  return (
    <div ref={photoRef} className="relative w-80 h-80 mx-auto perspective-1000">
      <div
        className="relative w-full h-full transition-transform duration-300 ease-out transform-gpu"
        style={{
          transform: `rotateY(${mousePosition.x}deg) rotateX(${-mousePosition.y}deg)`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl transform rotate-6 opacity-20"></div>
        <div className="relative w-full h-full bg-white rounded-2xl overflow-hidden shadow-2xl">
          <Image src="/profile_pic.png?height=320&width=320" alt="Chrisphine Miyawa" fill className="object-cover" sizes="100vh" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>
        <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl opacity-20 blur-xl"></div>
      </div>
    </div>
  )
}

function AnimatedBiography() {
  const [visibleLines, setVisibleLines] = useState<number[]>([])
  const lineRefs = useRef<(HTMLParagraphElement | null)[]>([])

  useEffect(() => {
    const observers = lineRefs.current.map((ref, index) => {
      if (!ref) return null

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setVisibleLines((prev) => [...prev, index])
            }, index * 100)
          }
        },
        { threshold: 0.5 },
      )

      observer.observe(ref)
      return observer
    })

    return () => {
      observers.forEach((observer) => observer?.disconnect())
    }
  }, [])

  return (
    <div className="space-y-4">
      {biographyLines.map((line, index) => (
        <p
          key={index}
          ref={(el: HTMLParagraphElement | null) => {
            lineRefs.current[index] = el
          }}
          className={`text-lg text-gray-600 dark:text-gray-300 leading-relaxed transition-all duration-700 ${
            visibleLines.includes(index) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          } ${line === "" ? "h-4" : ""}`}
        >
          {line}
        </p>
      ))}
    </div>
  )
}

function SkillBar({ skill }: { skill: Skill }) {
  const [isVisible, setIsVisible] = useState(false)
  const [animatedValue, setAnimatedValue] = useState(0)
  const skillRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          setTimeout(() => {
            let current = 0
            const increment = skill.percentage / 60
            const timer = setInterval(() => {
              current += increment
              if (current >= skill.percentage) {
                current = skill.percentage
                clearInterval(timer)
              }
              setAnimatedValue(Math.round(current))
            }, 16)
          }, 100)
        }
      },
      { threshold: 0.5 },
    )

    if (skillRef.current) {
      observer.observe(skillRef.current)
    }

    return () => observer.disconnect()
  }, [skill.percentage])

  const getCategoryColor = (category: string) => {
    const colors = {
      Frontend: "from-blue-500 to-cyan-500",
      Backend: "from-green-500 to-emerald-500",
      Design: "from-purple-500 to-pink-500",
      DevOps: "from-orange-500 to-red-500",
      Mobile: "from-indigo-500 to-purple-500",
    }
    return colors[category as keyof typeof colors] || "from-gray-500 to-gray-600"
  }

  return (
    <div
      ref={skillRef}
      className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}
    >
      <div className="flex justify-between items-center mb-2">
        <span className="text-gray-700 dark:text-gray-300 font-medium">{skill.name}</span>
        <span className="text-purple-600 font-bold text-lg">{animatedValue}%</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${getCategoryColor(skill.category)} rounded-full transition-all duration-1000 ease-out relative`}
          style={{ width: `${animatedValue}%` }}
        >
          <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
        </div>
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{skill.category}</div>
    </div>
  )
}

function Timeline() {
  const [hoveredItem, setHoveredItem] = useState<number | null>(null)

  const getTypeColor = (type: string) => {
    const colors = {
      work: "bg-blue-500",
      education: "bg-green-500",
      achievement: "bg-purple-500",
    }
    return colors[type as keyof typeof colors] || "bg-gray-500"
  }

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-600"></div>

      <div className="space-y-8">
        {timelineData.map((item) => (
          <div
            key={item.id}
            className="relative flex items-start group"
            onMouseEnter={() => setHoveredItem(item.id)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            {/* Timeline dot */}
            <div
              className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-4 border-white dark:border-gray-900 ${getTypeColor(item.type)} transition-all duration-300 ${
                hoveredItem === item.id ? "scale-125 shadow-lg" : "scale-100"
              }`}
            >
              {item.icon}
            </div>

            {/* Content */}
            <div
              className={`ml-6 flex-1 transition-all duration-300 ${
                hoveredItem === item.id ? "transform translate-x-2" : ""
              }`}
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-purple-600 bg-purple-100 dark:bg-purple-900 px-3 py-1 rounded-full">
                    {item.year}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full text-white ${getTypeColor(item.type)}`}>
                    {item.type}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{item.title}</h3>
                <p className="text-purple-600 font-medium mb-3">{item.company}</p>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{item.description}</p>
              </div>
            </div>

            {/* Tooltip */}
            {hoveredItem === item.id && (
              <div className="absolute left-16 top-0 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap z-20 animate-fade-in">
                Click to learn more
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
              </div>
            )}
          </div>
        ))}
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

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <ScrollSection>
            <div className="text-center mb-16">
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6">About Me</h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Passionate developer, creative problem solver, and lifelong learner
              </p>
            </div>
          </ScrollSection>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Photo Section */}
            <ScrollSection delay={200}>
              <MouseTrackingPhoto />
              <div className="text-center mt-8">
                <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-300 mb-2">
                  <MapPin className="w-4 h-4" />
                  Nairobi, Kenya
                </div>
                <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-300">
                  <Calendar className="w-4 h-4" />
                  Available for new opportunities
                </div>
              </div>
            </ScrollSection>

            {/* Biography */}
            <ScrollSection delay={400}>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">My Story</h2>
                <AnimatedBiography />
                <div className="flex gap-4 mt-8">
                <Link href="/Chrisphine_Miyawa_Resume.pdf">
                  <button className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all duration-300 hover:scale-105">
                    <Download className="w-4 h-4" />
                    Resume
                  </button>
                  </Link>
                  <Link href="/contact">
                  <button className="flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 hover:border-purple-600 text-gray-700 dark:text-gray-300 rounded-lg transition-all duration-300 hover:scale-105">
                    <Mail className="w-4 h-4" />
                    Contact
                  </button>
                  </Link>
                </div>
              </div>
            </ScrollSection>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-16 px-6 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto">
          <ScrollSection>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-12 text-center">Skills & Expertise</h2>
          </ScrollSection>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {skills.map((skill) => (
              <SkillBar key={skill.name} skill={skill} />
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <ScrollSection>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-12 text-center">My Journey</h2>
          </ScrollSection>
          <ScrollSection delay={200}>
            <Timeline />
          </ScrollSection>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-6 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollSection>
            <h2 className="text-4xl font-bold text-white mb-6">Let's Work Together</h2>
            <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">I'm always excited to take on new challenges and collaborate with amazing teams. Let's create something incredible together!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <button className="px-8 py-4 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 hover:scale-105">
                  Get In Touch
                </button>
              </Link>
              <Link href="/#projects">
                <button className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-all duration-300 hover:scale-105">
                  View My Work
                </button>
              </Link>
            </div>
          </ScrollSection>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}