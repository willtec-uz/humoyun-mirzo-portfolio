import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { message, conversation_id, user_info } = await req.json();

    // 1. Web userni ro'yxatdan o'tkazish yoki topish
    let webUserId: string | null = null;
    if (user_info?.email) {
      const { data: existingUser } = await supabase
        .from("web_users")
        .select("id")
        .eq("email", user_info.email)
        .single();

      if (existingUser) {
        webUserId = existingUser.id;
        await supabase.from("web_users")
          .update({ last_seen_at: new Date().toISOString() })
          .eq("id", webUserId);
      } else {
        const { data: newUser } = await supabase
          .from("web_users")
          .insert({ ...user_info, ip_address: req.headers.get("x-forwarded-for") })
          .select("id")
          .single();
        webUserId = newUser?.id;
      }
    }

    // 2. Conversation yaratish yoki davom ettirish
    let convId = conversation_id;
    if (!convId) {
      const { data: conv } = await supabase
        .from("conversations")
        .insert({ source: "web", web_user_id: webUserId })
        .select("id")
        .single();
      convId = conv?.id;
    }

    // 3. Foydalanuvchi xabarini saqlash
    await supabase.from("messages").insert({
      conversation_id: convId,
      role: "user",
      content: message,
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

    return new Response(
      JSON.stringify({ reply: aiReply, conversation_id: convId }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

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
- Aloqa uchun: Telegram @${profile?.telegram_username}`;
}
