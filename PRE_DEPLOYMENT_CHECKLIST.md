# Pre-Deployment Checklist - Email System

✅ **Build Status:** Passing (verified)

---

## 🔍 Code Verification Complete

### ✅ API Route (`app/api/employees/invite/route.ts`)
- **Line 99:** Uses `admin.auth.admin.inviteUserByEmail()` ✅
- **Line 96:** Redirect URL: `${process.env.NEXT_PUBLIC_BASE_URL}/employee-verification` ✅
- **Line 102-107:** Passes `name`, `role`, `company_id`, `company_name` to email template ✅
- **Line 108:** Uses `redirectTo` parameter correctly ✅
- **Logging:** Console logs for debugging enabled ✅

### ✅ Employee Verification Page (`app/employee-verification/page.tsx`)
- **Route:** `/employee-verification` exists ✅
- **Suspense:** Wrapped for `useSearchParams` ✅
- **UI:** Shows "You've been invited!" message ✅
- **Button:** "Start Verification" button present (placeholder) ✅

### ✅ Employer Dashboard (`app/employer/dashboard/page.tsx`)
- **Line 159:** Calls `/api/employees/invite` for single invites ✅
- **Line 219:** Calls `/api/employees/invite` for CSV bulk invites ✅
- **Company ID:** Passed from `localStorage.getItem('companyId')` ✅
- **UI:** "Add Employee" modal with single and CSV options ✅

---

## 📋 Pre-Deployment Steps

### Step 1: Install Email Template in Supabase
**Status:** ⏳ **YOU NEED TO DO THIS**

1. Open `QUICK_EMAIL_SETUP.md`
2. Follow the 5-step guide (2 minutes)
3. Copy HTML template into Supabase Dashboard
4. Update subject line
5. Save

**Why:** Email template can only be updated manually in Supabase Dashboard

---

### Step 2: Verify Railway Environment Variables
**Status:** ✅ **Should be set** (verify in Railway Dashboard)

Go to: Railway Dashboard → Your Service → Variables

**Required variables:**
```bash
NEXT_PUBLIC_BASE_URL=https://www.getwild-now.com
NEXT_PUBLIC_SUPABASE_URL=https://rqmjnenmeixvpwyzwyjw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**Critical:** `NEXT_PUBLIC_BASE_URL` must be the production URL!

---

### Step 3: Verify Brevo SMTP in Supabase
**Status:** ✅ **Already configured and working**

Supabase Dashboard → Authentication → Emails → SMTP Settings:
```
Enable Custom SMTP: ON ✅
Host: smtp-relay.brevo.com ✅
Port: 587 ✅
Username: 9b332d001@smtp-brevo.com ✅
Password: [Your Brevo SMTP Key] ✅
Sender email: team@getwild-now.com ✅
Sender name: Get wild Team ✅
```

---

### Step 4: Push to Git and Deploy
**Status:** ⏳ **Ready to push**

```bash
# All code is already committed
# Just redeploy on Railway
```

Go to Railway Dashboard → Your Service → Deployments → **Redeploy**

---

## 🧪 Testing Flow

### After Deployment, Test This Flow:

1. **Go to employer dashboard:**
   ```
   https://www.getwild-now.com/employer/dashboard
   ```

2. **Click "Add Employee"**

3. **Enter test employee:**
   - Name: Test User
   - Role: Employee
   - Email: your-email@gmail.com

4. **Click "Send invite link"**

5. **Check Railway logs:**
   ```
   [Invite] Sending invitation to your-email@gmail.com with redirect: https://www.getwild-now.com/employee-verification
   [Invite] Successfully sent invitation to your-email@gmail.com
   ```

6. **Check your email inbox:**
   - ✅ Email arrives (check spam if not in inbox)
   - ✅ Email looks beautiful and branded
   - ✅ Shows company name
   - ✅ "Start Verification" button is visible

7. **Click "Start Verification" button:**
   - ✅ Redirects to: `https://www.getwild-now.com/employee-verification`
   - ✅ Page loads with "You've been invited!" message
   - ✅ Shows company info

8. **Check Brevo logs:**
   - Go to: https://app.brevo.com → Transactional → Logs
   - ✅ Email shows as "delivered"

---

## ✅ What's Working

