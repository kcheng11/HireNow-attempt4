"use client"

import { useState } from "react"
import { useApp } from "@/lib/context/app-context"
import { useLanguage } from "@/lib/context/language-context"
import { AppHeader } from "@/components/app-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function ContractorSetupPage() {
  const { addContractor, setRole, hydrated } = useApp()
  const { t } = useLanguage()
  const router = useRouter()

  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [company, setCompany] = useState("")
  const [location, setLocation] = useState("")

  const handleSubmit = () => {
    if (!name.trim() || !phone.trim() || !location.trim()) {
      toast.error("Please fill in name, phone, and location.")
      return
    }
    const id = `contractor-${Date.now()}`
    addContractor({ id, name: name.trim(), phone: phone.trim(), company: company.trim(), location: location.trim() })
    setRole("contractor", id)
    toast.success("Profile created!")
    router.push("/contractor/dashboard")
  }

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-muted-foreground">{t("common.loading")}</div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader />
      <main className="mx-auto w-full max-w-xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold text-foreground">{t("contractor.setup")}</h1>
        <Card>
          <CardContent className="flex flex-col gap-4 pt-6">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">{t("common.name")}</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="phone">{t("common.phone")}</Label>
              <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="company">{t("contractor.company")}</Label>
              <Input id="company" value={company} onChange={(e) => setCompany(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="location">{t("common.location")}</Label>
              <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>
            <Button onClick={handleSubmit} className="w-full">{t("common.save")}</Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
