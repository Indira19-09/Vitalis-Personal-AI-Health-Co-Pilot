import { useLanguage } from "@/components/language-provider";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  AlertTriangle, FileText, Languages, Loader2, Pill, Plus, ScanSearch, Search, Trash2, Upload, X,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { analyzeHealthRecord, summarizeRecord, type ExtractedRecord } from "@/lib/records.functions";

export const Route = createFileRoute("/_authenticated/records")({
  head: () => ({
    meta: [
      { title: "Health Records — Vitalis" },
      { name: "description", content: "Upload prescriptions and lab reports — AI reads them and explains in simple language." },
      { property: "og:title", content: "Health Records — Vitalis" },
      { property: "og:description", content: "Upload prescriptions and lab reports — AI reads them and explains in simple language." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: RecordsPage,
});

interface Rec {
  id: string; title: string; record_type: string; record_date: string | null;
  provider: string | null; summary: string | null; file_url: string | null;
  extracted_data: ExtractedRecord | null; ai_summary: string | null; summary_language: string | null;
}

const TYPES = ["Lab report", "Prescription", "Scan / Imaging", "Discharge summary", "Vaccination", "Insurance", "Other"];
const LANGS = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "te", label: "తెలుగు" },
] as const;
const emptyForm = { title: "", record_type: "Lab report", record_date: "", provider: "", summary: "" };

function RecordsPage() {
  const { t, locale, language } = useLanguage();
  const translateLabel = t;
  const { user } = useAuth();
  const [records, setRecords] = useState<Rec[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [translating, setTranslating] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function load() {
    if (!user) return;
    const { data } = await supabase.from("health_records").select("*").eq("user_id", user.id).order("record_date", { ascending: false });
    setRecords((data as Rec[]) ?? []);
  }

  useEffect(() => { load(); }, [user]);

  async function addRec(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    await supabase.from("health_records").insert({
      user_id: user.id,
      title: form.title,
      record_type: form.record_type,
      record_date: form.record_date || null,
      provider: form.provider || null,
      summary: form.summary || null,
    });
    setForm(emptyForm);
    setShowForm(false);
    setSaving(false);
    load();
  }

  async function handleUpload(file: File) {
    if (!user) return;
    setUploading(true);
    setUploadError("");
    try {
      const path = `${user.id}/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
      const { error: upErr } = await supabase.storage.from("health-documents").upload(path, file);
      if (upErr) throw new Error(upErr.message);

      const { data: rec, error: insErr } = await supabase
        .from("health_records")
        .insert({ user_id: user.id, title: file.name, record_type: "Other", file_url: path })
        .select("id")
        .single();
      if (insErr || !rec) throw new Error(insErr?.message ?? "Failed to create record");

      await analyzeHealthRecord({ data: { recordId: rec.id, filePath: path, language } });
      setExpanded(rec.id);
      await load();
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function changeLanguage(rec: Rec, language: "en" | "hi" | "te") {
    if (rec.summary_language === language || !rec.extracted_data) return;
    setTranslating(rec.id);
    try {
      const { aiSummary } = await summarizeRecord({ data: { recordId: rec.id, language } });
      setRecords((prev) => prev.map((r) => (r.id === rec.id ? { ...r, ai_summary: aiSummary, summary_language: language } : r)));
    } catch {
      // keep old summary on failure
    } finally {
      setTranslating(null);
    }
  }

  async function remove(id: string) {
    await supabase.from("health_records").delete().eq("id", id);
    load();
  }

  const filtered = records.filter((r) =>
    [r.title, r.record_type, t(r.record_type), r.provider, r.summary, r.ai_summary].filter(Boolean).join(" ").toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{t("Health Records")}</h1>
          <p className="mt-1 text-muted-foreground">{t("Upload a prescription or lab report — the AI reads it and explains it in simple words")}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 rounded-xl border bg-card px-4 py-2.5 text-sm font-semibold hover:bg-muted">
            {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {showForm ? t("Cancel") : t("Add manually")}
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {uploading ? t("AI is reading…") : t("Upload & scan")}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f); }}
          />
        </div>
      </div>

      {uploadError && (
        <div className="flex items-center gap-2 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <AlertTriangle className="h-4 w-4 shrink-0" /> {t(uploadError)}
        </div>
      )}

      {showForm && (
        <form onSubmit={addRec} className="grid gap-4 rounded-2xl border bg-card p-6 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium">{t("Title")}</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required placeholder={t("Complete Blood Count")} className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">{t("Type")}</label>
            <select value={form.record_type} onChange={(e) => setForm({ ...form, record_type: e.target.value })} className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring">
              {TYPES.map((type) => <option key={type} value={type}>{t(type)}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">{t("Date")}</label>
            <input type="date" value={form.record_date} onChange={(e) => setForm({ ...form, record_date: e.target.value })} className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">{t("Provider / Lab")}</label>
            <input value={form.provider} onChange={(e) => setForm({ ...form, provider: e.target.value })} placeholder="Thyrocare" className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium">{t("Summary (optional)")}</label>
            <textarea value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} rows={2} placeholder={t("Key findings, values out of range…")} className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div className="sm:col-span-2">
            <button type="submit" disabled={saving} className="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60">
              {saving ? t("Saving…") : t("Save record")}
            </button>
          </div>
        </form>
      )}

      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("Search records…")}
          className="w-full rounded-xl border bg-card py-3 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border bg-card py-16 text-center">
          <FileText className="mb-3 h-10 w-10 text-muted-foreground" />
          <p className="font-medium">{records.length === 0 ? t("No records yet") : t("No matches")}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {records.length === 0 ? t("Upload a photo of a prescription or lab report and let the AI read it.") : t("Try a different search.")}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((r) => {
            const ex = r.extracted_data;
            const abnormal = ex?.tests?.filter((t) => t.abnormal) ?? [];
            const isOpen = expanded === r.id;
            return (
              <div key={r.id} className="rounded-2xl border bg-card p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent">
                      <FileText className="h-5 w-5 text-accent-foreground" />
                    </div>
                    <div>
                      <div className="font-semibold">{r.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {[t(r.record_type), r.record_date ? new Date(r.record_date).toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric" }) : null, r.provider].filter(Boolean).join(" · ")}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {abnormal.length > 0 && (
                      <span className="flex items-center gap-1 rounded-full bg-destructive/10 px-2.5 py-1 text-xs font-medium text-destructive">
                        <AlertTriangle className="h-3 w-3" /> {abnormal.length} {t("abnormal")}
                      </span>
                    )}
                    {ex && (
                      <button onClick={() => setExpanded(isOpen ? null : r.id)} className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-muted">
                        <ScanSearch className="h-3.5 w-3.5" /> {isOpen ? t("Hide details") : t("AI analysis")}
                      </button>
                    )}
                    <button onClick={() => remove(r.id)} className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {r.ai_summary && (
                  <div className="mt-3 rounded-xl bg-accent/50 p-4">
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wide text-accent-foreground">{t("Simple summary")}</span>
                      <div className="flex items-center gap-1">
                        <Languages className="h-3.5 w-3.5 text-muted-foreground" />
                        {LANGS.map((l) => (
                          <button
                            key={l.code}
                            onClick={() => changeLanguage(r, l.code)}
                            disabled={translating === r.id}
                            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${r.summary_language === l.code ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
                          >
                            {l.label}
                          </button>
                        ))}
                        {translating === r.id && <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />}
                      </div>
                    </div>
                    <p className="whitespace-pre-line text-sm leading-relaxed">{r.ai_summary}</p>
                  </div>
                )}
                {!r.ai_summary && r.summary && <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{r.summary}</p>}

                {isOpen && ex && (
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    {(ex.medicines?.length ?? 0) > 0 && (
                      <div className="rounded-xl border p-4">
                        <div className="mb-2 flex items-center gap-2 text-sm font-semibold"><Pill className="h-4 w-4 text-primary" /> {t("Medicines")} ({ex.medicines?.length ?? 0})</div>
                        <ul className="space-y-1.5 text-sm">
                          {ex.medicines?.map((m, i) => (
                            <li key={i} className="flex flex-wrap items-baseline gap-x-2">
                              <b>{m.name}</b>
                              <span className="text-muted-foreground">{[m.dosage, m.frequency, m.duration].filter(Boolean).join(" · ")}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {(ex.tests?.length ?? 0) > 0 && (
                      <div className="rounded-xl border p-4">
                        <div className="mb-2 text-sm font-semibold">{t("Test values")} ({ex.tests?.length ?? 0})</div>
                        <ul className="space-y-1.5 text-sm">
                          {ex.tests?.map((t, i) => (
                            <li key={i} className="flex flex-wrap items-baseline gap-x-2">
                              <span className={t.abnormal ? "font-semibold text-destructive" : "font-medium"}>{t.name}</span>
                              <span className={t.abnormal ? "font-semibold text-destructive" : ""}>{t.value} {t.unit ?? ""}</span>
                              {t.reference_range && <span className="text-xs text-muted-foreground">({translateLabel("normal")}: {t.reference_range})</span>}
                              {t.abnormal && <AlertTriangle className="h-3.5 w-3.5 text-destructive" />}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {(ex.diagnoses?.length ?? 0) > 0 && (
                      <div className="rounded-xl border p-4 sm:col-span-2">
                        <div className="mb-1 text-sm font-semibold">{t("Diagnoses / impressions")}</div>
                        <p className="text-sm text-muted-foreground">{ex.diagnoses?.join("; ")}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
