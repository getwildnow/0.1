# Quick Email Template Setup (2 Minutes)

🎯 **Goal:** Install the beautiful employee invitation email template

---

## ✅ Prerequisites

- [x] Brevo SMTP is configured and working (emails are sending)
- [x] You have access to Supabase Dashboard
- [x] `NEXT_PUBLIC_BASE_URL=https://www.getwild-now.com` is set in Railway

---

## 📋 Step-by-Step Instructions

### Step 1: Open Supabase Email Templates

1. Go to: https://supabase.com/dashboard
2. Select your project: **Getwild**
3. Click **Authentication** (left sidebar)
4. Click **Email Templates** (under Configuration)
5. Select **"Invite user"** template

---

### Step 2: Copy the HTML Template

**Copy this entire HTML code:**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Get Wild</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f4f0;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f4f0;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
          
          <!-- Logo Section -->
          <tr>
            <td style="padding: 40px 40px 20px 40px; text-align: center;">
              <img src="https://www.figma.com/api/mcp/asset/6368c286-c151-422f-9597-9b0fdc19ea03" alt="Get wild." style="height: 36px; width: auto;" />
            </td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td style="padding: 20px 40px 40px 40px;">
              <h1 style="margin: 0 0 16px 0; font-size: 28px; font-weight: 600; color: #11120D; text-align: center; line-height: 1.3;">
                You've been invited! 🎉
              </h1>
              
              <p style="margin: 0 0 24px 0; font-size: 16px; color: #5c5c5c; text-align: center; line-height: 1.6;">
                {{ .Data.company_name }} has invited you to join their health insurance plan with Get Wild.
              </p>
              
              <p style="margin: 0 0 32px 0; font-size: 15px; color: #5c5c5c; text-align: center; line-height: 1.6;">
                Get started with AI-powered health insights, free wearables, and comprehensive coverage.
              </p>
              
              <!-- CTA Button -->
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td align="center" style="padding: 0;">
                    <a href="{{ .ConfirmationURL }}" style="display: inline-block; padding: 16px 48px; background-color: #1b1d1a; color: #ffffff; text-decoration: none; border-radius: 12px; font-size: 16px; font-weight: 500; text-align: center;">
                      Start Verification
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 32px 0 0 0; font-size: 13px; color: #989795; text-align: center; line-height: 1.5;">
                If the button doesn't work, copy and paste this link into your browser:
              </p>
              <p style="margin: 8px 0 0 0; font-size: 12px; color: #989795; text-align: center; word-break: break-all;">
                {{ .ConfirmationURL }}
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px 40px 40px; border-top: 1px solid #e5e5e5;">
              <p style="margin: 0 0 8px 0; font-size: 13px; color: #989795; text-align: center; line-height: 1.5;">
                Questions? Contact us at <a href="mailto:team@getwild-now.com" style="color: #1b1d1a; text-decoration: none;">team@getwild-now.com</a>
              </p>
              <p style="margin: 0; font-size: 12px; color: #989795; text-align: center;">
                © 2025 Get Wild. All rights reserved.
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

---

### Step 3: Paste into Supabase

1. In the Supabase "Invite user" template editor
2. **Delete all existing content**
3. **Paste** the HTML code you just copied
4. Click **"Save"** at the bottom

---

### Step 4: Update Subject Line

In the same page, find the **"Subject"** field and change it to:

```
You've been invited to Get Wild! 🎉
```

Click **"Save"** again.

---

### Step 5: Test It!

1. Go to your employer dashboard: https://www.getwild-now.com/employer/dashboard
2. Click **"Add Employee"**
3. Enter a test email (your own email)
4. Click **"Send invite link"**
5. Check your email inbox

**Expected result:**
- ✅ Beautiful branded email arrives
- ✅ Shows company name
- ✅ "Start Verification" button works
- ✅ Button redirects to: `https://www.getwild-now.com/employee-verification`

---

## 🎨 What This Template Does

### Dynamic Variables

The template uses Supabase variables that are automatically filled:

- **`{{ .Data.company_name }}`** → Shows the company name (e.g., "Acme Corp")
- **`{{ .ConfirmationURL }}`** → The invite link that redirects to `/employee-verification`

### Redirect Flow

When an employee clicks "Start Verification":
1. They go to: `https://www.getwild-now.com/employee-verification`
2. They see: "You've been invited!" page with company info
3. They can click "Start Verification" button (currently placeholder)

---

## ✅ Verification Checklist

After installing the template, verify:

- [ ] Email template saved in Supabase
- [ ] Subject line updated
- [ ] Test email sent successfully
- [ ] Email looks professional and branded
- [ ] Company name appears correctly
- [ ] "Start Verification" button works
- [ ] Button redirects to `/employee-verification` page
- [ ] No errors in Supabase Auth Logs
- [ ] No errors in Brevo Logs

---

## 🚨 Troubleshooting

### Email not arriving?
- Check spam folder
- Check Brevo logs: https://app.brevo.com → Transactional → Logs
- Check Supabase Auth logs: Dashboard → Authentication → Logs

### Template looks broken?
- Make sure you copied the ENTIRE HTML (including `<!DOCTYPE html>` at top)
- Make sure you didn't accidentally add extra characters
- Try copying again from this file

### Button not working?
- Verify `NEXT_PUBLIC_BASE_URL=https://www.getwild-now.com` in Railway
- Check Railway logs for `[Invite]` messages
- Redeploy on Railway if you changed environment variables

---

## 📞 Need Help?

If something isn't working:
1. Check `EMAIL_TROUBLESHOOTING.md` for detailed debugging
2. Check Railway logs for errors
3. Check Brevo logs for delivery status
4. Check Supabase Auth logs for email events

---

**That's it! Your employee invitation emails are now beautiful and professional.** 🎉

