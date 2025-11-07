'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/admin/verify-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error('Invalid password')
      }

      // Password is correct, redirect to admin dashboard
      router.push('/admin/dashboard')
    } catch (error: any) {
      setError(error.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-brand-yellow">Get wild.</Link>
          <h1 className="mt-6 text-2xl font-bold text-white">
            Internal Dashboard Access
          </h1>
          <p className="mt-2 text-sm text-brand-gray">
            For Get Wild team members only
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-brand-dark rounded-lg shadow-xl p-8">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-brand-gray mb-2">
              Access Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="appearance-none rounded-lg relative block w-full px-3 py-2 bg-brand-black border border-brand-gray/30 placeholder-brand-gray text-white focus:outline-none focus:ring-brand-yellow focus:border-brand-yellow focus:z-10 sm:text-sm"
              placeholder="Enter access password"
            />
          </div>

          {error && (
            <div className="mt-4 text-sm text-red-400 text-center">
              {error}
            </div>
          )}

          <div className="mt-6">
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-brand-black bg-brand-yellow hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-yellow disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Access Dashboard'}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-brand-gray hover:text-brand-yellow">
            ← Back to main site
          </Link>
        </div>
      </div>
    </div>
  )
}
