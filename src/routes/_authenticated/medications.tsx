import { useLanguage } from "@/components/language-provider";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Pill, Plus, Trash2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/_authenticated/medications")({
  head: () => ({
    meta: [
      { title: "Medications — Vitalis" },
      { name: "description", content: "Track your medications, dosages, and schedules." },
      { property: "og:title", content: "Medications — Vitalis" },
      { property: "og:description", content: "Track your medications, dosages, and schedules." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: MedicationsPage,
});

interface Med {
  id: string; name: string; dosage: string | null; frequency: string | null;
  time_of_day: string | null; active: boolean; notes: string | null;
}

const emptyForm = { name: "", dosage: "", frequency: "Once daily", time_of_day: "Morning", notes: "" };

function MedicationsPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [meds, setMeds] = useState<Med[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  async function load() {
    if (!user) return;
    const { data } = await supabase.from("medications").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    setMeds((data as Med[]) ?? []);
  }

  useEffect(() => { load(); }, [user]);

  async function addMed(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    await supabase.from("medications").insert({ user_id: user.id, ...form });
    setForm(emptyForm);
    setShowForm(false);
    setSaving(false);
    load();
  }

  async function toggleActive(m: Med) {
    await supabase.from("medications").update({ active: !m.active }).eq("id", m.id);
    load();
  }

  async function remove(id: string) {
    await supabase.from("medications").delete().eq("id", id);
    load();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{t("Medications")}</h1>
          <p className="mt-1 text-muted-foreground">{t("Track prescriptions, dosages, and schedules")}</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? t("Cancel") : t("Add medication")}
        </button>
      </div>

      {showForm && (
        <form onSubmit={addMed} className="grid gap-4 rounded-2xl border bg-card p-6 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium">{t("Medication name")}</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="Metformin" className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">{t("Dosage")}</label>
            <input value={form.dosage} onChange={(e) => setForm({ ...form, dosage: e.target.value })} placeholder="500 mg" className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">{t("Frequency")}</label>
            <select value={form.frequency} onChange={(e) => setForm({ ...form, frequency: e.target.value })} className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring">
              {["Once daily", "Twice daily", "Three times daily", "Weekly", "As needed"].map((f) => <option key={f} value={f}>{t(f)}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">{t("Time of day")}</label>
            <select value={form.time_of_day} onChange={(e) => setForm({ ...form, time_of_day: e.target.value })} className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring">
              {["Morning", "Afternoon", "Evening", "Night", "With meals"].map((time) => <option key={time} value={time}>{t(time)}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium">{t("Notes (optional)")}</label>
            <input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder={t("Take after food")} className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div className="sm:col-span-2">
            <button type="submit" disabled={saving} className="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60">
              {saving ? t("Saving…") : t("Save medication")}
            </button>
          </div>
        </form>
      )}

      {meds.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border bg-card py-16 text-center">
          <Pill className="mb-3 h-10 w-10 text-muted-foreground" />
          <p className="font-medium">{t("No medications yet")}</p>
          <p className="mt-1 text-sm text-muted-foreground">{t("Add your first medication to start tracking.")}</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {meds.map((m) => (
            <div key={m.id} className={`card-hover rounded-2xl border bg-card p-5 ${!m.active ? "opacity-60" : ""}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent">
                    <Pill className="h-5 w-5 text-accent-foreground" />
                  </div>
                  <div>
                    <div className="font-semibold">{m.name}</div>
                    <div className="text-sm text-muted-foreground">{[m.dosage, m.frequency ? t(m.frequency) : null].filter(Boolean).join(" · ")}</div>
                  </div>
                </div>
                <button onClick={() => remove(m.id)} className="text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-full bg-muted px-2.5 py-1">{m.time_of_day ? t(m.time_of_day) : ""}</span>
                <span className={`rounded-full px-2.5 py-1 ${m.active ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}`}>
                  {m.active ? t("Active") : t("Stopped")}
                </span>
                {m.notes && <span className="rounded-full bg-muted px-2.5 py-1">{m.notes}</span>}
              </div>
              <button onClick={() => toggleActive(m)} className="mt-3 text-xs font-medium text-primary hover:underline">
                {m.active ? t("Mark as stopped") : t("Mark as active")}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
