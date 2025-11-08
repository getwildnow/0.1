# Railway Deployment Guide

## Overview
This guide will walk you through deploying the getwild Prime Care onboarding system to Railway.

## Prerequisites

Before deploying, ensure you have:
- A Railway account (sign up at https://railway.app)
- A GitHub repository with your code
- Supabase project set up with migrations applied
- Veriff account with API credentials
- OpenAI API key

## Step 1: Prepare Your Services

### 1.1 Set Up Supabase
1. Go to https://supabase.com and create a new project
2. Run the database migrations:
   - Navigate to SQL Editor in Supabase Dashboard
   - Run `supabase/migrations/001_initial_schema.sql`
   - Run `supabase/migrations/002_rls_policies.sql`
3. Note down your credentials from Settings > API:
   - Project URL
   - Anon/Public Key
   - Service Role Key (keep this secret!)

### 1.2 Set Up Veriff
1. Create an account at https://station.veriff.com/
2. Get your API credentials from Settings > API Keys:
   - API Key
   - API Secret
3. Configure webhook (you'll update this after deployment):
   - Endpoint: `https://your-app.railway.app/api/webhooks/veriff`
   - Events: `verification.status.changed`

### 1.3 Get OpenAI API Key
1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Add billing/payment method

## Step 2: Deploy to Railway

### 2.1 Connect Your Repository
1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Authorize Railway to access your GitHub
5. Select your repository

### 2.2 Configure Build Settings
Railway should auto-detect Next.js. Verify these settings:
- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Node Version**: 20.x (automatic)

### 2.3 Add Environment Variables
In Railway dashboard, go to Variables and add:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Veriff Configuration
VERIFF_API_KEY=your_veriff_api_key
VERIFF_API_SECRET=your_veriff_api_secret
VERIFF_API_URL=https://stationapi.veriff.com

# OpenAI Configuration
OPENAI_API_KEY=sk-your_openai_key_here

# Node Environment
NODE_ENV=production
```

### 2.4 Deploy
1. Railway will automatically build and deploy
2. Wait for deployment to complete (check Deployments tab)
3. Once deployed, Railway will provide your app URL: `https://your-app.railway.app`

## Step 3: Post-Deployment Configuration

### 3.1 Update Veriff Webhook
1. Go back to Veriff Dashboard > Settings > Webhooks
2. Update webhook URL to: `https://your-app.railway.app/api/webhooks/veriff`
3. Save changes

### 3.2 Configure Supabase Auth (if using magic links)
1. Go to Supabase Dashboard > Authentication > URL Configuration
2. Add your Railway URL to:
   - Site URL: `https://your-app.railway.app`
   - Redirect URLs: `https://your-app.railway.app/**`

### 3.3 Test Health Check
1. Visit: `https://your-app.railway.app/api/health`
2. Should return:
```json
{
  "status": "healthy",
  "database": "ok",
  "environment": "ok",
  "timestamp": "2024-..."
}
```

## Step 4: Verify Deployment

### 4.1 Test Admin Interface
1. Visit: `https://your-app.railway.app/admin/data-points`
2. Verify you can view/edit data points configuration

### 4.2 Test User Onboarding Flow
1. Create a test onboarding link (you'll need to implement magic link generation)
2. Test the complete flow:
   - Magic link → Veriff verification → AI chat → Dashboard

### 4.3 Monitor Logs
- Check Railway logs for any errors
- Monitor Supabase logs for database issues
- Check Veriff webhook logs for verification events

## Step 5: Production Considerations

### 5.1 Custom Domain (Optional)
1. In Railway, go to Settings > Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update Veriff webhook URL to use custom domain

### 5.2 Monitoring
Set up monitoring:
- Railway provides basic metrics (CPU, Memory, Network)
- Consider adding:
  - Error tracking (e.g., Sentry)
  - Uptime monitoring (e.g., UptimeRobot)
  - Log aggregation (e.g., LogDNA, Datadog)

### 5.3 Scaling
Railway auto-scales based on usage:
- Default: 1 instance
- Auto-scales up during high traffic
- Configured in Railway Settings > Service

### 5.4 Backups
- Supabase automatically backs up your database
- Consider downloading periodic backups for critical data
- Export user data regularly for compliance

## Troubleshooting

### Deployment Fails
- Check Railway build logs
- Verify all environment variables are set
- Ensure package.json has correct dependencies

### Health Check Fails
- Check environment variables are correct
- Verify Supabase connection
- Check Railway logs for errors

### Veriff Webhook Not Working
- Verify webhook URL is correct
- Check webhook signature verification
- Look for webhook events in Veriff dashboard
- Check Railway logs for webhook errors

### Database Connection Issues
- Verify Supabase credentials
- Check RLS policies are applied
- Ensure migrations ran successfully

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase service role key (server-side) |
| `VERIFF_API_KEY` | Yes | Veriff API key |
| `VERIFF_API_SECRET` | Yes | Veriff API secret (for webhooks) |
| `VERIFF_API_URL` | No | Veriff API base URL (default: https://stationapi.veriff.com) |
| `OPENAI_API_KEY` | Yes | OpenAI API key (starts with sk-) |
| `NODE_ENV` | Yes | Set to `production` |

## Cost Estimates

### Railway
- Hobby Plan: $5/month + usage
- Pro Plan: $20/month + usage
- Typical costs: $10-30/month for small-medium traffic

### Supabase
- Free tier: Up to 500MB database, 2GB bandwidth
- Pro: $25/month (8GB database, 50GB bandwidth)

### Veriff
- Contact Veriff for pricing (typically volume-based)

### OpenAI
- Pay per token
- GPT-4: ~$0.03 per 1K input tokens, $0.06 per 1K output tokens
- Typical onboarding: ~$0.10-0.30 per user

## Security Checklist

- ✅ All secrets stored as environment variables (not in code)
- ✅ RLS policies enabled on all tables
- ✅ Webhook signatures verified
- ✅ HTTPS enforced (Railway provides this)
- ✅ Service role key never exposed to client
- ✅ Input validation on all API endpoints
- ✅ Error messages don't leak sensitive info

## Support

For issues:
- Railway: https://railway.app/help
- Supabase: https://supabase.com/support
- Veriff: support@veriff.com
- OpenAI: https://help.openai.com

## Next Steps

After successful deployment:
1. Set up monitoring and alerts
2. Create admin authentication system
3. Implement magic link generation for inviting users
4. Add analytics tracking
5. Set up automated backups
6. Document admin procedures
7. Create runbooks for common issues

