"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import type { Language } from "@/lib/types"
import { getTranslation } from "@/lib/translations"

interface LanguageContextType {
  language: Language
  setLanguage: (l: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")
  const t = useCallback((key: string) => getTranslation(key, language), [language])

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider")
  return ctx
}
