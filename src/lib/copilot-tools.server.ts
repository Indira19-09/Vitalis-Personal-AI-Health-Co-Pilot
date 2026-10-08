import { tool } from "ai";
import { z } from "zod/v4";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export interface CopilotAction {
  type: string;
  label: string;
  ok: boolean;
}

const VITALS: Record<string, string> = {
  heart_rate: "bpm",
  systolic_bp: "mmHg",
  weight: "kg",
  glucose: "mg/dL",
  spo2: "%",
  sleep: "hrs",
};

/**
 * Tools the copilot can call to act on the signed-in user's data.
 * All writes go through the user's own RLS-scoped client.
 */
export function buildCopilotTools(
  supabase: SupabaseClient<Database>,
  userId: string,
  actions: CopilotAction[],
) {
  const record = (type: string, label: string, ok: boolean) => actions.push({ type, label, ok });

  return {
    add_medication: tool({
      description: "Add a medication to the user's medications list.",
      inputSchema: z.object({
        name: z.string().describe("Medication name, e.g. 'Dolo 650'"),
        dosage: z.string().nullable().describe("e.g. '650 mg', or null"),
        frequency: z
          .enum(["Once daily", "Twice daily", "Three times daily", "As needed", "Weekly"])
          .nullable(),
        time_of_day: z.enum(["Morning", "Afternoon", "Evening", "Night", "With meals"]).nullable(),
        notes: z.string().nullable(),
      }),
      execute: async (input) => {
        const { error } = await supabase.from("medications").insert({
          user_id: userId,
          name: input.name,
          dosage: input.dosage,
          frequency: input.frequency ?? "Once daily",
          time_of_day: input.time_of_day ?? "Morning",
          notes: input.notes,
          active: true,
        });
        record("medication", `Added medication: ${input.name}`, !error);
        return error ? { ok: false, error: error.message } : { ok: true };
      },
    }),

    stop_medication: tool({
      description: "Mark a medication as stopped (inactive) by name.",
      inputSchema: z.object({ name: z.string() }),
      execute: async ({ name }) => {
        const { data, error } = await supabase
          .from("medications")
          .update({ active: false })
          .eq("user_id", userId)
          .eq("active", true)
          .ilike("name", `%${name}%`)
          .select("id");
        const ok = !error && (data?.length ?? 0) > 0;
        record("medication", `Stopped medication: ${name}`, ok);
        return ok ? { ok: true, stopped: data!.length } : { ok: false, error: error?.message ?? "No matching active medication" };
      },
    }),

    delete_medication: tool({
      description: "Permanently remove a medication from the list by name.",
      inputSchema: z.object({ name: z.string() }),
      execute: async ({ name }) => {
        const { data, error } = await supabase
          .from("medications")
          .delete()
          .eq("user_id", userId)
          .ilike("name", `%${name}%`)
          .select("id");
        const ok = !error && (data?.length ?? 0) > 0;
        record("medication", `Removed medication: ${name}`, ok);
        return ok ? { ok: true, removed: data!.length } : { ok: false, error: error?.message ?? "No matching medication" };
      },
    }),

    book_appointment: tool({
      description: "Book a doctor appointment for the user.",
      inputSchema: z.object({
        doctor_name: z.string(),
        specialty: z.string().nullable(),
        appointment_datetime: z
          .string()
          .describe("ISO 8601 datetime with timezone offset, e.g. 2026-10-12T10:30:00+05:30"),
        location: z.string().nullable(),
        reason: z.string().nullable(),
      }),
      execute: async (input) => {
        const date = new Date(input.appointment_datetime);
        if (Number.isNaN(date.getTime())) return { ok: false, error: "Invalid date" };
        const { error } = await supabase.from("appointments").insert({
          user_id: userId,
          doctor_name: input.doctor_name,
          specialty: input.specialty,
          appointment_date: date.toISOString(),
          location: input.location,
          reason: input.reason,
        });
        record("appointment", `Booked appointment with ${input.doctor_name}`, !error);
        return error ? { ok: false, error: error.message } : { ok: true };
      },
    }),

    cancel_appointment: tool({
      description: "Cancel (delete) an upcoming appointment by doctor name.",
      inputSchema: z.object({ doctor_name: z.string() }),
      execute: async ({ doctor_name }) => {
        const { data, error } = await supabase
          .from("appointments")
          .delete()
          .eq("user_id", userId)
          .ilike("doctor_name", `%${doctor_name}%`)
          .gte("appointment_date", new Date().toISOString())
          .select("id");
        const ok = !error && (data?.length ?? 0) > 0;
        record("appointment", `Cancelled appointment with ${doctor_name}`, ok);
        return ok ? { ok: true } : { ok: false, error: error?.message ?? "No matching upcoming appointment" };
      },
    }),

    log_vital: tool({
      description:
        "Log a vital sign reading. Metrics: heart_rate (bpm), systolic_bp (mmHg), weight (kg), glucose (mg/dL), spo2 (%), sleep (hrs).",
      inputSchema: z.object({
        metric: z.enum(["heart_rate", "systolic_bp", "weight", "glucose", "spo2", "sleep"]),
        value: z.number(),
      }),
      execute: async ({ metric, value }) => {
        const { error } = await supabase
          .from("vitals")
          .insert({ user_id: userId, metric, value, unit: VITALS[metric] ?? "" });
        record("vital", `Logged ${metric.replace("_", " ")}: ${value} ${VITALS[metric]}`, !error);
        return error ? { ok: false, error: error.message } : { ok: true };
      },
    }),

    add_health_record: tool({
      description: "Add a health record (lab report, prescription, scan, etc.).",
      inputSchema: z.object({
        title: z.string(),
        record_type: z.enum([
          "Lab report",
          "Prescription",
          "Scan / Imaging",
          "Discharge summary",
          "Vaccination",
          "Insurance",
          "Other",
        ]),
        record_date: z.string().nullable().describe("YYYY-MM-DD or null"),
        provider: z.string().nullable(),
        summary: z.string().nullable(),
      }),
      execute: async (input) => {
        const { error } = await supabase.from("health_records").insert({ user_id: userId, ...input });
        record("record", `Added record: ${input.title}`, !error);
        return error ? { ok: false, error: error.message } : { ok: true };
      },
    }),

    update_profile: tool({
      description: "Update the user's health profile. Pass null for fields that should not change.",
      inputSchema: z.object({
        full_name: z.string().nullable(),
        blood_group: z.string().nullable(),
        allergies: z.string().nullable(),
        conditions: z.string().nullable(),
        abha_id: z.string().nullable().describe("ABHA (Ayushman Bharat Health Account) ID"),
      }),
      execute: async (input) => {
        const patch: Database["public"]["Tables"]["profiles"]["Update"] = {};
        if (input.full_name !== null) patch.full_name = input.full_name;
        if (input.blood_group !== null) patch.blood_group = input.blood_group;
        if (input.allergies !== null) patch.allergies = input.allergies;
        if (input.conditions !== null) patch.conditions = input.conditions;
        if (input.abha_id !== null) patch.abha_id = input.abha_id;
        if (Object.keys(patch).length === 0) return { ok: false, error: "Nothing to update" };
        const { error } = await supabase.from("profiles").update(patch).eq("id", userId);
        record("profile", `Updated profile: ${Object.keys(patch).join(", ").replace(/_/g, " ")}`, !error);
        return error ? { ok: false, error: error.message } : { ok: true };
      },
    }),
  };
}
