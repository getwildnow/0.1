"use client";

import { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import Message from "./Message";
import { useRouter } from "next/navigation";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  type: "text" | "consent" | "question" | "integration" | "action" | "complete";
  content: string;
  metadata?: any;
  timestamp: string;
}

export default function ChatInterface() {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [consentAgreed, setConsentAgreed] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadChatHistory();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadChatHistory = async () => {
    try {
      const response = await fetch("/api/onboarding/chat");
      if (response.ok) {
        const data = await response.json();
        if (data.messages && data.messages.length > 0) {
          setMessages(data.messages);
        } else {
          // Start conversation
          startConversation();
        }
      } else {
        // If unauthorized or error, show demo message
        setMessages([{
          id: '1',
          role: 'assistant',
          type: 'consent',
          content: 'Hi there! I\'m your health companion. Before we start, please agree to our terms.',
          timestamp: new Date().toISOString(),
        }]);
        setInitialized(true);
      }
    } catch (error) {
      console.error("Error loading chat:", error);
      // Show demo message on error
      setMessages([{
        id: '1',
        role: 'assistant',
        type: 'consent',
        content: 'Hi there! I\'m your health companion. Before we start, please agree to our terms.',
        timestamp: new Date().toISOString(),
      }]);
      setInitialized(true);
    }
  };

  const startConversation = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/onboarding/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "get_next" }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.message) {
          setMessages([{
            id: Date.now().toString(),
            role: "assistant",
            type: data.message.type,
            content: data.message.content,
            metadata: data.message.metadata,
            timestamp: new Date().toISOString(),
          }]);
        }
      }
    } catch (error) {
      console.error("Error starting conversation:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || loading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      type: "text",
      content: messageText,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/onboarding/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageText,
          action: "answer",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.message) {
          const aiMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            type: data.message.type,
            content: data.message.content,
            metadata: data.message.metadata,
            timestamp: new Date().toISOString(),
          };
          setMessages((prev) => [...prev, aiMessage]);

          // If complete, redirect to dashboard
          if (data.message.type === "complete") {
            setTimeout(() => {
              router.push("/dashboard");
            }, 2000);
          }
        }
      } else {
        // Show demo response on error
        const demoResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          type: "question",
          content: "Thanks for your response! (Demo mode - connect Supabase to save data)",
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, demoResponse]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      // Show demo response on error
      const demoResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        type: "question",
        content: "Thanks for your response! (Demo mode - connect Supabase to save data)",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, demoResponse]);
    } finally {
      setLoading(false);
    }
  };

  const handleConsentAgree = async () => {
    setConsentAgreed(true);
    setLoading(true);
    try {
      const response = await fetch("/api/onboarding/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "consent_agreed" }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.message) {
          const aiMessage: ChatMessage = {
            id: Date.now().toString(),
            role: "assistant",
            type: data.message.type,
            content: data.message.content,
            metadata: data.message.metadata,
            timestamp: new Date().toISOString(),
          };
          setMessages((prev) => [...prev, aiMessage]);
        }
      } else {
        // Demo mode - show next question even if API fails
        const demoMessage: ChatMessage = {
          id: Date.now().toString(),
          role: "assistant",
          type: "question",
          content: "Great! What are your health goals?",
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, demoMessage]);
      }
    } catch (error) {
      console.error("Error agreeing to consent:", error);
      // Demo mode - show next question even if API fails
      const demoMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "assistant",
        type: "question",
        content: "Great! What are your health goals?",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, demoMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleIntegrationClick = async (integration: string) => {
    // In production, this would initiate OAuth flow
    // For now, simulate connection
    setLoading(true);
    try {
      const response = await fetch("/api/onboarding/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "integration_connected",
          message: integration,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.message) {
          const aiMessage: ChatMessage = {
            id: Date.now().toString(),
            role: "assistant",
            type: data.message.type,
            content: data.message.content,
            metadata: data.message.metadata,
            timestamp: new Date().toISOString(),
          };
          setMessages((prev) => [...prev, aiMessage]);
        }
      }
    } catch (error) {
      console.error("Error connecting integration:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleActionSelect = async (action: string, choice: string) => {
    // Add user message showing selection
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      type: "text",
      content: choice,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);

    setLoading(true);
    try {
      const response = await fetch("/api/onboarding/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "action_completed",
          message: action,
          choice,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.message) {
          const aiMessage: ChatMessage = {
            id: Date.now().toString(),
            role: "assistant",
            type: data.message.type,
            content: data.message.content,
            metadata: data.message.metadata,
            timestamp: new Date().toISOString(),
          };
          setMessages((prev) => [...prev, aiMessage]);
        }
      }
    } catch (error) {
      console.error("Error selecting action:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
            G
          </div>
          <div>
            <h1 className="font-bold text-lg">getwild Prime Care</h1>
            <p className="text-xs text-gray-500">Your health companion</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
        {!initialized && (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-500">Loading...</div>
          </div>
        )}
        {initialized && messages.map((msg) => (
          <Message
            key={msg.id}
            role={msg.role}
            type={msg.type}
            content={msg.content}
            metadata={msg.metadata}
            onConsentAgree={handleConsentAgree}
            onAnswer={handleSend}
            onIntegrationClick={handleIntegrationClick}
            onActionSelect={handleActionSelect}
          />
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-lg px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 p-4 shadow-lg">
        <div className="flex gap-2 max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
            disabled={loading || !consentAgreed}
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading || !consentAgreed}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-md hover:shadow-lg transition-all transform hover:scale-105 active:scale-95"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

