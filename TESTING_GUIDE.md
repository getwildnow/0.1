# Testing Guide

This guide provides step-by-step instructions for testing the getwild Prime Care onboarding system.

## Prerequisites

- Application deployed and running (local or Railway)
- All environment variables configured
- Database migrations applied
- Veriff and OpenAI accounts set up

---

## 1. Health Check Testing

### Test the Health Endpoint

**URL:** `/api/health`

**Expected Response (Healthy):**
```json
{
  "status": "healthy",
  "database": "ok",
  "environment": "ok",
  "timestamp": "2024-..."
}
```

**Expected Response (Unhealthy):**
```json
{
  "status": "unhealthy",
  "database": "error" | "ok",
  "environment": "missing_variables",
  "missing": ["ENV_VAR_1", "ENV_VAR_2"]
}
```

**Test Steps:**
1. Visit: `https://your-app.railway.app/api/health`
2. Verify status is "healthy"
3. Check all systems are "ok"

---

## 2. Database Testing

### Verify Migrations

**Check tables exist:**
1. Open Supabase Dashboard > Table Editor
2. Verify these tables exist:
   - `user_profiles`
   - `onboarding_config`
   - `onboarding_conversations`
   - `user_onboarding_data`
   - `user_integrations`
   - `chat_messages`
   - `consents`

### Verify RLS Policies

1. Go to Supabase Dashboard > Authentication > Policies
2. Each table should have policies (check green indicators)
3. Test RLS by:
   - Creating a test user
   - Inserting data as that user
   - Trying to query as different user (should fail)

### Verify Default Config

1. Open Supabase Dashboard > Table Editor
2. Open `onboarding_config` table
3. Verify row with id='default' exists
4. Check it has data_points, integrations, actions, consent_text

---

## 3. Admin Interface Testing

### Test Data Points Configuration

**URL:** `/admin/data-points`

**Test Steps:**
1. Visit admin page
2. Verify markdown editor loads
3. Try editing data points:
   ```markdown
   - health goals
   - medications
   - apple health
   - wearable selection
   ```
4. Save changes
5. Refresh page
6. Verify changes persisted
7. Check database (onboarding_config table)

---

## 4. Veriff Integration Testing

### Test Session Creation

**API Endpoint:** `POST /api/identity/create-session`

**Test Steps:**
1. Create a test user in Supabase Auth
2. Get auth token for that user
3. Call the API:
   ```bash
   curl -X POST https://your-app.railway.app/api/identity/create-session \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json"
   ```
4. Expected response:
   ```json
   {
     "url": "https://magic.veriff.com/v/..."
   }
   ```
5. Check logs for "Creating Veriff session"
6. Verify session ID saved in user_profiles table

### Test Verification Flow

**Manual Test:**
1. Create user and get session URL (above)
2. Visit the Veriff URL
3. Complete verification (use Veriff test documents if in test mode)
4. Check Veriff dashboard for verification event
5. Verify webhook received (check Railway logs)
6. Check user_profiles table for updated data:
   - verification_status = 'verified'
   - first_name, last_name populated
   - dob, address fields populated
   - verified_at timestamp set

### Test Webhook

**Manual Webhook Test:**
1. Use Veriff dashboard > Webhooks > Test
2. Send test webhook to your endpoint
3. Check Railway logs for:
   - "Veriff webhook received"
   - "Veriff webhook signature verified"
   - "User profile updated"
4. Verify data in database

---

## 5. Onboarding Chat Testing

### Test Initial Chat Request

**API Endpoint:** `POST /api/onboarding/chat`

**Test Steps:**
1. Create user with verified profile
2. Call chat API with action "get_next":
   ```bash
   curl -X POST https://your-app.railway.app/api/onboarding/chat \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"action": "get_next"}'
   ```
3. Expected response:
   ```json
   {
     "message": {
       "type": "consent",
       "content": "Hi [Name]! I'm your health companion...",
       "metadata": {}
     }
   }
   ```

### Test Consent Agreement

**Request:**
```json
{
  "action": "consent_agreed"
}
```

**Expected:**
- Returns question message
- Consent saved in consents table
- Conversation status updated to 'collecting'

### Test Question Answering

**Request:**
```json
{
  "action": "answer",
  "message": "I want to lose weight and improve my sleep"
}
```

**Expected:**
- Answer extracted and saved in user_onboarding_data
- Next question returned
- data_points_collected updated

### Test Integration Connection

**Request:**
```json
{
  "action": "integration_connected",
  "message": "apple health"
}
```

**Expected:**
- Integration saved in user_integrations
- Next item in flow returned

### Test Action Completion

**Request:**
```json
{
  "action": "action_completed",
  "message": "wearable selection",
  "choice": "Oura Ring"
}
```

**Expected:**
- Action saved with choice
- Next item or completion returned

### Test Flow Completion

**Verify:**
- All data points collected
- All integrations connected (or skipped)
- All actions completed
- Final message type is 'complete'
- conversation status is 'complete'
- completed_at timestamp set

---

## 6. End-to-End User Flow Testing

