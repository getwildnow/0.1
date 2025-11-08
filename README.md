# getwild - Prime Care
## Employee Onboarding System

A streamlined 2-step employee onboarding platform with AI-powered data collection.

## 🎯 What It Does

### Employee Experience (2 Steps Only)

1. **ID Verification with Veriff**
   - Employee clicks magic link from email
   - Immediately redirected to Veriff for ID verification
   - Fast, secure identity verification
   - All identity data automatically captured

2. **AI Conversation with ChatGPT**
   - Smart AI chat interface
   - Collects remaining onboarding data
   - Natural conversation flow
   - Data automatically saved to database

### Admin Panel

Configure what data the AI should collect:
- **URL:** `/admin/data-points`
- Edit markdown list of data points
- Add integrations and actions
- Changes apply immediately

## 🚀 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Database:** Supabase (PostgreSQL)
- **ID Verification:** Veriff
- **AI:** OpenAI GPT-4
- **Deployment:** Render
- **Styling:** Tailwind CSS

## 📁 Project Structure

```
app/
├── onboard/
│   ├── [token]/      # Magic link entry point
│   ├── verify/       # Veriff verification
│   └── chat/         # ChatGPT conversation
├── admin/
│   └── data-points/  # Configuration panel
├── dashboard/        # Post-onboarding dashboard
└── api/
    ├── identity/     # Veriff session creation
    ├── webhooks/     # Veriff webhook handler
    ├── onboarding/   # ChatGPT chat API
    └── config/       # Admin configuration API
```

## ⚙️ Setup

See [SETUP.md](SETUP.md) for local development setup.

See [RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md) for production deployment.

## 🔐 Environment Variables

Required environment variables (see `ENV_EXAMPLE.txt`):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`
- `VERIFF_API_KEY`
- `VERIFF_API_SECRET`
- `VERIFF_API_URL`

## 📧 Magic Link Flow

1. Admin creates magic link via Supabase Auth
2. Employee receives email with magic link
3. Employee clicks link → Lands on `/onboard/[token]`
4. System authenticates and redirects to Veriff
5. After Veriff → Redirects to AI chat
6. After chat complete → Dashboard

## 🎨 Admin Configuration

Edit `/admin/data-points` to customize what the AI collects:

```markdown
# Health & Medical
- health goals
- medications
- allergies

# Integrations
- apple health
- google workspace

# Actions
- sign consent form
```

Changes apply immediately to new conversations.

## 📊 Data Storage

All data stored in Supabase:
- `user_profiles` - Veriff identity data + verification status
- `onboarding_conversations` - Chat state and consent
- `user_onboarding_data` - Collected data points
- `chat_messages` - Full conversation history
- `onboarding_config` - Admin configuration

## 🔒 Security

- Magic link authentication (no passwords)
- Veriff bank-level ID verification
- Row Level Security (RLS) on all tables
- Service role client for webhook operations
- Environment variable validation
- Structured logging

## 📝 License

Private - All Rights Reserved
