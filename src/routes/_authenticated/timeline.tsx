import { useLanguage } from "@/components/language-provider";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Activity, CalendarCheck, FileText, Link2, Loader2, Pill, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/_authenticated/timeline")({
  head: () => ({
    meta: [
      { title: "Health Timeline — Vitalis" },
      { name: "description", content: "Your unified health profile: records, vitals, appointments, and medications in one timeline." },
      { property: "og:title", content: "Health Timeline — Vitalis" },
      { property: "og:description", content: "Your unified health profile in one timeline." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TimelinePage,
});

interface Profile {
  full_name: string | null; blood_group: string | null; allergies: string | null;
  conditions: string | null; date_of_birth: string | null; abha_id: string | null;
}

interface Event {
  id: string;
  date: string;
  kind: "record" | "vital" | "appointment" | "medication";
  title: string;
  detail: string;
}

const KIND_META = {
  record: { icon: FileText, label: "Record", color: "bg-accent text-accent-foreground" },
  vital: { icon: Activity, label: "Vital", color: "bg-primary/10 text-primary" },
  appointment: { icon: CalendarCheck, label: "Appointment", color: "bg-secondary text-secondary-foreground" },
  medication: { icon: Pill, label: "Medication", color: "bg-muted text-muted-foreground" },
} as const;

function TimelinePage() {
  const { t, locale } = useLanguage();
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [linkingAbha, setLinkingAbha] = useState(false);

  async function load() {
    if (!user) return;
    setLoading(true);
    const [p, recs, vits, appts, meds] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
      supabase.from("health_records").select("id, title, record_type, record_date, created_at").eq("user_id", user.id),
      supabase.from("vitals").select("id, metric, value, unit, recorded_at").eq("user_id", user.id).order("recorded_at", { ascending: false }).limit(50),
      supabase.from("appointments").select("id, doctor_name, specialty, appointment_date, status").eq("user_id", user.id),
      supabase.from("medications").select("id, name, dosage, created_at, active").eq("user_id", user.id),
    ]);
    setProfile((p.data as Profile) ?? null);

    const ev: Event[] = [];
    for (const r of recs.data ?? []) ev.push({ id: `r-${r.id}`, date: r.record_date ?? r.created_at, kind: "record", title: r.title, detail: r.record_type });
    for (const v of vits.data ?? []) ev.push({ id: `v-${v.id}`, date: v.recorded_at, kind: "vital", title: `${v.metric.replace("_", " ")}: ${v.value} ${v.unit}`, detail: "Vital reading" });
    for (const a of appts.data ?? []) ev.push({ id: `a-${a.id}`, date: a.appointment_date, kind: "appointment", title: `Dr. ${a.doctor_name}`, detail: [a.specialty, a.status].filter(Boolean).join(" · ") });
    for (const m of meds.data ?? []) ev.push({ id: `m-${m.id}`, date: m.created_at, kind: "medication", title: m.name, detail: [m.dosage, m.active ? "active" : "stopped"].filter(Boolean).join(" · ") });
    ev.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setEvents(ev);
    setLoading(false);
  }

  useEffect(() => { load(); }, [user]);

  async function linkAbha() {
    if (!user) return;
    setLinkingAbha(true);
    // Mock ABHA link: generates a 14-digit ABHA number (demo only, no real ABDM call)
    const abha = Array.from({ length: 14 }, () => Math.floor(Math.random() * 10)).join("").replace(/(\d{4})(\d{4})(\d{4})(\d{2})/, "$1-$2-$3-$4");
    await supabase.from("profiles").update({ abha_id: abha }).eq("id", user.id);
    setLinkingAbha(false);
    load();
  }

  let lastMonth = "";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">{t("Health Timeline")}</h1>
        <p className="mt-1 text-muted-foreground">{t("Your complete health journey in one place")}</p>
      </div>

      {/* Unified health profile */}
      <div className="rounded-2xl border bg-card p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent">
              <User className="h-6 w-6 text-accent-foreground" />
            </div>
            <div>
              <div className="text-lg font-bold">{profile?.full_name ?? "Your profile"}</div>
              <div className="text-sm text-muted-foreground">
                {[
                  profile?.blood_group ? t("Blood group {group}", { group: profile.blood_group }) : null,
                  profile?.date_of_birth ? t("Born {date}", { date: new Date(profile.date_of_birth).toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric" }) }) : null,
                ].filter(Boolean).join(" · ") || t("Ask the AI copilot to update your profile")}
              </div>
            </div>
          </div>
          <div className="text-right">
            {profile?.abha_id ? (
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t("ABHA ID (mock)")}</div>
                <div className="font-mono text-sm font-semibold text-primary">{profile.abha_id}</div>
              </div>
            ) : (
              <button onClick={linkAbha} disabled={linkingAbha} className="flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold hover:bg-muted disabled:opacity-60">
                {linkingAbha ? <Loader2 className="h-4 w-4 animate-spin" /> : <Link2 className="h-4 w-4" />}
                {t("Link ABHA ID")}
              </button>
            )}
          </div>
        </div>
        {(profile?.allergies || profile?.conditions) && (
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            {profile.allergies && <span className="rounded-full bg-destructive/10 px-3 py-1 font-medium text-destructive">{t("Allergies:")} {profile.allergies}</span>}
            {profile.conditions && <span className="rounded-full bg-muted px-3 py-1 font-medium">{t("Conditions:")} {profile.conditions}</span>}
          </div>
        )}
      </div>

      {/* Timeline */}
      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : events.length === 0 ? (
        <div className="rounded-2xl border bg-card py-16 text-center text-sm text-muted-foreground">
          {t("Nothing here yet — add records, vitals, medications, or appointments and they'll appear in your timeline.")}
        </div>
      ) : (
        <div className="relative space-y-4 pl-6 before:absolute before:inset-y-2 before:left-2 before:w-px before:bg-border">
          {events.map((e) => {
            const month = new Date(e.date).toLocaleDateString(locale, { month: "long", year: "numeric" });
            const showMonth = month !== lastMonth;
            lastMonth = month;
            const meta = KIND_META[e.kind];
            return (
              <div key={e.id}>
                {showMonth && <div className="relative -left-6 mb-1 mt-2 bg-background pr-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">{month}</div>}
                <div className="relative flex items-start gap-4 rounded-2xl border bg-card p-4">
                  <span className="absolute -left-[1.65rem] top-5 h-2.5 w-2.5 rounded-full border-2 border-primary bg-background" />
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${meta.color}`}>
                    <meta.icon className="h-4.5 w-4.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium capitalize">{e.kind === "vital" ? e.title.replace(/^[^:]+/, (metric) => t(metric)) : e.title}</div>
                    <div className="text-xs text-muted-foreground">{t(meta.label)}{e.detail ? ` · ${e.detail.split(" · ").map((part) => t(part)).join(" · ")}` : ""}</div>
                  </div>
                  <div className="max-w-24 shrink-0 text-right text-xs text-muted-foreground">
                    {new Date(e.date).toLocaleDateString(locale, { day: "numeric", month: "short" })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
