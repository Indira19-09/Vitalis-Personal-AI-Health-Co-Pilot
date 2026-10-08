import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export interface ExtractedMedicine {
  name: string;
  dosage: string | null;
  frequency: string | null;
  duration: string | null;
}
export interface ExtractedTest {
  name: string;
  value: string;
  unit: string | null;
  reference_range: string | null;
  abnormal: boolean;
}
export interface ExtractedRecord {
  title: string | null;
  record_type: string | null;
  record_date: string | null;
  provider: string | null;
  patient_name: string | null;
  medicines: ExtractedMedicine[];
  tests: ExtractedTest[];
  diagnoses: string[];
  notes: string | null;
}

const LANG_NAMES: Record<string, string> = { en: "English", hi: "Hindi", te: "Telugu" };

const EXTRACTION_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: [
    "title", "record_type", "record_date", "provider", "patient_name",
    "medicines", "tests", "diagnoses", "notes",
  ],
  properties: {
    title: { type: ["string", "null"] },
    record_type: {
      type: ["string", "null"],
      enum: ["Lab report", "Prescription", "Scan / Imaging", "Discharge summary", "Vaccination", "Insurance", "Other", null],
    },
    record_date: { type: ["string", "null"], description: "YYYY-MM-DD" },
    provider: { type: ["string", "null"], description: "lab / hospital / doctor / clinic name" },
    patient_name: { type: ["string", "null"] },
    medicines: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["name", "dosage", "frequency", "duration"],
        properties: {
          name: { type: "string" },
          dosage: { type: ["string", "null"] },
          frequency: { type: ["string", "null"] },
          duration: { type: ["string", "null"] },
        },
      },
    },
    tests: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["name", "value", "unit", "reference_range", "abnormal"],
        properties: {
          name: { type: "string" },
          value: { type: "string" },
          unit: { type: ["string", "null"] },
          reference_range: { type: ["string", "null"] },
          abnormal: { type: "boolean", description: "true when value is outside the reference range" },
        },
      },
    },
    diagnoses: { type: "array", items: { type: "string" } },
    notes: { type: ["string", "null"] },
  },
} as const;

const EXTRACT_PROMPT = `You are a medical document OCR and extraction engine. Analyze this image of a medical document (prescription, lab report, discharge summary, or diagnostic record) and extract its contents into the requested JSON structure.

Rules:
- Always fill title with a short human-readable name for the document, e.g. "Complete Blood Count" or "Prescription — Dr. R. Prasad". Never leave it null when any heading or test panel is printed on the page.
- Always fill record_type with the best fit from the allowed list: "Lab report" when the document lists test values, "Prescription" when it lists medicines advised, "Scan / Imaging" for X-ray/CT/MRI/ultrasound reports, "Discharge summary" for hospital discharge papers, "Vaccination" for vaccination cards.
- Always fill record_date (YYYY-MM-DD, from the document), provider (the lab, hospital, clinic or doctor name printed on it) and patient_name when they are printed.
- Mark a test "abnormal": true when its value falls outside the stated reference range (or the standard range when none is stated).
- Extract EVERY medicine with its dosage, frequency and duration, and EVERY test value with its unit and reference range.
- Handle handwritten and bilingual (English + regional language) documents; transliterate to English where needed.
- If the image is not a medical document, return empty arrays and set notes to "Not a medical document".`;

function summaryPrompt(extracted: ExtractedRecord, language: string) {
  const lang = LANG_NAMES[language] ?? "English";
  return `You are a health-records explainer. Given this structured extraction from a medical document, write a short summary in SIMPLE ${lang} that any patient can understand.

Extraction JSON:
${JSON.stringify(extracted)}

Rules:
- 3-6 short sentences or bullets. Plain words, no jargon — explain any medical term you must use.
- Clearly call out any abnormal test values and what they generally indicate, without diagnosing.
- Mention medicines and what they are commonly prescribed for.
- End with: "This is a simplified explanation, not medical advice — please discuss with your doctor." (translated into ${lang}).
- Write ONLY the summary text.`;
}

async function toDataUrl(blob: Blob) {
  const bytes = new Uint8Array(await blob.arrayBuffer());
  let bin = "";
  const CHUNK = 0x8000;
  for (let i = 0; i < bytes.length; i += CHUNK) {
    bin += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
  }
  return `data:${blob.type || "image/jpeg"};base64,${btoa(bin)}`;
}

