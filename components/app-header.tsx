"use client"

import { useLanguage } from "@/lib/context/language-context"
import { useApp } from "@/lib/context/app-context"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Globe, ArrowLeft, LogOut } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"

export function AppHeader() {
  const { language, setLanguage, t } = useLanguage()
  const { currentRole, currentUserId, logout } = useApp()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <header className="flex items-center justify-between border-b border-border bg-card px-4 py-2.5">
      <div className="flex items-center gap-3">
        {currentRole && (
          <Button variant="ghost" size="icon" onClick={() => router.back()} aria-label={t("common.back")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/logo.png"
            alt="HireNow"
            width={300}
            height={90}
            className="h-14 w-auto object-contain"
            priority
          />
        </Link>
        {currentRole && (
          <>
            <Separator orientation="vertical" className="h-5" />
            <span className="text-sm text-muted-foreground capitalize">
              {t(`role.${currentRole}`)}
            </span>
          </>
        )}
      </div>

      <div className="flex items-center gap-2">
        {currentRole && currentUserId && (
          <>
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/${currentRole}/dashboard`}>
                {t("common.dashboard")}
              </Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="mr-1 h-3.5 w-3.5" />
              {t("common.switchRole")}
            </Button>
            <Separator orientation="vertical" className="h-5" />
          </>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setLanguage(language === "en" ? "hi" : "en")}
          className="gap-1.5"
        >
          <Globe className="h-3.5 w-3.5" />
          {language === "en" ? "हिंदी" : "English"}
        </Button>
      </div>
    </header>
  )
}
