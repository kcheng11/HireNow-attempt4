"use client"

import { useState } from "react"
import { useLanguage } from "@/lib/context/language-context"
import { useApp } from "@/lib/context/app-context"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { StarRating } from "@/components/star-rating"
import { Globe, ArrowLeft, LogOut, Flag } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function AppHeader() {
  const { language, setLanguage, t } = useLanguage()
  const { currentRole, currentUserId, projects, logout, addReport } = useApp()
  const router = useRouter()

  const [reportOpen, setReportOpen] = useState(false)
  const [reportTargetType, setReportTargetType] = useState<"laborer" | "contractor">("laborer")
  const [reportProjectId, setReportProjectId] = useState("")
  const [reportDescription, setReportDescription] = useState("")
  const [reportRating, setReportRating] = useState(0)

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  // Get projects associated with the current user (for report dropdown)
  const userProjects = projects.filter((p) => {
    if (currentRole === "contractor") return p.contractorId === currentUserId
    // For laborers, show projects they have hire requests for
    return true
  })

  const handleOpenReport = () => {
    setReportTargetType(currentRole === "contractor" ? "laborer" : "contractor")
    setReportProjectId("")
    setReportDescription("")
    setReportRating(0)
    setReportOpen(true)
  }

  const handleSubmitReport = () => {
    if (!reportProjectId || !reportDescription.trim() || reportRating === 0) {
      toast.error("Please fill in all fields.")
      return
    }
    addReport({
      id: `report-${Date.now()}`,
      reporterId: currentUserId!,
      reporterRole: currentRole!,
      projectId: reportProjectId,
      description: reportDescription.trim(),
      rating: reportRating,
      targetType: reportTargetType,
      date: new Date().toISOString().split("T")[0],
    })
    setReportOpen(false)
    toast.success(t("report.success"))
  }

  return (
    <>
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
              <Button variant="destructive" size="sm" onClick={handleOpenReport} className="gap-1.5">
                <Flag className="h-3.5 w-3.5" />
                {t("report.title")}
              </Button>
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

      {/* Report User Dialog */}
      <Dialog open={reportOpen} onOpenChange={setReportOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t("report.title")}</DialogTitle>
            <DialogDescription className="sr-only">Submit a report against a laborer or hirer.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label>{t("report.targetType")}</Label>
              <Select value={reportTargetType} onValueChange={(v) => setReportTargetType(v as "laborer" | "contractor")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="laborer">{t("report.laborer")}</SelectItem>
                  <SelectItem value="contractor">{t("report.contractor")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>{t("report.selectProject")}</Label>
              <Select value={reportProjectId} onValueChange={setReportProjectId}>
                <SelectTrigger>
                  <SelectValue placeholder={t("report.selectProject")} />
                </SelectTrigger>
                <SelectContent>
                  {userProjects.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>{t("report.description")}</Label>
              <Textarea
                value={reportDescription}
                onChange={(e) => setReportDescription(e.target.value)}
                placeholder={t("report.description")}
                rows={4}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>{t("report.rating")}</Label>
              <StarRating value={reportRating} onChange={setReportRating} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReportOpen(false)}>{t("common.cancel")}</Button>
            <Button onClick={handleSubmitReport}>{t("report.submit")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
