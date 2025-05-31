import Image from "next/image"
import Link from "next/link"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import PortfolioSection from "@/components/portfolio-section"

export default function PersonalLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <main className="min-h-screen flex items-center justify-center px-6 my-22">
        <div className="text-center max-w-4xl mx-auto">
          {/* Profile Image */}
          <div className="mb-8 animate-fade-in-delay-2">
            <div className="relative w-32 h-32 mx-auto mb-8">
              <Image
                src="/profile_pic.png?height=128&width=128"
                alt="Profile"
                width={128}
                height={128}
                className="rounded-full object-cover animate-pulse-soft"
              />
              <div className="absolute inset-0 rounded-full bg-purple-400 opacity-20 animate-pulse-ring"></div>
            </div>
          </div>

          {/* Name with Typewriter Effect */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="inline-block animate-typewriter">Chrisphine Miyawa</span>
          </h1>

          {/* Subtitle with Fade Up Animation */}
          <p className="text-xl md:text-2xl text-purple-200 mb-8 animate-fade-up-delay">Software Developer</p>

          {/* Description */}
          <p className="text-lg text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in-delay-5">
            Passionate about creating beautiful, functional, and user-centered digital experiences. I bring ideas to
            life through clean code and innovative design.
          </p>

          {/* CTA Button */}
          <div className="animate-fade-in-delay-6">
            <Link
              href="/contact"
              className="inline-flex items-center px-8 py-4 bg-purple-600 hover:bg-purple-700 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-purple-500/25"
            >
              Get In Touch
              <svg
                className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <svg className="w-6 h-6 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </main>

      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute top-3/4 right-1/4 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float-delay"></div>
      </div>

      {/* Portfolio Section */}
      <div id="projects">
        <PortfolioSection />
      </div>

      


      {/* Footer */}
      <Footer />
    </div>
  )
}