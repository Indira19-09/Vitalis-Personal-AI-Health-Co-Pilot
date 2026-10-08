import { LanguageSwitcher } from "@/components/language-switcher";
import { useLanguage } from "@/components/language-provider";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, CalendarCheck, FileText, Mail, MessageSquareHeart, Pill, ShieldCheck, Sparkles, HeartPulse } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vitalis — AI-Powered Personal Health Copilot" },
      { name: "description", content: "Understand, organize, and manage your healthcare journey with an AI copilot, medication tracking, appointments, and health records." },
      { property: "og:title", content: "Vitalis — AI-Powered Personal Health Copilot" },
      { property: "og:description", content: "Understand, organize, and manage your healthcare journey with an AI copilot." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const SUPPORT_EMAILS = [
  "indurayapalli@gmail.com",
  "santhoshikakatipalli@gmail.com",
  "deepthiabhilashakaluturi@gmail.com",
  "kancharlaniharika741@gmail.com",
  "jeevananand465275@gmail.com",
];

const features = [
  {
    icon: MessageSquareHeart,
    title: "AI Health Copilot",
    desc: "Chat with an AI that knows your medications, vitals, and records — get plain-language answers about your health.",
  },
  {
    icon: Pill,
    title: "Medication Tracking",
    desc: "Keep every prescription organized with dosage, frequency, and schedules in one place.",
  },
  {
    icon: CalendarCheck,
    title: "Appointments",
    desc: "Never miss a doctor visit. Track upcoming appointments with specialties, locations, and reasons.",
  },
  {
    icon: FileText,
    title: "Health Records",
    desc: "Store lab reports, prescriptions, and scan summaries — organized and searchable.",
  },
  {
    icon: Activity,
    title: "Vitals Dashboard",
    desc: "Log blood pressure, heart rate, weight, glucose and more — visualize trends over time.",
  },
  {
    icon: ShieldCheck,
    title: "Private by Design",
    desc: "Your health data is encrypted and visible only to you, secured with row-level access control.",
  },
];

function Landing() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex min-h-16 flex-wrap gap-3 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
              <HeartPulse className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold">Vitalis</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <LanguageSwitcher />
            <Link to="/auth" className="rounded-lg px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">
              {t("Sign in")}
            </Link>
            <Link to="/auth" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
              {t("Get started")}
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="hero-glow">
        <div className="mx-auto max-w-6xl px-4 py-24 text-center">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4 text-primary" />
            {t("AI-powered personal health copilot")}
          </div>
          <h1 className="mx-auto max-w-3xl text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl">
            {t("Your health journey,")} <span className="text-gradient">{t("finally in one place")}</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            {t("Vitalis helps you understand, organize, and manage your healthcare — an AI copilot that knows your medications, appointments, records, and vitals, and answers in plain language.")}
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/auth"
              className="rounded-xl bg-primary px-8 py-3.5 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90"
            >
              {t("Start free →")}
            </Link>
            <a href="#features" className="rounded-xl border bg-card px-8 py-3.5 text-base font-semibold hover:bg-muted">
              {t("See features")}
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-4 py-20">
        <h2 className="text-center text-3xl font-bold">{t("Everything your health needs")}</h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-muted-foreground">
          {t("Built for patients, caregivers, and anyone managing a complex healthcare journey.")}
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={t(f.title)} className="card-hover rounded-2xl border bg-card p-6">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-accent">
                <f.icon className="h-5 w-5 text-accent-foreground" />
              </div>
              <h3 className="text-lg font-semibold">{t(f.title)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t(f.desc)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-24">
        <div className="rounded-3xl bg-sidebar px-8 py-16 text-center">
          <h2 className="text-3xl font-bold text-sidebar-foreground">{t("Take control of your health today")}</h2>
          <p className="mx-auto mt-3 max-w-md text-sidebar-foreground/70">
            {t("Sign up in seconds and let your AI copilot organize the rest.")}
          </p>
          <Link
            to="/auth"
            className="mt-8 inline-block rounded-xl bg-primary px-8 py-3.5 font-semibold text-primary-foreground hover:bg-primary/90"
          >
            {t("Create your account")}
          </Link>
        </div>
      </section>

      <footer className="border-t bg-muted/40">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="grid gap-10 sm:grid-cols-2">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
                  <HeartPulse className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="font-display text-xl font-bold">Vitalis</span>
              </div>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
                {t("Your AI-powered personal health copilot — medications, appointments, records and vitals in one place.")}
              </p>
            </div>

            <div className="sm:justify-self-end">
              <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-foreground">
                <Mail className="h-4 w-4 text-primary" />
                {t("Contact support")}
              </h3>
              <p className="mt-3 text-sm text-muted-foreground">
                {t("Need help? Click any email below to write to our team.")}
              </p>
              <ul className="mt-4 space-y-2">
                {SUPPORT_EMAILS.map((email) => (
                  <li key={email}>
                    <a
                      href={`mailto:${email}`}
                      className="inline-flex items-center gap-2 text-sm font-medium text-primary underline-offset-4 hover:underline"
                    >
                      {email}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t pt-6 text-sm text-muted-foreground">
            <span>© 2026 Vitalis. {t("All rights reserved.")}</span>
            <span>{t("Built for HacXLerate 2026 · Challenge 01")}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
