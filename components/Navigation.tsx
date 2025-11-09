'use client'

import Link from 'next/link'
import { useState } from 'react'

const navigation = [
  { name: 'Overview', href: '#overview' },
  { name: 'Benefits', href: '#benefits' },
  { name: 'Product', href: '#product' },
  { name: 'Pricing', href: '#pricing' },
  { name: 'FAQ', href: '#faq' },
]

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="fixed inset-x-0 top-0 z-50 bg-[#fffaf4]/80 backdrop-blur-lg h-16">
      <div className="relative h-full max-w-[1280px] mx-auto px-4">
        {/* Logo */}
        <Link href="/" className="absolute left-4 md:left-[23px] top-1/2 -translate-y-1/2 h-[36px] w-[120px] md:w-[147px]">
          <img src="https://www.figma.com/api/mcp/asset/6368c286-c151-422f-9597-9b0fdc19ea03" alt="Get wild" className="w-full h-full object-contain" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex absolute top-0 left-0 right-0 h-full items-center justify-center space-x-10">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-[18px] font-medium text-[#1b1d1a] tracking-[-0.54px] leading-[1.4] hover:text-[#0e1414] transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Sign Up Button */}
        <Link
          href="/signup"
          className="hidden lg:flex absolute right-8 top-1/2 -translate-y-1/2 bg-[#1b1d1a] px-[16px] py-[8px] rounded-[12px] items-center justify-center gap-[8px] hover:bg-[#0e1414] transition-colors"
        >
          <span className="text-[16px] font-medium text-[#fffaf4] tracking-[-0.08px] leading-[1.45]">Sign Up</span>
        </Link>

        {/* Mobile menu button */}
        <div className="lg:hidden absolute right-4 top-1/2 -translate-y-1/2">
          <button
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="inline-flex items-center justify-center rounded-md p-2 text-[#1b1d1a] hover:bg-[#f8d794]/30"
          >
            <span className="sr-only">Toggle navigation</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-16 left-0 right-0 bg-[#fffaf4]/95 backdrop-blur-lg">
          <div className="space-y-1 px-4 py-3">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-lg px-3 py-2 text-[#1b1d1a] hover:bg-[#f8d794]/20"
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/signup"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-3 inline-flex w-full justify-center bg-[#1b1d1a] px-4 py-2 rounded-[12px] text-[16px] font-medium text-[#fffaf4] hover:bg-[#0e1414]"
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
