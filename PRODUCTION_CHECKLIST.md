# Production Readiness Checklist

Use this checklist to ensure your getwild Prime Care system is ready for production deployment on Railway.

## ✅ Pre-Deployment Checklist

### 1. Database Setup
- [ ] Supabase project created
- [ ] Migration `001_initial_schema.sql` applied successfully
- [ ] Migration `002_rls_policies.sql` applied successfully
- [ ] Default config inserted (verify in `onboarding_config` table)
- [ ] All tables have RLS (Row Level Security) enabled
- [ ] Test data inserted (optional, for testing)
- [ ] Database backups configured in Supabase

### 2. Environment Variables
- [ ] All required environment variables identified
- [ ] Supabase credentials obtained (URL, Anon Key, Service Role Key)
- [ ] Veriff credentials obtained (API Key, API Secret)
- [ ] OpenAI API key obtained and billing configured
- [ ] Environment variables added to Railway
- [ ] No secrets in code or Git history
- [ ] `.env.local` in `.gitignore`

### 3. Code Quality
- [ ] No console.errors in production code (use proper logging)
- [ ] No hardcoded credentials or API keys
- [ ] All TypeScript errors resolved
- [ ] No eslint errors
- [ ] All imports resolved correctly
- [ ] Build succeeds locally (`npm run build`)
- [ ] Production build tested locally (`npm run build && npm start`)

### 4. Security
- [ ] RLS policies tested and verified
- [ ] Service role key never exposed to client
- [ ] Webhook signature verification implemented (Veriff)
- [ ] CORS configured properly
- [ ] No sensitive data in error messages
- [ ] Input validation on all API endpoints
- [ ] SQL injection prevention (using Supabase client)
- [ ] XSS prevention (React default escaping)

### 5. API Routes
- [ ] `/api/health` endpoint working
- [ ] `/api/config/route.ts` tested
- [ ] `/api/identity/create-session/route.ts` tested
- [ ] `/api/onboarding/chat/route.ts` tested
- [ ] `/api/webhooks/veriff/route.ts` tested
- [ ] All routes have proper error handling
- [ ] All routes return appropriate status codes

### 6. Third-Party Services
- [ ] Veriff account in production mode (not test)
- [ ] Veriff webhook URL configured
- [ ] OpenAI API key has billing enabled
- [ ] OpenAI usage limits understood
- [ ] Supabase project plan appropriate for load

---

## 🚀 Deployment Steps

### 1. Render Setup
- [ ] Render account created
- [ ] GitHub repository connected
- [ ] Web Service created in Render
- [ ] Build command set: `npm install && npm run build`
- [ ] Start command set: `npm start`
- [ ] Environment variables added

### 2. Deploy Application
- [ ] Initial deployment successful
- [ ] Deployment logs checked for errors
- [ ] Application URL obtained (.onrender.com)
- [ ] Health check endpoint verified (`/api/health`)

### 3. Post-Deployment Configuration
- [ ] Veriff webhook URL updated to production URL
- [ ] Supabase Auth URLs updated (if using magic links)
- [ ] Custom domain configured (if applicable)
- [ ] SSL/HTTPS verified (Render provides this)

---

## ✅ Post-Deployment Testing

### 1. Health & Connectivity
- [ ] Health check returns "healthy" status
- [ ] Database connection working
- [ ] All environment variables detected

### 2. Admin Interface
- [ ] Can access `/admin/data-points`
- [ ] Can view existing data points
- [ ] Can edit data points
- [ ] Can save changes
- [ ] Changes persist in database

### 3. Onboarding Flow
- [ ] Veriff session creation works
- [ ] Veriff redirect working
- [ ] Veriff webhook received
- [ ] User profile created/updated
- [ ] Chat interface loads
- [ ] AI responses generated
- [ ] Data collected and saved
- [ ] Integration connections work (UI)
- [ ] Action selections work
- [ ] Completion state reached
- [ ] Dashboard accessible after completion

### 4. Database Operations
- [ ] User profiles created correctly
- [ ] Chat messages saved
- [ ] Onboarding data collected
- [ ] Consent records created
- [ ] Conversation state tracked
- [ ] RLS policies working (users can't see others' data)

### 5. Error Handling
- [ ] Invalid API requests handled gracefully
- [ ] Missing auth returns 401
- [ ] Database errors don't crash app
- [ ] Third-party API failures handled
- [ ] User-friendly error messages displayed

---

## 📊 Monitoring & Observability

### 1. Logging
- [ ] Application logs accessible in Railway
- [ ] Error logs identifiable
- [ ] Critical events logged
- [ ] Log retention understood

