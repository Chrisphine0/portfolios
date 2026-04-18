'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

// A simple rich text editor component
const RichTextEditor = ({ value, onChange }: { value: string, onChange: (value: string) => void }) => {
    // In a real application, you would use a library like Quill, TipTap, or Slate.
    // For this example, a simple textarea will suffice.
    return (
        <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={15}
            className="w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            placeholder="Start writing your masterpiece..."
        />
    )
}

export default function PostEditor({ params }: { params: { slug?: string } }) {
    const [title, setTitle] = useState('')
    const [slug, setSlug] = useState('')
    const [content, setContent] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()
    const isEditing = !!params.slug

    useEffect(() => {
        // Protect the route
        const isAuthenticated = sessionStorage.getItem('isAdminAuthenticated') === 'true'
        if (!isAuthenticated) {
            router.replace('/admin/login')
            return
        }

        if (isEditing) {
            // Fetch post data for editing
            // In a real app, this would fetch from your backend.
            console.log(`Fetching post: ${params.slug}`)
            setTitle('Example Post Title')
            setSlug(params.slug as string)
            setContent('<p>This is the content of the post being edited.</p>')
        }
    }, [isEditing, params.slug, router])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Here, you would send the data to your backend to save the post.
        console.log({ title, slug, content, isEditing })

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))

        setIsSubmitting(false)
        alert(`Post ${isEditing ? 'updated' : 'created'} successfully!`)
        router.push('/admin/dashboard')
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
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title</label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="My Awesome Blog Post"
                            className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="slug" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Slug</label>
                        <input
                            id="slug"
                            type="text"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            placeholder="my-awesome-blog-post"
                            className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Content</label>
                        <RichTextEditor value={content} onChange={setContent} />
                    </div>
                    <div className="flex justify-end gap-4">
                        <button type="button" onClick={() => router.back()} className="px-6 py-3 font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">Cancel</button>
                        <button type="submit" disabled={isSubmitting} className="px-6 py-3 font-semibold text-white bg-purple-600 rounded-lg hover:bg-purple-700 disabled:bg-purple-400">
                            {isSubmitting ? 'Saving...' : 'Save Post'}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    )
}
