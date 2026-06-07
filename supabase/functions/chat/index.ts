import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY")!;
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { message, conversation_id, user_info } = await req.json();

    let webUserId = null;
    if (user_info?.email) {
      const { data: eu } = await supabase.from("web_users").select("id").eq("email", user_info.email).single();
      if (eu) { webUserId = eu.id; await supabase.from("web_users").update({ last_seen_at: new Date().toISOString() }).eq("id", webUserId); }
      else { const { data: nu } = await supabase.from("web_users").insert({ ...user_info, ip_address: req.headers.get("x-forwarded-for") }).select("id").single(); webUserId = nu?.id; }
    }

    let convId = conversation_id;
    if (!convId) { const { data: c } = await supabase.from("conversations").insert({ source: "web", web_user_id: webUserId }).select("id").single(); convId = c?.id; }

    await supabase.from("messages").insert({ conversation_id: convId, role: "user", content: message });

    const { data: history } = await supabase.from("messages").select("role, content").eq("conversation_id", convId).order("created_at", { ascending: true }).limit(20);
    const [{ data: profile }, { data: services }, { data: projects }, { data: skills }] = await Promise.all([
      supabase.from("owner_profile").select("*").single(),
      supabase.from("services").select("*").eq("is_active", true).order("sort_order"),
      supabase.from("projects").select("*").eq("is_visible", true).order("sort_order"),
      supabase.from("skills").select("*").eq("is_visible", true).order("sort_order"),
    ]);

    const systemPrompt = `Siz ${profile?.full_name ?? "Humoyun Mirzo"}ning shaxsiy AI yordamchisisiz.\nShaxs: ${profile?.full_name}, ${profile?.title}, ${profile?.location}\nXizmatlar:\n${services?.map((s) => `- ${s.title}: ${s.description}`).join("\n")}\nLoyihalar:\n${projects?.map((p) => `- ${p.title}: ${p.description}`).join("\n") || "Hozircha yo'q"}\nKo'nikmalar: ${skills?.map((s) => s.name).join(", ")}\nQoidalar: mijoz tilida javob ber, narx so'ralsa loyiha hajbiga qarab de, batafsil javob ber, aloqa: @${profile?.telegram_username}`;

    const msgs = [{ role: "system", content: systemPrompt }, ...(history?.map((m) => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.content })) ?? [])];
    const groqRes = await fetch(GROQ_URL, { method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${GROQ_API_KEY}` }, body: JSON.stringify({ model: "llama-3.3-70b-versatile", messages: msgs, max_tokens: 1000 }) });
    const groqData = await groqRes.json();
    const aiReply = groqData.choices?.[0]?.message?.content ?? "Kechirasiz, xatolik yuz berdi.";

    await supabase.from("messages").insert({ conversation_id: convId, role: "assistant", content: aiReply });
    return new Response(JSON.stringify({ reply: aiReply, conversation_id: convId }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
