'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

function LoginContent() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const errorParam = searchParams.get('error')
    
    if (errorParam === 'link_expired') {
      setError('Your invitation link has expired. Please contact your HR team for a new invite.')
    } else if (errorParam === 'auth_failed') {
      setError('Authentication failed. Please try again or contact support.')
    } else if (errorParam === 'session_failed') {
      setError('Failed to establish session. Please try again or contact support.')
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()

    if (!supabase) {
      setError('Authentication service is not configured. Please contact support.')
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      router.push('/employee/dashboard')
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-cream flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-brand-black">Get wild.</Link>
          <h1 className="mt-6 text-2xl font-bold text-brand-black">
            Sign in to your employee account
          </h1>
          <p className="mt-2 text-sm text-brand-gray">
            Access your health coverage and submit claims
          </p>
        </div>

        <form onSubmit={handleSubmit} className="card">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-brand-dark mb-1">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-brand-gray/30 placeholder-brand-gray text-brand-dark focus:outline-none focus:ring-brand-green focus:border-brand-green focus:z-10 sm:text-sm"
                placeholder="your.email@company.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-brand-dark mb-1">
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
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-brand-gray/30 placeholder-brand-gray text-brand-dark focus:outline-none focus:ring-brand-green focus:border-brand-green focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          {error && (
            <div className="mt-4 text-sm text-red-600 text-center">
              {error}
            </div>
          )}

          <div className="mt-6">
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-green hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          <div className="mt-4 text-center text-sm">
            <Link href="/employee/forgot-password" className="font-medium text-brand-green hover:text-brand-green/80">
              Forgot your password?
            </Link>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-brand-gray">
            New employee? Contact your HR team to get access.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function EmployeeLogin() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <p className="text-brand-gray">Loading...</p>
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}
