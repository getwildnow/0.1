# Email Troubleshooting Guide

> **✅ CURRENT STATUS: Brevo SMTP Working**
> 
> Emails are successfully being sent via Brevo SMTP.
> If you need to install the email template, see `QUICK_EMAIL_SETUP.md`.

---

## Quick Diagnostics

### 1. Check Railway Environment Variables

**Go to Railway Dashboard → Your Service → Variables**

Ensure these are set:
```
NEXT_PUBLIC_BASE_URL=https://www.getwild-now.com
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**Important:** After changing environment variables, you MUST redeploy!

---

### 2. Check Supabase Email Settings

**Go to Supabase Dashboard → Authentication → Email Templates**

✅ **Invite user** template should be customized (see `SUPABASE_EMAIL_SETUP.md`)
✅ Subject line should be: "You've been invited to Get Wild! 🎉"
✅ Template should include company name variable: `{{ .Data.company_name }}`

---

### 3. Check Supabase Auth Logs

**Go to Supabase Dashboard → Authentication → Logs**

Look for:
- ✅ "Invite email sent" - Email was sent successfully
- ❌ "Rate limit exceeded" - Too many emails sent (see solution below)
- ❌ "SMTP error" - Email server issue (see solution below)

---

### 4. Check Railway Logs

**Go to Railway Dashboard → Your Service → Deployments → View Logs**

Search for:
```
[Invite] Sending invitation to
[Invite] Successfully sent invitation to
[Invite] Auth error for
```

This will show you exactly what's happening when you try to send invites.

---

## Common Issues & Solutions

### Issue 1: "Rate limit exceeded"

**Cause:** Supabase free tier limits emails to 3 per hour

**Solutions:**
1. **Wait 1 hour** between batches of invites
2. **Upgrade to Supabase Pro** ($25/month) for unlimited emails
3. **Configure custom SMTP** (see below)

---

### Issue 2: Emails going to spam

**Cause:** Default Supabase SMTP has low reputation

**Solutions:**
1. **Check spam folder** - emails might be there
2. **Configure custom SMTP** with your own domain (see below)
3. **Add SPF/DKIM records** to your domain

**Quick fix:** Tell employees to check spam and mark as "Not Spam"

---

### Issue 3: Wrong redirect URL

**Cause:** `NEXT_PUBLIC_BASE_URL` is set to `localhost`

**Solution:**
1. Go to Railway → Variables
2. Update: `NEXT_PUBLIC_BASE_URL=https://www.getwild-now.com`
3. **Redeploy!**

---

### Issue 4: Email template looks bad

**Cause:** Default Supabase template is plain text

**Solution:** Follow `SUPABASE_EMAIL_SETUP.md` to install the custom HTML template

---

### Issue 5: No emails being sent at all

**Diagnostic steps:**

1. **Check Railway logs** for `[Invite]` messages
2. **Check Supabase Auth logs** for email events
3. **Verify environment variables** are set correctly
4. **Test with a Gmail address** (most reliable for testing)
5. **Check Supabase project status** (not paused/suspended)

---

## Configure Custom SMTP (Recommended for Production)

### Why use custom SMTP?
- ✅ No rate limits
- ✅ Better deliverability
- ✅ Professional sender address
- ✅ Emails won't go to spam

### Option 1: Gmail (Free, Easy)

**Go to Supabase Dashboard → Project Settings → Auth → SMTP Settings**

Enable **Custom SMTP** and configure:

```
Host: smtp.gmail.com
Port: 587
Username: your-email@gmail.com
Password: [App Password - see below]
Sender email: your-email@gmail.com
Sender name: Get Wild
```

**To get Gmail App Password:**
1. Go to https://myaccount.google.com/security
2. Enable 2-Step Verification
3. Go to "App passwords"
4. Generate password for "Mail"
5. Copy the 16-character password

---

### Option 2: SendGrid (Professional, Scalable)

**Free tier: 100 emails/day**

1. Sign up at https://sendgrid.com
2. Create an API key
3. Verify your sender email
4. Configure in Supabase:

```
Host: smtp.sendgrid.net
Port: 587
Username: apikey
Password: [Your SendGrid API Key]
Sender email: noreply@getwild-now.com
Sender name: Get Wild
```

---

### Option 3: AWS SES (Most Scalable)

**Cost: $0.10 per 1,000 emails**

1. Sign up for AWS
2. Set up AWS SES
3. Verify your domain
4. Get SMTP credentials
5. Configure in Supabase

---

## Testing Checklist

After making changes, test with this checklist:

- [ ] Environment variables updated in Railway
- [ ] Redeployed on Railway
- [ ] Email template updated in Supabase
- [ ] Send test invite to Gmail address
- [ ] Check Railway logs for `[Invite]` messages
- [ ] Check Supabase Auth logs for email events
- [ ] Email received (check spam folder)
- [ ] Email looks good (HTML formatting)
- [ ] Button works and redirects to `/employee-verification`
- [ ] Company name appears correctly in email

---

## Still Having Issues?

### Debug Mode

1. **Check Railway logs** in real-time:
   - Go to Railway Dashboard → Your Service → Deployments
   - Click "View Logs"
   - Send an invite
   - Watch for `[Invite]` messages

2. **Check Supabase Auth logs**:
   - Go to Supabase Dashboard → Authentication → Logs
   - Filter by "email"
   - Look for errors

3. **Test the API directly**:
   ```bash
   curl -X POST https://www.getwild-now.com/api/employees/invite \
     -H "Content-Type: application/json" \
     -d '{
       "employees": [{"name": "Test User", "role": "Employee", "email": "test@example.com"}],
       "companyId": "your-company-id"
     }'
   ```

---

## Contact Support

If nothing works:

1. **Supabase Support:** https://supabase.com/dashboard/support
2. **Railway Support:** https://railway.app/help
3. **Check Supabase Status:** https://status.supabase.com

---

## Quick Reference

| Issue | Quick Fix |
|-------|-----------|
| Rate limit | Wait 1 hour or upgrade plan |
| Spam folder | Check spam, mark as not spam |
| Wrong URL | Update `NEXT_PUBLIC_BASE_URL` in Railway |
| Bad template | Follow `SUPABASE_EMAIL_SETUP.md` |
| No emails | Check Railway logs, verify env vars |
| SMTP error | Configure custom SMTP |

---

**Last updated:** 2025-11-10

