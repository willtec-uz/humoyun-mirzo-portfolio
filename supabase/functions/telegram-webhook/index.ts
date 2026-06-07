import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const body = await req.json();
    const message = body?.message;
    if (!message) return new Response("ok");

    const tgUser = message.from;
    const chatId = message.chat.id;
    const text = message.text ?? "";

    // 1. Telegram userni ro'yxatdan o'tkazish
    const { data: existingUser } = await supabase
      .from("telegram_users")
      .select("id")
      .eq("telegram_id", tgUser.id)
      .single();

    let tgUserId: string;
    if (existingUser) {
      tgUserId = existingUser.id;
      await supabase.from("telegram_users")
        .update({ last_seen_at: new Date().toISOString() })
        .eq("id", tgUserId);
    } else {
      const { data: newUser } = await supabase
        .from("telegram_users")
        .insert({
          telegram_id: tgUser.id,
          username: tgUser.username,
          first_name: tgUser.first_name,
          last_name: tgUser.last_name,
          language_code: tgUser.language_code,
        })
        .select("id")
        .single();
      tgUserId = newUser!.id;
    }

    // /start komandasi
    if (text === "/start") {
      const { data: profile } = await supabase.from("owner_profile").select("full_name, telegram_username").single();
      const greeting = `Salom! 👋 Men ${profile?.full_name ?? "Humoyun Mirzo"}ning AI yordamchisiman.\n\nWeb sayt, Telegram bot yoki dizayn bo'yicha savollaringizga javob berishga tayyorman. Nima bilan yordam bera olaman?`;
      await sendTelegramMessage(chatId, greeting);
      return new Response("ok");
    }

    // 2. Aktiv conversation topish yoki yaratish
    const { data: existingConv } = await supabase
      .from("conversations")
      .select("id")
      .eq("telegram_user_id", tgUserId)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    let convId: string;
    if (existingConv) {
      convId = existingConv.id;
    } else {
      const { data: newConv } = await supabase
        .from("conversations")
        .insert({ source: "telegram", telegram_user_id: tgUserId })
        .select("id")
        .single();
      convId = newConv!.id;
    }

    // 3. Xabarni saqlash
    await supabase.from("messages").insert({
      conversation_id: convId,
      role: "user",
      content: text,
    });

    // 4. Suhbat tarixini olish
    const { data: history } = await supabase
      .from("messages")
      .select("role, content")
      .eq("conversation_id", convId)
      .order("created_at", { ascending: true })
      .limit(20);

    // 5. Dinamik ma'lumotlarni olish
    const [{ data: profile }, { data: services }, { data: projects }, { data: skills }] =
      await Promise.all([
        supabase.from("owner_profile").select("*").single(),
        supabase.from("services").select("*").eq("is_active", true).order("sort_order"),
        supabase.from("projects").select("*").eq("is_visible", true).order("sort_order"),
        supabase.from("skills").select("*").eq("is_visible", true).order("sort_order"),
      ]);

    // 6. System prompt
    const systemPrompt = buildSystemPrompt(profile, services, projects, skills);

    // 7. Claude API
    const claudeRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": Deno.env.get("ANTHROPIC_API_KEY")!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: systemPrompt,
        messages: history?.map((m) => ({ role: m.role, content: m.content })) ?? [],
      }),
    });

    const claudeData = await claudeRes.json();
    const aiReply = claudeData.content?.[0]?.text ?? "Kechirasiz, xatolik yuz berdi.";
    const tokensUsed = claudeData.usage?.output_tokens ?? 0;

    // 8. AI javobini saqlash
    await supabase.from("messages").insert({
      conversation_id: convId,
      role: "assistant",
      content: aiReply,
      tokens_used: tokensUsed,
    });

    // 9. Telegram ga yuborish
    await sendTelegramMessage(chatId, aiReply);

    return new Response("ok");
  } catch (err) {
    console.error(err);
    return new Response("error", { status: 500 });
  }
});

async function sendTelegramMessage(chatId: number, text: string) {
  const token = Deno.env.get("TELEGRAM_BOT_TOKEN")!;
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "Markdown" }),
  });
}

function buildSystemPrompt(profile: any, services: any[], projects: any[], skills: any[]) {
  return `Siz ${profile?.full_name ?? "Humoyun Mirzo"}ning shaxsiy AI yordamchisisiz.

## Shaxs haqida
- Ism: ${profile?.full_name}
- Lavozim: ${profile?.title}
- Bio: ${profile?.bio}
- Joylashuv: ${profile?.location}
- Telegram: @${profile?.telegram_username}

## Xizmatlar
${services?.map((s) => `- **${s.title}**: ${s.description} | Texnologiyalar: ${s.technologies?.join(", ")}`).join("\n")}

## Loyihalar
${projects?.map((p) => `- **${p.title}** (${p.category}): ${p.description} | ${p.technologies?.join(", ")}`).join("\n") || "Hozircha qo'shilmagan"}

## Ko'nikmalar
${skills?.map((s) => `${s.name} (${s.level}%)`).join(", ")}

## Qoidalar
- Mijoz qaysi tilda yozsa, shu tilda javob ber (o'zbek, rus, ingliz)
- Me'yoriy, samimiy va professional uslubda gapir
- Narx so'ralsa: "loyiha hajbiga qarab" de va bog'lanishga taklif qil
- Batafsil va to'liq javob ber
- Telegram aloqa: @${profile?.telegram_username}`;
}
