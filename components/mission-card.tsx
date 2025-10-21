import type { Mission } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { MapPin, Users, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface MissionCardProps {
  mission: Mission
}

export function MissionCard({ mission }: MissionCardProps) {
  const progress = (mission.currentVolunteers / mission.peopleNeeded) * 100
  const isUrgent = mission.status === "urgent"
  const isCompleted = mission.status === "completed"

  const categoryColors = {
    food: "bg-chart-4/10 text-chart-4 border-chart-4/20",
    medical: "bg-destructive/10 text-destructive border-destructive/20",
    shelter: "bg-primary/10 text-primary border-primary/20",
    rescue: "bg-[#ff4500]/10 text-[#ff4500] border-[#ff4500]/20",
    supplies: "bg-chart-3/10 text-chart-3 border-chart-3/20",
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:border-[#ff4500]/50 transition-all hover:shadow-lg h-full flex flex-col">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {isUrgent && (
              <Badge variant="destructive" className="gap-1">
                <AlertCircle className="w-3 h-3" />
                Urgent
              </Badge>
            )}
            {isCompleted && <Badge variant="secondary">Completed</Badge>}
            <Badge variant="outline" className={categoryColors[mission.category]}>
              {mission.category}
            </Badge>
          </div>
          <h3 className="font-semibold text-lg mb-2 text-balance leading-tight">{mission.title}</h3>
        </div>
      </div>

      <div className="space-y-3 mb-4 flex-1">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span>{mission.location}</span>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 text-pretty">{mission.description}</p>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                {mission.currentVolunteers} / {mission.peopleNeeded} volunteers
              </span>
            </div>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
            <div
              className={`h-full transition-all ${isUrgent ? "bg-destructive" : "bg-[#ff4500]"}`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-border">
        <span className="text-xs text-muted-foreground">by {mission.createdBy}</span>
        <Button
          size="sm"
          variant={isCompleted ? "secondary" : "default"}
          className={!isCompleted ? "bg-primary hover:bg-primary/90" : ""}
          disabled={isCompleted}
        >
          {isCompleted ? "Completed" : "View Details"}
        </Button>
      </div>
    </div>
  )
}
