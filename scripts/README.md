# Magic Link Creation Script

## 📧 How to Create a Test Magic Link

### Quick Start

```bash
# Install dependencies (if needed)
npm install

# Create a magic link
npm run create-magic-link test@example.com
```

### What Happens

1. Script creates a Supabase user with the provided email
2. Generates a secure magic link
3. Displays the link for you to send to the employee

### Example Output

```
✅ Magic link created successfully!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📧 Send this link to the employee:

https://your-project.supabase.co/auth/v1/verify?token=...&type=magiclink&redirect_to=...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚀 When they click the link:
   1. They will be authenticated
   2. Redirected to Veriff for ID verification
   3. After Veriff → ChatGPT conversation
   4. After chat → Dashboard
```

### Employee Journey After Clicking

```
Magic Link Click
    ↓
Authenticated Automatically
    ↓
/onboard/verify → Veriff ID Verification
    ↓
Upload ID + Selfie
    ↓
Veriff Webhook → Stores Identity Data
    ↓
/onboard/chat → ChatGPT Conversation
    ↓
AI Collects Remaining Data
    ↓
/dashboard → Complete!
```

### Requirements

- `.env.local` file with:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `NEXT_PUBLIC_APP_URL` (optional, defaults to production URL)

### Troubleshooting

**Error: Missing Supabase credentials**
- Make sure `.env.local` exists and contains the required variables
- Check `ENV_EXAMPLE.txt` for the correct format

**Error: Invalid email**
- Provide a valid email address as the first argument
- Example: `npm run create-magic-link user@company.com`

### Production Use

For production, you would typically:
1. Create an admin panel for generating magic links
2. Integrate with your email service (SendGrid, Mailgun, etc.)
3. Store invitations in the database
4. Track who has completed onboarding

This script is for **testing purposes only**.

