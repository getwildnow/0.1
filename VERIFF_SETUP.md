# Veriff Integration Setup Guide

## Overview

This guide will help you set up Veriff identity verification for employee onboarding.

---

## Prerequisites

1. **Veriff Account**: You need a Veriff account with API credentials
2. **Supabase Access**: Admin access to your Supabase project
3. **Railway Access**: Admin access to deploy environment variables

---

## Step 1: Get Veriff API Credentials

### Sign Up for Veriff

1. Go to: https://www.veriff.com/
2. Click "Get Started" or "Request Demo"
3. Complete the signup process
4. Once approved, access your Veriff Dashboard

### Get API Credentials

1. Log in to Veriff Dashboard
2. Go to **Settings** → **API Keys**
3. Copy your:
   - **API Key** (also called X-AUTH-CLIENT)
   - **API Secret** (for webhook signature verification)

### Configure Webhook URL

1. In Veriff Dashboard, go to **Settings** → **Webhooks**
2. Set webhook URL to:
   ```
   https://rqmjnenmeixvpwyzwyjw.supabase.co/functions/v1/veriff_webhook
   ```
3. Enable these events:
   - `verification.approved`
   - `verification.declined`
   - `verification.resubmission_requested`
4. Save webhook configuration

---

## Step 2: Configure Environment Variables

### Local Development (`.env.local`)

Add these variables:

```bash
# Veriff API Credentials
VERIFF_API_KEY=your_veriff_api_key_here
VERIFF_API_SECRET=your_veriff_api_secret_here

# Existing variables (make sure these are set)
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://rqmjnenmeixvpwyzwyjw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Production (Railway)

1. Go to Railway Dashboard → Your Service → **Variables**
2. Add these variables:
   ```
   VERIFF_API_KEY=your_veriff_api_key_here
   VERIFF_API_SECRET=your_veriff_api_secret_here
   ```
3. Verify existing variables are correct:
   ```
   NEXT_PUBLIC_BASE_URL=https://www.getwild-now.com
   NEXT_PUBLIC_SUPABASE_URL=https://rqmjnenmeixvpwyzwyjw.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```
4. Click **Deploy** to redeploy with new variables

### Supabase Edge Function

1. Go to Supabase Dashboard → **Edge Functions** → **Secrets**
2. Add these secrets:
   ```
   VERIFF_API_SECRET=your_veriff_api_secret_here
   ```

---

## Step 3: Run Database Migration

The database migration adds Veriff columns to the `employees` table.

### Option A: Using Supabase Dashboard (Recommended)

1. Go to Supabase Dashboard → **SQL Editor**
2. Open the file: `supabase/migrations/20250110_add_veriff_data.sql`
3. Copy the entire SQL content
4. Paste into Supabase SQL Editor
5. Click **Run** to execute the migration

### Option B: Using Supabase CLI

```bash
cd "/Users/pytro/Documents/Website Get wild/get-wild-insurance"
supabase db push
```

### Verify Migration

Check that these columns exist in the `employees` table:
- `veriff_session_id`
- `veriff_status`
- `veriff_person`
- `veriff_decision_time`
- `verification_completed_at`
- `veriff_attempts`

---

## Step 4: Deploy Supabase Edge Function

### Option A: Using Supabase Dashboard

1. Go to Supabase Dashboard → **Edge Functions**
2. Click **"Create a new function"**
3. Name it: `veriff_webhook`
4. Copy the content from: `supabase/functions/veriff_webhook/index.ts`
5. Paste into the function editor
6. Click **Deploy**

### Option B: Using Supabase CLI

```bash
cd "/Users/pytro/Documents/Website Get wild/get-wild-insurance"
supabase functions deploy veriff_webhook
```

### Test Webhook Function

Send a test POST request:

```bash
curl -X POST \
  https://rqmjnenmeixvpwyzwyjw.supabase.co/functions/v1/veriff_webhook \
  -H "Content-Type: application/json" \
  -d '{
    "status": "success",
    "verification": {
      "id": "test-session-123",
      "status": "approved",
      "vendorData": "test-employee-id",
      "decisionTime": "2025-01-10T12:00:00Z"
    }
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "Verification processed"
}
```

