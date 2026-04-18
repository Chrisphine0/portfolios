'use client'

import { useState, useEffect } from 'react'
import { notFound } from 'next/navigation'
import Navigation from '@/components/navigation'
import Footer from '@/components/footer'
import { getPostData, type PostData } from '@/lib/posts'

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const [post, setPost] = useState<PostData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoading(true)
        const fetchedPost = await getPostData(params.slug)
        setPost(fetchedPost)
      } catch (error) {
        notFound()
      } finally {
        setIsLoading(false)
      }
    }
    fetchPost()
  }, [params.slug])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <Navigation />
        <main className="max-w-3xl mx-auto px-6 py-20">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
              <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded"></div>
              <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
              <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-4/6"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!post) return null // Handled by notFound() in useEffect

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navigation />
      <main className="max-w-3xl mx-auto px-6 py-20">
        <article>
          <header className="mb-12 text-center">
            <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">{post.title}</h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 mt-4">
              Published on {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </header>

          <div
            className="prose prose-lg dark:prose-invert mx-auto"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </main>
      <Footer />
    </div>
  )
}
