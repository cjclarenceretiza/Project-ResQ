import type { CommunityUpdate } from "@/lib/types"
import { AlertCircle, CheckCircle, Megaphone } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface CommunityFeedProps {
  updates: CommunityUpdate[]
}

export function CommunityFeed({ updates }: CommunityFeedProps) {
  const getIcon = (type: CommunityUpdate["type"]) => {
    switch (type) {
      case "urgent":
        return <AlertCircle className="w-5 h-5 text-destructive" />
      case "success":
        return <CheckCircle className="w-5 h-5 text-chart-3" />
      case "announcement":
        return <Megaphone className="w-5 h-5 text-primary" />
    }
  }

  const getBorderColor = (type: CommunityUpdate["type"]) => {
    switch (type) {
      case "urgent":
        return "border-l-destructive"
      case "success":
        return "border-l-chart-3"
      case "announcement":
        return "border-l-primary"
    }
  }

  return (
    <div className="space-y-4">
      {updates.map((update) => (
        <div
          key={update.id}
          className={`bg-card border border-border border-l-4 ${getBorderColor(
            update.type,
          )} rounded-lg p-5 hover:border-[#ff4500]/50 transition-colors`}
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5">{getIcon(update.type)}</div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold mb-1 text-balance">{update.title}</h4>
              <p className="text-sm text-muted-foreground mb-2 text-pretty">{update.content}</p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>{update.author}</span>
                <span>•</span>
                <span>{formatDistanceToNow(update.createdAt, { addSuffix: true })}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
