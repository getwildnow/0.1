'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function AdminDataPointsPage() {
  const [dataPoints, setDataPoints] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('onboarding_config')
          .select('*')
          .eq('id', 'default')
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error loading config:', error);
          return;
        }

        if (data && data.data_points) {
          // Convert array to markdown list format
          setDataPoints(data.data_points.join('\n'));
        }
      } catch (err) {
        console.error('Error loading config:', err);
      }
    };

    loadConfig();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    setSaved(false);

    try {
      // Parse markdown list (one item per line)
      const points = dataPoints
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .map(line => {
          // Remove markdown list markers (-, *, 1., etc.)
          return line.replace(/^[-*]\s+/, '').replace(/^\d+\.\s+/, '').trim();
        });

      const supabase = createClient();
      const { error } = await supabase
        .from('onboarding_config')
        .upsert({
          id: 'default',
          data_points: points,
          updated_at: new Date().toISOString(),
        });

      if (error) {
        throw error;
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save configuration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
          <p className="text-gray-600 mb-6">Configure data points for AI onboarding conversation</p>

          <div className="mb-6">
            <label htmlFor="data-points" className="block text-sm font-medium text-gray-700 mb-2">
              Data Points (one per line, markdown format)
            </label>
            <textarea
              id="data-points"
              value={dataPoints}
              onChange={(e) => setDataPoints(e.target.value)}
              rows={15}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              placeholder={`- Emergency contact name
- Emergency contact phone
- Medical insurance provider
- Allergies
- Dietary restrictions
- Preferred work schedule`}
            />
            <p className="mt-2 text-sm text-gray-500">
              Enter one data point per line. The AI will collect these during the conversation.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {saved && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-800 text-sm">Configuration saved successfully!</p>
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>
      </div>
    </div>
  );
}

