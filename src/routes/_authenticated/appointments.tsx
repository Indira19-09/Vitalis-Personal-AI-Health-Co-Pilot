import { useLanguage } from "@/components/language-provider";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CalendarCheck, MapPin, Plus, Trash2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/_authenticated/appointments")({
  head: () => ({
    meta: [
      { title: "Appointments — Vitalis" },
      { name: "description", content: "Track upcoming doctor appointments and visits." },
      { property: "og:title", content: "Appointments — Vitalis" },
      { property: "og:description", content: "Track upcoming doctor appointments and visits." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AppointmentsPage,
});

interface Appt {
  id: string; doctor_name: string; specialty: string | null; appointment_date: string;
  location: string | null; reason: string | null; status: string;
}

const emptyForm = { doctor_name: "", specialty: "", date: "", time: "", location: "", reason: "" };

function AppointmentsPage() {
  const { t, locale } = useLanguage();
  const { user } = useAuth();
  const [appts, setAppts] = useState<Appt[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  async function load() {
    if (!user) return;
    const { data } = await supabase.from("appointments").select("*").eq("user_id", user.id).order("appointment_date");
    setAppts((data as Appt[]) ?? []);
  }

  useEffect(() => { load(); }, [user]);

  async function addAppt(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    await supabase.from("appointments").insert({
      user_id: user.id,
      doctor_name: form.doctor_name,
      specialty: form.specialty || null,
      appointment_date: new Date(`${form.date}T${form.time || "09:00"}`).toISOString(),
      location: form.location || null,
      reason: form.reason || null,
    });
    setForm(emptyForm);
    setShowForm(false);
    setSaving(false);
    load();
  }

  async function markDone(a: Appt) {
    await supabase.from("appointments").update({ status: a.status === "completed" ? "upcoming" : "completed" }).eq("id", a.id);
    load();
  }

  async function remove(id: string) {
    await supabase.from("appointments").delete().eq("id", id);
    load();
  }

  const upcoming = appts.filter((a) => a.status !== "completed" && new Date(a.appointment_date) >= new Date());
  const rest = appts.filter((a) => !upcoming.includes(a));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{t("Appointments")}</h1>
          <p className="mt-1 text-muted-foreground">{t("Never miss a doctor visit")}</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? t("Cancel") : t("Book appointment")}
        </button>
      </div>

      {showForm && (
        <form onSubmit={addAppt} className="grid gap-4 rounded-2xl border bg-card p-6 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium">{t("Doctor name")}</label>
            <input value={form.doctor_name} onChange={(e) => setForm({ ...form, doctor_name: e.target.value })} required placeholder={t("Dr. Ananya Rao")} className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">{t("Specialty")}</label>
            <input value={form.specialty} onChange={(e) => setForm({ ...form, specialty: e.target.value })} placeholder={t("Cardiologist")} className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">{t("Date")}</label>
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">{t("Time")}</label>
            <input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">{t("Location")}</label>
            <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder={t("Apollo Clinic, Hyderabad")} className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">{t("Reason")}</label>
            <input value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} placeholder={t("Annual checkup")} className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div className="sm:col-span-2">
            <button type="submit" disabled={saving} className="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60">
              {saving ? t("Saving…") : t("Save appointment")}
            </button>
          </div>
        </form>
      )}

      {appts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border bg-card py-16 text-center">
          <CalendarCheck className="mb-3 h-10 w-10 text-muted-foreground" />
          <p className="font-medium">{t("No appointments yet")}</p>
          <p className="mt-1 text-sm text-muted-foreground">{t("Book your first appointment to see it here.")}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {[{ title: "Upcoming", list: upcoming }, { title: "Past & completed", list: rest }].map(
            (group) => group.list.length > 0 && (
              <div key={t(group.title)}>
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">{t(group.title)}</h2>
                <div className="space-y-3">
                  {group.list.map((a) => {
                    const d = new Date(a.appointment_date);
                    return (
                      <div key={a.id} className={`card-hover flex flex-wrap items-center gap-4 rounded-2xl border bg-card p-5 ${a.status === "completed" ? "opacity-60" : ""}`}>
                        <div className="flex min-h-14 min-w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-accent">
                          <span className="text-lg font-bold leading-none text-accent-foreground">{d.getDate()}</span>
                          <span className="text-[10px] uppercase text-accent-foreground/70">{d.toLocaleDateString(locale, { month: "short" })}</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold">{a.doctor_name}</div>
                          <div className="text-sm text-muted-foreground">
                            {[a.specialty, d.toLocaleTimeString(locale, { hour: "numeric", minute: "2-digit" })].filter(Boolean).join(" · ")}
                          </div>
                          {a.location && (
                            <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                              <MapPin className="h-3 w-3" /> {a.location}
                            </div>
                          )}
                          {a.reason && <div className="mt-1 text-xs text-muted-foreground">{t("Reason:")} {a.reason}</div>}
                        </div>
                        <div className="flex items-center gap-3">
                          <button onClick={() => markDone(a)} className="text-xs font-medium text-primary hover:underline">
                            {a.status === "completed" ? t("Mark upcoming") : t("Mark done")}
                          </button>
                          <button onClick={() => remove(a.id)} className="text-muted-foreground hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ),
          )}
        </div>
      )}
    </div>
  );
}
