"use client";

import { useState } from "react";
import ChatInterface from "@/components/chat/ChatInterface";

export default function TestPage() {
  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">Test Chat Interface</h1>
        <p className="text-gray-600 mb-4">
          This is a test page to see the chat UI. It won't save data without Supabase setup.
        </p>
        <ChatInterface />
      </div>
    </div>
  );
}

