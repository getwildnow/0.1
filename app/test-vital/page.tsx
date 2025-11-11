'use client';

import { useEffect, useState } from 'react';

interface VitalUser {
  user_id: string;
  user_key: string;
  client_user_id: string;
}

interface Connection {
  provider: {
    name: string;
    slug: string;
    logo: string;
  };
  status: string;
  created_on: string;
}

// Stat Card Component
function StatCard({ title, value, icon, color }: { title: string; value: string | number; icon: string; color: string }) {
  const colorClasses = {
    blue: 'from-blue-50 to-blue-100 border-blue-200',
    green: 'from-green-50 to-green-100 border-green-200',
    purple: 'from-purple-50 to-purple-100 border-purple-200',
    indigo: 'from-indigo-50 to-indigo-100 border-indigo-200',
    orange: 'from-orange-50 to-orange-100 border-orange-200',
    red: 'from-red-50 to-red-100 border-red-200',
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]} border-2 rounded-lg p-4`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="text-sm text-gray-600 font-medium">{title}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
  );
}

// Sleep Chart Component
function SleepChart({ data }: { data: any[] }) {
  const maxDuration = Math.max(...data.map(d => d.sleep?.duration_seconds || 0));
  
  return (
    <div className="space-y-2">
      <h4 className="font-semibold text-gray-700 mb-3">Sleep Duration (hours)</h4>
      {data.slice(0, 10).map((record, idx) => {
        const hours = (record.sleep?.duration_seconds || 0) / 3600;
        const percentage = (record.sleep?.duration_seconds || 0) / maxDuration * 100;
        const date = new Date(record.calendar_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        
        return (
          <div key={idx} className="flex items-center gap-3">
            <span className="text-sm text-gray-600 w-16">{date}</span>
            <div className="flex-1 bg-gray-200 rounded-full h-8 relative">
              <div 
                className="bg-gradient-to-r from-indigo-400 to-purple-500 h-8 rounded-full flex items-center justify-end pr-3"
                style={{ width: `${percentage}%` }}
              >
                <span className="text-white text-sm font-medium">{hours.toFixed(1)}h</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Activity Chart Component
function ActivityChart({ data }: { data: any[] }) {
  const maxSteps = Math.max(...data.map(d => d.steps || 0));
  
  return (
    <div className="space-y-2">
      <h4 className="font-semibold text-gray-700 mb-3">Daily Steps</h4>
      {data.slice(0, 10).map((record, idx) => {
        const steps = record.steps || 0;
        const percentage = (steps / maxSteps) * 100;
        const date = new Date(record.calendar_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        
        return (
          <div key={idx} className="flex items-center gap-3">
            <span className="text-sm text-gray-600 w-16">{date}</span>
            <div className="flex-1 bg-gray-200 rounded-full h-8 relative">
              <div 
                className="bg-gradient-to-r from-green-400 to-emerald-500 h-8 rounded-full flex items-center justify-end pr-3"
                style={{ width: `${percentage}%` }}
              >
                <span className="text-white text-sm font-medium">{steps.toLocaleString()}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Heart Rate Chart Component
function HeartRateChart({ data }: { data: any[] }) {
  const maxBPM = Math.max(...data.map(d => d.bpm || 0));
  const minBPM = Math.min(...data.map(d => d.bpm || 0).filter(b => b > 0));
  
  return (
    <div className="space-y-2">
      <h4 className="font-semibold text-gray-700 mb-3">Heart Rate (bpm)</h4>
      <div className="h-64 flex items-end justify-around gap-2">
        {data.slice(0, 20).map((record, idx) => {
          const bpm = record.bpm || 0;
          const height = ((bpm - minBPM) / (maxBPM - minBPM)) * 100;
          const time = new Date(record.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
          
          return (
            <div key={idx} className="flex-1 flex flex-col items-center gap-1">
              <div className="relative group">
                <div 
                  className="bg-gradient-to-t from-red-400 to-pink-500 rounded-t w-full hover:from-red-500 hover:to-pink-600 transition-colors"
                  style={{ height: `${height}%`, minHeight: '20px' }}
                />
                <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                  {bpm} bpm
                </div>
              </div>
              {idx % 4 === 0 && (
                <span className="text-xs text-gray-500 rotate-45 origin-left mt-2">{time}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function TestVitalPage() {
  const [step, setStep] = useState<'init' | 'connect' | 'providers' | 'connected'>('init');
  const [vitalUserId, setVitalUserId] = useState<string | null>(null);
  const [providers, setProviders] = useState<any[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [healthData, setHealthData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize - Create test user
  async function initializeVitalUser() {
    setLoading(true);
    setError(null);
    
    try {
      // Create a test user ID
      const testUserId = `test-user-${Date.now()}`;
      
      const response = await fetch('/api/vital-test/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to create Vital user');
      }

      const { data } = await response.json();
      setVitalUserId(data.user_id);
      setStep('connect');
      
      // Store in localStorage for persistence
      localStorage.setItem('test_vital_user_id', data.user_id);
    } catch (err: any) {
      setError(err.message || 'Failed to initialize');
    } finally {
      setLoading(false);
    }
  }

  // Fetch available providers
  async function fetchProviders() {
    if (!vitalUserId) return;
    
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/vital-test/providers');
      
      if (!response.ok) {
        throw new Error('Failed to fetch providers');
      }

      const { data } = await response.json();
      setProviders(data || []);
      setStep('providers');
    } catch (err: any) {
      setError(err.message || 'Failed to fetch providers');
    } finally {
      setLoading(false);
    }
  }

  // Connect to a specific provider
  async function connectToProvider(providerSlug: string) {
    if (!vitalUserId) return;
    
    setLoading(true);
    setError(null);

    try {
      console.log('Connecting to provider:', providerSlug);
      
      const response = await fetch('/api/vital-test/connect-provider', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vital_user_id: vitalUserId,
          provider_slug: providerSlug,
        }),
      });

      const result = await response.json();
      console.log('Connect provider response:', result);

      if (!response.ok) {
        throw new Error(result.error || result.details || 'Failed to generate link code');
      }

      const { data } = result;
      
      // Vital returns a link_token
      // We need to use this token with the Vital Link widget
      if (data.link_token) {
        console.log('Opening Vital Link widget with token:', data.link_token);
        openVitalLinkWidget(data.link_token);
      } else {
        console.error('No link token in response:', data);
        throw new Error('No link token returned from Vital API');
      }
    } catch (err: any) {
      console.error('Connect provider error:', err);
      setError(err.message || 'Failed to connect provider');
      setLoading(false);
    }
  }

  // Open Vital Link widget with a link token
  function openVitalLinkWidget(linkToken: string) {
    console.log('Opening Vital Link widget with token:', linkToken);
    
    // Use iframe approach since SDK URL is not available
    const environment = 'sandbox'; // or 'production'
    const widgetBaseUrl = environment === 'production'
      ? 'https://link.tryvital.io'
      : 'https://link.tryvital.io'; // Vital uses the same domain for both
    
    const widgetUrl = `${widgetBaseUrl}?token=${linkToken}&env=${environment}`;
    console.log('Widget URL:', widgetUrl);

    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.id = 'vital-link-modal';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10000;
    `;

    // Create close button
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '× Close';
    closeBtn.style.cssText = `
      position: absolute;
      top: 20px;
      right: 20px;
      background: white;
      border: none;
      padding: 10px 20px;
      border-radius: 5px;
      cursor: pointer;
      font-size: 18px;
      font-weight: bold;
      z-index: 10001;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    `;
    closeBtn.onclick = () => {
      if (document.body.contains(overlay)) {
        document.body.removeChild(overlay);
      }
      setLoading(false);
      // Refresh connections after closing
      checkConnections();
    };

    // Create container for iframe
    const container = document.createElement('div');
    container.style.cssText = `
      width: 90%;
      max-width: 500px;
      height: 80%;
      max-height: 700px;
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      position: relative;
    `;

    // Create iframe
    const iframe = document.createElement('iframe');
    iframe.src = widgetUrl;
    iframe.style.cssText = `
      width: 100%;
      height: 100%;
      border: none;
      background: white;
    `;

    // Allow necessary permissions for the iframe
    iframe.setAttribute('allow', 'camera; microphone; geolocation');

    // Start polling for connections (check every 3 seconds)
    let pollCount = 0;
    const maxPolls = 40; // Poll for up to 2 minutes
    const pollInterval = setInterval(async () => {
      pollCount++;
      console.log(`Polling for connections (attempt ${pollCount}/${maxPolls})...`);
      
      const connectionsData = await checkConnections();
      
      if (connectionsData && connectionsData.length > 0) {
        console.log('✅ Connection detected!', connectionsData);
        clearInterval(pollInterval);
        if (document.body.contains(overlay)) {
          document.body.removeChild(overlay);
        }
        setLoading(false);
        window.removeEventListener('message', messageHandler);
      } else if (pollCount >= maxPolls) {
        console.log('⏱️ Polling timeout - stopping');
        clearInterval(pollInterval);
      }
    }, 3000);

    // Listen for messages from the iframe (connection success/failure)
    const messageHandler = (event: MessageEvent) => {
      console.log('📨 Message from iframe:', event);
      console.log('Origin:', event.origin);
      console.log('Data:', event.data);
      
      // Check if message is from Vital
      if (event.origin.includes('tryvital.io') || event.origin.includes('vital.io') || event.origin.includes('localhost')) {
        const data = event.data;
        
        // Handle different message types
        if (data.type === 'vital.success' || data.event === 'success' || data.status === 'connected' || data.success) {
          console.log('✅ Connection successful via message!', data);
          clearInterval(pollInterval);
          if (document.body.contains(overlay)) {
            document.body.removeChild(overlay);
          }
          setLoading(false);
          checkConnections();
          window.removeEventListener('message', messageHandler);
        } else if (data.type === 'vital.exit' || data.event === 'exit' || data.type === 'close') {
          console.log('❌ Widget closed by user', data);
          clearInterval(pollInterval);
          if (document.body.contains(overlay)) {
            document.body.removeChild(overlay);
          }
          setLoading(false);
          checkConnections();
          window.removeEventListener('message', messageHandler);
        } else if (data.type === 'vital.error' || data.event === 'error') {
          console.error('❌ Connection error:', data);
          setError(data.message || 'Failed to connect to provider');
          clearInterval(pollInterval);
          if (document.body.contains(overlay)) {
            document.body.removeChild(overlay);
          }
          setLoading(false);
          window.removeEventListener('message', messageHandler);
        }
      }
    };

    window.addEventListener('message', messageHandler);
    
    // Clean up on close button click
    const originalOnClick = closeBtn.onclick;
    closeBtn.onclick = () => {
      console.log('Closing widget and stopping polling');
      clearInterval(pollInterval);
      window.removeEventListener('message', messageHandler);
      setLoading(false);
      if (originalOnClick) originalOnClick(null as any);
    };

    // Handle iframe load event
    iframe.onload = () => {
      console.log('Vital Link iframe loaded successfully');
      setLoading(false);
    };

    iframe.onerror = (err) => {
      console.error('Failed to load Vital Link iframe:', err);
      setError('Failed to load Vital Link widget');
      if (document.body.contains(overlay)) {
        document.body.removeChild(overlay);
      }
      setLoading(false);
    };

    // Assemble and add to DOM
    container.appendChild(iframe);
    overlay.appendChild(closeBtn);
    overlay.appendChild(container);
    document.body.appendChild(overlay);
    
    console.log('Vital Link modal opened');
  }

  // Check what's connected
  async function checkConnections() {
    if (!vitalUserId) return [];

    try {
      console.log('Checking connections for user:', vitalUserId);
      const response = await fetch(`/api/vital-test/connections?vital_user_id=${vitalUserId}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Failed to fetch connections: ${response.status} - ${errorText}`);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('Connections response:', result);
      console.log('result.data:', result.data);
      
      // The API returns providers array, not connections
      const connectionsData = result.data?.connections || result.data?.providers || [];
      console.log('Parsed connections:', connectionsData);
      setConnections(connectionsData);
      
      // If we have connections, update step
      if (connectionsData.length > 0) {
        setStep('connected');
      }
      
      return connectionsData;
    } catch (err: any) {
      console.error('Failed to fetch connections:', err.message);
      // Don't set error state during polling, just log it
      return [];
    }
  }

  // Fetch health data
  async function fetchHealthData(type: string) {
    if (!vitalUserId) return;

    setLoading(true);
    setError(null);
    setHealthData(null);

    try {
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];

      const response = await fetch(
        `/api/vital-test/data?vital_user_id=${vitalUserId}&type=${type}&start_date=${startDate}&end_date=${endDate}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch ${type} data`);
      }

      const { data } = await response.json();
      setHealthData({ type, data });
    } catch (err: any) {
      setError(err.message || `Failed to fetch ${type} data`);
    } finally {
      setLoading(false);
    }
  }

  // Render data summary cards
  function renderDataSummary(data: any) {
    const { type, data: records } = data;
    
    if (!Array.isArray(records) || records.length === 0) {
      return (
        <div className="col-span-3 text-center text-gray-500 py-8">
          No data available for this time period
        </div>
      );
    }

    switch (type) {
      case 'sleep':
        const avgSleep = records.reduce((sum, r) => sum + (r.sleep?.duration_seconds || 0), 0) / records.length / 3600;
        const avgDeepSleep = records.reduce((sum, r) => sum + (r.sleep?.deep_sleep_seconds || 0), 0) / records.length / 3600;
        return (
          <>
            <StatCard title="Avg Sleep" value={`${avgSleep.toFixed(1)}h`} icon="😴" color="blue" />
            <StatCard title="Avg Deep Sleep" value={`${avgDeepSleep.toFixed(1)}h`} icon="🌙" color="indigo" />
            <StatCard title="Nights Tracked" value={records.length} icon="📅" color="purple" />
          </>
        );
      
      case 'activity':
        const avgSteps = Math.round(records.reduce((sum, r) => sum + (r.steps || 0), 0) / records.length);
        const avgCalories = Math.round(records.reduce((sum, r) => sum + (r.calories_total || 0), 0) / records.length);
        return (
          <>
            <StatCard title="Avg Steps" value={avgSteps.toLocaleString()} icon="👟" color="green" />
            <StatCard title="Avg Calories" value={`${avgCalories}`} icon="🔥" color="orange" />
            <StatCard title="Days Tracked" value={records.length} icon="📅" color="blue" />
          </>
        );
      
      case 'heartrate':
        const rates = records.map(r => r.bpm).filter(Boolean);
        const avgHR = rates.length > 0 ? Math.round(rates.reduce((a, b) => a + b, 0) / rates.length) : 0;
        const maxHR = rates.length > 0 ? Math.max(...rates) : 0;
        const minHR = rates.length > 0 ? Math.min(...rates) : 0;
        return (
          <>
            <StatCard title="Avg Heart Rate" value={`${avgHR} bpm`} icon="❤️" color="red" />
            <StatCard title="Max Heart Rate" value={`${maxHR} bpm`} icon="📈" color="orange" />
            <StatCard title="Min Heart Rate" value={`${minHR} bpm`} icon="📉" color="blue" />
          </>
        );
      
      default:
        return (
          <StatCard title="Records Found" value={records.length} icon="📊" color="blue" />
        );
    }
  }

  // Render data visualization
  function renderDataVisualization(data: any) {
    const { type, data: records } = data;
    
    if (!Array.isArray(records) || records.length === 0) {
      return null;
    }

    switch (type) {
      case 'sleep':
        return <SleepChart data={records} />;
      case 'activity':
        return <ActivityChart data={records} />;
      case 'heartrate':
        return <HeartRateChart data={records} />;
      default:
        return null;
    }
  }

  // Load user from localStorage on mount and handle OAuth callbacks
  useEffect(() => {
    const savedUserId = localStorage.getItem('test_vital_user_id');
    if (savedUserId) {
      setVitalUserId(savedUserId);
      setStep('connect');
      
      // Check URL parameters for OAuth callback
      const urlParams = new URLSearchParams(window.location.search);
      const state = urlParams.get('state');
      const error = urlParams.get('error');
      
      if (state === 'success' || urlParams.has('code')) {
        console.log('✅ OAuth callback detected - success!');
        // Clear URL parameters
        window.history.replaceState({}, document.title, window.location.pathname);
        // Check connections
        setTimeout(() => checkConnections(), 1000);
      } else if (error) {
        console.error('❌ OAuth callback error:', error);
        setError(`Connection failed: ${error}`);
        // Clear URL parameters
        window.history.replaceState({}, document.title, window.location.pathname);
      } else {
        // Normal load - just check connections
        checkConnections();
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🏃‍♂️ Vital Wearables Integration Test
          </h1>
          <p className="text-gray-600">
            Test connecting health devices and fetching wearable data
          </p>
          {vitalUserId && (
            <p className="text-sm text-gray-500 mt-2">
              Test User ID: <code className="bg-gray-100 px-2 py-1 rounded">{vitalUserId}</code>
            </p>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">❌ {error}</p>
          </div>
        )}

        {/* Step 1: Initialize */}
        {step === 'init' && (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="mb-6">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🚀</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Get Started
              </h2>
              <p className="text-gray-600">
                Create a test user to begin connecting health devices
              </p>
            </div>
            <button
              onClick={initializeVitalUser}
              disabled={loading}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
            >
              {loading ? 'Initializing...' : 'Initialize Test User'}
            </button>
          </div>
        )}

        {/* Step 2: Show Providers */}
        {step === 'connect' && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">⌚</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Connect Your Devices
              </h2>
              <p className="text-gray-600 mb-6">
                Select a provider to connect your health data
              </p>
              <button
                onClick={fetchProviders}
                disabled={loading}
                className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 transition-colors"
              >
                {loading ? 'Loading...' : 'Show Providers'}
              </button>
              
              {/* Manual refresh button */}
              <div className="mt-4">
                <button
                  onClick={() => checkConnections()}
                  disabled={loading}
                  className="text-blue-600 hover:text-blue-800 underline text-sm disabled:text-gray-400"
                >
                  🔄 Refresh Connections
                </button>
              </div>
            </div>

            {connections.length > 0 && (
              <div className="mt-8 border-t pt-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  ✅ Connected Devices ({connections.length})
                </h3>
                <div className="space-y-2">
                  {connections.map((conn, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      {conn.logo && (
                        <img
                          src={conn.logo}
                          alt={conn.name}
                          className="w-8 h-8 rounded"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {conn.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          Connected: {new Date(conn.created_on).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        {conn.status}
                      </span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setStep('connected')}
                  className="mt-4 w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
                >
                  Continue to Fetch Data →
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 2.5: Provider Selection */}
        {step === 'providers' && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Select a Provider
            </h2>
            <p className="text-gray-600 mb-6">
              Choose a health app or wearable to connect
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {providers.map((provider) => (
                <button
                  key={provider.slug}
                  onClick={() => connectToProvider(provider.slug)}
                  disabled={loading}
                  className="flex flex-col items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all disabled:opacity-50"
                >
                  {provider.logo && (
                    <img
                      src={provider.logo}
                      alt={provider.name}
                      className="w-16 h-16 object-contain"
                    />
                  )}
                  <span className="font-medium text-gray-900 text-center text-sm">
                    {provider.name}
                  </span>
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setStep('connect')}
              className="mt-6 text-gray-600 hover:text-gray-900 underline"
            >
              ← Back
            </button>
          </div>
        )}

        {/* Step 3: Fetch Data */}
        {step === 'connected' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                📊 Fetch Health Data
              </h2>
              <p className="text-gray-600 mb-6">
                Select a data type to fetch from your connected devices
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { type: 'sleep', label: '😴 Sleep', icon: '🌙' },
                  { type: 'activity', label: '🏃 Activity', icon: '👟' },
                  { type: 'body', label: '⚖️ Body', icon: '📏' },
                  { type: 'workouts', label: '💪 Workouts', icon: '🏋️' },
                  { type: 'heartrate', label: '❤️ Heart Rate', icon: '💗' },
                  { type: 'profile', label: '👤 Profile', icon: '📋' },
                ].map((item) => (
                  <button
                    key={item.type}
                    onClick={() => fetchHealthData(item.type)}
                    disabled={loading}
                    className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-lg border-2 border-blue-200 hover:border-blue-400 transition-all disabled:opacity-50"
                  >
                    <div className="text-3xl mb-2">{item.icon}</div>
                    <div className="text-sm font-semibold text-gray-700">
                      {item.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Connected Devices */}
            {connections.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  ✅ Your Connected Devices
                </h3>
                <div className="space-y-2">
                  {connections.map((conn, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      {conn.logo && (
                        <img
                          src={conn.logo}
                          alt={conn.name}
                          className="w-8 h-8 rounded"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {conn.name}
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        {conn.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Data Display */}
            {healthData && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  📈 {healthData.type.charAt(0).toUpperCase() + healthData.type.slice(1)} Data
                </h3>
                
                {/* Visual Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {renderDataSummary(healthData)}
                </div>

                {/* Data Visualization */}
                <div className="mb-6">
                  {renderDataVisualization(healthData)}
                </div>

                {/* Raw JSON (collapsible) */}
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-900 font-medium">
                    View Raw JSON Data
                  </summary>
                  <div className="bg-gray-50 rounded-lg p-4 overflow-auto max-h-96 mt-2">
                    <pre className="text-sm text-gray-800">
                      {JSON.stringify(healthData.data, null, 2)}
                    </pre>
                  </div>
                </details>
                
                <div className="mt-4 text-sm text-gray-600">
                  {Array.isArray(healthData.data) && (
                    <p>✅ Found {healthData.data.length} records</p>
                  )}
                </div>
              </div>
            )}

            {loading && (
              <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Fetching data...</p>
              </div>
            )}
          </div>
        )}

        {/* Reset Button */}
        {vitalUserId && (
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                localStorage.removeItem('test_vital_user_id');
                setVitalUserId(null);
                setStep('init');
                setConnections([]);
                setHealthData(null);
                setError(null);
              }}
              className="text-sm text-gray-600 hover:text-gray-900 underline"
            >
              Reset Test
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

