"use client"

import type { Laborer } from "@/lib/types"
import { useLanguage } from "@/lib/context/language-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { StarRating } from "@/components/star-rating"
import { MapPin, Car, CircleOff } from "lucide-react"

interface LaborerCardProps {
  laborer: Laborer
  onHire?: () => void
  showHireButton?: boolean
}

export function LaborerCard({ laborer, onHire, showHireButton = false }: LaborerCardProps) {
  const { t } = useLanguage()

  const avgRating =
    laborer.ratings.length > 0
      ? laborer.ratings.reduce((sum, r) => sum + r.stars, 0) / laborer.ratings.length
      : 0

  const lowestRate = laborer.skills.length > 0
    ? Math.min(...laborer.skills.map((s) => s.hourlyRate))
    : 0

  return (
    <Card className="border-border transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base text-foreground">{laborer.name}</CardTitle>
            <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              {laborer.location}
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-sm font-semibold text-primary">
              {"From "}{t("common.currency")}{lowestRate}{t("common.perHour")}
            </span>
            {avgRating > 0 && (
              <div className="flex items-center gap-1">
                <StarRating value={Math.round(avgRating)} readonly size={14} />
                <span className="text-xs text-muted-foreground">({laborer.ratings.length})</span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-1.5">
          {laborer.skills.map((skill) => (
            <Badge key={skill.name} variant="secondary" className="text-xs">
              {skill.name} - {t("common.currency")}{skill.hourlyRate}{t("common.perHour")}
            </Badge>
          ))}
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          {laborer.canDrive ? (
            <>
              <Car className="h-3.5 w-3.5 text-primary" />
              {t("laborer.canDrive")}
            </>
          ) : (
            <>
              <CircleOff className="h-3.5 w-3.5" />
              {t("laborer.cannotDrive")}
            </>
          )}
        </div>
        {showHireButton && onHire && (
          <Button onClick={onHire} size="sm" className="w-full">
            {t("browse.requestHire")}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
