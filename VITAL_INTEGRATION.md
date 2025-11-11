# Vital API Integration Guide

This guide explains how to use the Vital API integration in your application for health data connectivity.

## Overview

[Vital](https://tryvital.io/) is a unified health data API that connects to 500+ wearables, health apps, and lab testing providers. This integration allows your app to:

- Connect users' health devices (Fitbit, Apple Health, Oura, Whoop, etc.)
- Retrieve activity, sleep, body metrics, workouts
- Access lab results and biomarker data
- Get real-time health data updates

## Setup

### 1. Add Environment Variables

Add to your `.env.local`:

```env
VITAL_API_KEY=sk_us_pfx7fUwFD5JzWIA5NB8kpQTCeVINvSsrhPaU1MJly9M
VITAL_ENVIRONMENT=sandbox
VITAL_REGION=us
```

### 2. Run Database Migration

Run the Vital integration migration in your Supabase dashboard:

```bash
# Go to Supabase Dashboard > SQL Editor
# Run the contents of: supabase/migrations/003_vital_integration.sql
```

This creates:
- `vital_users` - Links Supabase users to Vital users
- `vital_connections` - Stores connected health providers
- `vital_health_data` - Caches health data locally

## API Endpoints

### Create Vital User

**POST** `/api/vital/users`

Creates a new Vital user linked to the authenticated Supabase user.

```typescript
const response = await fetch('/api/vital/users', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${session.access_token}`,
  },
});

const { data } = await response.json();
// data.user_id - Vital user ID
// data.user_key - Vital user key
```

### Get User & Connections

**GET** `/api/vital/users?vital_user_id={id}`

Retrieves Vital user info and connected providers.

```typescript
const response = await fetch(`/api/vital/users?vital_user_id=${vitalUserId}`, {
  headers: {
    'Authorization': `Bearer ${session.access_token}`,
  },
});

const { data } = await response.json();
// data.user - Vital user info
// data.connections - Array of connected providers
```

### Create Link Token

**POST** `/api/vital/link`

Creates a link token for the Vital Link widget to connect health providers.

```typescript
const response = await fetch('/api/vital/link', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${session.access_token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    vital_user_id: vitalUserId,
    redirect_url: 'https://yourapp.com/dashboard',
  }),
});

const { data } = await response.json();
// data.link_token - Use with Vital Link widget
```

### Get Health Data

**GET** `/api/vital/data?vital_user_id={id}&type={type}&start_date={date}&end_date={date}`

Retrieves health data for a specific type and date range.

**Supported Types:**
- `activity` - Daily activity summaries (steps, calories, distance)
- `sleep` - Sleep stages, duration, quality
- `body` - Weight, body fat, BMI
- `workouts` - Exercise sessions
- `profile` - Age, height, biological sex
- `heartrate` - Heart rate measurements
- `glucose` - Blood glucose levels
- `blood_pressure` - Blood pressure readings

```typescript
// Get sleep data
const response = await fetch(
  `/api/vital/data?vital_user_id=${vitalUserId}&type=sleep&start_date=2024-01-01&end_date=2024-01-31`,
  {
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
    },
  }
);

const { data } = await response.json();
// data - Array of health data records
```

## Frontend Integration

### Using Vital Link Widget

The Vital Link widget allows users to connect their health devices:

```tsx
'use client';

import { useEffect } from 'react';

