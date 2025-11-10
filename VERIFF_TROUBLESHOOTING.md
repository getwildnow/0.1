# 🔧 Veriff Verification Not Starting - Troubleshooting

## Issue: "Verification system is not ready. Please refresh the page."

This error means the Veriff SDK failed to load. Here's how to fix it:

---

## ✅ Step 1: Check Railway Environment Variables

**This is the most common issue!**

1. Go to: https://railway.app/
2. Open your project → **Variables** tab
3. **Verify these variables exist:**
   - `VERIFF_API_KEY` = `bc193001-958f-45ca-931f-c6a040a59ff9`
   - `VERIFF_API_SECRET` = `1b053eaa-73eb-4924-81a3-6c917077c059`

4. **If they're missing:** Add them now!
5. **After adding:** Click **Deploy** to redeploy

⏱️ **Wait 2-3 minutes** for Railway to finish deploying, then test again.

---

## ✅ Step 2: Check Browser Console

1. On the verification page, press **F12** (or Cmd+Option+I on Mac)
2. Go to **Console** tab
3. Look for these messages:

### Good Signs ✅
```
[Veriff] SDK loaded successfully
[Veriff] SDK available: true
```

### Bad Signs ❌
```
[Veriff] Failed to load SDK
[Veriff] SDK failed to load after 5 seconds
Failed to load resource: cdn.veriff.me
```

---

## ✅ Step 3: Check Network Tab

1. In browser DevTools, go to **Network** tab
2. Refresh the page
3. Look for: `veriff.min.js`

### If it's there ✅
- Status should be `200 OK`
- Size should be ~50KB

### If it's missing or 404 ❌
- Check if ad blocker is blocking it
- Try disabling browser extensions
- Try in incognito/private mode

---

## ✅ Step 4: Test API Endpoint Directly

Open this URL in your browser:
```
https://www.getwild-now.com/api/veriff/create-session
```

### Expected Response:
```json
{
  "error": "Unauthorized"
}
```
This is good! It means the API is working.

### Bad Response:
```json
{
  "error": "VERIFF_API_KEY is not configured"
}
```
**Fix:** Add environment variables to Railway (see Step 1)

---

## ✅ Step 5: Check Railway Logs

1. Go to Railway Dashboard
2. Click on your deployment
3. Go to **Logs** tab
4. Look for errors like:
   ```
   [Veriff] Error creating session: VERIFF_API_KEY is not configured
   ```

**Fix:** Add environment variables and redeploy

---

## ✅ Step 6: Clear Browser Cache

1. Open DevTools (F12)
2. **Right-click** the refresh button
3. Select "**Empty Cache and Hard Reload**"
4. Or use: **Ctrl+Shift+R** (Windows) or **Cmd+Shift+R** (Mac)

---

## ✅ Step 7: Check Veriff Account Status

1. Log in to Veriff Dashboard: https://station.veriff.com/
2. Check if your account is active
3. Verify the API keys are correct:
   - Go to **Settings** → **API Keys**
   - Compare with Railway variables

---

## 🔄 Quick Fix Checklist

Run through this list:

- [ ] Environment variables added to Railway
- [ ] Railway redeployed (wait 2-3 minutes)
- [ ] Browser cache cleared
- [ ] No ad blocker active
- [ ] Tried in incognito mode
- [ ] Console shows SDK loaded
- [ ] Network tab shows veriff.min.js loaded (200 OK)

---

## 🧪 Test with Browser Console

On the verification page, open console and run:

```javascript
// Check if SDK loaded
console.log('Veriff SDK:', window.veriffSDK)

// Should return: Object with createVeriffFrame function
```

If it returns `undefined`, the SDK didn't load.

---

## 🆘 Still Not Working?

### Try Manual Test:

1. Open browser console on verification page
2. Paste this:

```javascript
// Manual SDK load test
const script = document.createElement('script');
script.src = 'https://cdn.veriff.me/sdk/js/1.3/veriff.min.js';
script.onload = () => console.log('SDK loaded!', window.veriffSDK);
script.onerror = () => console.log('SDK failed to load!');
document.head.appendChild(script);
```

3. Wait 3 seconds
4. If you see "SDK loaded!" → The issue is with Next.js Script loading
5. If you see "SDK failed to load!" → CDN is blocked or network issue

---

## 🔐 Security/Network Issues

### Corporate Network/VPN
- Some corporate networks block cdn.veriff.me
- Try on mobile hotspot or home network

### Ad Blockers
- uBlock Origin, AdBlock Plus can block Veriff
- Disable temporarily and test

### Browser Extensions
- Privacy Badger, Ghostery can block trackers
- Disable and test in incognito

---

## 📋 Information to Collect for Support

If still not working, collect this info:

1. **Railway deployment logs** (last 50 lines)
2. **Browser console output** (screenshot)
3. **Network tab** (screenshot showing veriff.min.js)
4. **Test URL response:** `https://www.getwild-now.com/api/veriff/create-session`
5. **Browser and OS:** e.g., "Chrome 119 on macOS"

---

## ✅ Most Common Fix

**90% of the time, it's this:**

1. Go to Railway → Variables
2. Add `VERIFF_API_KEY` and `VERIFF_API_SECRET`
3. Click **Deploy**
4. Wait 2-3 minutes
5. Hard refresh browser (Cmd+Shift+R)
6. Try again ✅

---

**Updated:** January 10, 2025

