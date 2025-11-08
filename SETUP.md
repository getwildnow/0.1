# Local Development Setup

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   - Copy `ENV_EXAMPLE.txt` to `.env.local`
   - Fill in your actual values (see below)

3. **Set up Supabase database:**
   - Create project at https://supabase.com
   - Run migrations (see Database Setup below)

4. **Start development server:**
   ```bash
   npm run dev
   ```

5. **Visit:** http://localhost:3000

---

## 1. Environment Variables

Create `.env.local` in the root directory:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Veriff Identity Verification
VERIFF_API_KEY=your_veriff_api_key
VERIFF_API_SECRET=your_veriff_api_secret
VERIFF_API_URL=https://stationapi.veriff.com

# OpenAI
OPENAI_API_KEY=sk-your_openai_key_here
```

**Get credentials:**
- **Supabase**: https://supabase.com/dashboard (Settings > API)
- **Veriff**: https://station.veriff.com/ (Settings > API Keys)
- **OpenAI**: https://platform.openai.com/api-keys

---

## 2. Database Setup (Supabase)

### Option A: Using Supabase Dashboard (Recommended for beginners)

1. Create a Supabase project at https://supabase.com
2. Go to **SQL Editor** in the dashboard
3. Run migrations in order:
   - Copy and paste contents of `supabase/migrations/001_initial_schema.sql`
   - Click "Run"
   - Copy and paste contents of `supabase/migrations/002_rls_policies.sql`
   - Click "Run"

### Option B: Using Supabase CLI (Advanced)

```bash
# Install Supabase CLI
npm install -g supabase

# Link to your project
supabase link --project-ref your-project-ref

# Push migrations
supabase db push
```

---

## 3. Veriff Setup (Identity Verification)

1. **Create account** at https://station.veriff.com/
2. **Get API credentials:**
   - Go to Settings > API Keys
   - Copy API Key and API Secret
   - Add to `.env.local`
3. **Configure webhook (for testing):**
   - Use ngrok or similar to expose localhost
   - Webhook URL: `https://your-ngrok-url.ngrok.io/api/webhooks/veriff`
   - Events: `verification.status.changed`

**Note:** For local development, webhook may not work without tunneling (ngrok, localtunnel, etc.)

---

## 4. Test Your Setup

### Health Check
Visit: http://localhost:3000/api/health

Should return:
```json
{
  "status": "healthy",
  "database": "ok",
  "environment": "ok"
}
```

### Test Pages
1. **Admin Interface:** http://localhost:3000/admin/data-points
2. **Test Page:** http://localhost:3000/test
3. **Dashboard:** http://localhost:3000/dashboard

### Test Onboarding Flow
1. You'll need to create a user with Supabase Auth
2. Visit: http://localhost:3000/onboard/verify (redirects to Veriff)
3. Complete verification
4. Continue to: http://localhost:3000/onboard/chat

---

## 5. Development Without Full Setup

You can test the UI without all services configured:

**What works without setup:**
- Admin interface (can't save)
- Static pages
- UI components

**What requires setup:**
- Database operations (requires Supabase)
- Identity verification (requires Veriff)
- AI chat (requires OpenAI)

---

## 6. Common Issues

### "Missing environment variables"
- Check that `.env.local` exists in root directory
- Verify all required variables are set
- Restart dev server after changing env vars

### "Cannot connect to database"
- Verify Supabase URL and keys are correct
- Check migrations ran successfully
- Visit Supabase dashboard to verify connection

### "Veriff API error"
- Verify API key and secret are correct
- Check if using test vs production keys
- Verify API URL is correct

### "OpenAI API error"
- Verify API key is correct and active
- Check you have credits/billing set up
- Ensure key starts with `sk-`

---

## 7. Next Steps

After successful local setup:
1. Test the complete onboarding flow
2. Customize data points in admin interface
3. Review and customize AI prompts in `lib/ai/conversation.ts`
4. Set up production deployment (see RAILWAY_DEPLOYMENT.md)

---

## Additional Resources

- **Project README:** `README.md`
- **Production Deployment:** `RAILWAY_DEPLOYMENT.md`
- **Testing Guide:** `TESTING.md` (if available)
- **Environment Variables Guide:** `ENV_EXAMPLE.txt`

