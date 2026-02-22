"use client"

import { use, useState } from "react"
import { useApp } from "@/lib/context/app-context"
import { useLanguage } from "@/lib/context/language-context"
import { AppHeader } from "@/components/app-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { StarRating } from "@/components/star-rating"
import { Car, CircleOff, MapPin, ImageIcon, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { projects, hireRequests, laborers, currentUserId, updateHireRequest, addRating, hydrated } = useApp()
  const { t } = useLanguage()

  const [rateDialogOpen, setRateDialogOpen] = useState(false)
  const [ratingLaborerId, setRatingLaborerId] = useState<string | null>(null)
  const [stars, setStars] = useState(0)
  const [comment, setComment] = useState("")

  const [amendDialogOpen, setAmendDialogOpen] = useState(false)
  const [amendRequestId, setAmendRequestId] = useState<string | null>(null)
  const [amendAmount, setAmendAmount] = useState("")

  const [completedRequests, setCompletedRequests] = useState<Set<string>>(new Set())

  const project = projects.find((p) => p.id === id)
  const requests = hireRequests.filter((r) => r.projectId === id)
  const contractor = useApp().contractors.find(c => c.id === currentUserId)

  if (!hydrated || !project) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-muted-foreground">{t("common.loading")}</div>
      </div>
    )
  }

  const handleApproveCounter = (requestId: string) => {
    const req = hireRequests.find(r => r.id === requestId)
    if (!req || !req.counterAmount) return
    updateHireRequest(requestId, {
      status: "accepted",
      offeredAmount: req.counterAmount,
      counterAmount: undefined,
    })
    toast.success("Counter offer approved!")
  }

  const handleDenyCounter = (requestId: string) => {
    updateHireRequest(requestId, { status: "declined" })
    toast.success("Counter offer denied.")
  }

  const handleAmendClick = (requestId: string) => {
    setAmendRequestId(requestId)
    setAmendAmount("")
    setAmendDialogOpen(true)
  }

  const handleSubmitAmend = () => {
    if (!amendRequestId || !amendAmount) return
    updateHireRequest(amendRequestId, {
      status: "pending",
      offeredAmount: Number(amendAmount),
      counterAmount: undefined,
    })
    setAmendDialogOpen(false)
    toast.success("Amended offer sent to laborer!")
  }

  const handleJobCompleted = (requestId: string) => {
    updateHireRequest(requestId, { jobCompleted: true, status: "completed" })
    setCompletedRequests(prev => new Set(prev).add(requestId))
    toast.success(t("project.paymentReceived"))
  }

  const handleRateClick = (laborerId: string) => {
    setRatingLaborerId(laborerId)
    setStars(0)
    setComment("")
    setRateDialogOpen(true)
  }

  const handleSubmitRating = () => {
    if (!ratingLaborerId || stars === 0) return
    addRating(ratingLaborerId, {
      contractorId: currentUserId!,
      contractorName: contractor?.name ?? "",
      stars,
      comment: comment.trim(),
      date: new Date().toISOString().split("T")[0],
    })
    setRateDialogOpen(false)
    toast.success("Rating submitted!")
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader />
      <main className="mx-auto w-full max-w-2xl px-4 py-8">
        <h1 className="mb-2 text-2xl font-bold text-foreground">{project.title}</h1>
        <p className="mb-1 text-sm text-muted-foreground">{project.description}</p>
        <p className="mb-1 text-xs text-muted-foreground">{project.location}</p>
        {project.startDate && (
          <p className="mb-4 text-xs text-muted-foreground">
            {project.startDate} - {project.endDate || "Ongoing"}
          </p>
        )}

        {/* Project space photos */}
        {project.photoUrls.length > 0 && (
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <ImageIcon className="h-4 w-4" />
                {t("contractor.projectPhotos")}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              {project.photoUrls.map((url, idx) => (
                <a key={idx} href={url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary underline break-all">
                  {url}
                </a>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Hired laborers / requests */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{t("project.hiredLaborers")}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {requests.length === 0 && (
              <p className="text-sm text-muted-foreground">No hire requests yet.</p>
            )}
            {requests.map((req) => {
              const laborer = laborers.find((l) => l.id === req.laborerId)
              if (!laborer) return null
              const showPaymentReceived = completedRequests.has(req.id) || req.jobCompleted
              return (
                <Card key={req.id} className="border-border">
                  <CardContent className="flex flex-col gap-2 pt-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-foreground">{laborer.name}</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" /> {laborer.location}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                          {laborer.canDrive ? (
                            <><Car className="h-3 w-3 text-primary" /> {t("laborer.canDrive")}</>
                          ) : (
                            <><CircleOff className="h-3 w-3" /> {t("laborer.cannotDrive")}</>
                          )}
                        </div>
                      </div>
                      <Badge
                        variant={
                          req.status === "accepted" ? "default" :
                          req.status === "declined" ? "destructive" :
                          req.status === "completed" ? "default" :
                          req.status === "negotiating" ? "outline" :
                          "secondary"
                        }
                      >
                        {t(`common.${req.status}`)}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <p>Date: {req.date}</p>
                      <p>Pickup: {req.pickupLocation}</p>
                      <p>Dropoff: {req.dropoffLocation}</p>
                    </div>
                    <div className="text-sm font-medium text-primary">
                      {t("browse.offeredAmount")}: {t("common.currency")}{req.offeredAmount}
                    </div>

                    {/* Negotiation handling */}
                    {req.status === "negotiating" && req.counterAmount && (
                      <div className="rounded-md border border-border bg-muted/50 p-3">
                        <p className="mb-2 text-sm text-foreground">
                          {t("project.counterOffer")}: {t("common.currency")}{req.counterAmount}
                        </p>
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleApproveCounter(req.id)}>
                            {t("project.approveAmount")}
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleAmendClick(req.id)}>
                            {t("project.amendAmount")}
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDenyCounter(req.id)}>
                            {t("project.denyAmount")}
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Job completed button */}
                    {req.status === "accepted" && !showPaymentReceived && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleJobCompleted(req.id)}
                        className="w-fit"
                      >
                        <CheckCircle2 className="mr-1.5 h-4 w-4" />
                        {t("project.jobCompleted")}
                      </Button>
                    )}

                    {showPaymentReceived && (
                      <div className="flex items-center gap-2 rounded-md bg-primary/10 px-3 py-2 text-sm font-semibold text-primary">
                        <CheckCircle2 className="h-4 w-4" />
                        {t("project.paymentReceived")}
                      </div>
                    )}

                    {/* Rate laborer if completed */}
                    {(req.status === "completed" || showPaymentReceived) && (
                      <Button size="sm" variant="outline" onClick={() => handleRateClick(laborer.id)} className="w-fit">
                        {t("project.rateLaborer")}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </CardContent>
        </Card>
      </main>

      {/* Rate dialog */}
      <Dialog open={rateDialogOpen} onOpenChange={setRateDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{t("project.rateLaborer")}</DialogTitle>
            <DialogDescription className="sr-only">Rate the laborer.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <Label>{t("project.stars")}</Label>
              <StarRating value={stars} onChange={setStars} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>{t("project.comment")}</Label>
              <Textarea value={comment} onChange={(e) => setComment(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSubmitRating}>{t("common.submit")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Amend dialog */}
      <Dialog open={amendDialogOpen} onOpenChange={setAmendDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{t("project.amendAmount")}</DialogTitle>
            <DialogDescription className="sr-only">Enter a new amount to send back to the laborer.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <Label>{t("project.newAmount")} ({t("common.currency")})</Label>
              <Input
                type="number"
                value={amendAmount}
                onChange={(e) => setAmendAmount(e.target.value)}
                placeholder="e.g. 2800"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSubmitAmend}>{t("common.submit")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
