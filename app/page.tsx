"use client"

import { useEffect, useState } from "react"
import { useApp } from "@/lib/context/app-context"
import { useLanguage } from "@/lib/context/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Globe, Hammer, HardHat, LogIn } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function LandingPage() {
  const { currentRole, currentUserId, laborers, contractors, setRole, hydrated } = useApp()
  const { language, setLanguage, t } = useLanguage()
  const router = useRouter()
  const [showSignIn, setShowSignIn] = useState(false)

  useEffect(() => {
    if (hydrated && currentRole && currentUserId) {
      router.push(`/${currentRole}/dashboard`)
    }
  }, [hydrated, currentRole, currentUserId, router])

  const handleRoleSelect = (role: "laborer" | "contractor") => {
    router.push(`/${role}/setup`)
  }

  const handleSignIn = (role: "laborer" | "contractor", userId: string) => {
    setRole(role, userId)
    router.push(`/${role}/dashboard`)
  }

  const userLaborers = laborers.filter(l => l.id.startsWith("laborer-"))
  const userContractors = contractors.filter(c => c.id.startsWith("contractor-"))
  const hasExistingProfiles = userLaborers.length > 0 || userContractors.length > 0

  if (!hydrated || (currentRole && currentUserId)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-muted-foreground">{t("common.loading")}</div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex items-center justify-between border-b border-border bg-card px-4 py-3">
        <Image
          src="/images/logo.png"
          alt="HireNow"
          width={360}
          height={108}
          className="h-16 w-auto object-contain"
          priority
        />
        <div className="flex items-center gap-2">
          {hasExistingProfiles && (
            <Button variant="outline" size="sm" onClick={() => setShowSignIn(true)} className="gap-1.5">
              <LogIn className="h-3.5 w-3.5" />
              {t("common.signBackIn")}
            </Button>
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

      <main className="flex flex-1 flex-col items-center justify-center px-4 py-12">
        <div className="mx-auto max-w-lg text-center">
          <Image
            src="/images/logo.png"
            alt="HireNow"
            width={720}
            height={216}
            className="mx-auto mb-6 h-48 w-auto object-contain"
            priority
          />
          <p className="text-lg text-muted-foreground text-pretty leading-relaxed">
            {t("app.tagline")}
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-6">
          <Card
            className="w-72 cursor-pointer border-border transition-all hover:border-primary/40 hover:shadow-md"
            onClick={() => handleRoleSelect("laborer")}
          >
            <CardHeader className="items-center text-center pb-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Hammer className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="mt-2 text-foreground">{t("role.laborer")}</CardTitle>
              <CardDescription>{t("role.laborer.desc")}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col pt-0 text-center">
              <Button className="w-full">{t("role.laborer")}</Button>
            </CardContent>
          </Card>

          <Card
            className="w-72 cursor-pointer border-border transition-all hover:border-primary/40 hover:shadow-md"
            onClick={() => handleRoleSelect("contractor")}
          >
            <CardHeader className="items-center text-center pb-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <HardHat className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="mt-2 text-foreground">{t("role.contractor")}</CardTitle>
              <CardDescription>{t("role.contractor.desc")}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col pt-0 text-center">
              <Button variant="outline" className="w-full">{t("role.contractor")}</Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <Dialog open={showSignIn} onOpenChange={setShowSignIn}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{t("common.signBackIn")}</DialogTitle>
            <DialogDescription>{t("common.existingProfiles")}</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            {userLaborers.map(laborer => (
              <Button
                key={laborer.id}
                variant="outline"
                className="h-auto justify-start gap-3 px-3 py-2.5"
                onClick={() => handleSignIn("laborer", laborer.id)}
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Hammer className="h-4 w-4 text-primary" />
                </div>
                <div className="flex flex-col items-start text-left">
                  <span className="text-sm font-medium">{laborer.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {t("role.laborer")} &middot; {laborer.location}
                  </span>
                </div>
              </Button>
            ))}
            {userContractors.map(contractor => (
              <Button
                key={contractor.id}
                variant="outline"
                className="h-auto justify-start gap-3 px-3 py-2.5"
                onClick={() => handleSignIn("contractor", contractor.id)}
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <HardHat className="h-4 w-4 text-primary" />
                </div>
                <div className="flex flex-col items-start text-left">
                  <span className="text-sm font-medium">{contractor.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {t("role.contractor")} &middot; {contractor.location}
                  </span>
                </div>
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
