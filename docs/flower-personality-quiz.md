# Flower Personality Quiz

## Overview

The Flower Personality Quiz ("Find Your Flower") is a customer acquisition funnel integrated into the Hwabelle website. It guides visitors through a personality quiz to discover their signature flower archetype, then funnels them toward the AI Designer and Shop the Kit experiences.

**Customer Journey:** Homepage → Quiz → Lead Capture → Personalized Result → AI Designer → Shop the Kit

## Routes

| Route | Description |
|-------|-------------|
| `/flower-quiz` | Main quiz page (public, no auth required) |
| `/flower-quiz/result/:slug` | Shareable flower profile page (generic, no PII) |

## Flower Archetypes

8 initial archetypes: Rose, Lavender, Sunflower, Daisy, Cosmos, Violet, Hydrangea, Peony.

All profile data is centralized in `src/data/flowerQuizProfiles.ts`.

## Scoring Architecture

The quiz uses **deterministic scoring** — no AI or network requests.

1. Each of the 7 questions has 4 answers
2. Each answer assigns weighted points (1-3) to one or more flower archetypes
3. After the final answer, all scores are summed
4. The flower with the highest score wins
5. Ties are broken alphabetically by slug

Scoring logic: `src/lib/flower-quiz/scoring.ts`
Question data: `src/data/flowerQuizQuestions.ts`

## Database

### Table: `flower_quiz_submissions`

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| created_at | TIMESTAMPTZ | Auto-set |
| first_name | TEXT | Optional |
| email | TEXT | Normalized (lowercase, trimmed) |
| marketing_consent | BOOLEAN | Default `false`, never preselected |
| flower_result | TEXT | Validated against 8 allowed slugs |
| answers | JSONB | Complete answer map |
| source | TEXT | e.g., "homepage" |
| utm_source | TEXT | Campaign attribution |
| utm_medium | TEXT | Campaign attribution |
| utm_campaign | TEXT | Campaign attribution |
| utm_content | TEXT | Campaign attribution |
| utm_term | TEXT | Campaign attribution |
| referrer | TEXT | HTTP referrer |
| session_id | UUID | Reserved for future use |
| completed_at | TIMESTAMPTZ | When quiz was completed |

## Automated Email & Lead Funnel Integration

When a user enters their email:
1. **Submission Persistence**: Saves to `flower_quiz_submissions` table.
2. **Newsletter Sync**: If `marketing_consent` is checked (`true`), the email and name are upserted to the `customers` table with `consent: true`.
3. **Automated Result Email**: Sends a branded HTML email via **AWS SES** (`hello@hwabelle.shop` with Resend fallback):
   - Subject: `Your Flower Personality: You're a [Flower Name]! 🌸`
   - Content: Personalized greeting, archetype headline & tagline, personality traits, symbolism, pressing difficulty & tips, recommended DIY keepsake project, and direct buttons linking to the AI Designer & Shop.

Migration: `supabase/migrations/20260826000000_create_flower_quiz_submissions.sql`

## Analytics Events

All events fire through the existing GA4 (`gtag`) integration. **No email addresses are sent.**

| Event | When |
|-------|------|
| `flower_quiz_viewed` | Quiz page loads |
| `flower_quiz_started` | User clicks "Discover My Flower" |
| `flower_quiz_question_answered` | Each question answered |
| `flower_quiz_lead_submitted` | Lead form submitted |
| `flower_quiz_completed` | Result displayed |
| `flower_quiz_ai_designer_clicked` | User clicks AI Designer CTA |
| `flower_quiz_shop_clicked` | User clicks Shop CTA |

Properties: `source`, `flower_result`, `question_number`, `utm_source`, `utm_medium`, `utm_campaign`

## AI Designer Handoff

The result page links to `/designer?flower=lavender&source=flower-quiz`.

The Designer page reads these params and shows a contextual banner when arriving from the quiz. This is non-breaking — the Designer works normally without these params.

## Supabase Security Model

- The `flower_quiz_submissions` table has **RLS enabled** with **no anon/authenticated policies**
- The browser **cannot** directly read or write this table
- Submissions go through the `flower-quiz-submit` Edge Function
- The Edge Function uses `SUPABASE_SERVICE_ROLE_KEY` (available in Deno runtime, never exposed to browser)
- The browser only sends requests via `supabase.functions.invoke()` using the anon key

## Environment Variables

No new environment variables required. The feature uses existing:

- `VITE_SUPABASE_URL` — Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` — Supabase anon key
- `VITE_GA_MEASUREMENT_ID` — Google Analytics

The Edge Function uses Supabase-provided runtime variables (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`).

## Local Development

```bash
# Start the dev server
npm run dev

# Run tests
npm run test

# Run linting
npm run lint

# Production build
npm run build
```

### Supabase

To apply the database migration:

```bash
supabase db push
```

To deploy the Edge Function:

```bash
supabase functions deploy flower-quiz-submit
```

## Testing

### Automated Tests

```bash
npm run test
```

Tests cover:
- Every flower can be reached via deterministic scoring
- Scoring is deterministic (same input = same output)
- Ties resolve alphabetically
- Email validation
- Answer set validation
- Submission payload validation
- Component rendering and interaction

### Manual Testing

1. Navigate to homepage → click "Discover My Flower"
2. Complete all 7 questions
3. Submit lead form
4. View result
5. Click "Design My Flower Project" → verify AI Designer context banner
6. Return → click "Start Pressing My Flowers" → verify shop page
7. Visit `/flower-quiz/result/lavender` directly → verify static profile
8. Test on mobile (375px, 414px)
9. Test keyboard navigation through quiz

## Troubleshooting

### Quiz submission fails
- Check browser console for Edge Function errors
- Verify the `flower-quiz-submit` function is deployed: `supabase functions list`
- Check that `flower_quiz_submissions` table exists: `supabase db remote status`

### Result not displaying after submission error
- The UI allows "Skip and see my result" when submission fails
- The result is calculated client-side and doesn't depend on database persistence

### Invalid flower slug in URL
- `/flower-quiz/result/invalid-slug` redirects to `/flower-quiz`

### Analytics events not firing
- Verify `VITE_GA_MEASUREMENT_ID` is set
- Check that `window.gtag` is available in browser console
- Events use the existing GA4 integration — no separate setup needed
