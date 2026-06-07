# Humoyun Mirzo — Portfolio & AI Assistant

Personal portfolio website with AI-powered chat assistant, integrated with Telegram bot.

## 🏗️ Architecture

```
frontend/          → Next.js web sayt
supabase/
  functions/
    chat/          → Web chat API (Claude AI)
    telegram-webhook/ → Telegram bot webhook
  migrations/      → DB migrations
```

## 🚀 Tech Stack

- **Frontend:** Next.js, Tailwind CSS
- **Backend:** Supabase Edge Functions (Deno)
- **Database:** Supabase PostgreSQL
- **AI:** Claude API (Anthropic)
- **Bot:** Telegram Bot API
- **Deploy:** Vercel (frontend) + Supabase (backend)

## ⚙️ Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### Supabase Edge Functions
```
ANTHROPIC_API_KEY=your_claude_api_key
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 📦 Setup

```bash
# Frontend
cd frontend
npm install
npm run dev

# Supabase functions (local)
supabase start
supabase functions serve
```
