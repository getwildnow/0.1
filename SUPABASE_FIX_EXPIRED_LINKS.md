# 🔥 FIX: Fresh Invitation Links Showing as Expired

## Problem
Fresh invitation links immediately show:
```
#error=access_denied&error_code=otp_expired&error_description=Email+link+is+invalid+or+has+expired
```

## Root Cause
Supabase "Invite User" links expire too quickly OR Site URL/Redirect URLs are misconfigured.

---

## ✅ CRITICAL FIXES REQUIRED IN SUPABASE DASHBOARD

### 1. **Authentication > URL Configuration**

Go to: https://rqmjnenmeixvpwyzwyjw.supabase.co/project/rqmjnenmeixvpwyzwyjw/auth/url-configuration

#### Site URL:
```
https://www.getwild-now.com
```
**⚠️ IMPORTANT:** Must include `www.` and NO trailing slash!

#### Redirect URLs (Add these):
```
https://www.getwild-now.com/**
https://www.getwild-now.com/employee-verification
https://www.getwild-now.com/employee-verification/**
https://getwild-now.com/**
```

### 2. **Authentication > Email Templates > Invite User**

Go to: https://rqmjnenmeixvpwyzwyjw.supabase.co/project/rqmjnenmeixvpwyzwyjw/auth/templates

Click "Invite user" template and verify the button link uses:
```html
<a href="{{ .ConfirmationURL }}">Accept the invite</a>
```

**NOT:**
```html
<a href="{{ .SiteURL }}">...</a>
```

The `{{ .ConfirmationURL }}` automatically includes our `redirectTo` parameter.

### 3. **Authentication > Providers > Email**

Go to: https://rqmjnenmeixvpwyzwyjw.supabase.co/project/rqmjnenmeixvpwyzwyjw/auth/providers

Verify:
- ✅ **Email provider is enabled**
- ✅ **"Enable email confirmations"** is **DISABLED** (we don't want email verification)
- ✅ **"Secure email change"** is **ENABLED** (optional but recommended)

### 4. **Project Settings > API > JWT Settings**

Go to: https://rqmjnenmeixvpwyzwyjw.supabase.co/project/rqmjnenmeixvpwyzwyjw/settings/api

Verify **JWT expiry** is reasonable:
- Default: `3600` (1 hour)
- Recommended for testing: `86400` (24 hours)

---

## 🧪 How to Test After Fixing

1. **Clear ALL existing users** (optional but recommended for clean test):
   - Go to Authentication > Users
   - Delete test users

2. **Send fresh invite** from:
   ```
   https://www.getwild-now.com/employer/dashboard
   ```

3. **Click email link**
   - Should redirect to: `https://www.getwild-now.com/employee-verification`
   - Should show Veriff button (once Veriff SDK is fixed)
   - Should **NOT** show `otp_expired` error

4. **Check URL in browser**
   - Good: `https://www.getwild-now.com/employee-verification#access_token=...`
   - Bad: `https://www.getwild-now.com/employee-verification#error=access_denied&error_code=otp_expired`

---

## 🔍 Additional Debugging

If links still expire immediately:

### Check Supabase Logs
https://rqmjnenmeixvpwyzwyjw.supabase.co/project/rqmjnenmeixvpwyzwyjw/logs/explorer

Run this query:
```sql
SELECT 
  timestamp,
  event_message,
  metadata->>'email' as email,
  metadata->>'error' as error
FROM auth.audit_log_entries
WHERE event_type = 'user_invited'
ORDER BY created_at DESC
LIMIT 10;
```

### Check if invites are being created
```sql
SELECT 
  id,
  email,
  created_at,
  invited_at,
  confirmed_at
FROM auth.users
WHERE invited_at IS NOT NULL
ORDER BY created_at DESC
LIMIT 5;
```

---

## 📝 Summary Checklist

- [ ] Site URL set to `https://www.getwild-now.com`
- [ ] Redirect URLs include `/employee-verification`
- [ ] Email template uses `{{ .ConfirmationURL }}`
- [ ] Email confirmations are DISABLED
- [ ] JWT expiry is reasonable (24 hours for testing)
- [ ] Test with fresh invite
- [ ] Verify no `otp_expired` error
- [ ] Verify Veriff button appears

---

## 🚨 If Still Not Working

The issue might be with the **invite flow itself**. Consider switching to **Magic Links** instead:
- Magic links are more reliable
- Better expiry handling
- Easier to debug

Let me know if you want me to implement Magic Link auth instead of Invite User!

