# Tech Stack & Project Overview

## Project Overview
**What we're building:** Health insurance + wellness optimization platform for startups
- Comprehensive health insurance (zero deductible, no network restrictions)
- Wellness optimization (wearables, biometric labs, AI insights)
- Telehealth system (video consultations with dedicated doctors)

**Reference/Inspiration:** https://rivendell.health/ (similar concept)

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

