'use client'

import Link from 'next/link'
import { useState } from 'react'

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="fixed w-full top-0 bg-brand-cream z-50 border-b border-brand-gray/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-brand-black">Get wild.</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link href="#overview" className="text-brand-dark hover:text-brand-black transition-colors">
                Overview
              </Link>
              <Link href="#benefits" className="text-brand-dark hover:text-brand-black transition-colors">
                Benefits
              </Link>
              <Link href="#product" className="text-brand-dark hover:text-brand-black transition-colors">
                Product
              </Link>
              <Link href="#pricing" className="text-brand-dark hover:text-brand-black transition-colors">
                Pricing
              </Link>
              <Link href="#faq" className="text-brand-dark hover:text-brand-black transition-colors">
                FAQ
              </Link>
            </div>
          </div>

          <div className="hidden md:block">
            <Link href="/employer/login" className="btn-primary">
              Sign up
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-brand-dark hover:text-brand-black hover:bg-brand-yellow/20"
            >
              <span className="sr-only">Open main menu</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-brand-cream border-t border-brand-gray/20">
            <Link href="#overview" className="block px-3 py-2 text-brand-dark hover:text-brand-black">Overview</Link>
            <Link href="#benefits" className="block px-3 py-2 text-brand-dark hover:text-brand-black">Benefits</Link>
            <Link href="#product" className="block px-3 py-2 text-brand-dark hover:text-brand-black">Product</Link>
            <Link href="#pricing" className="block px-3 py-2 text-brand-dark hover:text-brand-black">Pricing</Link>
            <Link href="#faq" className="block px-3 py-2 text-brand-dark hover:text-brand-black">FAQ</Link>
            <Link href="/employer/login" className="block px-3 py-2 mt-4 btn-primary text-center">Sign up</Link>
          </div>
        </div>
      )}
    </nav>
  )
}
