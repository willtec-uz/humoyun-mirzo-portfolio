# 🚀 Loyihani ishga tushirish qo'llanmasi

## 1. Supabase sozlamalari

### Secrets qo'shish (Supabase Dashboard -> Settings -> Edge Functions)
```
ANTHROPIC_API_KEY = (Claude API kalitingiz)
TELEGRAM_BOT_TOKEN = (Telegram bot tokeningiz @BotFather dan)
```

### Edge Functions deploy qilish
```bash
# Supabase CLI o'rnatish
npm install -g supabase

# Login
supabase login

# Loyihaga ulash
supabase link --project-ref ethkngnzqzrnqzminskp

# Funksiyalarni deploy qilish
supabase functions deploy chat
supabase functions deploy telegram-webhook
```

## 2. Telegram Bot sozlash

### Bot yaratish
1. @BotFather ga boring
2. /newbot komandasi bering
3. Bot nomini kiriting
4. Token oling va Supabase Secrets ga qo'shing

### Webhook o'rnatish
```bash
curl -X POST "https://api.telegram.org/bot{TOKEN}/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://ethkngnzqzrnqzminskp.supabase.co/functions/v1/telegram-webhook"}'
```

## 3. Frontend sozlash
```bash
cd frontend
npm install
cp .env.example .env.local
# .env.local ga Supabase URL va anon key kiriting
npm run dev
```

## 4. Edge Function URL lar
- Chat API: `https://ethkngnzqzrnqzminskp.supabase.co/functions/v1/chat`
- Telegram Webhook: `https://ethkngnzqzrnqzminskp.supabase.co/functions/v1/telegram-webhook`