### Complete Onboarding Flow

1. **Create User**
   - Create test user in Supabase Auth

2. **Identity Verification**
   - Call `/api/identity/create-session`
   - Visit Veriff URL
   - Complete verification
   - Wait for webhook
   - Verify data in user_profiles

3. **Start Chat**
   - Navigate to `/onboard/chat`
   - Verify chat interface loads
   - Verify personalized greeting (uses Veriff data)

4. **Accept Consent**
   - Click consent button
   - Verify first question appears

5. **Answer Questions**
   - Answer each data point question
   - Verify responses saved
   - Verify next question appears

6. **Connect Integrations**
   - Click integration connect buttons
   - Simulate OAuth (if implemented)
   - Verify integrations saved

7. **Complete Actions**
   - Make action selections
   - Verify choices saved

8. **Completion**
   - Verify completion message
   - Verify redirect to dashboard
   - Check all data in database

---

## 7. Error Handling Testing

### Test Missing Auth

**Test:** Call API without auth token

**Expected:**
- Status 401
- Error: "Unauthorized"

### Test Invalid Data

**Test:** Send malformed JSON

**Expected:**
- Status 400 or 500
- Graceful error message
- No app crash

### Test Database Errors

**Test:** 
1. Temporarily break database connection (wrong URL in env)
2. Try to load page

**Expected:**
- Error boundary catches error
- User-friendly error page
- Can reload to retry

### Test Third-Party API Failures

**Test:** Use invalid Veriff API key

**Expected:**
- Error logged
- User-friendly error message
- No sensitive info leaked

---

## 8. Performance Testing

### Load Time Testing

**Test:**
- Use browser DevTools > Network tab
- Measure page load times
- Target: < 3 seconds initial load

### API Response Time

**Test:**
- Measure API response times
- Target: < 1 second for most endpoints
- Target: < 3 seconds for AI generation

### Database Query Performance

**Test:**
- Check Supabase Dashboard > Logs
- Look for slow queries (> 100ms)
- Optimize if needed

---

## 9. Security Testing

### Test RLS Policies

**Test:**
1. Create two users
2. Login as User A
3. Try to query User B's data
4. Should fail with RLS error

### Test Service Role Exposure

**Test:**
- Check all client-side code
- Verify SUPABASE_SERVICE_ROLE_KEY never sent to client
- Only NEXT_PUBLIC_SUPABASE_ANON_KEY in client

### Test Webhook Signatures

**Test:**
1. Send webhook with invalid signature
2. Should be rejected
3. Check logs for "signature verification failed"

### Test Input Validation

**Test:**
- Try SQL injection in form inputs
- Try XSS attacks in chat
- Should be sanitized/escaped

---

## 10. Regression Testing Checklist

Run these tests after any changes:

- [ ] Health check passes
- [ ] Admin interface loads and saves
- [ ] Veriff session creation works
- [ ] Veriff webhook processes correctly
- [ ] Chat API returns responses
- [ ] AI generates questions
- [ ] Data saves to database
- [ ] RLS policies work
- [ ] Error boundary catches errors
- [ ] Logs appear in Railway

---

## 11. Browser Testing

Test in multiple browsers:

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)

---

## 12. Automated Testing (Future)

Consider adding:

1. **Unit Tests**
   - Test utility functions
   - Test AI conversation logic
   - Test data parsing

2. **Integration Tests**
   - Test API routes
   - Test database operations
   - Mock third-party services

3. **E2E Tests**
   - Playwright or Cypress
   - Test complete user flows
   - Test critical paths

---

## Common Issues & Solutions

### Issue: Health check fails
**Solution:** Check environment variables, verify database connection

### Issue: Veriff webhook not received
**Solution:** Check webhook URL in Veriff dashboard, verify signature secret

### Issue: AI not generating responses
**Solution:** Check OpenAI API key, verify billing, check rate limits

### Issue: Data not saving
**Solution:** Check RLS policies, verify user authentication, check database logs

### Issue: Error boundary showing
**Solution:** Check Railway logs for actual error, fix root cause

---

## Testing Checklist Summary

Before deploying to production:

- [ ] All health checks pass
- [ ] Database properly set up
- [ ] All migrations applied
- [ ] Default config present
- [ ] Admin interface works
- [ ] Veriff integration works
- [ ] Chat AI works
- [ ] Data persistence works
- [ ] Error handling works
- [ ] Security checks pass
- [ ] Performance acceptable
- [ ] Browser compatibility verified

---

## Continuous Monitoring

After deployment:

1. **Daily:**
   - Check error logs
   - Monitor uptime

2. **Weekly:**
   - Review OpenAI costs
   - Check database size
   - Review user feedback

3. **Monthly:**
   - Full regression test
   - Security audit
   - Dependency updates

---

## Getting Help

If tests fail:
1. Check Railway logs for errors
2. Check Supabase logs for database errors
3. Check Veriff dashboard for verification issues
4. Review PRODUCTION_CHECKLIST.md
5. Review TROUBLESHOOTING section in RAILWAY_DEPLOYMENT.md

