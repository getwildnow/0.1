# Employee Invitation System - Setup Guide

## ✅ What's Been Built

A complete employee invitation system that allows employers to:
1. Upload CSV files with employee data (Name, Role, Email)
2. Bulk invite employees via Supabase Auth
3. Employees receive invitation emails automatically
4. Track invitation status (invited, active, inactive)

## 🗄️ Database Setup Required

### Step 1: Run SQL Migration

Go to Supabase SQL Editor:
https://supabase.com/dashboard/project/rqmjnenmeixvpwyzwyjw/sql/new

Run the SQL from: `supabase/migrations/20250810_create_companies_employees.sql`

This creates:
- `companies` table - Links founders to their companies
- `employees` table - Stores employee data and links to Supabase Auth users
- RLS policies for data isolation between companies
- Indexes for performance

### Step 2: Add Environment Variable

Add to Railway (or `.env.local` for local dev):

```
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

**Where to find it:**
1. Go to: https://supabase.com/dashboard/project/rqmjnenmeixvpwyzwyjw/settings/api
2. Copy the `service_role` key (NOT the `anon` key)
3. ⚠️ **IMPORTANT**: This key has admin privileges - keep it secret!

## 🎯 How It Works

### For Employers:

1. **Click "Add Employee"** button on dashboard
2. **Copy ChatGPT Prompt** (small icon in modal)
3. **Paste in ChatGPT** to generate sample CSV
4. **Upload CSV** via drag-and-drop or click
5. **Click "Send invite links"**
6. System processes each employee:
   - Creates user in Supabase Auth
   - Sends invitation email
   - Creates employee record in database
7. **See results** - Shows success/failure count

### For Employees:

1. **Receive invitation email** from Supabase
2. **Click magic link** in email
3. **[Tade's Part]** - Verification/onboarding flow
4. After verification, employee can access `/employee/dashboard`

## 📁 Files Created/Modified

### New Files:
- `app/api/employees/invite/route.ts` - API endpoint for sending invitations
- `lib/supabase/admin.ts` - Admin client for server-side auth operations
- `supabase/migrations/20250810_create_companies_employees.sql` - Database schema

### Modified Files:
- `app/employer/dashboard/page.tsx` - Added CSV upload modal
- `app/api/founders/create/route.ts` - Creates company alongside founder
- `app/signup/page.tsx` - Stores company ID in localStorage
- `package.json` - Added `papaparse` for CSV parsing

## 🔧 Technical Details

### CSV Format:
```csv
Name,Role,Email
John Doe,Software Engineer,john.doe@company.com
Jane Smith,Product Manager,jane.smith@company.com
```

### API Endpoint:
**POST** `/api/employees/invite`

**Request:**
```json
{
  "employees": [
    {
      "name": "John Doe",
      "role": "Software Engineer",
      "email": "john@example.com"
    }
  ],
  "companyId": "uuid-here"
}
```

**Response:**
```json
{
  "success": true,
  "summary": {
    "total": 2,
    "successful": 2,
    "failed": 0
  },
  "results": [
    {
      "email": "john@example.com",
      "success": true
    }
  ]
}
```

### Supabase Auth Integration:
Uses `supabase.auth.admin.inviteUserByEmail()` which:
- Creates user in `auth.users` table
- Sends invitation email with magic link
- Includes custom metadata (name, role, company_id)
- Redirects to `/employee/onboarding` after click

## 🚨 Important Notes

### Data Isolation:
- Each company can only see their own employees (RLS policies)
- Employees can only see their own company's data
- Admin dashboard can see all companies

### Security:
- Service role key is used server-side only (never exposed to client)
- RLS policies prevent cross-company data access
- Email validation before sending invites
- Duplicate email prevention per company

### What's NOT Included (Tade's Part):
- Employee verification flow after clicking magic link
- Password setup for employees
- Employee profile completion
- Updating employee status to 'active' after verification

## 🧪 Testing

### Test Locally:

1. **Start dev server:**
```bash
cd "/Users/pytro/Documents/Website Get wild/get-wild-insurance"
npm run dev
```

2. **Sign up as founder:**
- Go to http://localhost:3000/signup
- Complete 2-step signup
- You'll be redirected to dashboard

3. **Create test CSV:**
```csv
Name,Role,Email
Test Employee,Engineer,test@example.com
```

4. **Upload and invite:**
- Click "Add Employee"
- Upload CSV
- Click "Send invite links"
- Check results

5. **Check email:**
- Test employee should receive invitation email
- Email contains magic link to `/employee/onboarding`

### Test on Production:

1. **Run SQL migration** in Supabase
2. **Add `SUPABASE_SERVICE_ROLE_KEY`** to Railway
3. **Deploy** from `getwild-app` branch
4. **Test signup flow** on live site

## 📋 Next Steps (For Tade)

1. **Configure Supabase Email Templates**
   - Customize invitation email design
   - Add company branding
   - Set correct redirect URL

2. **Build Employee Onboarding Flow**
   - Create `/employee/onboarding` page
   - Handle magic link token
   - Allow password setup
   - Update employee status to 'active'
   - Redirect to employee dashboard

3. **Connect to Existing Auth System**
   - Link with your verification system
   - Update employee record after verification
   - Handle edge cases (expired links, etc.)

## 🐛 Troubleshooting

### "Server configuration error"
- Check `SUPABASE_SERVICE_ROLE_KEY` is set
- Verify it's the service role key, not anon key

### "Company ID not found"
- User needs to sign up again
- Check localStorage has `companyId`

### "Employee already invited"
- Email already exists in that company
- Check `employees` table in Supabase

### Invitation email not received
- Check Supabase Auth email settings
- Verify email provider is configured
- Check spam folder
- Look at Supabase Auth logs

## 📞 Contact

If you have questions:
- Check `.ai-rules.md` for project guidelines
- Review database schema in migration file
- Test with small CSV first (1-2 employees)

---

**Branch:** `getwild-app`
**Last Updated:** November 9, 2025
**Status:** ✅ Ready for database migration and testing

