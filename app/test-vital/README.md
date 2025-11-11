# Vital Wearables Test Page

This is a standalone test page for testing the Vital API integration without affecting your main application.

## Access

Visit: **http://localhost:3000/test-vital**

## Features

✅ **Isolated Testing** - Completely separate from your main frontend  
✅ **User-Friendly** - Step-by-step guided flow  
✅ **Complete Testing** - Tests all Vital integration features  
✅ **Visual Feedback** - See data in real-time  
✅ **Persistent** - Saves test user ID in localStorage  

## How to Use

### Step 1: Initialize
1. Visit `http://localhost:3000/test-vital`
2. Click "Initialize Test User"
3. Creates a Vital user automatically

### Step 2: Connect Devices
1. Click "Connect Device"
2. Vital Link widget opens
3. Select a provider (in sandbox mode, use test accounts)
4. Complete the connection flow
5. See connected devices listed

### Step 3: Fetch Data
1. Click any data type button:
   - 😴 Sleep - Sleep stages, duration, quality
   - 🏃 Activity - Steps, calories, distance
   - ⚖️ Body - Weight, BMI, body fat
   - 💪 Workouts - Exercise sessions
   - ❤️ Heart Rate - Heart rate measurements
   - 👤 Profile - Age, height, biological sex

2. Data appears as JSON below
3. Try different data types to test various endpoints

## Sandbox Mode Testing

In sandbox mode, you can use Vital's test providers:

### Test Accounts Available:
- **Fitbit** (test account)
- **Oura** (test account)
- **Apple Health** (simulator)
- **Garmin** (test account)
- **Whoop** (test account)

Credentials and instructions available at: https://docs.tryvital.io/wearables/providers/test-mode

## What Gets Tested

✅ `/api/vital/users` - User creation  
✅ `/api/vital/link` - Link token generation  
✅ Vital Link Widget - Device connection  
✅ `/api/vital/data` - Data retrieval for all types  
✅ Supabase `vital_users` table - User storage  
✅ Supabase `vital_connections` table - Connection tracking  

## Verify in Supabase

Check your Supabase dashboard:

1. **Table Editor** > `vital_users` - Should see test user
2. **Table Editor** > `vital_connections` - Should see connected providers
3. **Table Editor** > `vital_health_data` - May see cached data

## Troubleshooting

### "Failed to create Vital user"
- Check `.env.local` has `VITAL_API_KEY`
- Verify API key is correct
- Check environment is set to `sandbox`

### "Failed to generate link token"
- Vital user must exist first
- Check API key permissions

### "No data returned"
- In sandbox mode, some providers may have limited test data
- Try different data types
- Check date range (default: last 30 days)

### Widget doesn't open
- Check browser console for errors
- Verify Vital Link SDK loads (check Network tab)
- Try a different browser

## Reset Test

Click "Reset Test" at the bottom to:
- Clear localStorage
- Start fresh with new test user
- Reset all connections

## Integration Later

When ready to integrate into your main app:

1. Copy the widget initialization code
2. Use the same API endpoints
3. Replace test user creation with real auth
4. Customize the UI to match your design

## Remove This Page

To remove from production:

1. Delete `/app/test-vital/` folder
2. Or add route guard in `page.tsx`:

```typescript
if (process.env.NODE_ENV === 'production') {
  redirect('/');
}
```

---

**Note:** This page creates real Vital users in sandbox mode. Data is not real health data, but the integration is fully functional.


