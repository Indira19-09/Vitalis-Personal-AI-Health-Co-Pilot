import { useLanguage } from "@/components/language-provider";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Activity, CalendarCheck, FileText, MessageSquareHeart, Pill, Plus, Trash2 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Vitalis" },
      { name: "description", content: "Your health at a glance: vitals, medications, appointments, and records." },
      { property: "og:title", content: "Dashboard — Vitalis" },
      { property: "og:description", content: "Your health at a glance." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Dashboard,
});

const VITAL_METRICS = [
  { key: "heart_rate", label: "Heart Rate", unit: "bpm" },
  { key: "systolic_bp", label: "Systolic BP", unit: "mmHg" },
  { key: "weight", label: "Weight", unit: "kg" },
  { key: "glucose", label: "Blood Glucose", unit: "mg/dL" },
  { key: "spo2", label: "SpO₂", unit: "%" },
  { key: "sleep", label: "Sleep", unit: "hrs" },
];

interface Vital { id: string; metric: string; value: number; unit: string; recorded_at: string }

function Dashboard() {
  const { t, locale } = useLanguage();
  const { user } = useAuth();
  const [vitals, setVitals] = useState<Vital[]>([]);
  const [medCount, setMedCount] = useState(0);
  const [nextAppt, setNextAppt] = useState<{ doctor_name: string; specialty: string | null; appointment_date: string } | null>(null);
  const [recordCount, setRecordCount] = useState(0);
  const [selectedMetric, setSelectedMetric] = useState("heart_rate");
  const [newValue, setNewValue] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    if (!user) return;
    const [v, m, a, r] = await Promise.all([
      supabase.from("vitals").select("*").eq("user_id", user.id).order("recorded_at", { ascending: true }).limit(200),
      supabase.from("medications").select("id", { count: "exact", head: true }).eq("user_id", user.id).eq("active", true),
      supabase.from("appointments").select("doctor_name, specialty, appointment_date").eq("user_id", user.id).gte("appointment_date", new Date().toISOString()).order("appointment_date").limit(1),
      supabase.from("health_records").select("id", { count: "exact", head: true }).eq("user_id", user.id),
    ]);
    setVitals((v.data as Vital[]) ?? []);
    setMedCount(m.count ?? 0);
    setNextAppt(a.data?.[0] ?? null);
    setRecordCount(r.count ?? 0);
  }

  useEffect(() => { load(); }, [user]);

  async function addVital(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !newValue) return;
    setSaving(true);
    const meta = VITAL_METRICS.find((m) => m.key === selectedMetric);
    if (!meta) { setSaving(false); return; }
    await supabase.from("vitals").insert({ user_id: user.id, metric: meta.key, value: Number(newValue), unit: meta.unit });
    setNewValue("");
    setSaving(false);
    load();
  }

  async function deleteVital(id: string) {
    await supabase.from("vitals").delete().eq("id", id);
    load();
  }

  const metricMeta = VITAL_METRICS.find((m) => m.key === selectedMetric) ?? { key: "heart_rate", label: "Heart Rate", unit: "bpm" };
  const chartData = vitals
    .filter((v) => v.metric === selectedMetric)
    .map((v) => ({ date: new Date(v.recorded_at).toLocaleDateString(locale, { day: "numeric", month: "short" }), value: v.value, id: v.id }));
  const latest = chartData[chartData.length - 1];

  const stats = [
    { icon: Pill, label: "Active medications", value: String(medCount), to: "/medications" },
    { icon: CalendarCheck, label: "Next appointment", value: nextAppt ? `${nextAppt.doctor_name} · ${new Date(nextAppt.appointment_date).toLocaleDateString(locale, { day: "numeric", month: "short" })}` : t("None scheduled"), to: "/appointments" },
    { icon: FileText, label: "Health records", value: String(recordCount), to: "/records" },
    { icon: Activity, label: t("Latest {metric}", { metric: t(metricMeta.label) }), value: latest ? `${latest.value} ${metricMeta.unit}` : "—", to: "/dashboard" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{t("Health Dashboard")}</h1>
          <p className="mt-1 text-muted-foreground">{t("Your health at a glance")}</p>
        </div>
        <Link to="/chat" className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
          <MessageSquareHeart className="h-4 w-4" /> {t("Ask the AI Copilot")}
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={t(s.label)} to={s.to} className="card-hover rounded-2xl border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent">
                <s.icon className="h-5 w-5 text-accent-foreground" />
              </div>
              <div className="min-w-0">
                <div className="text-xs text-muted-foreground">{t(s.label)}</div>
                <div className="truncate text-lg font-bold">{s.value}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Vitals tracker */}
      <div className="rounded-2xl border bg-card p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-xl font-bold">{t("Vitals Tracker")}</h2>
          <form onSubmit={addVital} className="flex flex-wrap items-center gap-2">
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            >
              {VITAL_METRICS.map((m) => <option key={m.key} value={m.key}>{t(m.label)}</option>)}
            </select>
            <input
              type="number"
              step="any"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              placeholder={t("Value in {unit}", { unit: metricMeta.unit })}
              required
              className="w-36 rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            <button type="submit" disabled={saving} className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60">
              <Plus className="h-4 w-4" /> {t("Log")}
            </button>
          </form>
        </div>

        <div className="mt-6 h-64">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="id" tickFormatter={(id) => chartData.find((reading) => reading.id === id)?.date ?? ""} tick={{ fontSize: 12 }} stroke="var(--color-muted-foreground)" />
                <YAxis tick={{ fontSize: 12 }} stroke="var(--color-muted-foreground)" domain={["auto", "auto"]} />
                <Tooltip labelFormatter={(id) => chartData.find((reading) => reading.id === id)?.date ?? ""} contentStyle={{ borderRadius: 12, border: "1px solid var(--color-border)", background: "var(--color-card)" }} />
                <Line type="monotone" dataKey="value" stroke="var(--color-primary)" strokeWidth={2.5} dot={{ r: 4, fill: "var(--color-primary)" }} name={`${t(metricMeta.label)} (${metricMeta.unit})`} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center rounded-xl bg-muted text-sm text-muted-foreground">
              {t("No {metric} readings yet — log your first one above.", { metric: t(metricMeta.label) })}
            </div>
          )}
        </div>

        {chartData.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {chartData.slice(-8).reverse().map((d) => (
              <span key={d.id} className="group flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs">
                {d.date}: <b>{d.value}</b> {metricMeta.unit}
                <button onClick={() => deleteVital(d.id)} className="text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive">
                  <Trash2 className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
