import { LanguageSwitcher } from "@/components/language-switcher";
import { useLanguage } from "@/components/language-provider";
import { createFileRoute, Outlet, Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import {
  HeartPulse, LayoutDashboard, MessageSquareHeart, Pill, CalendarCheck, FileText, History, LogOut, Loader2,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/_authenticated")({
  component: AuthenticatedLayout,
});

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/chat", label: "AI Copilot", icon: MessageSquareHeart },
  { to: "/timeline", label: "Timeline", icon: History },
  { to: "/medications", label: "Medications", icon: Pill },
  { to: "/appointments", label: "Appointments", icon: CalendarCheck },
  { to: "/records", label: "Health Records", icon: FileText },
] as const;

function AuthenticatedLayout() {
  const { t } = useLanguage();
  const { session, loading } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (!loading && !session) navigate({ to: "/auth" });
  }, [loading, session, navigate]);

  if (loading || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-20 flex w-64 flex-col bg-sidebar text-sidebar-foreground max-lg:hidden">
        <div className="flex h-16 items-center gap-2 px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sidebar-primary">
            <HeartPulse className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          <span className="font-display text-lg font-bold">Vitalis</span>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const active = pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
                }`}
              >
                <item.icon className="h-4.5 w-4.5" />
                {t(item.label)}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-sidebar-border p-3">
          <div className="mb-3"><LanguageSwitcher /></div>
          <div className="mb-2 truncate px-3 text-xs text-sidebar-foreground/60">{session.user.email}</div>
          <button
            onClick={signOut}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent/60"
          >
            <LogOut className="h-4.5 w-4.5" />
            {t("Sign out")}
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="fixed inset-x-0 top-0 z-20 flex h-14 items-center justify-between border-b bg-card px-4 lg:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <HeartPulse className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-display font-bold">Vitalis</span>
        </div>
        <LanguageSwitcher />
        <button onClick={signOut} className="text-sm text-muted-foreground">{t("Sign out")}</button>
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-6 border-t bg-card py-2 lg:hidden">
        {navItems.map((item) => {
          const active = pathname.startsWith(item.to);
          return (
            <Link key={item.to} to={item.to} className={`flex min-w-0 flex-col items-center gap-1 px-1 py-1 text-center text-[10px] leading-relaxed ${active ? "text-primary" : "text-muted-foreground"}`}>
              <item.icon className="h-5 w-5" />
              {t(item.label)}
            </Link>
          );
        })}
      </nav>

      {/* Main */}
      <main className="flex-1 px-4 pb-24 pt-20 sm:px-8 lg:ml-64 lg:pb-8 lg:pt-8">
        <div className="mx-auto max-w-5xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
