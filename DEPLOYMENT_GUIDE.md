# Deployment Guide - Employee Onboarding System v2

## Overview
This guide covers deploying the getwild Prime Care employee onboarding system to Railway.

## Prerequisites
- Railway account
- Supabase project
- Veriff account
- OpenAI API key
- GitHub repository

## Step 1: Database Setup

1. Open Supabase dashboard → SQL Editor
2. Run the complete SQL script: `supabase/migrations/001_complete_schema.sql`
3. Verify all tables and RLS policies are created

## Step 2: Railway Deployment

1. Connect your GitHub repository to Railway
2. Select the `v2-employee-auth` branch
3. Configure build settings:
   - Build command: `npm run build`
   - Start command: `npm start`
4. Add environment variables from `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `VERIFF_API_KEY`
   - `VERIFF_API_SECRET`
   - `OPENAI_API_KEY`
   - `RAILWAY_EXTERNAL_URL` (set after deployment, e.g., `https://your-app.railway.app`)

## Step 3: Supabase Configuration

1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Set **Site URL**: `https://your-app.railway.app`
3. Add **Redirect URLs**:
   - `https://your-app.railway.app/auth/callback`
   - `https://your-app.railway.app/**`

## Step 4: Veriff Configuration

1. Go to Veriff Dashboard → Settings → Integration
2. Set **Webhook Events URL**: `https://your-app.railway.app/api/webhooks/veriff`
3. Set **Return URL**: `https://your-app.railway.app/onboard/chat`
4. Verify API keys match your `.env.local`

## Step 5: Admin Configuration

1. Deploy the application
2. Visit `https://your-app.railway.app/admin/data-points`
3. Enter your data points (one per line, markdown format)
4. Click "Save Configuration"

## Step 6: Testing the Flow

1. **Admin creates user**:
   - Go to Supabase Dashboard → Authentication → Users
   - Click "Add user" → Enter email
   - User receives magic link email

2. **User clicks magic link**:
   - Opens `/auth/callback`
   - Exchanges code for session
   - Redirects to `/onboard/verify`

3. **User verifies identity**:
   - Clicks "Start Verification"
   - Redirects to Veriff
   - Completes ID verification

4. **Veriff webhook**:
   - Veriff sends webhook to `/api/webhooks/veriff`
   - Extracts all data (name, DOB, address, etc.)
   - Stores in `user_profiles` table

5. **User redirected to chat**:
   - Veriff redirects to `/onboard/chat`
   - Page polls `/api/verify-status` until verified
   - Chat interface loads

6. **AI conversation**:
   - AI uses Veriff data (never asks for it)
   - Collects remaining data points from admin config
   - Stores answers in `user_onboarding_data`

## Troubleshooting

### Webhook not receiving data
- Check Veriff dashboard webhook URL is correct
- Verify `VERIFF_API_SECRET` matches Veriff dashboard
- Check Railway logs for webhook errors

### Chat stuck on "Loading..."
- Check `/api/verify-status` endpoint
- Verify `verification_status` is 'verified' in `user_profiles`
- Check Railway logs for errors

### Authentication errors
- Verify Supabase Site URL and Redirect URLs
- Check `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Ensure magic link email is sent correctly

### Database errors
- Verify SQL migration ran successfully
- Check RLS policies are enabled
- Ensure service role key is correct for webhooks

## Environment Variables Checklist

- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `VERIFF_API_KEY`
- [ ] `VERIFF_API_SECRET`
- [ ] `OPENAI_API_KEY`
- [ ] `RAILWAY_EXTERNAL_URL`

## Success Criteria

✓ Magic link flow works
✓ Veriff verification completes
✓ Webhook stores all data in Supabase
✓ Chat interface loads after verification
✓ AI uses Veriff data (doesn't ask for it)
✓ AI collects remaining data points
✓ All data stored in Supabase

