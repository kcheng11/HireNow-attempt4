"use client"

import { useState } from "react"
import { useApp } from "@/lib/context/app-context"
import { useLanguage } from "@/lib/context/language-context"
import { AppHeader } from "@/components/app-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Plus, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import type { Skill } from "@/lib/types"

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]

export default function LaborerSetupPage() {
  const { addLaborer, setRole, hydrated } = useApp()
  const { t } = useLanguage()
  const router = useRouter()

  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [location, setLocation] = useState("")
  const [canDrive, setCanDrive] = useState(false)
  const [skills, setSkills] = useState<Skill[]>([])
  const [skillName, setSkillName] = useState("")
  const [skillRate, setSkillRate] = useState("")
  const [availability, setAvailability] = useState<string[]>([])
  const [photoUrls, setPhotoUrls] = useState<string[]>([])
  const [photoUrl, setPhotoUrl] = useState("")

  const handleAddSkill = () => {
    if (!skillName.trim() || !skillRate) return
    setSkills([...skills, { name: skillName.trim(), hourlyRate: Number(skillRate) }])
    setSkillName("")
    setSkillRate("")
  }

  const handleRemoveSkill = (idx: number) => {
    setSkills(skills.filter((_, i) => i !== idx))
  }

  const handleToggleDay = (day: string) => {
    setAvailability((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    )
  }

  const handleAddPhoto = () => {
    if (!photoUrl.trim()) return
    setPhotoUrls([...photoUrls, photoUrl.trim()])
    setPhotoUrl("")
  }

  const handleRemovePhoto = (idx: number) => {
    setPhotoUrls(photoUrls.filter((_, i) => i !== idx))
  }

  const handleSubmit = () => {
    if (!name.trim() || !phone.trim() || !location.trim()) {
      toast.error("Please fill in name, phone, and location.")
      return
    }
    if (skills.length === 0) {
      toast.error("Please add at least one skill.")
      return
    }
    if (availability.length === 0) {
      toast.error("Please select at least one available day.")
      return
    }

    const id = `laborer-${Date.now()}`
    addLaborer({
      id,
      name: name.trim(),
      phone: phone.trim(),
      location: location.trim(),
      canDrive,
      skills,
      availability,
      photoUrls,
      ratings: [],
    })
    setRole("laborer", id)
    toast.success("Profile created!")
    router.push("/laborer/dashboard")
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
        <h1 className="mb-6 text-2xl font-bold text-foreground">{t("laborer.setup")}</h1>

        <div className="flex flex-col gap-6">
          {/* Basic info */}
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
                <Label htmlFor="location">{t("common.location")}</Label>
                <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} />
              </div>
              <div className="flex items-center gap-3">
                <Switch id="canDrive" checked={canDrive} onCheckedChange={setCanDrive} />
                <Label htmlFor="canDrive">{t("laborer.canDriveQuestion")}</Label>
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{t("laborer.skills")}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill, idx) => (
                  <Badge key={idx} variant="secondary" className="gap-1 pr-1">
                    {skill.name} - {t("common.currency")}{skill.hourlyRate}{t("common.perHour")}
                    <button type="button" onClick={() => handleRemoveSkill(idx)} aria-label="Remove skill">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder={t("laborer.skillName")}
                  value={skillName}
                  onChange={(e) => setSkillName(e.target.value)}
                  className="flex-1"
                />
                <div className="flex items-center gap-1">
                  <span className="text-sm text-muted-foreground">{t("common.currency")}</span>
                  <Input
                    type="number"
                    placeholder={t("laborer.rate")}
                    value={skillRate}
                    onChange={(e) => setSkillRate(e.target.value)}
                    className="w-24"
                  />
                </div>
                <Button type="button" size="sm" variant="outline" onClick={handleAddSkill}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Availability */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{t("laborer.availability")}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              {DAYS.map((day) => (
                <label key={day} className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={availability.includes(day)}
                    onCheckedChange={() => handleToggleDay(day)}
                  />
                  {t(`day.${day}`)}
                </label>
              ))}
            </CardContent>
          </Card>

          {/* Photos */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{t("laborer.photos")}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {photoUrls.map((url, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="flex-1 truncate text-sm text-muted-foreground">{url}</span>
                  <button type="button" onClick={() => handleRemovePhoto(idx)} aria-label="Remove photo">
                    <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                  </button>
                </div>
              ))}
              <div className="flex gap-2">
                <Input
                  placeholder={t("laborer.photoUrl")}
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  className="flex-1"
                />
                <Button type="button" size="sm" variant="outline" onClick={handleAddPhoto}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Button onClick={handleSubmit} className="w-full">
            {t("common.save")}
          </Button>
        </div>
      </main>
    </div>
  )
}
