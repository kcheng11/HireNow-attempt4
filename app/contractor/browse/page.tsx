"use client"

import { useState, useMemo } from "react"
import { useApp } from "@/lib/context/app-context"
import { useLanguage } from "@/lib/context/language-context"
import { AppHeader } from "@/components/app-header"
import { LaborerCard } from "@/components/laborer-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { toast } from "sonner"
import type { Laborer } from "@/lib/types"

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]

export default function BrowseLaborersPage() {
  const { laborers, projects, currentUserId, addHireRequest, hydrated } = useApp()
  const { t } = useLanguage()

  const [skillFilter, setSkillFilter] = useState("")
  const [locationFilter, setLocationFilter] = useState("")
  const [dayFilter, setDayFilter] = useState("")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  const [hireDialogOpen, setHireDialogOpen] = useState(false)
  const [selectedLaborer, setSelectedLaborer] = useState<Laborer | null>(null)
  const [selectedProject, setSelectedProject] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [pickup, setPickup] = useState("")
  const [dropoff, setDropoff] = useState("")
  const [offeredAmount, setOfferedAmount] = useState("")

  const myProjects = projects.filter((p) => p.contractorId === currentUserId && p.status === "active")

  const allSkills = useMemo(() => {
    const set = new Set<string>()
    laborers.forEach((l) => l.skills.forEach((s) => set.add(s.name)))
    return Array.from(set).sort()
  }, [laborers])

  const allLocations = useMemo(() => {
    const set = new Set<string>()
    laborers.forEach((l) => set.add(l.location))
    return Array.from(set).sort()
  }, [laborers])

  const filtered = useMemo(() => {
    let list = [...laborers]
    if (skillFilter) list = list.filter((l) => l.skills.some((s) => s.name === skillFilter))
    if (locationFilter) list = list.filter((l) => l.location === locationFilter)
    if (dayFilter) list = list.filter((l) => l.availability.includes(dayFilter))
    list.sort((a, b) => {
      const aMin = a.skills.length > 0 ? Math.min(...a.skills.map((s) => s.hourlyRate)) : 0
      const bMin = b.skills.length > 0 ? Math.min(...b.skills.map((s) => s.hourlyRate)) : 0
      return sortOrder === "asc" ? aMin - bMin : bMin - aMin
    })
    return list
  }, [laborers, skillFilter, locationFilter, dayFilter, sortOrder])

  const handleHireClick = (laborer: Laborer) => {
    setSelectedLaborer(laborer)
    setSelectedProject("")
    setSelectedDate(undefined)
    setPickup("")
    setDropoff("")
    setOfferedAmount("")
    setHireDialogOpen(true)
  }

  const handleSendRequest = () => {
    if (!selectedLaborer || !selectedProject || !selectedDate || !pickup.trim() || !offeredAmount) {
      toast.error("Please fill in all fields including offered amount.")
      return
    }
    addHireRequest({
      id: `request-${Date.now()}`,
      projectId: selectedProject,
      laborerId: selectedLaborer.id,
      contractorId: currentUserId!,
      date: selectedDate.toISOString().split("T")[0],
      status: "pending",
      pickupLocation: pickup.trim(),
      dropoffLocation: dropoff.trim(),
      offeredAmount: Number(offeredAmount),
      jobCompleted: false,
    })
    setHireDialogOpen(false)
    toast.success("Hire request sent!")
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
      <main className="mx-auto w-full max-w-3xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold text-foreground">{t("browse.title")}</h1>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-3">
          <Select value={skillFilter || "all"} onValueChange={(v) => setSkillFilter(v === "all" ? "" : v)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder={t("browse.filterSkill")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("common.all")}</SelectItem>
              {allSkills.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={locationFilter || "all"} onValueChange={(v) => setLocationFilter(v === "all" ? "" : v)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder={t("browse.filterLocation")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("common.all")}</SelectItem>
              {allLocations.map((l) => (
                <SelectItem key={l} value={l}>{l}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={dayFilter || "all"} onValueChange={(v) => setDayFilter(v === "all" ? "" : v)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder={t("browse.filterDay")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("common.all")}</SelectItem>
              {DAYS.map((d) => (
                <SelectItem key={d} value={d}>{t(`day.${d}`)}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortOrder} onValueChange={(v) => setSortOrder(v as "asc" | "desc")}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder={t("browse.sortRate")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">{t("browse.lowToHigh")}</SelectItem>
              <SelectItem value="desc">{t("browse.highToLow")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results */}
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((laborer) => (
            <LaborerCard
              key={laborer.id}
              laborer={laborer}
              showHireButton
              onHire={() => handleHireClick(laborer)}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="mt-8 text-center text-muted-foreground">No laborers match your filters.</p>
        )}
      </main>

      {/* Hire dialog */}
      <Dialog open={hireDialogOpen} onOpenChange={setHireDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {t("browse.requestHire")}{selectedLaborer ? ` - ${selectedLaborer.name}` : ""}
            </DialogTitle>
            <DialogDescription className="sr-only">Select project, date, and payment details.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <Label>{t("browse.selectProject")}</Label>
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger>
                  <SelectValue placeholder={t("browse.selectProject")} />
                </SelectTrigger>
                <SelectContent>
                  {myProjects.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>{t("browse.selectDate")}</Label>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>{t("browse.pickupLocation")}</Label>
              <Input value={pickup} onChange={(e) => setPickup(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>{t("browse.dropoffLocation")}</Label>
              <Input value={dropoff} onChange={(e) => setDropoff(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>{t("browse.offeredAmount")}</Label>
              <Input
                type="number"
                value={offeredAmount}
                onChange={(e) => setOfferedAmount(e.target.value)}
                placeholder="e.g. 2500"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSendRequest}>{t("browse.sendRequest")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
