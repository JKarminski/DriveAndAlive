import React, { createContext, useContext, useState, useEffect } from "react";

import pl from "../locales/pl.json";
import en from "../locales/en.json";

type Translations = typeof pl;

const translations: Record<string, Translations> = { pl, en };

interface I18nContextType {
  lang: string;
  t: (key: string) => string;
  setLang: (lang: string) => void;
  toggleLang: () => void;
}

export const I18nContext = createContext<I18nContextType | null>(null);

export const useI18n = () => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
};

export const I18nProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLangState] = useState(() => {
    return localStorage.getItem("daa_lang") || "pl";
  });

  const setLang = (newLang: string) => {
    setLangState(newLang);
    localStorage.setItem("daa_lang", newLang);
  };

  const toggleLang = () => {
    setLang(lang === "pl" ? "en" : "pl");
  };

  // Helper to get nested keys like "nav.about"
  const t = (path: string): string => {
    const keys = path.split(".");
    let current: any = translations[lang] || translations["pl"];
    for (const key of keys) {
      if (current[key] === undefined) {
        // fallback to pl
        let fallback: any = translations["pl"];
        for (const k of keys) {
          if (fallback[k] === undefined) return path;
          fallback = fallback[k];
        }
        return fallback as string;
      }
      current = current[key];
    }
    return current as string;
  };

  return (
    <I18nContext.Provider value={{ lang, t, setLang, toggleLang }}>
      {children}
    </I18nContext.Provider>
  );
};
