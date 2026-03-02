# Hwabelle

Preserve nature's beauty, one bloom at a time. Hwabelle is a flower press kit brand website built with React, TypeScript, Tailwind CSS, and Supabase.

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Backend**: Supabase (Auth, Database, Edge Functions)
- **AI**: Google Gemini (Designer, Blog Generation, Email Campaigns)
- **Hosting**: Vercel

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

The app runs at `http://localhost:8080`.

## Environment Variables

Create a `.env` file with:

```
VITE_SUPABASE_PROJECT_ID="your-project-id"
VITE_SUPABASE_PUBLISHABLE_KEY="your-anon-key"
VITE_SUPABASE_URL="https://your-project.supabase.co"
```

## Deployment

This project is deployed on **Vercel**. Push to `main` to trigger a deployment.

### Supabase Edge Functions

Deploy edge functions with the Supabase CLI:

```bash
npx supabase functions deploy ai-designer
npx supabase functions deploy generate-blog
npx supabase functions deploy generate-email-funnel
```

Required secrets:
- `GOOGLE_API_KEY` — Google Gemini API key (powers all AI features)
