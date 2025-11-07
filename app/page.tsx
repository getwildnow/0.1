import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Navigation />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-brand-cream to-brand-yellow/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-brand-black">
              POV: You Get Everything Covered
            </h1>
            <p className="text-xl md:text-2xl text-brand-dark mb-8 max-w-3xl mx-auto">
              Health insurance for startups that actually makes sense. Zero deductibles, 
              59-minute claims, and coverage for everything that hurts you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/employer/login" className="btn-primary text-lg px-8 py-4">
                Get Started Today
              </a>
              <a href="#product" className="btn-secondary text-lg px-8 py-4">
                Learn More
              </a>
            </div>
          </div>
        </section>

        {/* Product Section */}
        <section id="product" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                One Product: Full Coverage of Everything
              </h2>
              <div className="max-w-4xl mx-auto">
                <div className="bg-brand-cream rounded-2xl p-8 md:p-12 border-2 border-brand-green">
                  <h3 className="text-2xl font-bold mb-4 text-brand-green">Our Policy in Plain English</h3>
                  <p className="text-xl text-brand-dark leading-relaxed">
                    "Except fraud, we cover everything related to your body and health that hurts you."
                  </p>
                  <div className="mt-6 pt-6 border-t border-brand-gray/30">
                    <ul className="text-lg text-brand-dark space-y-2">
                      <li className="flex items-center">
                        <svg className="w-6 h-6 text-brand-green mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        No co-payments or deductibles
                      </li>
                      <li className="flex items-center">
                        <svg className="w-6 h-6 text-brand-green mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Dental and vision included
                      </li>
                      <li className="flex items-center">
                        <svg className="w-6 h-6 text-brand-green mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Mental health fully covered
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="benefits" className="py-20 bg-brand-cream/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
              Why Teams Choose Get Wild
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Claim Speed */}
              <div className="card text-center">
                <div className="w-16 h-16 bg-brand-yellow rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-brand-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4">Claims Paid in Under 59 Minutes</h3>
                <p className="text-brand-dark">
                  Every claim is processed in less than 59 minutes instead of 14 days. 
                  We pay directly to the hospitals when possible or give you the pre-cash for your bill.
                </p>
              </div>

              {/* Support */}
              <div className="card text-center">
                <div className="w-16 h-16 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4">24/7 Human Support in 30 Seconds</h3>
                <p className="text-brand-dark">
                  You reach human support within 30 seconds 24/7, we resolve every issue in under 3 minutes for you.
                </p>
              </div>

              {/* Flexibility */}
              <div className="card text-center">
                <div className="w-16 h-16 bg-brand-teal rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4">Cancel Anytime</h3>
                <p className="text-brand-dark">
                  You can cancel your insurance anytime, just like a Netflix subscription. 
                  No long-term contracts or penalties.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-brand-green text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Get Wild?
            </h2>
            <p className="text-xl mb-8">
              Join forward-thinking startups who prioritize their team's health and wellbeing.
            </p>
            <a href="/employer/login" className="bg-white text-brand-green px-8 py-4 rounded-lg font-semibold text-lg hover:bg-brand-cream transition-colors inline-block">
              Start Your Coverage Today
            </a>
            <p className="mt-4 text-sm opacity-90">
              For companies with 20+ employees
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
