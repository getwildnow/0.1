"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { DEFAULT_MARKDOWN_LIST } from "@/lib/config/default-list";

export default function AdminDataPointsPage() {
  const [markdown, setMarkdown] = useState(DEFAULT_MARKDOWN_LIST);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [hasSupabase, setHasSupabase] = useState(false);
  
  useEffect(() => {
    // Check if Supabase is configured
    setHasSupabase(
      !!process.env.NEXT_PUBLIC_SUPABASE_URL && 
      process.env.NEXT_PUBLIC_SUPABASE_URL !== 'your_supabase_project_url' &&
      !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'your_supabase_anon_key'
    );
  }, []);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const response = await fetch("/api/config");
      const data = await response.json();
      
      if (data.config) {
        // Reconstruct markdown from config
        let md = "# Health & Medical\n";
        data.config.data_points?.forEach((dp: string) => {
          if (!data.config.integrations?.includes(dp) && !data.config.actions?.includes(dp)) {
            md += `- ${dp}\n`;
          }
        });
        
        md += "\n# Integrations\n";
        data.config.integrations?.forEach((int: string) => {
          md += `- ${int}\n`;
        });
        
        md += "\n# Actions\n";
        data.config.actions?.forEach((act: string) => {
          md += `- ${act}\n`;
        });
        
        setMarkdown(md || DEFAULT_MARKDOWN_LIST);
      }
    } catch (error) {
      console.error("Error loading config:", error);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    
    try {
      const response = await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markdown }),
      });

      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        alert("Failed to save");
      }
    } catch (error) {
      console.error("Error saving:", error);
      alert("Error saving config");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-2">Admin: Data Points Configuration</h1>
          <p className="text-gray-600 mb-6">
            Edit the markdown list below. AI will automatically use this to collect data.
          </p>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Markdown List
            </label>
            <textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              className="w-full h-96 p-4 border-2 border-gray-300 rounded-lg font-mono text-sm focus:border-blue-500 focus:outline-none resize-none"
              placeholder="Enter markdown list..."
            />
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {saving ? "Saving..." : "Save Configuration"}
            </button>
            {saved && (
              <span className="text-green-600 font-medium">✓ Saved!</span>
            )}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold mb-2">How it works:</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Add items with <code className="bg-white px-1 rounded">- item name</code></li>
              <li>• AI automatically detects if it's a question, integration, or action</li>
              <li>• Changes apply immediately to new conversations</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

