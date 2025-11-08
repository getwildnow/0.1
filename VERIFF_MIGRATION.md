# Migration from Stripe Identity to Veriff

## What Changed

✅ **Replaced Stripe Identity with Veriff**
- Removed Stripe Identity dependency
- Added Veriff API client
- Updated all verification flows

## Database Changes

You need to run a migration to update column names:

```sql
-- Update user_profiles table
ALTER TABLE user_profiles 
  RENAME COLUMN stripe_verification_session_id TO veriff_verification_session_id;

ALTER TABLE user_profiles 
  RENAME COLUMN stripe_data TO veriff_data;

-- Update onboarding_conversations table
ALTER TABLE onboarding_conversations 
  RENAME COLUMN stripe_verified TO veriff_verified;

ALTER TABLE onboarding_conversations 
  RENAME COLUMN stripe_data TO veriff_data;
```

Or drop and recreate tables using the updated migration file.

## Environment Variables

Update your `.env.local`:

**Remove:**
- `STRIPE_SECRET_KEY`
- `STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`

**Add:**
- `VERIFF_API_KEY`
- `VERIFF_API_SECRET`
- `VERIFF_API_URL` (optional, defaults to https://stationapi.veriff.com/v1)

## Veriff Setup

1. Create account at https://station.veriff.com/
2. Get API key and secret from Settings > API Keys
3. Set up webhook:
   - Endpoint: `https://your-domain.com/api/webhooks/veriff`
   - Events: `verification.status.changed`
   - Copy API secret for signature verification

## Files Changed

- ✅ `lib/veriff.ts` - New Veriff client
- ✅ `lib/stripe.ts` - Removed
- ✅ `app/api/identity/create-session/route.ts` - Updated for Veriff
- ✅ `app/api/webhooks/veriff/route.ts` - New Veriff webhook handler
- ✅ `app/api/webhooks/stripe/route.ts` - Removed
- ✅ `supabase/migrations/001_initial_schema.sql` - Updated schema
- ✅ All references updated from `stripe` to `veriff`

## Testing

After setup:
1. Create Veriff account and get API keys
2. Update `.env.local` with Veriff credentials
3. Run database migration
4. Test verification flow

