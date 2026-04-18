'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function PostEditor({ params }: { params: { slug?: string[] } }) {
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [content, setContent] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()
  const isEditing = !!params.slug?.[0]
  const postSlug = params.slug?.[0]

  useEffect(() => {
    if (sessionStorage.getItem('isAdminAuthenticated') !== 'true') {
      router.replace('/admin/login')
      return
    }

    if (isEditing && postSlug) {
      setIsLoading(true)
      fetch(`/api/posts/${postSlug}`, {
        headers: { 'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'password'}` },
      })
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch post data.')
          return res.json()
        })
        .then(data => {
          setTitle(data.title)
          setSlug(postSlug)
          setContent(data.content)
          setExcerpt(data.excerpt)
        })
        .catch(err => setError(err.message))
        .finally(() => setIsLoading(false))
    } else {
      setIsLoading(false)
    }
  }, [isEditing, postSlug, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const apiUrl = isEditing ? `/api/posts/${postSlug}` : '/api/posts'
    const method = isEditing ? 'PUT' : 'POST'

    try {
      const res = await fetch(apiUrl, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'password'}`,
        },
        body: JSON.stringify({ title, slug: postSlug || slug, content, excerpt }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || `Failed to ${isEditing ? 'update' : 'create'} post.`)
      }

      alert(`Post ${isEditing ? 'updated' : 'created'} successfully!`)
      router.push('/admin/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  if (sessionStorage.getItem('isAdminAuthenticated') !== 'true') return null

  if (isLoading) {
    return <div className="text-center py-20">Loading editor...</div>
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-md">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isEditing ? 'Edit Post' : 'Create New Post'}
          </h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
              required
            />
          </div>
          {!isEditing && (
            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Slug</label>
              <input
                id="slug"
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))}
                className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                required
              />
            </div>
          )}
           <div>
                <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Excerpt</label>
                 <input
                    id="excerpt"
                    type="text"
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="A short summary of the post"
                    className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                />
            </div>
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Content (Markdown)</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={20}
              className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:text-white dark:border-gray-600 font-mono"
              placeholder="# My Heading\n\nWrite your post content in Markdown..."
            />
          </div>
          <div className="flex justify-end gap-4">
            <button type="button" onClick={() => router.back()} className="px-6 py-3 font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-6 py-3 font-semibold text-white bg-purple-600 rounded-lg hover:bg-purple-700 disabled:opacity-50">
              {isSubmitting ? 'Saving...' : 'Save Post'}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
