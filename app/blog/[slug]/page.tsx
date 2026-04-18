'use client'

import { useState, useEffect } from 'react'
import { notFound } from 'next/navigation'
import Navigation from '@/components/navigation'
import Footer from '@/components/footer'

interface Post {
  slug: string
  title: string
  content: string
  date: string
}

// Dummy function to simulate fetching a single post
const getPost = async (slug: string): Promise<Post | null> => {
  const posts: Post[] = [
    {
      slug: 'my-first-post',
      title: 'My First Blog Post',
      content: `<p>This is the full content of my first post. It's a great start to a long and fruitful blogging journey. I'll be sharing my thoughts on web development, a bit of design, and maybe even some personal projects.</p><p>Stay tuned for more updates!</p>`,
      date: '2024-08-01',
    },
    {
      slug: 'understanding-react-hooks',
      title: 'Understanding React Hooks',
      content: `<p>React Hooks have revolutionized how we write components. In this post, we'll explore the most common hooks and how to use them effectively.</p><h2>useState</h2><p>The <code>useState</code> hook is the most basic and essential hook for managing state in a functional component.</p><h2>useEffect</h2><p>The <code>useEffect</code> hook lets you perform side effects in functional components, such as data fetching, subscriptions, or manually changing the DOM.</p>`,
      date: '2024-08-05',
    },
  ]
  return posts.find((p) => p.slug === slug) || null
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const [post, setPost] = useState<Post | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true)
      const fetchedPost = await getPost(params.slug)
      if (!fetchedPost) {
        notFound()
      }
      setPost(fetchedPost)
      setIsLoading(false)
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

  if (!post) return null // This will be handled by notFound() in useEffect

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
