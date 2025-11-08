<!-- 92ce8f32-fff1-4b8c-b3d3-b6de887237e5 1de0b017-63e8-4348-90e4-25c224450875 -->
# Ultra-Simple AI Onboarding System

## User Flow (Only 2 Steps!)

1. **Magic Link → Stripe Identity** - Employee clicks link → Stripe verification → Extract all data
2. **AI Conversation** - Everything happens here:

   - AI uses ALL Stripe data (never asks for it)
   - Consent (first thing in chat)
   - Collects data from markdown list
   - All integrations (via buttons)
   - Complete → Dashboard

**No password setup** - Authentication handled by magic link/Supabase Auth

## Data Storage (All in Supabase)

### Supabase Tables

**All data stored in Supabase:**

- `user_profiles` - Complete Stripe Identity data
- `onboarding_config` - Admin's markdown list (data_points, integrations, actions)
- `onboarding_conversations` - Conversation state and progress
- `user_onboarding_data` - All collected answers (health, lifestyle, etc.)
- `user_integrations` - Connected OAuth integrations
- `chat_messages` - Full conversation history
- `consents` - Consent records

**Everything persists in Supabase database.**

## Magic Link Flow

1. Employee receives magic link (email/SMS)
2. Clicks link → `/onboard/[token]`
3. Verify token → Create/authenticate user in Supabase
4. Redirect to Stripe Identity verification
5. Stripe processes → Webhook saves data to Supabase
6. Redirect to `/onboard/chat`
7. AI conversation begins

## Technical Implementation

### Authentication Flow

```typescript
// /onboard/[token]/page.tsx
1. Verify magic link token
2. Create/authenticate user with Supabase Auth
3. Create Stripe Identity session
4. Redirect to Stripe
5. After Stripe → Redirect to chat
```

### Data Storage Flow

```typescript
// Stripe Webhook → Save to Supabase
1. Webhook receives verification
2. Extract all Stripe data
3. Save to user_profiles table
4. Update onboarding_conversations status

// AI Chat → Save to Supabase
1. User answers question
2. AI extracts data
3. Save to user_onboarding_data table
4. Update conversation state

// OAuth → Save to Supabase
1. User connects integration
2. Save token to user_integrations table
3. Update conversation state
```

## Database Schema (Supabase)

```sql
-- User profiles (Stripe data)
user_profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id),
  stripe_verification_session_id TEXT,
  verification_status TEXT,
  first_name TEXT,
  last_name TEXT,
  dob DATE,
  gender TEXT,
  email TEXT,
  phone TEXT,
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  country TEXT,
  id_number TEXT,
  document_type TEXT,
  stripe_data JSONB,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ
)

-- Onboarding config (admin's markdown list)
onboarding_config (
  id UUID PRIMARY KEY,
  data_points TEXT[],
  integrations TEXT[],
  actions TEXT[],
  consent_text TEXT,
  updated_at TIMESTAMPTZ
)

-- Conversation state
onboarding_conversations (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id),
  stripe_verified BOOLEAN,
  stripe_data JSONB,
  consent_agreed BOOLEAN,
  data_points_collected TEXT[],
  integrations_connected TEXT[],
  status TEXT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
)

-- Collected answers
user_onboarding_data (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  data_point TEXT,
  value JSONB,
  extracted_at TIMESTAMPTZ
)

-- Connected integrations
user_integrations (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  integration_name TEXT,
  oauth_token TEXT,
  connected_at TIMESTAMPTZ
)

-- Chat messages
chat_messages (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  role TEXT,
  type TEXT,
  content TEXT,
  metadata JSONB,
  timestamp TIMESTAMPTZ
)

-- Consents
consents (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  consent_type TEXT,
  agreed_at TIMESTAMPTZ
)
```

## Complete Flow

1. **Magic Link** → `/onboard/[token]`

   - Verify token
   - Authenticate with Supabase
   - Create Stripe session
   - Redirect to Stripe

2. **Stripe Identity** → Stripe hosted page

   - User uploads ID + selfie
   - Stripe processes
   - Webhook fires → Save to Supabase

3. **AI Chat** → `/onboard/chat`

   - Load Stripe data from Supabase
   - Load config from Supabase
   - Show consent
   - Ask questions (save to Supabase)
   - Show integrations (save to Supabase)
   - Complete → Dashboard

4. **Dashboard** → `/dashboard`

   - Same chat interface
   - All data from Supabase

## Key Points

✅ **Everything in Supabase** - All data persisted

✅ **No Password** - Magic link authentication

✅ **Simple Flow** - Magic link → Stripe → Chat → Done

✅ **Admin Config** - Markdown list stored in Supabase

✅ **Real-time** - Supabase real-time for chat updates

### To-dos

- [ ] Initialize Next.js 14 project with TypeScript and Tailwind
- [ ] Set up Supabase project and create all tables with RLS policies
- [ ] Set up Stripe Identity product and configure webhooks
- [ ] Build magic link verification page that creates Stripe session
- [ ] Build API endpoint to create Stripe Identity verification session
- [ ] Build webhook handler to extract and save ALL Stripe Identity data to Supabase
- [ ] Build return page after Stripe verification that redirects to chat
- [ ] Build admin page with markdown editor and complete default list
- [ ] Build parser to separate data_points, integrations, and actions from markdown
- [ ] Create API to save/load config from Supabase
- [ ] Build AI engine that reads config from Supabase and handles questions/integrations
- [ ] Build chat interface that loads data from Supabase and handles all interactions
- [ ] Build all message type components (consent, question, button, choice)
- [ ] Build functions to save all data to Supabase (answers, integrations, consents)
- [ ] Integrate OAuth buttons in chat with callback handling and Supabase storage
- [ ] Build dashboard with same chat interface, loads from Supabase