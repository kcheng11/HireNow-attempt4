"use client"

import { AppProvider } from "@/lib/context/app-context"
import { LanguageProvider } from "@/lib/context/language-context"
import type { ReactNode } from "react"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <AppProvider>
        {children}
      </AppProvider>
    </LanguageProvider>
  )
}
