'use client'

import { useState } from 'react'
import { DashboardSidebar } from './DashboardSidebar'

interface NavLink {
  name: string
  href: string
  icon: React.ReactNode
}

interface DashboardLayoutProps {
  children: React.ReactNode
  links: NavLink[]
}

export function DashboardLayout({ children, links }: DashboardLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <div className="min-h-screen flex bg-brand-cream">
      <DashboardSidebar 
        links={links} 
        isCollapsed={isCollapsed} 
        toggleSidebar={toggleSidebar} 
      />
      <main className="flex-1 p-8 sm:p-12 transition-all duration-300 ease-in-out">
        {children}
      </main>
    </div>
  )
}
