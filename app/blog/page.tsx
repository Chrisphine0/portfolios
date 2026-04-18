'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import Navigation from '@/components/navigation'
import Footer from '@/components/footer'

interface Post {
  slug: string
  title: string
  excerpt: string
  date: string
}

// Dummy function to simulate fetching posts
// In a real app, this would fetch from a CMS or local markdown files
const getPosts = async (): Promise<Post[]> => {
  // For now, we return a hardcoded list. I will implement full markdown support later.
  return [
    {
      slug: 'my-first-post',
      title: 'My First Blog Post',
      excerpt: 'This is the beginning of my journey into technical writing. Stay tuned for more!',
      date: '2024-08-01',
    },
    {
      slug: 'understanding-react-hooks',
      title: 'Understanding React Hooks',
      excerpt: 'A deep dive into useState, useEffect, and other essential React hooks.',
      date: '2024-08-05',
    },
  ]
}

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true)
      const fetchedPosts = await getPosts()
      setPosts(fetchedPosts)
      setIsLoading(false)
    }
    fetchPosts()
  }, [])

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navigation />
      <main className="max-w-4xl mx-auto px-6 py-20">
        <header className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">My Blog</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Thoughts on technology, development, and everything in between.
          </p>
        </header>

        {isLoading ? (
          <div className="space-y-8">
            {[1, 2].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
              </div>
            ))}
          </div>
        ) : posts.length > 0 ? (
          <div className="space-y-12">
            {posts.map((post) => (
              <article key={post.slug}>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  <Link href={`/blog/${post.slug}`} className="hover:text-purple-600 transition-colors duration-300">
                    {post.title}
                  </Link>
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                  {post.excerpt}
                </p>
                <Link href={`/blog/${post.slug}`} className="text-purple-600 hover:underline mt-4 inline-block font-semibold">
                  Read More &rarr;
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">No posts yet.</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Check back soon for my latest articles!</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
