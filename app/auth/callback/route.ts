import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/employee/dashboard'

  console.log('[Auth Callback] Processing auth callback...')
  console.log('[Auth Callback] Code present:', !!code)
  console.log('[Auth Callback] Next destination:', next)

  if (code) {
    const cookieStore = await cookies()
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.set({ name, value: '', ...options })
          },
        },
      }
    )

    console.log('[Auth Callback] Exchanging code for session...')
    
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('[Auth Callback] Error exchanging code:', error.message)
      return NextResponse.redirect(
        new URL('/employee/login?error=auth_failed', requestUrl.origin)
      )
    }

    console.log('[Auth Callback] ✅ Session created successfully!')
    console.log('[Auth Callback] User ID:', data.user?.id)
    console.log('[Auth Callback] User email:', data.user?.email)
    console.log('[Auth Callback] User metadata:', data.user?.user_metadata)
    console.log('[Auth Callback] Redirecting to:', next)

    // Redirect to the dashboard (or specified next page)
    return NextResponse.redirect(new URL(next, requestUrl.origin))
  }

  console.error('[Auth Callback] No code provided in callback')
  
  // No code present, redirect to login
  return NextResponse.redirect(
    new URL('/employee/login?error=no_code', requestUrl.origin)
  )
}

