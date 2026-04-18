'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this should be a more secure authentication method.
    // For this personal portfolio, a hardcoded password is a simple starting point.
    if (password === (process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'password')) {
      // Use sessionStorage to maintain login state for the current session.
      sessionStorage.setItem('isAdminAuthenticated', 'true')
      router.push('/admin/dashboard')
    } else {
      setError('Invalid password. Please try again.')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-sm p-8 space-y-6 bg-white rounded-lg shadow-xl dark:bg-gray-800">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white">Admin Access</h1>
        <p className="text-center text-gray-600 dark:text-gray-400">Enter your password to manage the blog.</p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700 dark:text-gray-300 sr-only"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
          </div>
          {error && <p className="text-sm text-center text-red-500 dark:text-red-400">{error}</p>}
          <div>
            <button
              type="submit"
              className="w-full px-4 py-3 font-semibold text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300"
            >
              Unlock Dashboard
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