---

## Step 5: Deploy Application

### Build and Deploy

```bash
cd "/Users/pytro/Documents/Website Get wild/get-wild-insurance"
npm run build
```

If build succeeds, push to git and redeploy on Railway:

```bash
git add -A
git commit -m "Add Veriff identity verification integration"
git push origin getwild-app
```

Then redeploy on Railway Dashboard.

---

## Step 6: Test the Full Flow

### End-to-End Testing

1. **Send Employee Invite**:
   - Go to: `https://www.getwild-now.com/employer/dashboard`
   - Click "Add Employee"
   - Enter test employee details
   - Click "Send invite link"

2. **Check Email**:
   - Open the invitation email
   - Click "Start Verification" button
   - Should redirect to: `/employee-verification`

3. **Start Verification**:
   - Click "Start Verification" button on page
   - Veriff SDK should open in iframe
   - Complete identity verification (use Veriff test mode)

4. **Check Status**:
   - After submitting verification, page should show "Processing..."
   - Once Veriff approves (usually 1-2 minutes in test mode)
   - Should automatically redirect to `/employee/dashboard`

5. **Verify Database**:
   - Check Supabase → `employees` table
   - Employee should have:
     - `veriff_status`: `approved`
     - `veriff_session_id`: session ID
     - `veriff_person`: person data (JSON)
     - `verification_completed_at`: timestamp

---

## Troubleshooting

### Issue: "Verification system is not ready"

**Cause:** Veriff SDK failed to load

**Fix:**
- Check browser console for errors
- Ensure script loads: `https://cdn.veriff.me/sdk/js/1.3/veriff.min.js`
- Try refreshing the page

---

### Issue: "Failed to create verification session"

**Cause:** Veriff API credentials not set or invalid

**Fix:**
1. Check Railway environment variables
2. Verify `VERIFF_API_KEY` is correct
3. Check Railway logs for API error messages
4. Redeploy after updating variables

---

### Issue: Verification completed but status not updating

**Cause:** Webhook not receiving events from Veriff

**Fix:**
1. Check Veriff Dashboard → Webhooks → ensure URL is correct
2. Check Supabase Edge Function logs
3. Verify `VERIFF_API_SECRET` is set in Supabase secrets
4. Test webhook manually (see Step 4)

---

### Issue: Employee redirected back to verification page

**Cause:** `veriff_status` not set to `approved`

**Fix:**
1. Check Supabase → `employees` table
2. Manually set `veriff_status` to `approved` for testing
3. Check Supabase Edge Function logs for webhook errors

---

## Veriff Test Mode

### Enable Test Mode

1. In Veriff Dashboard → **Settings** → **Environment**
2. Toggle **Test Mode** ON
3. Use test documents for verification

### Test Documents

Veriff provides test documents that always approve/decline:

- **Always Approve**: Use any ID with name "APPROVED PERSON"
- **Always Decline**: Use any ID with name "DECLINED PERSON"

See Veriff documentation for full list of test scenarios.

---

## Security Notes

1. **API Secret**: Never commit `VERIFF_API_SECRET` to git
2. **Webhook Signature**: Always verify webhook signatures in production
3. **PII Data**: `veriff_person` column stores sensitive data - ensure proper encryption
4. **Rate Limiting**: Implement rate limiting on `/api/veriff/create-session`

---

## Production Checklist

Before going live:

- [ ] Veriff account is in production mode (not test)
- [ ] API credentials are production keys
- [ ] Webhook URL is correct and responding
- [ ] Environment variables set in Railway
- [ ] Database migration applied
- [ ] Edge function deployed
- [ ] Webhook signature verification enabled
- [ ] Full flow tested end-to-end
- [ ] Error handling tested (declined verification)
- [ ] Mobile device testing completed

---

## Support

### Veriff Support
- Documentation: https://developers.veriff.com/
- Support: support@veriff.com

### Internal Support
- Check Railway logs for backend errors
- Check Supabase logs for database/function errors
- Check browser console for frontend errors

---

**Last Updated:** January 10, 2025

