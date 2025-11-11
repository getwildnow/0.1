# Employee Profile Setup Instructions

## Issue: Profile Shows Fake Data

The profile page is trying to load real data from the database, but the new columns don't exist yet because the migration hasn't been run.

## Solution: Run the Database Migration

### Step 1: Open Supabase SQL Editor

1. Go to: https://supabase.com/dashboard
2. Select your project: **Getwild**
3. Click **SQL Editor** (left sidebar)
4. Click **New Query**

### Step 2: Run This SQL

Copy and paste this SQL into the editor:

```sql
-- Add profile fields to employees table
ALTER TABLE public.employees
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS emergency_contact_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS emergency_contact_phone VARCHAR(50);

-- Add comments
COMMENT ON COLUMN public.employees.address IS 'Employee residential address';
COMMENT ON COLUMN public.employees.emergency_contact_name IS 'Emergency contact full name';
COMMENT ON COLUMN public.employees.emergency_contact_phone IS 'Emergency contact phone number';
```

### Step 3: Click "Run" (or press Cmd/Ctrl + Enter)

You should see: **Success. No rows returned**

### Step 4: Verify the Columns Were Added

Run this query to check:

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'employees' 
AND column_name IN ('address', 'emergency_contact_name', 'emergency_contact_phone');
```

You should see 3 rows showing the new columns.

### Step 5: Redeploy on Railway

1. Go to Railway dashboard
2. Find your deployment
3. Click "Deploy" or it will auto-deploy from the latest git push

### Step 6: Test the Profile Page

1. Go to `https://www.getwild-now.com/employee/dashboard/profile`
2. You should see:
   - Your real name (from the invite)
   - Your real email
   - Empty fields for phone, DOB, address (ready to fill in)
   - Company name and role from your invite
3. Fill in your info and click "Save Changes"
4. Refresh the page → your data should persist!

## Why This Happens

The code expects these database columns:
- `address`
- `emergency_contact_name`  
- `emergency_contact_phone`

But they don't exist in your database yet. The migration adds them.

## Troubleshooting

If you still see fake data after running the migration:

1. **Check browser console** for errors
2. **Check Railway logs** - look for API errors
3. **Hard refresh** the page (Cmd+Shift+R or Ctrl+Shift+R)
4. **Try incognito mode** to rule out caching

The profile page should show "Loading profile..." briefly, then display your real data.

