# Render Deployment Guide

## Overview
This guide will walk you through deploying the getwild Prime Care onboarding system to Render.

## Prerequisites

Before deploying, ensure you have:
- A Render account (sign up at https://render.com)
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
   - Endpoint: `https://your-app.onrender.com/api/webhooks/veriff`
   - Events: `verification.status.changed`

### 1.3 Get OpenAI API Key
1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Add billing/payment method

## Step 2: Deploy to Render

### 2.1 Create New Web Service
1. Go to https://render.com/dashboard
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository:
   - Click "Connect account" if not already connected
   - Select your repository

### 2.2 Configure Web Service

Fill in the following settings:

**Basic Settings:**
- **Name**: `getwild-primecare` (or your preferred name)
- **Region**: Choose closest to your users
- **Branch**: `main` (or your default branch)
- **Root Directory**: Leave empty (unless your app is in a subdirectory)

**Build & Deploy:**
- **Runtime**: `Node`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

**Instance Type:**
- **Free** or **Starter** ($7/month) - Starter recommended for production

### 2.3 Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Add the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
VERIFF_API_KEY=your_veriff_api_key
VERIFF_API_SECRET=your_veriff_api_secret
VERIFF_API_URL=https://stationapi.veriff.com
OPENAI_API_KEY=sk-your_openai_key_here
NODE_ENV=production
```

**Important:** Make sure to click "Add" after each variable!

### 2.4 Deploy

1. Click **"Create Web Service"**
2. Render will automatically:
   - Clone your repository
   - Install dependencies
   - Build your Next.js app
   - Deploy it
3. Wait for deployment to complete (usually 3-5 minutes)
4. Your app URL will be: `https://your-app-name.onrender.com`

## Step 3: Post-Deployment Configuration

### 3.1 Update Veriff Webhook
1. Go back to Veriff Dashboard > Settings > Webhooks
2. Update webhook URL to: `https://your-app-name.onrender.com/api/webhooks/veriff`
3. Save changes

### 3.2 Configure Supabase Auth (if using magic links)
1. Go to Supabase Dashboard > Authentication > URL Configuration
2. Add your Render URL to:
   - Site URL: `https://your-app-name.onrender.com`
   - Redirect URLs: `https://your-app-name.onrender.com/**`

### 3.3 Test Health Check
1. Visit: `https://your-app-name.onrender.com/api/health`
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
1. Visit: `https://your-app-name.onrender.com/admin/data-points`
2. Verify you can view/edit data points configuration

### 4.2 Monitor Logs
- Go to Render Dashboard > Your Service
- Click **"Logs"** tab
- Check for any errors

### 4.3 Test User Onboarding Flow
1. Create a test onboarding link (you'll need to implement magic link generation)
2. Test the complete flow:
   - Magic link → Veriff verification → AI chat → Dashboard

## Step 5: Production Considerations

### 5.1 Custom Domain (Optional)
1. In Render, go to your service > **"Settings"**
2. Scroll to **"Custom Domains"**
3. Click **"Add Custom Domain"**
4. Follow instructions to update DNS records
5. Update Veriff webhook URL to use custom domain

### 5.2 Auto-Deploy on Git Push
Render automatically deploys when you push to your connected branch:
- Push to `main` → Automatic deployment
- Can be disabled in Settings if needed

### 5.3 Monitoring
Set up monitoring:
- Render provides basic metrics (response time, CPU, memory)
- Consider adding:
  - Error tracking (e.g., Sentry)
  - Uptime monitoring (e.g., UptimeRobot)
  - Log aggregation (e.g., LogDNA, Datadog)

### 5.4 Scaling
Render auto-scales based on plan:
- **Free**: Single instance, may sleep after inactivity
- **Starter**: Single instance, always on
- **Standard+**: Auto-scaling available

⚠️ **Free Tier Note**: Free services sleep after 15 minutes of inactivity and take ~30 seconds to wake up. For production, use Starter ($7/month) or higher.

### 5.5 Backups
- Supabase automatically backs up your database
- Consider downloading periodic backups for critical data
- Export user data regularly for compliance

## Troubleshooting

### Deployment Fails
- Check build logs in Render dashboard
- Verify all environment variables are set correctly
- Ensure `package.json` has correct scripts
- Check Node version compatibility (Render uses latest LTS)

### Health Check Fails
- Check environment variables are correct
- Verify Supabase connection
- Check Render logs for errors
- Ensure all required env vars are present

### Veriff Webhook Not Working
- Verify webhook URL is correct (use .onrender.com URL)
- Check webhook signature verification
- Look for webhook events in Veriff dashboard
- Check Render logs for webhook errors

### Database Connection Issues
- Verify Supabase credentials
- Check RLS policies are applied
- Ensure migrations ran successfully
- Check Supabase Dashboard > Logs

### App Sleeps on Free Tier
- Upgrade to Starter plan ($7/month) for always-on service
- Or use a uptime monitor to ping your app every 10 minutes

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

### Render
- **Free**: $0/month (sleeps after inactivity, 750 hours/month)
- **Starter**: $7/month (always on, 1 instance)
- **Standard**: $25/month (auto-scaling, better performance)
- Typical recommendation: **Starter** for production

### Supabase
- Free tier: Up to 500MB database, 2GB bandwidth
- Pro: $25/month (8GB database, 50GB bandwidth)

### Veriff
- Contact Veriff for pricing (typically volume-based)

### OpenAI
- Pay per token
- GPT-4: ~$0.03 per 1K input tokens, $0.06 per 1K output tokens
- Typical onboarding: ~$0.10-0.30 per user

**Total Estimated Monthly Cost:** $32-60 + per-user costs

## Render-Specific Features

### Persistent Disk (Optional)
If you need file storage:
1. Go to service > **"Disk"**
2. Add disk with path `/data`
3. Files persist across deployments

### Health Check Configuration
Render automatically uses your health endpoint:
- Path: `/api/health`
- Auto-detected and monitored
- Restarts service if unhealthy

### Preview Environments
For each pull request:
1. Enable in Settings > **"Pull Request Previews"**
2. Each PR gets a unique URL for testing
3. Great for reviewing changes before merge

### Cron Jobs (Scheduled Tasks)
If you need scheduled tasks:
1. Create new **"Cron Job"** in Render
2. Use same repository
3. Set schedule (e.g., `0 0 * * *` for daily)

## Security Checklist

- ✅ All secrets stored as environment variables (not in code)
- ✅ RLS policies enabled on all tables
- ✅ Webhook signatures verified
- ✅ HTTPS enforced (Render provides this)
- ✅ Service role key never exposed to client
- ✅ Input validation on all API endpoints
- ✅ Error messages don't leak sensitive info
- ✅ Dependencies up to date (`npm audit`)

## CI/CD with Render

Render provides automatic CI/CD:
1. Push to GitHub → Automatic build & deploy
2. View deploy history in dashboard
3. Rollback to previous versions if needed
4. Set up deploy notifications (Slack, email, etc.)

## Support

For issues:
- Render: https://render.com/docs or support@render.com
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

## Render vs Other Platforms

**Why Render?**
- ✅ Easy setup (auto-detects Next.js)
- ✅ Free tier available (with limitations)
- ✅ Automatic SSL certificates
- ✅ Auto-deploy on git push
- ✅ Good performance
- ✅ Simple pricing
- ✅ Preview environments for PRs

**Limitations:**
- ⚠️ Free tier sleeps after inactivity
- ⚠️ Fewer regions than AWS/Vercel
- ⚠️ Less control than raw VPS

## Quick Command Reference

```bash
# Build locally to test
npm run build

# Start production server locally
npm run build && npm start

# Check for security issues
npm audit

# Update dependencies
npm update

# Check TypeScript errors
npx tsc --noEmit
```

---

**Ready to Deploy?** ✅

Follow the steps above and you'll have your app running on Render in under 30 minutes!

