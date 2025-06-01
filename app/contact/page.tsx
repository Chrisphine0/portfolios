"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Mail, Phone, MapPin, Send, Check, Github, Linkedin, Twitter, Instagram } from "lucide-react"

// EmailJS integration
import emailjs from '@emailjs/browser'

// EmailJS Configuration
const EMAILJS_CONFIG = {
  SERVICE_ID: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
  TEMPLATE_ID: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
  PUBLIC_KEY: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!,
}

interface FormData {
  name: string
  email: string
  subject: string
  message: string
}

interface FormErrors {
  name?: string
  email?: string
  subject?: string
  message?: string
}

const socialLinks = [
  { name: "GitHub", icon: Github, url: "https://github.com/Chrisphine0", color: "hover:text-gray-900" },
  { name: "LinkedIn", icon: Linkedin, url: "https://linkedin.com/in/miyawachrisphine", color: "hover:text-blue-600" },
  { name: "Twitter", icon: Twitter, url: "https://twitter.com", color: "hover:text-blue-400" },
  { name: "Instagram", icon: Instagram, url: "https://instagram.com", color: "hover:text-pink-600" },
]

function FloatingLabelInput({
  id,
  label,
  type = "text",
  value,
  onChange,
  error,
  required = false,
  multiline = false,
}: {
  id: string
  label: string
  type?: string
  value: string
  onChange: (value: string) => void
  error?: string
  required?: boolean
  multiline?: boolean
}) {
  const [isFocused, setIsFocused] = useState(false)
  const hasValue = value.length > 0
  const isFloating = isFocused || hasValue

  const inputClasses = `
    w-full px-4 pt-6 pb-2 text-gray-900 dark:text-white bg-transparent border-2 rounded-lg
    transition-all duration-300 focus:outline-none peer
    ${error ? "border-red-500 focus:border-red-500" : "border-gray-300 dark:border-gray-600 focus:border-purple-500"}
    ${multiline ? "resize-none min-h-[120px]" : ""}
  `

  const labelClasses = `
    absolute left-4 transition-all duration-300 pointer-events-none
    ${
      isFloating
        ? "top-2 text-xs text-purple-600 dark:text-purple-400"
        : "top-4 text-base text-gray-500 dark:text-gray-400"
    }
    ${error ? "text-red-500" : ""}
  `

  const InputComponent = multiline ? "textarea" : "input"

  return (
    <div className="relative">
      <InputComponent
        id={id}
        name={id}
        type={multiline ? undefined : type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={inputClasses}
        required={required}
        aria-describedby={error ? `${id}-error` : undefined}
        aria-invalid={error ? "true" : "false"}
      />
      <label htmlFor={id} className={labelClasses}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-red-500 animate-fade-in" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

function SubmitButton({
  isLoading,
  isSuccess,
}: {
  isLoading: boolean
  isSuccess: boolean
}) {
  return (
    <button
      type="submit"
      disabled={isLoading || isSuccess}
      className={`
        relative w-full py-4 px-8 rounded-lg font-semibold text-white
        transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300
        ${isSuccess ? "bg-green-500 hover:bg-green-600" : "bg-purple-600 hover:bg-purple-700"}
        ${isLoading || isSuccess ? "cursor-not-allowed opacity-75" : "cursor-pointer"}
      `}
      aria-label={isLoading ? "Submitting form" : isSuccess ? "Form submitted successfully" : "Submit form"}
    >
      <span
        className={`flex items-center justify-center transition-opacity duration-300 ${
          isLoading || isSuccess ? "opacity-0" : "opacity-100"
        }`}
      >
        <Send className="w-5 h-5 mr-2" />
        Send Message
      </span>

      {/* Loading Spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Success Checkmark */}
      {isSuccess && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Check className="w-6 h-6 text-white animate-bounce" />
        </div>
      )}
    </button>
  )
}

function ConfettiPiece({ delay }: { delay: number }) {
  const colors = ["bg-red-400", "bg-blue-400", "bg-green-400", "bg-yellow-400", "bg-purple-400", "bg-pink-400"]
  const randomColor = colors[Math.floor(Math.random() * colors.length)]

  return (
    <div
      className={`absolute w-3 h-3 ${randomColor} rounded-sm animate-bounce opacity-80`}
      style={{
        left: `${Math.random() * 100}%`,
        animationDelay: `${delay}ms`,
        animationDuration: `${1000 + Math.random() * 1000}ms`,
      }}
    />
  )
}

function ConfettiAnimation() {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {Array.from({ length: 50 }).map((_, i) => (
        <ConfettiPiece key={i} delay={i * 50} />
      ))}
    </div>
  )
}

function SocialIcon({ social }: { social: (typeof socialLinks)[0] }) {
  const Icon = social.icon

  return (
    <a
      href={social.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`
        flex items-center justify-center w-12 h-12 rounded-full
        bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400
        transition-all duration-300 transform hover:scale-110 hover:shadow-lg
        hover:animate-bounce ${social.color}
      `}
      aria-label={`Visit my ${social.name} profile`}
    >
      <Icon className="w-5 h-5" />
    </a>
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

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [submitError, setSubmitError] = useState<string>("")
  
  const formRef = useRef<HTMLFormElement>(null)

  // Initialize EmailJS
  useEffect(() => {
    if (EMAILJS_CONFIG.PUBLIC_KEY) {
      emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY)
    }
  }, [])

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters"
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    // Subject validation
    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required"
    } else if (formData.subject.trim().length < 5) {
      newErrors.subject = "Subject must be at least 5 characters"
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = "Message is required"
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setErrors({})
    setSubmitError("")

    try {
      // Check if EmailJS is configured
      if (!EMAILJS_CONFIG.SERVICE_ID || !EMAILJS_CONFIG.TEMPLATE_ID || !EMAILJS_CONFIG.PUBLIC_KEY) {
        throw new Error("EmailJS configuration is missing. Please check your environment variables.")
      }

      // Log configuration for debugging (remove in production)
      console.log('EmailJS Config:', {
        SERVICE_ID: EMAILJS_CONFIG.SERVICE_ID ? '✓' : '✗',
        TEMPLATE_ID: EMAILJS_CONFIG.TEMPLATE_ID ? '✓' : '✗',
        PUBLIC_KEY: EMAILJS_CONFIG.PUBLIC_KEY ? '✓' : '✗',
      })

      // Prepare template parameters
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message,
        to_email: 'miyawachrisphineodhiambo@gmail.com', // Your email
      }

      // Send email using EmailJS
      const response = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        templateParams,
        EMAILJS_CONFIG.PUBLIC_KEY
      )

      console.log('Email sent successfully:', response)
      
      setIsSuccess(true)
      setShowConfetti(true)

      // Reset form after success
      setTimeout(() => {
        setFormData({ name: "", email: "", subject: "", message: "" })
        setIsSuccess(false)
        setShowConfetti(false)
      }, 3000)

    } catch (error: any) {
      console.error('Error sending email:', error)
      
      let errorMessage = "Failed to send message. Please try again."
      
      if (error.text) {
        errorMessage = `Error: ${error.text}`
      } else if (error.message) {
        errorMessage = error.message
      }
      
      setSubmitError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const updateFormData = (field: keyof FormData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
    // Clear submit error when user starts typing
    if (submitError) {
      setSubmitError("")
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Confetti Animation */}
      {showConfetti && <ConfettiAnimation />}

      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollSection>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">Let's Work Together</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Have a project in mind? I'd love to hear about it. Send me a message and let's create something amazing
              together.
            </p>
          </ScrollSection>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Information */}
            <ScrollSection delay={200}>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Contact Information</h2>

                <div className="space-y-6 mb-12">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                      <Mail className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Email</h3>
                      <p className="text-gray-600 dark:text-gray-300">miyawachrisphineodhiambo@gmail.com</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                      <Phone className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Phone</h3>
                      <p className="text-gray-600 dark:text-gray-300">+254 768 078 946</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Location</h3>
                      <p className="text-gray-600 dark:text-gray-300">Nairobi, Kenya</p>
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Follow Me</h3>
                  <div className="flex gap-4">
                    {socialLinks.map((social) => (
                      <SocialIcon key={social.name} social={social} />
                    ))}
                  </div>
                </div>
              </div>
            </ScrollSection>

            {/* Contact Form */}
            <ScrollSection delay={400}>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Send a Message</h2>

                <form ref={formRef} onSubmit={handleSubmit} className="space-y-6" noValidate>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FloatingLabelInput
                      id="name"
                      label="Your Name"
                      value={formData.name}
                      onChange={updateFormData("name")}
                      error={errors.name}
                      required
                    />

                    <FloatingLabelInput
                      id="email"
                      label="Email Address"
                      type="email"
                      value={formData.email}
                      onChange={updateFormData("email")}
                      error={errors.email}
                      required
                    />
                  </div>

                  <FloatingLabelInput
                    id="subject"
                    label="Subject"
                    value={formData.subject}
                    onChange={updateFormData("subject")}
                    error={errors.subject}
                    required
                  />

                  <FloatingLabelInput
                    id="message"
                    label="Your Message"
                    value={formData.message}
                    onChange={updateFormData("message")}
                    error={errors.message}
                    required
                    multiline
                  />

                  <SubmitButton isLoading={isLoading} isSuccess={isSuccess} />
                </form>

                {/* Success Message */}
                {isSuccess && (
                  <div className="mt-6 p-4 bg-green-100 dark:bg-green-900 border border-green-300 dark:border-green-700 rounded-lg animate-fade-in">
                    <div className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <p className="text-green-800 dark:text-green-200 font-medium">
                        Message sent successfully! I'll get back to you soon.
                      </p>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {submitError && (
                  <div className="mt-6 p-4 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-lg animate-fade-in">
                    <p className="text-red-800 dark:text-red-200 font-medium">
                      {submitError}
                    </p>
                  </div>
                )}
              </div>
            </ScrollSection>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}