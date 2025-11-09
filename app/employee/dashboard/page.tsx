'use client'

import { useState } from 'react'

interface Message {
  from: 'user' | 'ai'
  text: string
}

export default function EmployeeDashboard() {
  const [message, setMessage] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || !agreed) return

    const newUserMessage: Message = { from: 'user', text: message }
    
    setMessages(prev => [
      ...prev, 
      newUserMessage,
      { from: 'ai', text: "I'm really sorry you're not feeling well. Could you tell me a bit more about what specific symptoms you're experiencing or what feels different from your usual health? This will help me guide you to the right expert as quickly as possible." }
    ]);
    
    setMessage('')
  }

  return (
    <div className="flex h-full flex-col bg-[#F9F9F9]">
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-3xl mx-auto w-full">
          {messages.length === 0 ? (
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center border-2 border-brand-dark/10">
                  <span className="text-2xl font-semibold">AI</span>
                </div>
              </div>
              <h1 className="text-4xl font-semibold text-brand-black">
                Hi, I'm your AI Doctor
              </h1>
              <p className="mt-4 text-brand-gray max-w-md mx-auto">
                I'm your private and personal AI doctor. My service is fast and free. What can I help you with today?
              </p>
            </div>
          ) : (
            <>
              <p className="text-center text-sm text-brand-gray mb-8">
                If this is an emergency, call 911 or your local emergency number.
              </p>
              <div className="space-y-6">
                {messages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.from === 'user' ? (
                      <div className="bg-brand-green text-white rounded-2xl rounded-br-none max-w-md p-4">
                        <p>{msg.text}</p>
                      </div>
                    ) : (
                      <div className="text-brand-dark max-w-md">
                        <p>{msg.text}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="p-6 sm:p-8 bg-brand-cream border-t border-brand-gray/10">
        <div className="max-w-3xl mx-auto">
          <form
            onSubmit={handleSubmit}
          >
            <div className="bg-white rounded-xl border border-brand-gray/20 p-4">
              <div className="flex items-center mb-2">
                <input
                  id="terms"
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="h-4 w-4 rounded border-brand-gray/30 text-brand-green focus:ring-brand-green"
                />
                <label htmlFor="terms" className="ml-2 text-xs text-brand-gray">
                  I agree to the Get Wild Terms of Service.
                </label>
              </div>
              <div className="relative">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Reply to your AI Doctor..."
                  className="w-full border-none resize-none focus:outline-none focus:ring-0 placeholder-brand-gray"
                  rows={2}
                />
                <button
                  type="submit"
                  disabled={!agreed || !message}
                  className="absolute right-0 bottom-0 bg-brand-green text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-brand-green/90 disabled:bg-brand-gray/50 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
