# ⚡ Quick Veriff Setup (5 Minutes)

Follow these steps in order to get Veriff working.

---

## ✅ Step 1: Add to Railway (2 min)

1. Go to: https://railway.app/
2. Open your project → **Variables** tab
3. Click **+ New Variable** and add:

```
VERIFF_API_KEY
bc193001-958f-45ca-931f-c6a040a59ff9
```

4. Click **+ New Variable** again and add:

```
VERIFF_API_SECRET
1b053eaa-73eb-4924-81a3-6c917077c059
```

5. Click **Deploy** button (top right)

---

## ✅ Step 2: Run Database Migration (1 min)

1. Go to: https://supabase.com/dashboard/project/rqmjnenmeixvpwyzwyjw/sql
2. Copy this entire SQL script:

```sql
-- Add Veriff verification columns to employees table

-- Add veriff_status enum type
DO $$ BEGIN
  CREATE TYPE veriff_status_enum AS ENUM (
    'not_started',
    'pending',
    'submitted',
    'approved',
    'declined',
    'resubmission_requested',
    'expired'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Add Veriff columns to employees table
ALTER TABLE public.employees
  ADD COLUMN IF NOT EXISTS veriff_session_id VARCHAR(255),
  ADD COLUMN IF NOT EXISTS veriff_status veriff_status_enum DEFAULT 'not_started',
  ADD COLUMN IF NOT EXISTS veriff_person JSONB,
  ADD COLUMN IF NOT EXISTS veriff_decision_time TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS verification_completed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS veriff_attempts INTEGER DEFAULT 0;

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS employees_veriff_session_id_idx ON public.employees(veriff_session_id);
CREATE INDEX IF NOT EXISTS employees_veriff_status_idx ON public.employees(veriff_status);

-- Update existing status column to support verification flow
COMMENT ON COLUMN public.employees.status IS 'Employee status: invited, verification_pending, verified, active, inactive';
COMMENT ON COLUMN public.employees.veriff_status IS 'Veriff verification status from identity verification process';
COMMENT ON COLUMN public.employees.veriff_session_id IS 'Veriff session ID for tracking verification';
COMMENT ON COLUMN public.employees.veriff_person IS 'Person data from Veriff (firstName, lastName, dateOfBirth, etc.)';
COMMENT ON COLUMN public.employees.veriff_decision_time IS 'When Veriff made the verification decision';
COMMENT ON COLUMN public.employees.verification_completed_at IS 'When employee completed the verification process';
COMMENT ON COLUMN public.employees.veriff_attempts IS 'Number of verification attempts';
```

3. Paste into SQL Editor
4. Click **Run** (or press Cmd+Enter)
5. Should see: ✅ Success

---

## ✅ Step 3: Deploy Webhook Function (1 min)

1. Go to: https://supabase.com/dashboard/project/rqmjnenmeixvpwyzwyjw/functions
2. Click **Create a new function**
3. Name: `veriff_webhook`
4. Copy this entire code:

```typescript
// Veriff Webhook Handler
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-hmac-signature, x-signature',
}

interface VeriffWebhookPayload {
  status: 'success' | 'fail'
  verification: {
    id: string
    code: number
    person?: {
      firstName?: string
      lastName?: string
      dateOfBirth?: string
      gender?: string
      nationality?: string
      idNumber?: string
    }
    document?: {
      number?: string
      type?: string
      country?: string
    }
    status: 'approved' | 'declined' | 'resubmission_requested' | 'expired'
    vendorData?: string
    decisionTime?: string
    acceptanceTime?: string
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase configuration')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)
    const body = await req.text()
    const payload: VeriffWebhookPayload = JSON.parse(body)

    console.log('[Veriff Webhook] Received:', {
      sessionId: payload.verification.id,
      status: payload.verification.status,
      vendorData: payload.verification.vendorData,
    })

    const employeeId = payload.verification.vendorData

    if (!employeeId) {
      console.error('[Veriff Webhook] No vendorData (employee ID) provided')
      return new Response(
        JSON.stringify({ error: 'Missing employee ID' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const updateData: any = {
      veriff_session_id: payload.verification.id,
      veriff_status: payload.verification.status,
      veriff_decision_time: payload.verification.decisionTime || new Date().toISOString(),
    }

    if (payload.verification.status === 'approved' && payload.verification.person) {
      updateData.veriff_person = payload.verification.person
      updateData.verification_completed_at = new Date().toISOString()
      updateData.status = 'verified'
    }

    console.log('[Veriff Webhook] Updating employee:', employeeId)

    const { data: employee, error: updateError } = await supabase
      .from('employees')
      .update(updateData)
      .eq('id', employeeId)
      .select()
      .single()

    if (updateError) {
      console.error('[Veriff Webhook] Failed to update employee:', updateError)
      return new Response(
        JSON.stringify({ error: 'Database update failed', details: updateError }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('[Veriff Webhook] Successfully updated employee:', {
      employeeId,
      status: payload.verification.status,
    })

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Verification processed',
        employeeId,
        status: payload.verification.status,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error: any) {
    console.error('[Veriff Webhook] Error:', error)
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
```

5. Click **Deploy function**

---

## ✅ Step 4: Add Supabase Secret (30 sec)

1. Stay in Supabase → Go to **Edge Functions** → **Secrets** tab
2. Click **Add secret**
3. Name: `VERIFF_API_SECRET`
4. Value: `1b053eaa-73eb-4924-81a3-6c917077c059`
5. Click **Save**

---

## ✅ Step 5: Configure Veriff Dashboard (1 min)

1. Log in to Veriff Dashboard: https://station.veriff.com/
2. Go to **Settings** → **Webhooks**
3. Add webhook URL:
   ```
   https://rqmjnenmeixvpwyzwyjw.supabase.co/functions/v1/veriff_webhook
   ```
4. Enable these events:
   - ✅ verification.approved
   - ✅ verification.declined
   - ✅ verification.resubmission_requested
   - ✅ verification.expired
5. Click **Save**

---

## 🧪 Test It!

### Test the Full Flow:

1. **Wait for Railway deployment** (check Railway dashboard)
2. Go to: https://www.getwild-now.com/employer/dashboard
3. Click **Add Employee**
4. Enter:
   - Name: `Test Employee`
   - Role: `Tester`
   - Email: `your-email@example.com`
5. Click **Send invite link**
6. Check your email → Click **Start Verification**
7. Click **Start Verification** button on page
8. Complete Veriff verification (use test mode if available)
9. Should auto-redirect to dashboard after approval ✅

---

## 🐛 Troubleshooting

### "Verification system is not ready"
- Refresh the page
- Check browser console for errors

### "Failed to create verification session"
- Check Railway logs for errors
- Verify environment variables are set
- Redeploy on Railway

### Verification completed but not redirecting
- Check Supabase Edge Function logs
- Verify webhook URL in Veriff Dashboard
- Check `employees` table for `veriff_status`

---

## ✅ Done!

Your Veriff integration is now live! 🎉

Employees will now:
1. Receive invite email
2. Click to start verification
3. Complete ID verification with Veriff
4. Auto-redirect to dashboard

---

**Next:** Test with a real employee invite!

