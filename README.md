# Vitalis — AI-Powered Personal Health Copilot

**HacXLerate 2026 · Round 1 · Challenge 01 (Altrix Labs): AI-Powered Personal Health Copilot**

Vitalis helps individuals understand, organize, and manage their healthcare journey. It combines a
personalized AI copilot with practical health-management tools — medications, appointments, health
records, and vitals tracking — in one secure app.

## Key Features

- **Medical Record Intelligence (OCR + AI)** — upload a photo of a prescription, lab report, or
  discharge summary and the AI reads it: extracts every medicine (name, dosage, frequency,
  duration), every test value with its reference range, flags abnormal values, and pulls out
  diagnoses and dates. Handles handwritten and bilingual documents.
- **AI Health Summary in Simple Language** — every scanned record gets a plain-language explanation
  a patient can understand, with abnormal values called out and a safety disclaimer. Summaries can
  be regenerated in **English, Hindi, or Telugu** (multi-language bonus).
- **AI Health Copilot** — a chat assistant that personalizes every answer using the user's actual
  medications, appointments, vitals, and records — and can *act* on the app: add/stop medications,
  book/cancel appointments, log vitals, add records, update the profile (tool calling, verified
  with real database writes). Safety guardrails: no diagnosis, emergency escalation to 112.
- **Unified Health Profile & Timeline** — one chronological timeline of records, vitals,
  appointments, and medications, plus a profile card with blood group, allergies, and conditions.
- **ABDM/ABHA Readiness (bonus)** — profiles carry an ABHA ID field with a mock link flow, and
  extracted record data is stored as structured JSON aligned to FHIR-style observations/medications.
- **Health Dashboard** — at-a-glance stats plus a vitals tracker (heart rate, blood pressure,
  weight, glucose, SpO₂, sleep) with trend charts.
- **Medication Tracking** — dosages, frequency, time of day, active/stopped states, notes.
- **Appointments** — book and track doctor visits with specialty, location, and reason.
- **Authentication** — email/password and Google sign-in. Every user's data is isolated with
  row-level security; uploaded documents live in a private storage bucket scoped per user.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React 19, TanStack Start (SSR), TanStack Router, Tailwind CSS v4, Recharts |
| Backend | TanStack Start server functions (RPC) |
| Database | PostgreSQL (Lovable Cloud / Supabase) with Row-Level Security |
| Auth | Lovable Cloud Auth (email/password + Google OAuth) |
| AI | Lovable AI Gateway — Google Gemini (chat completions), personalized with user health context |

## Architecture

```
src/
├── routes/
│   ├── index.tsx                    # Landing page (public)
│   ├── auth.tsx                     # Sign in / sign up (public)
│   ├── _authenticated.tsx           # Protected layout (sidebar, auth gate)
│   └── _authenticated/
│       ├── dashboard.tsx            # Stats + vitals tracker with charts
│       ├── chat.tsx                 # AI copilot chat (with action confirmations)
│       ├── timeline.tsx             # Unified health profile + timeline (+ mock ABHA link)
│       ├── medications.tsx          # Medication CRUD
│       ├── appointments.tsx         # Appointment CRUD
│       └── records.tsx              # Record upload, AI OCR analysis, multi-language summaries
├── lib/
│   ├── health.functions.ts          # Server fn: AI copilot (context + tools + persistence)
│   ├── records.functions.ts         # Server fns: OCR extraction + plain-language summaries
│   ├── copilot-tools.server.ts      # Copilot action tools (write through the user's RLS client)
│   └── gateway.server.ts            # Lovable AI Gateway provider
├── hooks/useAuth.ts                 # Session hook
└── integrations/supabase/           # Generated client + auth middleware
```

### Data model

`profiles` (incl. `abha_id`), `medications`, `appointments`, `health_records` (incl.
`extracted_data` JSON, `ai_summary`, `summary_language`), `vitals`, `chat_messages` — all
user-scoped with RLS policies (`auth.uid() = user_id`). Uploaded documents are stored in the
private `health-documents` storage bucket, with policies restricting access to the owner's folder.

### Record intelligence pipeline

1. User uploads a photo of a medical document on the Health Records page.
2. The file goes to private storage; a record row is created.
3. The `analyzeHealthRecord` server function downloads the file and sends it to a vision-capable
   AI model with a strict JSON schema.
4. The model extracts medicines, dosages, test values + reference ranges (with abnormal flags),
   diagnoses, and dates — stored as structured JSON (FHIR-friendly shape for ABDM readiness).
5. A second AI call writes a plain-language summary in the chosen language (English/Hindi/Telugu).
6. The record card shows the summary, abnormal-value badges, and the full extracted detail.

### AI copilot flow

1. User sends a message from the chat page.
2. The `chatWithCopilot` server function (authenticated) loads the user's profile, active
   medications, upcoming appointments, recent vitals, and records (including AI summaries).
3. That context is injected into the system prompt and sent to the AI model with action tools.
4. When the user asks for a change ("add Dolo 650"), the model must call the matching tool, which
   writes through the user's own RLS-scoped database client — confirmed with an on-screen tick.
5. The reply is returned and both turns are persisted to `chat_messages`.

## Running locally

```bash
bun install
bun dev
```

## Deployment

The app is deployed on Lovable (frontend + backend + database together). 
> Note: the backend (AI copilot, database, auth) requires a server runtime, so a static-only host
> like GitHub Pages can only serve a frontend demo, not the full app.

## Disclaimer

Vitalis is not a medical device and does not provide medical advice, diagnosis, or treatment.
Always consult a qualified healthcare professional.
