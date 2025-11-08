# getwild Prime Care - Employee Onboarding System

Ultra-simple AI-powered onboarding system with Stripe Identity verification and dynamic data collection.

## Features

- **2-Step Flow**: Magic Link → Veriff Identity → AI Conversation
- **Veriff Identity**: Automatic extraction of all personal data (name, DOB, address, email, phone, etc.)
- **AI Conversation**: Intelligent chat that uses Veriff data and collects health/lifestyle information
- **Dynamic Config**: Admin can add/remove data points via simple markdown list
- **OAuth Integrations**: Connect services directly in chat (Apple Health, Instagram, LinkedIn, etc.)
- **All in Supabase**: Everything stored securely in Supabase database

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Identity**: Veriff
- **AI**: OpenAI GPT-4
- **Styling**: Tailwind CSS

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create `.env.local`:
   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

   # Veriff
   VERIFF_API_KEY=your_veriff_api_key
   VERIFF_API_SECRET=your_veriff_api_secret
   VERIFF_API_URL=https://stationapi.veriff.com

   # OpenAI
   OPENAI_API_KEY=sk-...
   ```

3. **Set up Supabase:**
   - Run migrations in `supabase/migrations/`:
     - `001_initial_schema.sql`
     - `002_rls_policies.sql`
   - Or use Supabase CLI: `supabase db push`

4. **Set up Veriff:**
   - Create account at https://station.veriff.com/
   - Get API key and secret from Settings > API Keys
   - Configure webhook endpoint: `https://your-domain.com/api/webhooks/veriff`
   - Add API key and secret to `.env.local`

5. **Run development server:**
   ```bash
   npm run dev
   ```

## Usage

### Admin Interface

Visit `/admin/data-points` to edit the markdown list of data points to collect.

Example:
```markdown
- health goals
- medications
- exercise frequency
- apple health
- wearable selection
```

The AI automatically:
- Detects if item is a question, integration, or action
- Generates natural questions
- Shows OAuth buttons for integrations
- Shows choice buttons for actions

### User Flow

1. Employee receives magic link
2. Clicks link → `/onboard/[token]`
3. Redirected to Veriff Identity verification
4. After verification → `/onboard/chat`
5. AI conversation collects all data
6. Complete → `/dashboard`

## Project Structure

```
├── app/
│   ├── admin/data-points/     # Admin config interface
│   ├── api/
│   │   ├── config/            # Config CRUD
│   │   ├── identity/           # Veriff Identity
│   │   ├── onboarding/        # Chat API
│   │   └── webhooks/veriff/    # Veriff webhooks
│   ├── onboard/
│   │   ├── [token]/            # Magic link handler
│   │   ├── verify/             # Veriff verification redirect
│   │   └── chat/               # AI conversation
│   └── dashboard/              # Main dashboard
├── components/
│   └── chat/                   # Chat components
├── lib/
│   ├── ai/                     # AI conversation engine
│   ├── config/                 # Config parser
│   ├── supabase/               # Supabase clients
│   ├── veriff.ts               # Veriff client
│   └── openai.ts               # OpenAI client
└── supabase/migrations/        # Database migrations
```

## Database Schema

- `user_profiles` - Veriff Identity data
- `onboarding_config` - Admin's markdown list config
- `onboarding_conversations` - Conversation state
- `user_onboarding_data` - Collected answers
- `user_integrations` - Connected OAuth integrations
- `chat_messages` - Chat history
- `consents` - Consent records

## Production Deployment

### Ready to Deploy? 🚀

This application is production-ready with:
- ✅ Environment validation
- ✅ Structured logging
- ✅ Error boundaries
- ✅ Health monitoring
- ✅ Security best practices

### Quick Deploy to Render

1. **Prerequisites:**
   - Supabase project with migrations applied
   - Veriff API credentials
   - OpenAI API key

2. **Deploy:**
   - Connect GitHub repo to Render
   - Configure build: `npm install && npm run build`
   - Configure start: `npm start`
   - Add environment variables (see `ENV_EXAMPLE.txt`)
   - Deploy

3. **Post-Deploy:**
   - Update Veriff webhook URL
   - Test health check: `/api/health`

### Documentation

- **🚀 Render Deployment:** See `RENDER_DEPLOYMENT.md`
- **🚂 Railway Deployment:** See `RAILWAY_DEPLOYMENT.md` (alternative)
- **✅ Checklist:** See `PRODUCTION_CHECKLIST.md`
- **🧪 Testing:** See `TESTING_GUIDE.md`
- **📋 Summary:** See `DEPLOYMENT_SUMMARY.md`
- **🔧 Local Setup:** See `SETUP.md`

## Monitoring

- **Health Check:** `https://your-app-name.onrender.com/api/health`
- **Admin Interface:** `https://your-app-name.onrender.com/admin/data-points`
- **Logs:** Render Dashboard → Your Service → Logs

## Support

- Render: https://render.com/docs or support@render.com
- Supabase: https://supabase.com/support
- Veriff: support@veriff.com
- OpenAI: https://help.openai.com

## License

Private - getwild