### Code Level
- ✅ API uses correct Supabase method: `inviteUserByEmail()`
- ✅ Redirect URL configured: `/employee-verification`
- ✅ Company name passed to email template
- ✅ Employee data (name, role, email) passed correctly
- ✅ Error handling and logging implemented
- ✅ Re-invite logic for existing users
- ✅ CSV bulk upload supported
- ✅ Single employee invite supported

### Infrastructure Level
- ✅ Brevo SMTP configured and tested
- ✅ Sender email verified: `team@getwild-now.com`
- ✅ Domain authenticated: `getwild-now.com`
- ✅ Rate limits: 300 emails/day (Brevo free tier)
- ✅ Build passing (no TypeScript errors)

### UI Level
- ✅ Employer dashboard has "Add Employee" button
- ✅ Modal supports single and CSV invites
- ✅ Success/failure messages displayed
- ✅ Employee verification page exists and styled

---

## ⏳ What You Need to Do

### 1. Install Email Template (2 minutes)
**File:** `QUICK_EMAIL_SETUP.md`

Steps:
1. Open Supabase Dashboard
2. Go to Authentication → Email Templates → Invite user
3. Copy HTML from `QUICK_EMAIL_SETUP.md`
4. Paste into Supabase
5. Update subject line
6. Save

### 2. Verify Railway Environment Variables (1 minute)
Check that `NEXT_PUBLIC_BASE_URL=https://www.getwild-now.com`

### 3. Redeploy on Railway (1 minute)
Click "Redeploy" in Railway Dashboard

### 4. Test the Full Flow (2 minutes)
Follow the testing flow above

---

## 🎯 Expected Email Flow

```
Employer Dashboard
    ↓
Click "Add Employee"
    ↓
Enter employee details
    ↓
Click "Send invite link"
    ↓
API: /api/employees/invite
    ↓
Supabase: admin.auth.admin.inviteUserByEmail()
    ↓
Brevo SMTP: Sends email
    ↓
Employee receives beautiful branded email
    ↓
Employee clicks "Start Verification" button
    ↓
Redirects to: /employee-verification
    ↓
Employee sees "You've been invited!" page
    ↓
(Future: Employee completes verification flow)
```

---

## 📊 Email Template Variables

The email template uses these Supabase variables:

| Variable | Source | Example |
|----------|--------|---------|
| `{{ .Data.company_name }}` | API line 106 | "Acme Corp" |
| `{{ .Data.name }}` | API line 103 | "John Doe" |
| `{{ .Data.role }}` | API line 104 | "Software Engineer" |
| `{{ .ConfirmationURL }}` | Supabase auto-generated | `https://www.getwild-now.com/employee-verification?token=...` |

---

## 🚨 Troubleshooting

### If emails don't arrive:
1. Check Railway logs for `[Invite]` messages
2. Check Brevo logs: https://app.brevo.com → Transactional → Logs
3. Check spam folder
4. Verify `NEXT_PUBLIC_BASE_URL` in Railway
5. See `EMAIL_TROUBLESHOOTING.md`

### If redirect doesn't work:
1. Verify `NEXT_PUBLIC_BASE_URL` is correct in Railway
2. Check Railway logs for the actual redirect URL
3. Redeploy if you changed environment variables

### If template looks broken:
1. Make sure you copied the ENTIRE HTML from `QUICK_EMAIL_SETUP.md`
2. Check Supabase Auth Logs for template errors
3. Re-copy and paste the template

---

## 📞 Support Files

- **Quick Setup:** `QUICK_EMAIL_SETUP.md`
- **Troubleshooting:** `EMAIL_TROUBLESHOOTING.md`
- **Complete Guide:** `SUPABASE_EMAIL_SETUP.md`
- **Documentation Index:** `EMAIL_SETUP_README.md`

---

## ✅ Final Checklist

Before going live:

- [ ] Email template installed in Supabase
- [ ] Subject line updated in Supabase
- [ ] Railway environment variables verified
- [ ] Redeployed on Railway
- [ ] Test email sent successfully
- [ ] Email looks good and branded
- [ ] Button redirects correctly
- [ ] No errors in Railway logs
- [ ] No errors in Brevo logs
- [ ] No errors in Supabase Auth logs

---

**Status:** Ready to deploy after installing email template in Supabase! 🚀

**Last Updated:** November 9, 2025

