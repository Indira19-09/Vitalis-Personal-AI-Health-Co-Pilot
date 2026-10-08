import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { isLanguage, LANGUAGE_STORAGE_KEY, LOCALES, translate, type Language } from "@/lib/translations";

const LanguageContext = createContext({
  language: "en" as Language,
  locale: LOCALES.en,
  setLanguage: (_language: Language) => {},
  t: (text: string, params?: Record<string, string | number>) => translate("en", text, params),
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (isLanguage(saved)) setLanguageState(saved);
    } catch { /* Storage may be unavailable in private browsing. */ }
    const sync = (event: StorageEvent) => {
      if (event.key === LANGUAGE_STORAGE_KEY) setLanguageState(isLanguage(event.newValue) ? event.newValue : "en");
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  useEffect(() => { document.documentElement.lang = language; }, [language]);
  function setLanguage(next: Language) {
    setLanguageState(next);
    try { localStorage.setItem(LANGUAGE_STORAGE_KEY, next); } catch { /* The current tab still works. */ }
  }
  return <LanguageContext.Provider value={{ language, locale: LOCALES[language], setLanguage, t: (text, params) => translate(language, text, params) }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() { return useContext(LanguageContext); }