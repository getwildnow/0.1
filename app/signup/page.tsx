'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function SignUpPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      setError('Please enter your email')
      return
    }
    setError('')
    setStep(2)
  }

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !companyName) {
      setError('Please fill in all fields')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/founders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          name,
          company_name: companyName,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create account')
      }

      // Store founder and company info in localStorage
      localStorage.setItem('founderId', data.founder.id)
      localStorage.setItem('founderEmail', data.founder.email)
      localStorage.setItem('companyId', data.company.id)
      localStorage.setItem('companyName', data.company.name)

      // Redirect to dashboard
      router.push('/employer/dashboard')
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="bg-brand-cream min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <img className="mx-auto h-12 w-auto" src="https://www.figma.com/api/mcp/asset/6368c286-c151-422f-9597-9b0fdc19ea03" alt="Get Wild" />
          <h2 className="mt-6 text-center text-3xl font-semibold text-brand-black">
            Create an account
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {step === 1 ? (
            <form className="space-y-6" onSubmit={handleEmailSubmit}>
              <div>
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-brand-gray/30 placeholder-brand-gray text-brand-dark focus:outline-none focus:ring-brand-green focus:border-brand-green sm:text-sm"
                  placeholder="you@company.com"
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[#1b1d1a] hover:bg-[#0e1414] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green transition-colors"
                >
                  Continue
                </button>
              </div>
            </form>
          ) : (
            <form className="space-y-6" onSubmit={handleDetailsSubmit}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-brand-dark mb-1">
                  Your Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-brand-gray/30 placeholder-brand-gray text-brand-dark focus:outline-none focus:ring-brand-green focus:border-brand-green sm:text-sm"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-medium text-brand-dark mb-1">
                  Company Name
                </label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  autoComplete="organization"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-brand-gray/30 placeholder-brand-gray text-brand-dark focus:outline-none focus:ring-brand-green focus:border-brand-green sm:text-sm"
                  placeholder="Acme Inc."
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 px-4 border border-brand-gray/30 text-sm font-medium rounded-lg text-brand-dark hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[#1b1d1a] hover:bg-[#0e1414] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Creating...' : 'Get Started'}
                </button>
              </div>
            </form>
          )}
          
          {step === 1 && (
            <p className="text-center text-sm text-brand-gray">
              Already have an account?{' '}
              <Link href="/login" className="font-medium text-brand-green hover:text-brand-green/80">
                Log in
              </Link>
            </p>
          )}
        </div>

        <p className="text-center text-xs text-brand-gray/80">
          By clicking continue, you agree to our{' '}
          <Link href="/terms-of-service" className="underline hover:text-brand-green">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy-policy" className="underline hover:text-brand-green">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  )
}
