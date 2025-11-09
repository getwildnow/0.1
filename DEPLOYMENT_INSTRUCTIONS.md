# Deployment Instructions

## GitHub Setup

The Git repository has been initialized and all files have been committed. To push to GitHub:

1. **Create the GitHub repository** (if not already created):
   - Go to https://github.com/new
   - Name: `0.1`
   - Organization: `getwildnow`
   - Make it private or public as needed

2. **Push the code**:
   ```bash
   cd "/Users/pytro/Documents/Website Get wild/get-wild-insurance"
   git push -u origin main
   ```

   If you get an authentication error, you may need to:
   - Use a Personal Access Token (PAT) instead of password
   - Or use SSH: `git remote set-url origin git@github.com:getwildnow/0.1.git`

## Render Deployment

1. **Connect to Render**:
   - Go to https://render.com
   - Create a new Web Service
   - Connect your GitHub repository `getwildnow/0.1`
   - Select the `get-wild-insurance` directory as root

2. **Environment Variables**:
   Set these in Render dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `STRIPE_SECRET_KEY`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - `ADMIN_PASSWORD` (set to: Getwild45real!?)

3. **Supabase Setup**:
   - Create a new Supabase project
   - Run the SQL migrations in order from `supabase/migrations/`
   - Copy the API keys to Render environment variables

4. **Stripe Setup**:
   - Get your API keys from Stripe Dashboard
   - Set up webhook endpoint: `https://your-app.onrender.com/api/stripe/webhook`
   - Configure webhook to send these events:
     - `checkout.session.completed`
     - `invoice.payment_succeeded`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`

## Post-Deployment

1. **Test the deployment**:
   - Visit your Render URL
   - Test employer signup/login
   - Test employee login
   - Test admin dashboard with password: `Getwild45real!?`

2. **Configure custom domain** (optional):
   - Add your domain in Render settings
   - Update DNS records as instructed

## Support

For any issues, check:
- Render logs for deployment errors
- Browser console for frontend errors
- Supabase logs for database issues
- Stripe webhook logs for payment issues
