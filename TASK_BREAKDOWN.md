# Comprehensive Task Breakdown - Employee Onboarding System v2

## Database Schema Design & Migrations

### Tasks:
1. **Design complete database schema**
   - `user_profiles` table (TEXT user_id, Veriff data fields, JSONB veriff_data)
   - `onboarding_config` table (data_points array, integrations, actions, consent_text)
   - `onboarding_conversations` table (user_id, veriff_verified, veriff_data, status)
   - `user_onboarding_data` table (user_id, data_point, value JSONB)
   - `user_integrations` table (user_id, integration_name, tokens)
   - `chat_messages` table (user_id, role, type, content, metadata)
   - `consents` table (user_id, consent_type, agreed_at)

2. **Create RLS policies**
   - Config table: Anyone can read/write (for admin panel)
   - User tables: Users can only access their own data (by user_id matching auth.uid() or sessionId)
   - Service role bypasses RLS (for webhooks)

3. **Write single SQL migration script**
   - Combine all table creation and RLS policies into one file
   - Ensure user_id is TEXT (not UUID)
   - No foreign keys to auth.users
   - Proper indexes for performance

## API Endpoint Implementation

### Tasks:
1. **Authentication & Callback**
   - `/auth/callback` - Handle Supabase magic link callback
     - Exchange auth code for session
     - Create user profile record
     - Redirect to `/onboard/verify`

2. **Veriff Integration**
   - `/api/identity/create-session` - Create Veriff session
     - Generate unique sessionId
     - Call Veriff API with callbackUrl, vendorData
     - Store sessionId in user_profiles
     - Return Veriff session URL
   - `/api/webhooks/veriff` - Handle Veriff webhooks
     - Verify webhook signature (HMAC SHA256)
     - Extract sessionId from vendorData or database lookup
     - Extract all person data (name, DOB, address, email, phone, etc.)
     - Update user_profiles table
     - Update onboarding_conversations.veriff_verified = true
     - Use service role client (bypasses RLS)

3. **Verification Status**
   - `/api/verify-status` - Check verification status
     - Accept sessionId as query param
     - Query user_profiles for verification_status
     - Use service role client (bypasses RLS)
     - Return { verified: boolean, status: string }

4. **AI Chat**
   - `/api/onboarding/chat` - Main chat endpoint
     - GET: Load chat history for sessionId
     - POST: Process user message
     - Load Veriff data from user_profiles
     - Load admin config from onboarding_config
     - Generate AI response using GPT-4
     - System prompt includes Veriff data (AI never asks for it)
     - Extract answers and store in user_onboarding_data
     - Save messages to chat_messages
     - Return AI response

5. **Admin Panel**
   - `/admin/data-points` - Admin interface
     - GET: Load current config from onboarding_config
     - POST: Save config (data_points array)
   - `/api/config` - Config API endpoint
     - GET: Return current config
     - POST: Update config

6. **Health Check**
   - `/api/health` - Health check endpoint
     - Return { status: 'ok', timestamp: string }

## Frontend Component Structure

### Tasks:
1. **Root Layout**
   - `app/layout.tsx` - Root layout with ErrorBoundary wrapper
   - Include global styles
   - Metadata configuration

2. **Homepage**
   - `app/page.tsx` - Simple redirect to `/onboard/verify` or welcome message

3. **Authentication Flow**
   - `app/auth/callback/page.tsx` - Magic link callback handler
     - Exchange code for session
     - Redirect to `/onboard/verify`

4. **Verification Page**
   - `app/onboard/verify/page.tsx` - Veriff verification initiation
     - Call `/api/identity/create-session`
     - Store sessionId in localStorage
     - Redirect to Veriff URL

5. **Chat Page**
   - `app/onboard/chat/page.tsx` - Chat interface page
     - Poll `/api/verify-status` until verified
     - Show loading state during polling
     - Load ChatInterface component after verification

6. **Chat Components**
   - `components/chat/ChatInterface.tsx` - Main chat UI
     - Display messages
     - Handle user input
     - Send messages to `/api/onboarding/chat`
     - Show typing indicators
   - `components/chat/Message.tsx` - Individual message component
     - Render text, consent, question types
   - `components/chat/ConsentGate.tsx` - Consent handling (if needed)

