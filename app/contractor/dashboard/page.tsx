"use client"

import { useState } from "react"
import { useApp } from "@/lib/context/app-context"
import { useLanguage } from "@/lib/context/language-context"
import { AppHeader } from "@/components/app-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, X, Users } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Link from "next/link"

export default function ContractorDashboardPage() {
  const { projects, hireRequests, currentUserId, addProject, hydrated } = useApp()
  const { t } = useLanguage()
  const router = useRouter()
  const [createOpen, setCreateOpen] = useState(false)

  const [title, setTitle] = useState("")
  const [desc, setDesc] = useState("")
  const [location, setLocation] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [photoUrls, setPhotoUrls] = useState<string[]>([])
  const [photoUrl, setPhotoUrl] = useState("")

  const myProjects = projects.filter((p) => p.contractorId === currentUserId)

  const handleAddPhoto = () => {
    if (!photoUrl.trim()) return
    setPhotoUrls([...photoUrls, photoUrl.trim()])
    setPhotoUrl("")
  }

  const handleRemovePhoto = (idx: number) => {
    setPhotoUrls(photoUrls.filter((_, i) => i !== idx))
  }

  const handleCreate = () => {
    if (!title.trim() || !location.trim()) {
      toast.error("Please fill in title and location.")
      return
    }
    const id = `project-${Date.now()}`
    addProject({
      id,
      contractorId: currentUserId!,
      title: title.trim(),
      description: desc.trim(),
      location: location.trim(),
      photoUrls,
      startDate,
      endDate,
      status: "active",
    })
    setTitle("")
    setDesc("")
    setLocation("")
    setStartDate("")
    setEndDate("")
    setPhotoUrls([])
    setCreateOpen(false)
    toast.success("Project created!")
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
      <main className="mx-auto w-full max-w-2xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">{t("contractor.projects")}</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push("/contractor/browse")}>
              <Users className="mr-1.5 h-4 w-4" />
              {t("contractor.browseLaborers")}
            </Button>
            <Button onClick={() => setCreateOpen(true)}>
              <Plus className="mr-1.5 h-4 w-4" />
              {t("contractor.createProject")}
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {myProjects.length === 0 && (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No projects yet. Create your first project!
              </CardContent>
            </Card>
          )}
          {myProjects.map((project) => {
            const requestCount = hireRequests.filter((r) => r.projectId === project.id).length
            return (
              <Link key={project.id} href={`/contractor/project/${project.id}`}>
                <Card className="cursor-pointer border-border transition-all hover:border-primary/40 hover:shadow-md">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base text-foreground">{project.title}</CardTitle>
                      <Badge variant={project.status === "active" ? "default" : "secondary"}>
                        {project.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-1">
                    <p className="text-sm text-muted-foreground">{project.description}</p>
                    <p className="text-xs text-muted-foreground">{project.location}</p>
                    {project.startDate && (
                      <p className="text-xs text-muted-foreground">
                        {project.startDate} - {project.endDate || "Ongoing"}
                      </p>
                    )}
                    <p className="text-xs text-primary">{requestCount} hire request(s)</p>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </main>

      {/* Create project dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t("contractor.createProject")}</DialogTitle>
            <DialogDescription className="sr-only">Fill in project details.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <Label>{t("contractor.projectTitle")}</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>{t("contractor.projectDesc")}</Label>
              <Input value={desc} onChange={(e) => setDesc(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>{t("common.location")}</Label>
              <Input value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>
            <div className="flex gap-3">
              <div className="flex flex-1 flex-col gap-1.5">
                <Label>{t("contractor.startDate")}</Label>
                <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </div>
              <div className="flex flex-1 flex-col gap-1.5">
                <Label>{t("contractor.endDate")}</Label>
                <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
            </div>
            {/* Project space photos */}
            <div className="flex flex-col gap-1.5">
              <Label>{t("contractor.projectPhotos")}</Label>
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
                  placeholder="https://..."
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  className="flex-1"
                />
                <Button type="button" size="sm" variant="outline" onClick={handleAddPhoto}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleCreate}>{t("common.save")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
