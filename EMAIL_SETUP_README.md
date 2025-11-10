# Email Setup Documentation

This directory contains comprehensive documentation for setting up and troubleshooting email delivery for Get Wild.

---

## 📚 Documentation Files

### 🚀 Quick Start (Start Here!)

**[QUICK_EMAIL_SETUP.md](./QUICK_EMAIL_SETUP.md)**
- **Time:** 2 minutes
- **Purpose:** Copy-paste the email template into Supabase
- **Use this if:** You want to install the beautiful employee invitation email template right now

---

### 📖 Complete Guide

**[SUPABASE_EMAIL_SETUP.md](./SUPABASE_EMAIL_SETUP.md)**
- **Time:** 10 minutes
- **Purpose:** Comprehensive email template setup with explanations
- **Use this if:** You want to understand how everything works
- **Includes:**
  - Email template HTML with explanations
  - Environment variable configuration
  - SMTP setup guides (Gmail, SendGrid, AWS SES)
  - Production checklist

---

### 🔧 Troubleshooting

**[EMAIL_TROUBLESHOOTING.md](./EMAIL_TROUBLESHOOTING.md)**
- **Purpose:** Debug email delivery issues
- **Use this if:** Emails aren't being sent or delivered
- **Includes:**
  - Common issues and fixes
  - Rate limiting solutions
  - SMTP configuration help
  - Brevo-specific troubleshooting
  - Log checking guides

---

### 📝 Plain Text Template

**[EMAIL_TEMPLATE_PLAIN_TEXT.txt](./EMAIL_TEMPLATE_PLAIN_TEXT.txt)**
- **Purpose:** Plain text fallback for email clients that don't support HTML
- **Use this if:** You need a text-only version of the email

---

## ✅ Current Status

### What's Working
- ✅ Brevo SMTP configured and sending emails
- ✅ Email template HTML created and ready to use
- ✅ Redirect URL configured to `/employee-verification`
- ✅ Sender email verified: `team@getwild-now.com`
- ✅ Domain authenticated: `getwild-now.com`
- ✅ Rate limits: 300 emails/day (Brevo free tier)

### What You Need to Do
- [ ] Copy email template into Supabase Dashboard (see `QUICK_EMAIL_SETUP.md`)
- [ ] Test by sending an invite from employer dashboard
- [ ] Verify email looks good and button works

---

## 🎯 Quick Reference

### Email Flow
1. Employer sends invite from dashboard
2. API calls Supabase `inviteUserByEmail()`
3. Supabase sends email via Brevo SMTP
4. Employee receives beautiful branded email
5. Employee clicks "Start Verification" button
6. Redirects to: `https://www.getwild-now.com/employee-verification`

### Key Configuration
- **SMTP Provider:** Brevo
- **SMTP Host:** `smtp-relay.brevo.com`
- **SMTP Port:** `587`
- **Sender:** `team@getwild-now.com`
- **Redirect URL:** `https://www.getwild-now.com/employee-verification`

### Important Variables
- `NEXT_PUBLIC_BASE_URL` - Set in Railway environment variables
- `{{ .Data.company_name }}` - Dynamic company name in email
- `{{ .ConfirmationURL }}` - Invite link with token

---

## 📞 Need Help?

1. **Email not sending?** → Check `EMAIL_TROUBLESHOOTING.md`
2. **Template not working?** → Check `QUICK_EMAIL_SETUP.md`
3. **Want to customize?** → Check `SUPABASE_EMAIL_SETUP.md`

---

## 🔗 Related Files

### Code Files
- `app/api/employees/invite/route.ts` - API that sends invites
- `app/employee-verification/page.tsx` - Landing page after clicking email link
- `lib/supabase/admin.ts` - Supabase admin client

### Environment Files
- `.env.local` - Local development environment variables
- Railway Dashboard - Production environment variables

---

**Last Updated:** November 9, 2025

