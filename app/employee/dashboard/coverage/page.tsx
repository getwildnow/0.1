'use client'

export default function CoveragePage() {
  const coverageCategories = [
    {
      name: 'Medical',
      icon: '🏥',
      items: [
        'Doctor visits (primary care and specialists)',
        'Hospital stays and emergency room visits',
        'Surgery and medical procedures',
        'Preventive care and screenings',
        'Laboratory tests and X-rays',
        'Physical therapy and rehabilitation',
        'Prescription medications',
        'Medical equipment and devices',
      ],
    },
    {
      name: 'Dental',
      icon: '🦷',
      items: [
        'Routine cleanings and exams',
        'Fillings and extractions',
        'Root canals and crowns',
        'Bridges and dentures',
        'Orthodontics (braces, Invisalign)',
        'Oral surgery',
        'Periodontal treatments',
        'Cosmetic procedures',
      ],
    },
    {
      name: 'Vision',
      icon: '👁️',
      items: [
        'Annual eye exams',
        'Prescription glasses',
        'Contact lenses',
        'LASIK and vision correction surgery',
        'Treatment for eye conditions',
        'Designer frames',
        'Prescription sunglasses',
        'Vision therapy',
      ],
    },
    {
      name: 'Mental Health',
      icon: '🧠',
      items: [
        'Therapy and counseling sessions',
        'Psychiatric consultations',
        'Mental health medications',
        'Substance abuse treatment',
        'Inpatient mental health care',
        'Group therapy sessions',
        'Telehealth mental health services',
        'Wellness programs',
      ],
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-brand-black">Your Coverage Details</h1>
        <p className="text-brand-gray mt-1">Everything you need to know about your health insurance coverage</p>
      </div>

      {/* Simple Policy */}
      <div className="card bg-brand-green/10 border-brand-green mb-8">
        <h2 className="text-2xl font-bold text-brand-green mb-4">Our Simple Policy</h2>
        <p className="text-xl text-brand-dark leading-relaxed">
          "Except fraud, we cover everything related to your body and health that hurts you."
        </p>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center">
            <svg className="h-6 w-6 text-brand-green mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-medium text-brand-dark">$0 Deductible</span>
          </div>
          <div className="flex items-center">
            <svg className="h-6 w-6 text-brand-green mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-medium text-brand-dark">$0 Co-payments</span>
          </div>
          <div className="flex items-center">
            <svg className="h-6 w-6 text-brand-green mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-medium text-brand-dark">No Network Restrictions</span>
          </div>
        </div>
      </div>

      {/* Coverage Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {coverageCategories.map((category) => (
          <div key={category.name} className="card">
            <div className="flex items-center mb-4">
              <span className="text-3xl mr-3">{category.icon}</span>
              <h3 className="text-xl font-bold text-brand-black">{category.name} Coverage</h3>
            </div>
            <ul className="space-y-2">
              {category.items.map((item, index) => (
                <li key={index} className="flex items-start">
                  <svg className="h-5 w-5 text-brand-green mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-brand-dark">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* How to Use */}
      <div className="card">
        <h2 className="text-xl font-bold text-brand-black mb-4">How to Use Your Coverage</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="w-12 h-12 bg-brand-yellow rounded-full flex items-center justify-center mb-3">
              <span className="font-bold text-brand-black">1</span>
            </div>
            <h3 className="font-semibold text-brand-black mb-2">Visit Any Provider</h3>
            <p className="text-sm text-brand-gray">
              See any doctor, dentist, or specialist. No need to check if they're "in-network" - everyone is covered.
            </p>
          </div>
          <div>
            <div className="w-12 h-12 bg-brand-yellow rounded-full flex items-center justify-center mb-3">
              <span className="font-bold text-brand-black">2</span>
            </div>
            <h3 className="font-semibold text-brand-black mb-2">Submit Your Claim</h3>
            <p className="text-sm text-brand-gray">
              Upload your receipt or invoice through our dashboard. Claims are processed in under 59 minutes.
            </p>
          </div>
          <div>
            <div className="w-12 h-12 bg-brand-yellow rounded-full flex items-center justify-center mb-3">
              <span className="font-bold text-brand-black">3</span>
            </div>
            <h3 className="font-semibold text-brand-black mb-2">Get Reimbursed</h3>
            <p className="text-sm text-brand-gray">
              We pay directly to providers when possible, or reimburse you quickly for out-of-pocket expenses.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
