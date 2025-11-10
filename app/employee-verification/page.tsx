'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function VerificationContent() {
  const searchParams = useSearchParams()
  const [founderName, setFounderName] = useState('')
  const [companyName, setCompanyName] = useState('')

  useEffect(() => {
    // Get founder/company info from URL params or token
    // For now, we'll use placeholder - Tade will integrate with actual auth token
    const token = searchParams.get('token')
    
    // TODO: Tade will decode token to get founder name and company
    // For now, show generic message
    setFounderName('your employer')
    setCompanyName('Get Wild')
  }, [searchParams])

  return (
    <div className="bg-brand-cream min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6">
        <Link href="/">
          <img
            src="https://www.figma.com/api/mcp/asset/6368c286-c151-422f-9597-9b0fdc19ea03"
            alt="Get wild."
            className="h-9 w-auto"
          />
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-8">
          {/* Headline */}
          <div>
            <h1 className="text-4xl font-semibold text-brand-black mb-4">
              You've been invited!
            </h1>
            <p className="text-lg text-brand-gray">
              You got invited by <span className="font-medium text-brand-dark">{founderName}</span> to join {companyName}
            </p>
          </div>

          {/* Verification Button */}
          <div>
            <button
              onClick={() => {
                // Placeholder - verification flow will be implemented later
              }}
              className="bg-[#1b1d1a] px-8 py-4 rounded-xl text-white text-lg font-medium hover:bg-[#0e1414] transition-colors w-full max-w-xs mx-auto block"
            >
              Start Verification
            </button>
          </div>

          {/* Additional Info */}
          <p className="text-sm text-brand-gray">
            By continuing, you agree to our{' '}
            <Link href="/terms-of-service" className="underline hover:text-brand-dark">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy-policy" className="underline hover:text-brand-dark">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}

export default function EmployeeVerificationPage() {
  return (
    <Suspense fallback={
      <div className="bg-brand-cream min-h-screen flex items-center justify-center">
        <p className="text-brand-gray">Loading...</p>
      </div>
    }>
      <VerificationContent />
    </Suspense>
  )
}
