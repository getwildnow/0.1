# 🔥 DEBUG: Emails Not Sending

## 🔍 Quick Checks

### 1. Check Railway Logs
Go to Railway → Your app → Logs

When you click "Send invite link", you should see:
```
[Invite] Sending invitation to pytrobusiness@gmail.com
[Invite] Creating user with metadata: { name: 'Konstantin', ... }
[Invite] User created/invited. User ID: xxx
[Invite] User metadata saved: { name: 'Konstantin', ... }
```

**If you DON'T see these logs** → Frontend not calling the API  
**If you see these logs** → API called successfully, issue is with Supabase email sending

---

### 2. Check Supabase SMTP Configuration

Go to: https://supabase.com/dashboard/project/rqmjnenmeixvpwyzwyjw/settings/auth

Scroll to **SMTP Settings** and verify:

```
Enable Custom SMTP: ✅ ON
SMTP Host: smtp-relay.brevo.com
SMTP Port: 587
SMTP User: team@getwild-now.com
SMTP Password: [your Brevo SMTP password]
Sender email: team@getwild-now.com
Sender name: Get Wild
```

---

### 3. Check Brevo Sender Verification

Go to: https://app.brevo.com/settings/senders

**Verify:**
- ✅ `team@getwild-now.com` is listed
- ✅ Status is **"Verified"** (green checkmark)

If not verified:
1. Click "Verify"
2. Check email for verification link
3. Click to verify sender

---

### 4. Check Supabase Auth Logs

Go to: https://supabase.com/dashboard/project/rqmjnenmeixvpwyzwyjw/logs/auth-logs

Look for recent events:
- **user_invited** events
- **Error messages** in the logs

Common errors:
- "SMTP connection failed" → Wrong SMTP credentials
- "Sender not verified" → Verify sender in Brevo
- "Invalid from address" → Wrong sender email

---

## 🚨 Common Issues

### Issue 1: Wrong SMTP Username
**Brevo SMTP username is NOT your email!**

Check in Brevo Dashboard → SMTP & API → SMTP Settings

The username looks like: `team@getwild-now.com` or a special SMTP login

### Issue 2: Wrong SMTP Password
The password is NOT your Brevo account password!

It's the **SMTP key** from: Brevo → SMTP & API → SMTP Settings → Create SMTP Key

### Issue 3: Port Blocked
Some networks block port 587.

Try port **465** (SSL) instead:
```
SMTP Port: 465
```

---

## ✅ Quick Test

### Test Supabase Email Sending

Go to: https://supabase.com/dashboard/project/rqmjnenmeixvpwyzwyjw/auth/users

1. Click "Invite user"
2. Enter your email
3. Click "Send invitation"

**If this works** → Your invite API has an issue  
**If this fails** → SMTP configuration is wrong

---

## 🔧 Step-by-Step Fix

1. **Verify Brevo sender email** (if not already done)
2. **Get SMTP credentials** from Brevo dashboard
3. **Update Supabase SMTP settings** with correct credentials
4. **Test email** from Supabase users page
5. **Test invite** from your employer dashboard

---

## 📝 Brevo SMTP Settings Location

Go to: https://app.brevo.com/settings/keys/smtp

You should see:
```
SMTP Server: smtp-relay.brevo.com
Port: 587
Login: team@getwild-now.com (or different)
SMTP Key: [long password string]
```

Copy these EXACT values to Supabase!

---

**Check these and let me know what you find!** 🔍

