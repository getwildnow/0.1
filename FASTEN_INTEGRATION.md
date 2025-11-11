# Fasten Health API Integration Guide

This guide explains how to use the Fasten Health API integration for accessing clinical data and medical records.

## Overview

[Fasten Health](https://www.fastenhealth.com/) is a unified clinical data API that connects to healthcare providers and EHR systems. This integration allows your app to:

- Connect users' medical records from hospitals, clinics, and health systems
- Access medications, lab results, conditions, procedures
- Retrieve immunization records, allergies, and care plans
- Get raw FHIR resources for advanced use cases

## Setup

### 1. Add Environment Variables

Add to your `.env.local`:

```env
FASTEN_PUBLIC_ID=public_test_kkshw1p73833j3rjkm9gpc0jhrv6e2arqajzt124elpl7
FASTEN_API_KEY=your_private_key_here  # Get from Fasten dashboard (click eye icon)
FASTEN_ENVIRONMENT=sandbox
FASTEN_API_URL=https://api.fastenhealth.com

# Optional: For webhooks
FASTEN_WEBHOOK_SECRET=your_webhook_secret
```

### 2. Run Database Migration

Run the Fasten integration migration in your Supabase dashboard:

```bash
# Go to Supabase Dashboard > SQL Editor
# Run the contents of: supabase/migrations/004_fasten_integration.sql
```

This creates:
- `fasten_users` - Links Supabase users to Fasten users
- `fasten_connections` - Stores connected medical sources
- `fasten_clinical_data` - Caches clinical data locally

## API Endpoints

### Get Fasten Configuration

**GET** `/api/fasten/config`

Returns the public ID needed for the Fasten Connect widget.

```typescript
const response = await fetch('/api/fasten/config', {
  headers: {
    'Authorization': `Bearer ${session.access_token}`,
  },
});

const { data } = await response.json();
// data.publicId - Use with Fasten Connect widget
```

### Create Fasten User

**POST** `/api/fasten/users`

Creates a new Fasten user linked to the authenticated Supabase user.

```typescript
const response = await fetch('/api/fasten/users', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${session.access_token}`,
  },
});

const { data } = await response.json();
// data.user_id - Fasten user ID
// data.patient_id - Fasten patient ID
```

### Get User & Connections

**GET** `/api/fasten/users`

Retrieves Fasten user info and connected medical sources.

```typescript
const response = await fetch('/api/fasten/users', {
  headers: {
    'Authorization': `Bearer ${session.access_token}`,
  },
});

const { data } = await response.json();
// data.user - Fasten user info
// data.connections - Array of connected medical sources
```

### Get Clinical Data

**GET** `/api/fasten/clinical-data?type={type}&start_date={date}&end_date={date}&status={status}`

Retrieves clinical data for a specific type.

**Supported Types:**
- `medications` - Prescription medications
- `labs` - Laboratory results
- `conditions` - Medical conditions/diagnoses
- `procedures` - Medical procedures
- `allergies` - Allergies and intolerances
- `immunizations` - Vaccination records
- `care_plans` - Treatment plans

```typescript
// Get active medications
const response = await fetch(
  '/api/fasten/clinical-data?type=medications&status=active',
  {
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
    },
  }
);

const { data } = await response.json();
// data - Array of medication records

// Get lab results for date range
const labResponse = await fetch(
  '/api/fasten/clinical-data?type=labs&start_date=2024-01-01&end_date=2024-12-31',
  {
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
    },
  }
);

const { data: labs } = await labResponse.json();
```

## Frontend Integration

### Using Fasten Connect Widget

The Fasten Connect widget (called "Fasten Stitch") allows users to connect their medical records:

```tsx
'use client';

import { useEffect, useState } from 'react';

