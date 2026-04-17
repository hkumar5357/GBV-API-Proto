# Uplevyl · GBV Manager Response Prototype

A React SPA that helps frontline managers and HR leaders respond to employee disclosures of gender-based violence, stalking, harassment, or domestic violence. The app calls a single backend endpoint and choreographs the response into a progressive, conversational experience.

## Stack

- React 18 + Vite
- Pure SPA (no SSR)
- Deployed on Vercel

## Run locally

```bash
npm install
cp .env.example .env   # set VITE_API_URL, or leave empty for demo mode
npm run dev
```

Requires Node 18+.

## Configure

- `VITE_API_URL` — URL of the `/api/ask` backend. If empty or unreachable, the app falls back to mock responses.

## Deploy

Push to Vercel. `vercel.json` includes a SPA rewrite. Set `VITE_API_URL` in Vercel project env.

## Features

- 5 industry verticals (Retail, Healthcare, Manufacturing, Hospitality, Corporate)
- 20 pre-built scenarios with jurisdiction-specific mock responses
- Progressive reveal: jurisdiction → threads → guidance (word-by-word) → clarifications → next steps → compliance doc → audit trail
- Clarification taps fire real follow-up API calls
- Auto-generated compliance records and session audit trail
- Demo mode fallback when API is unreachable
- Shareable quick-launch URLs via query params
