export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-2xl text-center">
        {/* Logo */}
        <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-4xl mx-auto mb-8 shadow-2xl">
          G
        </div>

        {/* Title */}
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          getwild - Prime Care
        </h1>
        <p className="text-2xl text-gray-600 mb-12">
          Employee Onboarding System
        </p>

        {/* Instructions Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-12 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            Welcome to Your Onboarding Journey
          </h2>
          
          <div className="space-y-8 text-left">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  📧 Check Your Email
                </h3>
                <p className="text-gray-600">
                  You will receive a secure magic link from your administrator. Click the link to begin your onboarding.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-2xl font-bold text-indigo-600">2</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  🔒 ID Verification with Veriff
                </h3>
                <p className="text-gray-600">
                  Complete a quick and secure identity verification process. This ensures your information is protected.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  🤖 AI-Powered Onboarding Chat
                </h3>
                <p className="text-gray-600">
                  Chat with our AI assistant powered by ChatGPT to complete your onboarding quickly and easily.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-gray-500 text-sm">
          <p>🔐 Bank-level security • ⚡ Complete in minutes • 🎯 Smart & Simple</p>
        </div>
      </div>
    </main>
  );
}

