# 🚀 Veriff Deployment Guide

## ✅ What Changed

We've implemented Veriff verification using **Supabase Edge Functions** (the correct architecture):

1. **Supabase Edge Function** (`create-veriff-session`) → Calls Veriff API securely
2. **Frontend** → Simple button that calls Edge Function → Opens Veriff modal
3. **Webhook** → Already set up at `veriff_webhook` Edge Function

---

## 📋 Deployment Steps

### 1. Deploy Supabase Edge Functions

```bash
cd "/Users/pytro/Documents/Website Get wild/get-wild-insurance"

# Deploy the create-veriff-session function
npx supabase functions deploy create-veriff-session

# The webhook should already be deployed, but if needed:
npx supabase functions deploy veriff_webhook
```

### 2. Set Supabase Secrets

```bash
# Set Veriff credentials in Supabase
npx supabase secrets set VERIFF_API_KEY=bc193001-958f-45ca-931f-c6a040a59ff9
npx supabase secrets set VERIFF_API_SECRET=1b053eaa-73eb-4924-81a3-6c917077c059
```

### 3. Verify Environment Variables in Railway

Make sure these are set in Railway (for the Next.js app):

```
NEXT_PUBLIC_SUPABASE_URL=https://rqmjnenmeixvpwyzwyjw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_BASE_URL=https://www.getwild-now.com
```

**NOTE:** You do NOT need `NEXT_PUBLIC_VERIFF_API_KEY` in Railway anymore since the Edge Function handles it!

### 4. Configure Veriff Dashboard

Go to your Veriff Dashboard and set:

**Webhook URL:**
```
https://rqmjnenmeixvpwyzwyjw.supabase.co/functions/v1/veriff_webhook
```

**Redirect URL (if needed):**
```
https://www.getwild-now.com/employee-verification
```

---

## 🧪 Testing the Flow

### 1. Send Fresh Invite

From employer dashboard:
```
https://www.getwild-now.com/employer/dashboard
```

### 2. Click Email Link

Should redirect to:
```
https://www.getwild-now.com/employee-verification
```

### 3. Click "Start Verification" Button

Console should show:
```
[Veriff] Loading InContext SDK...
[Veriff] ✅ SDK ready, button will call Edge Function
[Veriff] Calling Supabase Edge Function to create session...
[Veriff] Session created successfully, opening modal...
```

### 4. Complete Verification

The Veriff modal opens → Complete ID verification → Modal closes → Status polling begins

### 5. Check Webhook

Once Veriff processes, webhook updates employee status in database and redirects to dashboard.

---

## 🔍 Troubleshooting

### Edge Function Not Working

Check Supabase logs:
```
https://supabase.com/dashboard/project/rqmjnenmeixvpwyzwyjw/logs/edge-functions
```

### Secrets Not Set

List current secrets:
```bash
npx supabase secrets list
```

### Frontend Errors

Check browser console for detailed logs. All steps are logged with `[Veriff]` prefix.

### Webhook Not Receiving Events

1. Check Veriff Dashboard webhook configuration
2. Verify webhook URL is correct
3. Check Supabase Edge Function logs
4. Test webhook manually with Veriff test events

---

## 📊 Architecture Summary

```
User clicks "Start Verification"
    ↓
Frontend calls Supabase Edge Function
    ↓
Edge Function calls Veriff API
    ↓
Veriff returns session URL
    ↓
Frontend opens Veriff modal (InContext SDK)
    ↓
User completes verification
    ↓
Veriff sends webhook to Supabase
    ↓
Webhook updates database
    ↓
Frontend polls status → Redirects to dashboard
```

---

## ✅ Benefits of This Architecture

1. **Secure**: API keys never exposed to frontend
2. **Reliable**: Veriff API called from server, not browser
3. **Scalable**: Edge Functions handle high traffic
4. **Simple**: Frontend just displays button and modal
5. **Correct**: Follows Veriff's recommended architecture

---

## 🚨 Important Notes

- The Edge Function requires authentication (user token)
- Maximum 3 verification attempts per employee
- Session creation updates `veriff_attempts` counter
- Webhook handles final status updates
- Status polling is backup for webhook delays

---

## 📝 Files Changed

- ✅ Created: `supabase/functions/create-veriff-session/index.ts`
- ✅ Updated: `app/employee-verification/page.tsx`
- ✅ Deleted: `app/api/veriff/create-session/route.ts` (old approach)
- ✅ Kept: `app/api/veriff/status/route.ts` (still needed for polling)

---

## 🎉 Ready to Deploy!

1. Deploy Edge Functions
2. Set secrets
3. Test with fresh invite
4. Monitor logs

Everything should work smoothly now! 🚀

