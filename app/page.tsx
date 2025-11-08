export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center max-w-md px-6">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-3xl mx-auto mb-6 shadow-lg">
          G
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          getwild - Prime Care
        </h1>
        <p className="text-gray-600 mb-6">
          Employee Onboarding System
        </p>
        <div className="bg-white rounded-lg shadow-lg p-8">
          <p className="text-lg text-gray-700 mb-2">
            📧 Please check your email for your onboarding link
          </p>
          <p className="text-sm text-gray-500">
            You should have received a secure magic link to begin your onboarding process.
          </p>
        </div>
      </div>
    </div>
  );
}