7. **Admin Components**
   - `app/admin/data-points/page.tsx` - Admin interface
     - Textarea for markdown list
     - Save button
     - Load current config on mount

8. **Error Handling**
   - `components/ErrorBoundary.tsx` - React error boundary
     - Catch and display errors gracefully

## Integration Points

### Tasks:
1. **Supabase Integration**
   - `lib/supabase/client.ts` - Client-side client
     - Use NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
   - `lib/supabase/server.ts` - Server-side client
     - Use cookies for session management
     - Compatible with @supabase/ssr
   - `lib/supabase/service.ts` - Service role client
     - Use SUPABASE_SERVICE_ROLE_KEY
     - Bypasses RLS

2. **Veriff Integration**
   - `lib/veriff.ts` - Veriff API client
     - X-AUTH-CLIENT header (not Authorization)
     - createSession method with correct payload structure
     - getVerification method
     - verifyWebhookSignature method (HMAC SHA256)
     - Don't send empty person object

3. **OpenAI Integration**
   - `lib/openai.ts` - OpenAI client initialization
   - `lib/ai/conversation.ts` - GPT-4 conversation logic
     - System prompt includes Veriff data
     - Extract answers from user responses
     - Track conversation state

## Production Utilities

### Tasks:
1. **Environment Variables**
   - `lib/env.ts` - Environment variable validation
     - Validate all required vars on import
     - Type-safe access
     - Server-side only

2. **Logging**
   - `lib/logger.ts` - Structured logging
     - Log levels (info, warn, error, debug)
     - Structured format
     - Service call tracking

3. **Configuration**
   - `next.config.js` - Next.js configuration
   - `tsconfig.json` - TypeScript configuration
   - `tailwind.config.ts` - Tailwind CSS configuration
   - `postcss.config.mjs` - PostCSS configuration

## Deployment Configuration

### Tasks:
1. **Package Configuration**
   - `package.json` - Dependencies and scripts
     - Next.js, React, Supabase, OpenAI, Veriff SDK
     - Build and start scripts

2. **Git Configuration**
   - `.gitignore` - Ignore node_modules, .env.local, etc.
   - Create branch `v2-employee-auth`

3. **Railway Configuration**
   - Environment variables setup
   - Build command: `npm run build`
   - Start command: `npm start`
   - Set RAILWAY_EXTERNAL_URL

4. **External Service Configuration**
   - Supabase dashboard:
     - Site URL: Railway URL
     - Redirect URLs: Railway URL + /auth/callback
   - Veriff dashboard:
     - Webhook Events URL: Railway URL + /api/webhooks/veriff
     - Return URL: Railway URL + /onboard/chat

## Testing Checkpoints

### Tasks:
1. **Unit Testing**
   - Test Veriff client methods
   - Test OpenAI conversation logic
   - Test Supabase queries

2. **Integration Testing**
   - Test magic link flow
   - Test Veriff webhook processing
   - Test chat API with Veriff data

3. **End-to-End Testing**
   - Complete flow: Magic link → Veriff → Chat
   - Verify all data stored correctly
   - Verify AI uses Veriff data (doesn't ask for it)
   - Verify admin panel works

4. **Production Testing**
   - Deploy to Railway
   - Test with real Veriff session
   - Monitor logs for errors
   - Verify webhooks work

## Implementation Order

1. **Phase 0**: Create this task breakdown ✓
2. **Phase 1**: Branch setup & environment verification
3. **Phase 2**: Database schema (SQL script)
4. **Phase 3**: Core utilities (env, logger, Supabase clients)
5. **Phase 4**: Veriff integration (client, API endpoints)
6. **Phase 5**: Magic link flow (callback route)
7. **Phase 6**: Verification page & webhook handler
8. **Phase 7**: Chat system (API, components, polling)
9. **Phase 8**: Admin panel
10. **Phase 9**: Error boundaries & production utilities
11. **Phase 10**: Railway deployment
12. **Phase 11**: End-to-end testing

