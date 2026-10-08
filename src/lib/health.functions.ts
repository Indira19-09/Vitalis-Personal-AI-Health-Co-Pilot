import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const SYSTEM_PROMPT = `You are Vitalis, an AI-powered personal health copilot. You help users understand, organize, and manage their healthcare journey.

Your capabilities:
- Explain symptoms, conditions, medications, and lab results in plain language
- Help users prepare questions for doctor appointments
- Summarize the user's health data (provided below as context) and spot patterns
- Give general wellness, nutrition, sleep, and lifestyle guidance
- Remind users about medication adherence when relevant

Rules:
- You are NOT a doctor. Never diagnose. Always recommend consulting a qualified healthcare professional for medical decisions.
- If the user describes emergency symptoms (chest pain, difficulty breathing, severe bleeding, stroke signs, suicidal thoughts), immediately urge them to call emergency services (112 in India) or go to the nearest ER.
- Be warm, concise, and clear. Use short paragraphs and bullet points.
- When the user's health context is provided, personalize your answers using it.`;

const ACTION_INTENT =
  /\b(add|added|put|include|remove|delete|cancel|stop|discontinue|book|schedule|reschedule|log|record|save|update|set|change|mark)\b/i;

export const chatWithCopilot = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) =>
    z
      .object({
        message: z.string().min(1).max(4000),
        history: z
          .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() }))
          .max(20)
          .default([]),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) throw new Error("AI gateway key is not configured");

    const { supabase, userId } = context;

    // Build personal health context for personalization
    const [profile, meds, appts, vitals, records] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
      supabase.from("medications").select("name, dosage, frequency, time_of_day, active").eq("user_id", userId).eq("active", true),
      supabase.from("appointments").select("doctor_name, specialty, appointment_date, reason").eq("user_id", userId).gte("appointment_date", new Date().toISOString()).order("appointment_date").limit(5),
      supabase.from("vitals").select("metric, value, unit, recorded_at").eq("user_id", userId).order("recorded_at", { ascending: false }).limit(20),
      supabase.from("health_records").select("title, record_type, record_date, summary, ai_summary, extracted_data, created_at").eq("user_id", userId).order("created_at", { ascending: false }).limit(10),
    ]);

    const healthContext = [
      profile.data ? `Profile: ${profile.data.full_name || "unknown"}, blood group ${profile.data.blood_group || "unknown"}, allergies: ${profile.data.allergies || "none listed"}, conditions: ${profile.data.conditions || "none listed"}, ABHA ID: ${profile.data.abha_id || "not linked"}` : null,
      meds.data?.length ? `Active medications: ${meds.data.map((m) => `${m.name} ${m.dosage || ""} (${m.frequency || ""})`).join("; ")}` : null,
      appts.data?.length ? `Upcoming appointments: ${appts.data.map((a) => `${a.doctor_name} (${a.specialty || "general"}) on ${a.appointment_date}`).join("; ")}` : null,
      vitals.data?.length ? `Recent vitals: ${vitals.data.map((v) => `${v.metric}: ${v.value} ${v.unit}`).join("; ")}` : null,
      records.data?.length
        ? `Health records (most recently uploaded first):\n${records.data
            .map((r) => {
              const head = `- ${r.title} (${r.record_type || "record"}, ${r.record_date || "undated"})`;
              const summary = r.ai_summary || r.summary || "";
              const lines = [head, summary ? `  Summary: ${summary}` : ""];
              const e = r.extracted_data as
                | { medicines?: { name: string; dosage?: string | null; frequency?: string | null }[]; tests?: { name: string; value: string; unit?: string | null; reference_range?: string | null; abnormal?: boolean }[]; diagnoses?: string[] }
                | null;
              const meds = e?.medicines?.length ? e.medicines.slice(0, 8).map((m) => `${m.name}${m.dosage ? ` ${m.dosage}` : ""}${m.frequency ? ` (${m.frequency})` : ""}`).join("; ") : "";
              const abnormal = e?.tests?.filter((t) => t.abnormal).slice(0, 8).map((t) => `${t.name} ${t.value}${t.unit ? ` ${t.unit}` : ""}${t.reference_range ? ` (ref ${t.reference_range})` : ""}`).join("; ");
              const dx = e?.diagnoses?.length ? e.diagnoses.slice(0, 6).join("; ") : "";
              if (meds) lines.push(`  Medicines listed: ${meds}`);
              if (abnormal) lines.push(`  Abnormal values: ${abnormal}`);
              if (dx) lines.push(`  Diagnoses noted: ${dx}`);
              return lines.filter(Boolean).join("\n");
            })
            .join("\n")}`
        : null,
    ].filter(Boolean).join("\n");

    const [{ streamText, isStepCount }, { createGatewayProvider }, { buildCopilotTools }] = await Promise.all([
      import("ai"),
      import("./gateway.server"),
      import("./copilot-tools.server"),
    ]);
    type Action = import("./copilot-tools.server").CopilotAction;

    const now = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "full", timeStyle: "short" });
    const instructions =
      SYSTEM_PROMPT +
      `\n\nYou can take actions in the app using your tools: add/stop/remove medications, book/cancel appointments, log vitals, add health records, and update the user's profile. When the user asks you to do one of these, CALL THE TOOL — never claim something was done without calling it. Handle EVERY requested change in the message (e.g. 'cancel X and add Y' = two tool calls). Earlier assistant messages in the chat may be wrong — the health context below is the only source of truth for what is currently saved. After a tool runs, confirm briefly what was done (or explain the error). If key details are missing (e.g. appointment date), ask for them. Current date/time in India (IST, UTC+05:30): ${now}.` +
      (healthContext ? `\n\nUser's health context:\n${healthContext}` : "");

    const actions: Action[] = [];
    const provider = createGatewayProvider(apiKey);

    let reply = "";
    try {
      const result = streamText({
        model: provider.responses("openai/gpt-6-astra"),
        instructions,
        messages: [...data.history, { role: "user" as const, content: data.message }],
        tools: buildCopilotTools(supabase, userId, actions),
        stopWhen: isStepCount(8),
        // When the user asks for a change, force a real tool call on the first step
        // so the model can't just claim it did it.
        prepareStep: ({ stepNumber }) =>
          stepNumber === 0 && ACTION_INTENT.test(data.message) ? { toolChoice: "required" as const } : undefined,
        providerOptions: {
          openai: {
            forceReasoning: true,
            reasoningEffort: "low",
            reasoningSummary: "auto",
            store: false,
            include: ["reasoning.encrypted_content"],
          },
        },
      });
      reply = (await result.text).trim();
    } catch (err) {
      const status = (err as { statusCode?: number }).statusCode;
      console.error("AI gateway failed", status, err);
      if (status === 429) throw new Error("The AI is busy right now — please try again in a moment.");
      if (status === 402) throw new Error("AI credits are exhausted. Please top up in Settings → Plans & credits.");
      if (status === 403) throw new Error("AI access is blocked for this workspace. Please check your workspace AI settings.");
      throw new Error(`AI request failed${status ? ` (${status})` : ""}. Please try again.`);
    }

    if (!reply) {
      reply = actions.length
        ? actions.map((a) => `${a.ok ? "✅" : "⚠️"} ${a.label}`).join("\n")
        : "Sorry, I couldn't generate a response.";
    }

    // Persist the conversation turn
    await supabase.from("chat_messages").insert([
      { user_id: userId, role: "user", content: data.message },
      { user_id: userId, role: "assistant", content: reply },
    ]);

    return { reply, actions };
  });
