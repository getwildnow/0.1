# 🔧 Fix Employee Landing on Login Page Instead of Dashboard

## 🔴 Problem
Employees click invite link → Land on `/employee/login` (password page) instead of `/employee/dashboard`

## ✅ Root Cause
Supabase URL configuration is redirecting to wrong page OR token is not being processed.

---

## 🛠️ Fix in Supabase Dashboard

### **1. Check Site URL**
Go to: https://supabase.com/dashboard/project/rqmjnenmeixvpwyzwyjw/auth/url-configuration

**Site URL must be:**
```
https://www.getwild-now.com
```

**NOT:**
- ❌ `http://localhost:3000`
- ❌ `https://getwild-now.com` (without www)
- ❌ `https://www.getwild-now.com/` (with trailing slash)

---

### **2. Add Redirect URLs**
In the same page, add these to **Redirect URLs**:

```
https://www.getwild-now.com/**
https://www.getwild-now.com/employee/dashboard
https://www.getwild-now.com/employee/**
```

Click **Save** after adding each one!

---

### **3. Verify Email Template**
Go to: https://supabase.com/dashboard/project/rqmjnenmeixvpwyzwyjw/auth/templates

Click **"Invite user"** and verify line 52 has:
```html
{{ .ConfirmationURL }}
```
✅ This is already correct!

---

## 🧪 Test After Fixing

1. **Send new invite** from employer dashboard
2. **Check the email** - click the link
3. **Should land on:** `https://www.getwild-now.com/employee/dashboard#access_token=...`
4. **Should see:** "Verifying..." then dashboard
5. **Should NOT see:** Login page with password

---

## 🔍 Debug if Still Not Working

### Check the actual URL in the email:

Open the invite email → Right-click the button → Copy link address

**It should look like:**
```
https://www.getwild-now.com/employee/dashboard#access_token=eyJhbG...&refresh_token=...&type=invite
```

**If it looks like:**
```
http://localhost:3000/employee/dashboard#...
```
→ Site URL is wrong in Supabase!

---

## ✅ Summary Checklist

- [ ] Site URL = `https://www.getwild-now.com` (no trailing slash)
- [ ] Redirect URLs include `/employee/dashboard`
- [ ] Email template uses `{{ .ConfirmationURL }}`
- [ ] Test with fresh invite
- [ ] Verify email link goes to correct URL
- [ ] Should land on dashboard, not login page

---

**Fix these 3 settings in Supabase and it will work!** 🚀

