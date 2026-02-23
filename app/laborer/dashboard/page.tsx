"use client"

import { useState } from "react"
import { useApp } from "@/lib/context/app-context"
import { useLanguage } from "@/lib/context/language-context"
import { AppHeader } from "@/components/app-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { StarRating } from "@/components/star-rating"
import { Car, CircleOff, MapPin } from "lucide-react"
import { toast } from "sonner"

export default function LaborerDashboardPage() {
  const { laborers, projects, hireRequests, contractors, currentUserId, updateHireRequest, addContractorRating, hydrated } = useApp()
  const { t } = useLanguage()

  const [pickupDialogOpen, setPickupDialogOpen] = useState(false)
  const [counterDialogOpen, setCounterDialogOpen] = useState(false)
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null)
  const [editPickup, setEditPickup] = useState("")
  const [editDropoff, setEditDropoff] = useState("")
  const [counterAmount, setCounterAmount] = useState("")

  // Rate hirer state
  const [rateHirerOpen, setRateHirerOpen] = useState(false)
  const [rateHirerContractorId, setRateHirerContractorId] = useState<string | null>(null)
  const [hirerStars, setHirerStars] = useState(0)
  const [hirerComment, setHirerComment] = useState("")

  const laborer = laborers.find((l) => l.id === currentUserId)
  const myRequests = hireRequests.filter((r) => r.laborerId === currentUserId)
  const acceptedDates = myRequests
    .filter((r) => r.status === "accepted")
    .map((r) => new Date(r.date))

  const handleAcceptClick = (requestId: string) => {
    const req = hireRequests.find((r) => r.id === requestId)
    if (!req) return
    setSelectedRequestId(requestId)
    setEditPickup(req.pickupLocation)
    setEditDropoff(req.dropoffLocation)
    setPickupDialogOpen(true)
  }

  const handleConfirmAccept = () => {
    if (!selectedRequestId) return
    updateHireRequest(selectedRequestId, {
      status: "accepted",
      pickupLocation: editPickup,
      dropoffLocation: editDropoff,
    })
    setPickupDialogOpen(false)
    toast.success("Request accepted!")
  }

  const handleDecline = (requestId: string) => {
    updateHireRequest(requestId, { status: "declined" })
    toast.success("Request declined.")
  }

  const handleCounterClick = (requestId: string) => {
    setSelectedRequestId(requestId)
    setCounterAmount("")
    setCounterDialogOpen(true)
  }

  const handleSubmitCounter = () => {
    if (!selectedRequestId || !counterAmount) return
    updateHireRequest(selectedRequestId, {
      status: "negotiating",
      counterAmount: Number(counterAmount),
    })
    setCounterDialogOpen(false)
    toast.success("Counter offer sent!")
  }

  const handleRateHirerClick = (contractorId: string) => {
    setRateHirerContractorId(contractorId)
    setHirerStars(0)
    setHirerComment("")
    setRateHirerOpen(true)
  }

  const handleSubmitHirerRating = () => {
    if (!rateHirerContractorId || hirerStars === 0) return
    addContractorRating(rateHirerContractorId, {
      laborerId: currentUserId!,
      laborerName: laborer?.name ?? "",
      stars: hirerStars,
      comment: hirerComment.trim(),
      date: new Date().toISOString().split("T")[0],
    })
    setRateHirerOpen(false)
    toast.success("Rating submitted!")
  }

  if (!hydrated || !laborer) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-muted-foreground">{t("common.loading")}</div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader />
      <main className="mx-auto w-full max-w-2xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold text-foreground">{t("common.dashboard")}</h1>

        {/* Profile summary */}
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{laborer.name}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" /> {laborer.location}
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              {laborer.canDrive ? (
                <><Car className="h-3.5 w-3.5 text-primary" /> {t("laborer.canDrive")}</>
              ) : (
                <><CircleOff className="h-3.5 w-3.5" /> {t("laborer.cannotDrive")}</>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {laborer.skills.map((skill) => (
                <Badge key={skill.name} variant="secondary" className="text-xs">
                  {skill.name} - {t("common.currency")}{skill.hourlyRate}{t("common.perHour")}
                </Badge>
              ))}
            </div>
            {laborer.ratings.length > 0 && (
              <div className="flex items-center gap-2 mt-1">
                <StarRating
                  value={Math.round(laborer.ratings.reduce((s, r) => s + r.stars, 0) / laborer.ratings.length)}
                  readonly
                  size={16}
                />
                <span className="text-xs text-muted-foreground">({laborer.ratings.length} reviews)</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Calendar */}
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{t("laborer.myCalendar")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="multiple"
              selected={acceptedDates}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        {/* Hire requests */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{t("laborer.hireRequests")}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {myRequests.length === 0 && (
              <p className="text-sm text-muted-foreground">No hire requests yet.</p>
            )}
            {myRequests.map((req) => {
              const project = projects.find((p) => p.id === req.projectId)
              const contractor = contractors.find((c) => c.id === req.contractorId)
              const contractorAvgRating = contractor && contractor.ratings.length > 0
                ? contractor.ratings.reduce((sum, r) => sum + r.stars, 0) / contractor.ratings.length
                : 0
              return (
                <Card key={req.id} className="border-border">
                  <CardContent className="flex flex-col gap-2 pt-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-foreground">{project?.title ?? "Unknown Project"}</p>
                        <p className="text-xs text-muted-foreground">
                          {t("role.contractor")}: {contractor?.name ?? "Unknown"} &middot; {req.date}
                        </p>
                        {contractorAvgRating > 0 && (
                          <div className="mt-1 flex items-center gap-1">
                            <StarRating value={Math.round(contractorAvgRating)} readonly size={14} />
                            <span className="text-xs text-muted-foreground">({contractor!.ratings.length})</span>
                          </div>
                        )}
                      </div>
                      <Badge
                        variant={
                          req.status === "accepted" ? "default" :
                          req.status === "declined" ? "destructive" :
                          req.status === "negotiating" ? "outline" :
                          "secondary"
                        }
                      >
                        {t(`common.${req.status}`)}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <p>Pickup: {req.pickupLocation}</p>
                      <p>Dropoff: {req.dropoffLocation}</p>
                    </div>
                    <div className="text-sm font-medium text-primary">
                      {t("browse.offeredAmount")}: {t("common.currency")}{req.offeredAmount}
                    </div>
                    {req.counterAmount && req.status === "negotiating" && (
                      <div className="text-sm text-muted-foreground">
                        {t("laborer.yourAmount")}: {t("common.currency")}{req.counterAmount}
                      </div>
                    )}
                    {req.status === "pending" && (
                      <div className="flex gap-2 mt-1">
                        <Button size="sm" onClick={() => handleAcceptClick(req.id)}>
                          {t("common.accept")}
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleCounterClick(req.id)}>
                          {t("laborer.counterOffer")}
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDecline(req.id)}>
                          {t("common.decline")}
                        </Button>
                      </div>
                    )}
                    {req.status === "negotiating" && (
                      <p className="text-xs text-muted-foreground italic">Waiting for hirer response...</p>
                    )}
                    {(req.status === "completed" || req.jobCompleted) && contractor && (
                      <Button size="sm" variant="outline" onClick={() => handleRateHirerClick(contractor.id)} className="w-fit">
                        {t("project.rateHirer")}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </CardContent>
        </Card>
      </main>

      {/* Accept / confirm pickup dialog */}
      <Dialog open={pickupDialogOpen} onOpenChange={setPickupDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{t("laborer.confirmPickup")}</DialogTitle>
            <DialogDescription className="sr-only">Confirm or edit pickup locations before accepting.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <Label>{t("browse.pickupLocation")}</Label>
              <Input value={editPickup} onChange={(e) => setEditPickup(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>{t("browse.dropoffLocation")}</Label>
              <Input value={editDropoff} onChange={(e) => setEditDropoff(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleConfirmAccept}>{t("common.accept")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Counter offer dialog */}
      <Dialog open={counterDialogOpen} onOpenChange={setCounterDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{t("laborer.counterOffer")}</DialogTitle>
            <DialogDescription className="sr-only">Request a different payment amount.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <Label>{t("laborer.yourAmount")} ({t("common.currency")})</Label>
              <Input
                type="number"
                value={counterAmount}
                onChange={(e) => setCounterAmount(e.target.value)}
                placeholder="e.g. 3000"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSubmitCounter}>{t("common.submit")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rate Hirer dialog */}
      <Dialog open={rateHirerOpen} onOpenChange={setRateHirerOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{t("project.rateHirer")}</DialogTitle>
            <DialogDescription className="sr-only">Rate the hirer.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <Label>{t("project.stars")}</Label>
              <StarRating value={hirerStars} onChange={setHirerStars} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>{t("project.comment")}</Label>
              <Textarea value={hirerComment} onChange={(e) => setHirerComment(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSubmitHirerRating}>{t("common.submit")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