export function VitalLinkWidget({ linkToken }: { linkToken: string }) {
  useEffect(() => {
    // Load Vital Link SDK
    const script = document.createElement('script');
    script.src = 'https://link.tryvital.io/v3/vital-link.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      // @ts-ignore
      const vitalLink = window.VitalLink.create({
        token: linkToken,
        env: 'sandbox', // or 'production'
        region: 'us', // or 'eu'
        onSuccess: (provider) => {
          console.log('Connected to:', provider);
          // Refresh connections list
        },
        onError: (error) => {
          console.error('Connection error:', error);
        },
        onExit: () => {
          console.log('User closed widget');
        },
      });

      vitalLink.open();
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [linkToken]);

  return <div id="vital-link-container" />;
}
```

### Complete User Flow Example

```tsx
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export function HealthConnectPage() {
  const [vitalUserId, setVitalUserId] = useState<string | null>(null);
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [connections, setConnections] = useState<any[]>([]);

  useEffect(() => {
    initializeVital();
  }, []);

  async function initializeVital() {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) return;

    // Check if user already has a Vital account
    const { data: vitalUser } = await supabase
      .from('vital_users')
      .select('vital_user_id')
      .eq('user_id', session.user.id)
      .single();

    if (vitalUser) {
      setVitalUserId(vitalUser.vital_user_id);
      loadConnections(vitalUser.vital_user_id);
    } else {
      // Create new Vital user
      const response = await fetch('/api/vital/users', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });
      const { data } = await response.json();
      
      // Store in Supabase
      await supabase.from('vital_users').insert({
        user_id: session.user.id,
        vital_user_id: data.user_id,
        vital_user_key: data.user_key,
        team_id: data.team_id,
      });
      
      setVitalUserId(data.user_id);
    }
  }

  async function loadConnections(userId: string) {
    const response = await fetch(`/api/vital/users?vital_user_id=${userId}`);
    const { data } = await response.json();
    setConnections(data.connections || []);
  }

  async function connectDevice() {
    if (!vitalUserId) return;

    const response = await fetch('/api/vital/link', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        vital_user_id: vitalUserId,
        redirect_url: window.location.href,
      }),
    });
    
    const { data } = await response.json();
    setLinkToken(data.link_token);
  }

  async function fetchHealthData(type: string) {
    if (!vitalUserId) return;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    const endDate = new Date();

    const response = await fetch(
      `/api/vital/data?vital_user_id=${vitalUserId}&type=${type}` +
      `&start_date=${startDate.toISOString().split('T')[0]}` +
      `&end_date=${endDate.toISOString().split('T')[0]}`
    );
    
    const { data } = await response.json();
    console.log(`${type} data:`, data);
    return data;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Connect Your Health Devices</h1>
      
      {connections.length > 0 ? (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Connected Devices</h2>
          <ul className="space-y-2">
            {connections.map((conn) => (
              <li key={conn.source_id} className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                {conn.provider.name}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-gray-600 mb-4">No devices connected yet.</p>
      )}
      
      <button
        onClick={connectDevice}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Connect New Device
      </button>

      {connections.length > 0 && (
        <div className="mt-6 space-y-2">
          <button
            onClick={() => fetchHealthData('sleep')}
            className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 mr-2"
          >
            Fetch Sleep Data
          </button>
          <button
            onClick={() => fetchHealthData('activity')}
            className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
          >
            Fetch Activity Data
          </button>
        </div>
      )}
      
      {linkToken && <VitalLinkWidget linkToken={linkToken} />}
    </div>
  );
}
```

## Using the Vital Client Directly

You can also use the Vital client directly in your API routes:

```typescript
import { vital } from '@/lib/vital';

// In your API route
export async function GET() {
  // Create user
  const user = await vital.createUser('user-123');
  
  // Get providers
  const providers = await vital.getProviders();
  
  // Get health data
  const sleepData = await vital.getSleep(
    user.user_id,
    '2024-01-01',
    '2024-01-31'
  );
  
  return Response.json({ sleepData });
}
```

## Best Practices

1. **Store Vital User ID**: Always store the `vital_user_id` in your database linked to your user
2. **Cache Health Data**: Cache frequently accessed health data in the `vital_health_data` table
3. **Use Webhooks**: Set up webhooks for real-time data updates instead of polling
4. **Handle Errors**: Vital API calls can fail if users disconnect devices - handle gracefully
5. **Rate Limiting**: Be mindful of API rate limits in production
6. **Privacy**: Always inform users what health data you're accessing and why

## Testing in Sandbox Mode

In sandbox mode, you can test with simulated data without connecting real devices:

1. Create a Vital user
2. Use test provider credentials from Vital documentation
3. Connect test providers through the Link widget
4. Fetch simulated health data

## Production Checklist

- [ ] Change `VITAL_ENVIRONMENT` to `production`
- [ ] Update `VITAL_API_KEY` to production key
- [ ] Set up Vital webhooks for real-time updates
- [ ] Run migration in production Supabase
- [ ] Test with real health devices
- [ ] Update privacy policy with health data usage
- [ ] Implement proper error handling
- [ ] Set up monitoring for API failures

## Additional Resources

- [Vital Documentation](https://docs.tryvital.io/)
- [Vital Dashboard](https://app.tryvital.io/)
- [Vital Link Widget Docs](https://docs.tryvital.io/wearables/connecting-providers/vital-link)
- [Vital API Reference](https://docs.tryvital.io/api-reference)



