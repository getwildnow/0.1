# Supabase Invite Email Configuration

## Critical Settings to Update in Supabase Dashboard

After deploying the code, you **MUST** update these settings in your Supabase Dashboard for invite links to work correctly.

### 1. URL Configuration

Go to: **Authentication → URL Configuration**

Update these settings:

- **Site URL**: `https://www.getwild-now.com`
- **Redirect URLs**: Add `https://www.getwild-now.com/employee/dashboard`

### 2. Email Template Configuration

Go to: **Authentication → Email Templates → Invite user**

Ensure the template uses the dynamic confirmation URL variable:

```html
<a href="{{ .ConfirmationURL }}">Accept Invitation</a>
```

**DO NOT** hardcode the URL like this:
```html
<!-- ❌ WRONG -->
<a href="http://localhost:8080/employee/login">Accept Invitation</a>
```

The `{{ .ConfirmationURL }}` variable will automatically use the `redirectTo` parameter we pass in the API call.

### 3. Railway Environment Variable

Verify in Railway dashboard that this is set correctly:

```
NEXT_PUBLIC_BASE_URL=https://www.getwild-now.com
```

**Important**: 
- No trailing slash
- Include `www.` if your domain uses it
- Use `https://` (not `http://`)

## How It Works

1. **Employer sends invite** → API calls `inviteUserByEmail()` with `redirectTo: https://www.getwild-now.com/employee/dashboard`
2. **Supabase sends email** → Uses the template with `{{ .ConfirmationURL }}` which includes the redirect URL
3. **Employee clicks link** → Redirects to `https://www.getwild-now.com/employee/dashboard#access_token=...`
4. **Dashboard layout** → Supabase client automatically processes the hash tokens and establishes session
5. **Employee sees dashboard** → Fully authenticated! ✅

## Testing

After updating the settings:

1. **Redeploy on Railway** (to get the latest code)
2. **Send a new invite** from the employer dashboard
3. **Click the link** in the email
4. **Should see**: Brief "Loading..." screen, then the employee dashboard
5. **Should NOT see**: Login page or any errors

## Troubleshooting

If you still get redirected to login:

1. **Check Railway logs** for the actual redirect URL being used
2. **Check Supabase Auth logs** to see what URL the email was sent with
3. **Verify the email template** doesn't have a hardcoded URL
4. **Clear browser cache** and try with a fresh incognito window
5. **Check browser console** for detailed logging from the auth flow

