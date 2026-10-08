import { useLanguage } from "@/components/language-provider";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { AlertTriangle, CheckCircle2, HeartPulse as Sparkles, Loader2, Send, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { chatWithCopilot } from "@/lib/health.functions";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/_authenticated/chat")({
  head: () => ({
    meta: [
      { title: "AI Copilot — Vitalis" },
      { name: "description", content: "Chat with your AI health copilot — personalized answers based on your medications, vitals, and records." },
      { property: "og:title", content: "AI Copilot — Vitalis" },
      { property: "og:description", content: "Chat with your AI health copilot." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ChatPage,
});

interface Action { type: string; label: string; ok: boolean }
interface Msg { role: "user" | "assistant"; content: string; actions?: Action[] }

const ACTION_LINKS: Record<string, { to: "/medications" | "/appointments" | "/records" | "/dashboard"; text: string }> = {
  medication: { to: "/medications", text: "View medications" },
  appointment: { to: "/appointments", text: "View appointments" },
  record: { to: "/records", text: "View records" },
  vital: { to: "/dashboard", text: "View dashboard" },
  profile: { to: "/dashboard", text: "View dashboard" },
};

const SUGGESTIONS = [
  "Add Dolo 650 to my medications, twice daily",
  "Book an appointment with Dr. Rao (cardiologist) next Monday at 10am",
  "Log my heart rate as 78 bpm",
  "Summarize my current health status",
];

function ChatPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const askCopilot = useServerFn(chatWithCopilot);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("chat_messages")
      .select("role, content")
      .eq("user_id", user.id)
      .order("created_at")
      .limit(50)
      .then(({ data }) => {
        if (data) setMessages(data as Msg[]);
      });
  }, [user]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    setError(null);
    setInput("");
    const next = [...messages, { role: "user" as const, content: trimmed }];
    setMessages(next);
    setSending(true);
    try {
      const { reply, actions } = await askCopilot({
        data: {
          message: trimmed,
          history: next.slice(-12).slice(0, -1).map(({ role, content }) => ({ role, content })),
        },
      });
      setMessages([...next, { role: "assistant", content: reply, actions }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setMessages(messages);
      setInput(trimmed);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex h-[calc(100vh-10rem)] flex-col lg:h-[calc(100vh-4rem)]">
      <div className="mb-4">
        <h1 className="text-3xl font-bold">{t("AI Health Copilot")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("Personalized answers using your medications, vitals, and records. Not a substitute for professional medical advice.")}
        </p>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto rounded-2xl border bg-card p-4 sm:p-6">
        {messages.length === 0 && !sending && (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent">
              <Sparkles className="h-7 w-7 text-accent-foreground" />
            </div>
            <h2 className="text-lg font-semibold">{t("How can I help with your health today?")}</h2>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              {t("I can see your medications, upcoming appointments, vitals, and records — ask me anything.")}
            </p>
            <div className="mt-6 grid w-full max-w-lg gap-2 sm:grid-cols-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={t(s)}
                  onClick={() => send(t(s))}
                  className="rounded-xl border bg-background px-4 py-3 text-left text-sm hover:bg-muted"
                >
                  {t(s)}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""}`}>
            {m.role === "assistant" && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                m.role === "user" ? "whitespace-pre-wrap bg-primary text-primary-foreground" : "bg-muted"
              }`}
            >
              {m.role === "assistant" ? (
                <>
                  {m.actions && m.actions.length > 0 && (
                    <div className="mb-3 space-y-1.5">
                      {m.actions.map((a, j) => {
                        const link = ACTION_LINKS[a.type];
                        return (
                          <div
                            key={j}
                            className={`flex flex-wrap items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium ${
                              a.ok ? "border-primary/30 bg-background text-foreground" : "border-destructive/30 bg-destructive/10 text-destructive"
                            }`}
                          >
                            {a.ok ? <CheckCircle2 className="h-4 w-4 text-primary" /> : <AlertTriangle className="h-4 w-4" />}
                            <span>{a.ok ? a.label : t("Couldn't complete: {label}", { label: a.label })}</span>
                            {a.ok && link && (
                              <Link to={link.to} className="ml-auto font-semibold text-primary hover:underline">
                                {t(link.text)} →
                              </Link>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                  <div className="[&_h1]:mb-2 [&_h1]:mt-3 [&_h1]:font-bold [&_h2]:mb-2 [&_h2]:mt-3 [&_h2]:font-bold [&_h3]:mb-1.5 [&_h3]:mt-3 [&_h3]:font-semibold [&_li]:ml-4 [&_li]:list-disc [&_p]:mb-2 [&_strong]:font-semibold">
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  </div>
                </>
              ) : (
                m.content
              )}
            </div>
            {m.role === "user" && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary">
                <User className="h-4 w-4 text-secondary-foreground" />
              </div>
            )}
          </div>
        ))}

        {sending && (
          <div className="flex gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="flex items-center gap-2 rounded-2xl bg-muted px-4 py-3 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> {t("Thinking…")}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {error && <p className="mt-2 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{t(error)}</p>}

      <form
        onSubmit={(e) => { e.preventDefault(); send(input); }}
        className="mt-4 flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t("Ask about symptoms, medications, appointments…")}
          className="flex-1 rounded-xl border bg-card px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
        <button
          type="submit"
          disabled={sending || !input.trim()}
          className="flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
        >
          <Send className="h-4 w-4" />
          <span className="max-sm:hidden">{t("Send")}</span>
        </button>
      </form>
    </div>
  );
}