### 2. Metrics (Optional but Recommended)
- [ ] Set up error tracking (e.g., Sentry)
- [ ] Set up uptime monitoring (e.g., UptimeRobot)
- [ ] Set up performance monitoring (e.g., Vercel Analytics)
- [ ] Set up log aggregation (e.g., LogDNA)

### 3. Alerts
- [ ] Deployment failure alerts configured
- [ ] Error rate alerts configured
- [ ] Uptime alerts configured
- [ ] Database usage alerts configured

---

## 🔒 Security Checklist

- [ ] All secrets stored as environment variables
- [ ] No secrets in Git history
- [ ] HTTPS enforced (Railway default)
- [ ] RLS policies prevent unauthorized data access
- [ ] Webhook signatures verified
- [ ] API endpoints validate inputs
- [ ] Error messages don't leak sensitive info
- [ ] Service role key only used server-side
- [ ] CORS configured appropriately
- [ ] Dependencies up to date (npm audit)

---

## 💰 Cost Management

### 1. Service Costs Understood
- [ ] Railway pricing reviewed ($5-30/month typical)
- [ ] Supabase plan selected (Free or Pro $25/month)
- [ ] Veriff pricing agreed upon
- [ ] OpenAI costs estimated (~$0.10-0.30 per user)
- [ ] Total monthly cost acceptable

### 2. Usage Limits
- [ ] OpenAI rate limits understood
- [ ] Supabase database size limits understood
- [ ] Railway resource limits understood
- [ ] Cost alerts configured (if available)

---

## 📱 User Experience

- [ ] Application loads quickly (< 3 seconds)
- [ ] Mobile responsive
- [ ] Error states user-friendly
- [ ] Loading states shown
- [ ] Success confirmations shown
- [ ] Chat interface intuitive
- [ ] Veriff flow seamless

---

## 📋 Documentation

- [ ] `README.md` updated with project info
- [ ] `SETUP.md` has local development instructions
- [ ] `RAILWAY_DEPLOYMENT.md` has deployment guide
- [ ] `ENV_EXAMPLE.txt` lists all required variables
- [ ] API routes documented (or self-explanatory)
- [ ] Database schema documented (migrations)
- [ ] Onboarding flow documented

---

## 🔄 Maintenance Plan

### 1. Regular Tasks
- [ ] Monitor error logs weekly
- [ ] Review OpenAI costs weekly
- [ ] Check Supabase database size monthly
- [ ] Update dependencies monthly (`npm update`)
- [ ] Review security updates monthly
- [ ] Test critical flows monthly

### 2. Backup Strategy
- [ ] Supabase automatic backups enabled
- [ ] Manual backup procedure documented
- [ ] Backup restoration tested
- [ ] Data export scheduled (compliance)

### 3. Incident Response
- [ ] On-call contact identified
- [ ] Rollback procedure documented
- [ ] Critical issues procedure defined
- [ ] Support contact list maintained

---

## ✅ Go-Live Approval

Before going live, ensure:

- [ ] **All critical items above completed**
- [ ] **Stakeholders approve deployment**
- [ ] **Support team trained (if applicable)**
- [ ] **Rollback plan in place**
- [ ] **Monitoring configured**
- [ ] **Cost expectations set**

---

## 🎉 Post-Launch

After successful launch:

1. **Monitor closely for 24 hours**
   - Check logs every few hours
   - Watch for error spikes
   - Monitor user feedback

2. **First Week**
   - Daily log reviews
   - Track key metrics
   - Address any issues quickly

3. **Ongoing**
   - Weekly reviews
   - Monthly security updates
   - Quarterly feature reviews

---

## Common Issues & Solutions

### Issue: Health check fails
**Solution:**
- Check Railway logs for errors
- Verify all environment variables are set
- Test Supabase connection manually

### Issue: Veriff webhook not received
**Solution:**
- Verify webhook URL in Veriff dashboard
- Check webhook signature verification
- Look for webhook events in Veriff logs
- Check Railway logs for webhook errors

### Issue: OpenAI rate limit exceeded
**Solution:**
- Increase OpenAI rate limits (contact support)
- Implement request queuing
- Add user-facing rate limit messages

### Issue: Database connection errors
**Solution:**
- Check Supabase status page
- Verify connection pooling settings
- Review RLS policies for conflicts
- Check service role key is correct

---

## Support Resources

- **Railway:** https://railway.app/help
- **Supabase:** https://supabase.com/docs
- **Veriff:** support@veriff.com
- **OpenAI:** https://help.openai.com
- **Next.js:** https://nextjs.org/docs

---

## Revision History

- v1.0 - Initial production readiness checklist
- Date: 2024
- Reviewed by: DevOps Team

---

**Ready for Production?** ✅

Once all items are checked, you're ready to deploy to production with confidence!

