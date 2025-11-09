import Link from 'next/link'

export default function SignUpPage() {
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
          <button
            type="button"
            className="w-full flex justify-center items-center py-3 px-4 border border-brand-gray/30 rounded-lg shadow-sm bg-white text-sm font-medium text-brand-dark hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Sign up with Google
          </button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-brand-gray/20" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-brand-gray">Or continue with</span>
            </div>
          </div>

          <form className="space-y-6" action="#" method="POST">
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
                className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-brand-gray/30 placeholder-brand-gray text-brand-dark focus:outline-none focus:ring-brand-green focus:border-brand-green sm:text-sm"
                placeholder="you@company.com"
              />
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-brand-green hover:bg-brand-green/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green"
              >
                Send magic link
              </button>
            </div>
          </form>
          
          <p className="text-center text-sm text-brand-gray">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-brand-teal hover:text-brand-green">
              Log in
            </Link>
          </p>
        </div>
        <p className="text-center text-xs text-brand-gray/80">
          By clicking continue, you agree to our{' '}
          <Link href="/terms-of-service" className="underline hover:text-brand-teal">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy-policy" className="underline hover:text-brand-teal">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  )
}
