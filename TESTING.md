# Local Testing Guide

## Quick Start

The dev server should be running at: **http://localhost:3000**

## Pages to Test

### 1. Home Page
- **URL**: http://localhost:3000
- **What to check**: Basic page loads

### 2. Admin Interface (No Auth Required)
- **URL**: http://localhost:3000/admin/data-points
- **What to test**:
  - See the markdown list editor
  - Edit the list
  - Click "Save Configuration" (will show error without Supabase, but UI works)
  - See the default list with all data points

### 3. Test Chat Interface (Demo Mode)
- **URL**: http://localhost:3000/test
- **What to test**:
  - Chat interface loads
  - Consent checkbox appears
  - Can type messages
  - Messages appear (demo mode - won't save without Supabase)
  - UI looks good

### 4. Onboarding Flow (Requires Supabase)
- **URL**: http://localhost:3000/onboard/test-token
- **What happens**: Will redirect to Stripe or show error (needs Supabase + Stripe)

## Testing Checklist

- [ ] Home page loads
- [ ] Admin page loads and shows markdown editor
- [ ] Can edit markdown in admin
- [ ] Test chat page loads
- [ ] Consent checkbox appears
- [ ] Can type and send messages
- [ ] Messages display correctly
- [ ] UI looks good on mobile (responsive)

## Next Steps for Full Testing

1. **Set up Supabase**:
   - Create project
   - Run migrations
   - Add credentials to `.env.local`

2. **Set up Stripe**:
   - Create account
   - Enable Identity
   - Add credentials to `.env.local`

3. **Set up OpenAI**:
   - Get API key
   - Add to `.env.local`

4. **Test Full Flow**:
   - Magic link → Stripe → Chat → Dashboard

## Current Status

✅ UI Components Built
✅ Chat Interface Works (Demo Mode)
✅ Admin Interface Works
⏳ Full Flow (Needs Supabase/Stripe/OpenAI)

