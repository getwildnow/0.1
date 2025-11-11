'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

const VALID_EMAIL = 'team@getwild-now.com'
const VALID_PASSWORD = 'Getwild45real!?'

export default function EmployerLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Simple validation
    if (email === VALID_EMAIL && password === VALID_PASSWORD) {
      // Set auth in localStorage with 24 hour expiry
      const authData = {
        email: VALID_EMAIL,
        expires: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
        timestamp: Date.now()
      }
      localStorage.setItem('employer_auth', JSON.stringify(authData))
      
      // Redirect to dashboard
      router.push('/employer/dashboard')
    } else {
      setError('Invalid email or password')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-cream px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-block mb-6">
            <Image
              src="/logo.svg"
              alt="Get wild."
              width={120}
              height={40}
              className="h-10 w-auto"
            />
          </div>
          <h1 className="text-3xl font-bold text-brand-darkest mb-2">Internal Dashboard</h1>
          <p className="text-brand-gray">Sign in to access the employer portal</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-brand-gray/20 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600 font-medium">⚠️ {error}</p>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-brand-darkest mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="team@getwild-now.com"
                className="w-full px-4 py-3 border border-brand-gray/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-brand-darkest mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                className="w-full px-4 py-3 border border-brand-gray/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-3 bg-brand-black text-white rounded-lg font-medium hover:bg-brand-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-brand-gray mt-6">
          For internal use only. Authorized personnel only.
        </p>
      </div>
    </div>
  )
}

