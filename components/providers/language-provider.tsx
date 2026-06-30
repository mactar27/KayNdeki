"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { translations, type Lang, type TranslationKey } from "@/lib/i18n"

interface LanguageContextValue {
  lang: Lang
  setLang: (lang: Lang) => void
  t: (key: TranslationKey) => string
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("fr")

  useEffect(() => {
    try {
      const stored = localStorage.getItem("kayndeki_lang") as Lang | null
      if (stored === "fr" || stored === "wo" || stored === "en") setLangState(stored)
    } catch {}
  }, [])

  const setLang = (l: Lang) => {
    setLangState(l)
    try { localStorage.setItem("kayndeki_lang", l) } catch {}
  }

  const t = (key: TranslationKey): string => translations[lang][key] ?? translations.fr[key]

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useTranslation() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error("useTranslation must be used inside LanguageProvider")
  return ctx
}