export function FastenConnectWidget() {
  const [publicId, setPublicId] = useState<string | null>(null);

  useEffect(() => {
    // Get public ID from backend
    fetch('/api/fasten/config')
      .then(res => res.json())
      .then(({ data }) => setPublicId(data.publicId));
  }, []);

  useEffect(() => {
    if (!publicId) return;

    // Load Fasten Connect (Stitch) widget
    const link = document.createElement('link');
    link.href = 'https://cdn.fastenhealth.com/connect/v3/fasten-stitch-element.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://cdn.fastenhealth.com/connect/v3/fasten-stitch-element.js';
    script.type = 'module';
    document.body.appendChild(script);

    script.onload = () => {
      // Widget is ready
      console.log('Fasten Connect widget loaded');
    };

    return () => {
      document.head.removeChild(link);
      document.body.removeChild(script);
    };
  }, [publicId]);

  if (!publicId) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Connect Your Medical Records</h2>
      <fasten-stitch-element public-id={publicId}></fasten-stitch-element>
    </div>
  );
}
```

### Complete User Flow Example

```tsx
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export function MedicalRecordsPage() {
  const [fastenUserId, setFastenUserId] = useState<string | null>(null);
  const [connections, setConnections] = useState<any[]>([]);
  const [medications, setMedications] = useState<any[]>([]);
  const [labs, setLabs] = useState<any[]>([]);

  useEffect(() => {
    initializeFasten();
  }, []);

  async function initializeFasten() {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) return;

    // Check if user already has a Fasten account
    const { data: fastenUser } = await supabase
      .from('fasten_users')
      .select('fasten_user_id')
      .eq('user_id', session.user.id)
      .single();

    if (fastenUser) {
      setFastenUserId(fastenUser.fasten_user_id);
      loadConnections();
    } else {
      // Create new Fasten user
      const response = await fetch('/api/fasten/users', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });
      const { data } = await response.json();
      setFastenUserId(data.user_id);
    }
  }

  async function loadConnections() {
    const response = await fetch('/api/fasten/users');
    const { data } = await response.json();
    setConnections(data.connections || []);
  }

  async function fetchMedications() {
    const response = await fetch('/api/fasten/clinical-data?type=medications&status=active');
    const { data } = await response.json();
    setMedications(data || []);
  }

  async function fetchLabs() {
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 1);
    
    const response = await fetch(
      `/api/fasten/clinical-data?type=labs&start_date=${startDate.toISOString().split('T')[0]}`
    );
    const { data } = await response.json();
    setLabs(data || []);
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Medical Records</h1>
      
      {connections.length > 0 ? (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Connected Sources</h2>
          <ul className="space-y-2">
            {connections.map((conn) => (
              <li key={conn.id} className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                {conn.source_name}
                <span className="text-sm text-gray-500">
                  Last synced: {new Date(conn.last_sync_at).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="mb-6">
          <p className="text-gray-600 mb-4">No medical sources connected yet.</p>
          <FastenConnectWidget />
        </div>
      )}
      
      {connections.length > 0 && (
        <div className="space-y-6">
          <div>
            <button
              onClick={fetchMedications}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
            >
              Load Medications
            </button>
            
            {medications.length > 0 && (
              <div className="bg-white rounded shadow p-4">
                <h3 className="font-semibold mb-2">Active Medications</h3>
                <ul className="space-y-2">
                  {medications.map((med) => (
                    <li key={med.id} className="border-b pb-2">
                      <div className="font-medium">{med.medication_name}</div>
                      {med.dosage && <div className="text-sm text-gray-600">{med.dosage}</div>}
                      {med.frequency && <div className="text-sm text-gray-600">{med.frequency}</div>}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div>
            <button
              onClick={fetchLabs}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
            >
              Load Lab Results
            </button>
            
            {labs.length > 0 && (
              <div className="bg-white rounded shadow p-4">
                <h3 className="font-semibold mb-2">Recent Lab Results</h3>
                <ul className="space-y-2">
                  {labs.map((lab) => (
                    <li key={lab.id} className="border-b pb-2">
                      <div className="font-medium">{lab.test_name}</div>
                      <div className="text-sm text-gray-600">
                        {lab.value} {lab.unit}
                        {lab.reference_range && ` (Ref: ${lab.reference_range})`}
                      </div>
                      <div className="text-xs text-gray-500">{new Date(lab.date).toLocaleDateString()}</div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
```

## Webhooks (Optional)

Set up webhooks to receive real-time notifications:

1. **Add webhook secret to `.env.local`**:
   ```env
   FASTEN_WEBHOOK_SECRET=your_webhook_secret
   ```

2. **Configure webhook URL in Fasten dashboard**:
   - URL: `https://yourdomain.com/api/fasten/webhooks`
   - Events: `connection.created`, `connection.deleted`, `data.sync_completed`

3. **Webhook events handled**:
   - `connection.created` - User connected a new medical source
   - `connection.deleted` - User disconnected a source
   - `data.sync_completed` - New clinical data is available

## Best Practices

1. **Cache Clinical Data**: Store frequently accessed data in `fasten_clinical_data` table
2. **Handle Sync States**: Some data may take time to sync after connection
3. **Privacy First**: Only request data you actually need
4. **Error Handling**: Handle cases where users disconnect sources
5. **HIPAA Compliance**: Ensure your app meets HIPAA requirements for PHI
6. **Consent Management**: Always get explicit user consent before accessing medical data

## Testing in Sandbox Mode

In sandbox mode, you can test with simulated medical records:

1. Create a Fasten user
2. Use the Connect widget to link test providers
3. Test provider credentials available in Fasten documentation
4. Fetch simulated clinical data

## Production Checklist

- [ ] Change `FASTEN_ENVIRONMENT` to `production`
- [ ] Update credentials to production keys
- [ ] Set up webhooks for real-time updates
- [ ] Run migration in production Supabase
- [ ] Test with real medical records
- [ ] Ensure HIPAA compliance
- [ ] Update privacy policy with PHI usage
- [ ] Implement audit logging
- [ ] Set up monitoring for API failures

## Additional Resources

- [Fasten Documentation](https://docs.fastenhealth.com/)
- [Fasten Dashboard](https://connect.fastenhealth.com/)
- [FHIR Specification](https://www.hl7.org/fhir/)
- [HIPAA Compliance Guide](https://www.hhs.gov/hipaa/index.html)



