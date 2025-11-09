'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavLink {
  name: string
  href: string
  icon: React.ReactNode
}

interface DashboardSidebarProps {
  links: NavLink[]
  isCollapsed: boolean
  toggleSidebar: () => void
}

export function DashboardSidebar({ links, isCollapsed, toggleSidebar }: DashboardSidebarProps) {
  const pathname = usePathname()

  return (
    <aside 
      className={`flex-shrink-0 bg-[#11120D] p-6 flex flex-col transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'}`}
    >
      <div className={`mb-10 ${isCollapsed ? 'mx-auto' : ''}`}>
        <Link href="/">
          <img
            src="https://www.figma.com/api/mcp/asset/6368c286-c151-422f-9597-9b0fdc19ea03"
            alt="Get wild."
            className={`transition-all duration-300 ${isCollapsed ? 'h-8 w-8' : 'h-9 w-auto'}`}
          />
        </Link>
      </div>
      <nav className="flex flex-col space-y-2">
        {links.map((link) => {
          const isActive = pathname === link.href
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`
                flex items-center gap-x-4 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${
                  isActive
                    ? 'bg-brand-dark text-brand-cream'
                    : 'text-brand-gray hover:bg-brand-dark hover:text-brand-cream'
                }
                ${isCollapsed ? 'justify-center' : ''}
              `}
            >
              {link.icon}
              <span className={`${isCollapsed ? 'hidden' : 'block'}`}>{link.name}</span>
            </Link>
          )
        })}
      </nav>
      <div className="mt-auto">
        <button 
          onClick={toggleSidebar}
          className={`
            w-full flex items-center gap-x-4 px-4 py-2.5 rounded-lg text-sm font-medium text-brand-gray hover:bg-brand-dark hover:text-brand-cream
            ${isCollapsed ? 'justify-center' : ''}
          `}
        >
          <CollapseIcon isCollapsed={isCollapsed} />
          <span className={`${isCollapsed ? 'hidden' : 'block'}`}>Collapse</span>
        </button>
        <button className={`
          w-full flex items-center gap-x-4 px-4 py-2.5 rounded-lg text-sm font-medium text-brand-gray text-left hover:bg-brand-dark hover:text-brand-cream mt-2
          ${isCollapsed ? 'justify-center' : ''}
        `}>
          <LogoutIcon />
          <span className={`${isCollapsed ? 'hidden' : 'block'}`}>Logout</span>
        </button>
      </div>
    </aside>
  )
}

function CollapseIcon({ isCollapsed }: { isCollapsed: boolean }) {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      {isCollapsed ? (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      )}
    </svg>
  )
}

function LogoutIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  )
}
