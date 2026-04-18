'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Plus, Edit, Trash } from 'lucide-react'

interface Post {
  slug: string
  title: string
  date: string
}

// Dummy function to simulate fetching posts
const getAdminPosts = async (): Promise<Post[]> => {
  return [
    { slug: 'my-first-post', title: 'My First Blog Post', date: '2024-08-01' },
    { slug: 'understanding-react-hooks', title: 'Understanding React Hooks', date: '2024-08-05' },
  ]
}

export default function AdminDashboard() {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Protect the route
    const isAuthenticated = sessionStorage.getItem('isAdminAuthenticated') === 'true'
    if (!isAuthenticated) {
      router.replace('/admin/login')
      return
    }

    const fetchPosts = async () => {
      setIsLoading(true)
      const fetchedPosts = await getAdminPosts()
      setPosts(fetchedPosts)
      setIsLoading(false)
    }

    fetchPosts()
  }, [router])

  // Handle deletion of a post
  const handleDelete = (slug: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      // Here you would call an API to delete the post
      console.log(`Deleting post: ${slug}`)
      setPosts(posts.filter(p => p.slug !== slug))
    }
  }

  if (isLoading) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
          <p className="text-lg text-gray-600 dark:text-gray-300">Loading dashboard...</p>
        </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Blog Dashboard</h1>
          <Link href="/admin/editor" className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors duration-300">
            <Plus className="w-5 h-5" />
            New Post
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {posts.length > 0 ? (
              posts.map(post => (
                <li key={post.slug} className="p-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{post.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Published on {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Link href={`/admin/editor/${post.slug}`} className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                      <Edit className="w-5 h-5" />
                    </Link>
                    <button onClick={() => handleDelete(post.slug)} className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors">
                      <Trash className="w-5 h-5" />
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <li className="p-6 text-center text-gray-500 dark:text-gray-400">
                <p>No posts yet. Time to write something amazing!</p>
              </li>
            )}
          </ul>
        </div>
      </main>
    </div>
  )
}