function handleAiError(err: unknown): never {
  const status = (err as { statusCode?: number }).statusCode;
  console.error("AI request failed", status, err);
  if (status === 429) throw new Error("The AI is busy right now — please try again in a moment.");
  if (status === 402) throw new Error("AI credits are exhausted. Please top up in Settings → Plans & credits.");
  if (status === 403) throw new Error("AI access is blocked for this workspace. Please check your workspace AI settings.");
  throw new Error(`AI request failed${status ? ` (${status})` : ""}. Please try again.`);
}

const RESPONSES_OPTS = {
  openai: {
    forceReasoning: true,
    reasoningEffort: "low" as const,
    reasoningSummary: "auto" as const,
    store: false,
    include: ["reasoning.encrypted_content"],
  },
};

export const analyzeHealthRecord = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) =>
    z
      .object({
        recordId: z.string().uuid(),
        filePath: z.string().min(1),
        language: z.enum(["en", "hi", "te"]).default("en"),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) throw new Error("AI gateway key is not configured");
    const { supabase, userId } = context;

    // Verify the record belongs to this user
    const { data: rec, error: recErr } = await supabase
      .from("health_records")
      .select("id, file_url")
      .eq("id", data.recordId)
      .eq("user_id", userId)
      .single();
    if (recErr || !rec) throw new Error("Record not found");

    const { data: blob, error: dlErr } = await supabase.storage
      .from("health-documents")
      .download(data.filePath);
    if (dlErr || !blob) throw new Error("Could not read the uploaded file");

    const [{ streamText }, { createGatewayProvider }] = await Promise.all([
      import("ai"),
      import("./gateway.server"),
    ]);
    const provider = createGatewayProvider(apiKey);
    const model = provider.responses("openai/gpt-6-astra");
    const image = await toDataUrl(blob);

    let extracted: ExtractedRecord;
    try {
      const result = streamText({
        model,
        messages: [
          {
            role: "user" as const,
            content: [
              { type: "image" as const, image },
              { type: "text" as const, text: EXTRACT_PROMPT },
            ],
          },
        ],
        providerOptions: {
          ...RESPONSES_OPTS,
          openai: {
            ...RESPONSES_OPTS.openai,
            text: {
              format: {
                type: "json_schema",
                name: "medical_record_extraction",
                strict: true,
                schema: EXTRACTION_SCHEMA,
              },
            },
          },
        },
      });
      extracted = JSON.parse(await result.text) as ExtractedRecord;
    } catch (err) {
      handleAiError(err);
    }

    // Plain-language summary in the requested language
    let aiSummary = "";
    try {
      const sum = streamText({
        model,
        messages: [{ role: "user" as const, content: summaryPrompt(extracted!, data.language) }],
        providerOptions: RESPONSES_OPTS,
      });
      aiSummary = (await sum.text).trim();
    } catch (err) {
      console.error("Summary generation failed", err);
    }

    const { error: upErr } = await supabase
      .from("health_records")
      .update({
        title: extracted!.title || "Scanned document",
        record_type: extracted!.record_type || "Other",
        record_date: extracted!.record_date,
        provider: extracted!.provider,
        extracted_data: JSON.parse(JSON.stringify(extracted)),
        ai_summary: aiSummary || null,
        summary_language: data.language,
      })
      .eq("id", data.recordId)
      .eq("user_id", userId);
    if (upErr) throw new Error("Failed to save the analysis");

    return { extracted: extracted!, aiSummary };
  });

export const summarizeRecord = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) =>
    z
      .object({ recordId: z.string().uuid(), language: z.enum(["en", "hi", "te"]) })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) throw new Error("AI gateway key is not configured");
    const { supabase, userId } = context;

    const { data: rec, error } = await supabase
      .from("health_records")
      .select("extracted_data")
      .eq("id", data.recordId)
      .eq("user_id", userId)
      .single();
    if (error || !rec?.extracted_data) throw new Error("No extracted data to summarize");

    const [{ streamText }, { createGatewayProvider }] = await Promise.all([
      import("ai"),
      import("./gateway.server"),
    ]);
    const provider = createGatewayProvider(apiKey);
    const result = streamText({
      model: provider.responses("openai/gpt-6-astra"),
      messages: [
        {
          role: "user" as const,
          content: summaryPrompt(rec.extracted_data as unknown as ExtractedRecord, data.language),
        },
      ],
      providerOptions: RESPONSES_OPTS,
    });
    const aiSummary = (await result.text).trim();

    await supabase
      .from("health_records")
      .update({ ai_summary: aiSummary, summary_language: data.language })
      .eq("id", data.recordId)
      .eq("user_id", userId);

    return { aiSummary };
  });
