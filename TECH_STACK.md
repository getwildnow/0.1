# Tech Stack & Project Overview

## Project Overview
**Company:** Global Care (C-Corp)  
**Product:** PRIME CARE - The first truly customer-friendly health insurance

**Vision:** Applied AI company building THE SINGLE POINT OF CONTACT for all health needs

**Core Concept:** We don't just offer insurance. We build a complete new layer of AI-powered health/doctor system on top of the best insurance on the planet. One app, one login, everything health-related.

## Core Product Features

### 1. Revolutionary Insurance Model
- **Full coverage of everything** (one-page policy in plain English)
- **We only profit when we PAY claims** (10% service fee on payouts)
- **59-minute claim processing** (vs 14-day industry average)
- **Direct payment** to hospitals or instant pre-cash to customers
- **30-second support response**, 3-minute problem resolution
- **Transparent pricing** - only changes at age milestones (20, 30, 40, etc.)
- **Cancel anytime** like Netflix

### 2. Complete AI Doctor Layer (Inspired by [Doctronic](https://moge.ai/en/product/doctronic))
- **Comprehensive AI Medical Assessment** - detailed health evaluations, symptom analysis, personalized treatment
- **24/7 AI Doctor** - instant medical guidance, no wait times
- **Multi-Specialty Support** - primary care, mental health, arthritis, weight management, etc.
- **AI Preventive Longevity Doctor** - keeps you healthy proactively
- **Seamless Doctor Integration** - smooth transition from AI to real doctors when needed
- **Telehealth** with real human doctors (urgent care, prescriptions, follow-ups)
- **Clinic partnerships** for in-person care
- **Free wearables** (Oura, Whoop) for continuous data collection
- **Educational Resource Center** - trusted health information, self-care tips

### 3. Data Wallet System
- **Comprehensive data collection:**
  - Health records from doctors
  - Wearable data (24/7 tracking)
  - Social media scraping and analysis
  - AI interviewer (conversational data gathering)
  - User-uploaded data
- **"Login with Data Wallet"** - use your health data across other apps
- **Data ecosystem** - continuous data flow and insights

### 4. Target Market (Phase 1)
- **Visa holders in the US** (especially San Francisco)
- Founders who raised first round
- High-paid tech professionals
- Premium positioning (~$300/month)

**References:** 
- UI Inspiration: https://rivendell.health/
- AI Doctor System: [Doctronic](https://moge.ai/en/product/doctronic)

---

## 🎯 What Makes This Different: SINGLE POINT OF CONTACT

Traditional healthcare is fragmented:
- ❌ Insurance company (for claims)
- ❌ Primary doctor (for appointments)
- ❌ Specialists (for specific issues)
- ❌ Urgent care (for emergencies)
- ❌ Pharmacy (for prescriptions)
- ❌ Labs (for tests)
- ❌ Fitness apps (for prevention)

**Our approach: ONE APP for EVERYTHING**
- ✅ **Insurance** - Claims processed in 59 minutes
- ✅ **AI Doctor** - 24/7 instant medical guidance
- ✅ **Real Doctors** - When you need human care
- ✅ **Prescriptions** - Ordered through the app
- ✅ **Labs & Tests** - Scheduled and tracked
- ✅ **Preventive Care** - AI keeps you healthy
- ✅ **Wearables** - Continuous monitoring
- ✅ **All Your Health Data** - In one place

**Result:** You never wonder "who do I contact for this health issue?" The answer is always: PRIME CARE.

---

## Core Tech Stack

| Category | Technology |
|----------|-----------|
| **Language** | TypeScript |
| **Framework** | Next.js 14 |
| **Database** | Supabase (with SDK) |
| **Hosting** | Render |
| **Payments** | Stripe |
| **AI** | OpenAI API |

---

## Architecture Principles

- **ONE language:** Everything in TypeScript
- **ONE framework:** Next.js 14 (App Router)
- **ONE database:** Supabase for data, auth, real-time
- **Everything else:** Use APIs (no additional heavy tools)

---

## Key Integrations (APIs)

- **Wearables:** Oura Ring, Whoop API
- **Telehealth:** TBD (video consultation API)
- **Labs/Diagnostics:** TBD (lab ordering API)
- **Payments:** Stripe for subscriptions
- **AI Insights:** OpenAI API for health data analysis

---

## Development Notes

- Use Next.js 14 App Router (not Pages Router)
- Supabase handles: Database, Auth, Real-time, Storage
- All components in TypeScript
- API routes for backend logic
- Server components by default, client components when needed

