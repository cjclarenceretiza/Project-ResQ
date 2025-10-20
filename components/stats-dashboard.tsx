import type { Statistics } from "@/lib/types"
import { Activity, Heart, Package, Users } from "lucide-react"

interface StatsDashboardProps {
  stats: Statistics
}

export function StatsDashboard({ stats }: StatsDashboardProps) {
  const statItems = [
    {
      label: "Active Missions",
      value: stats.activeMissions,
      icon: Activity,
      color: "text-accent",
    },
    {
      label: "People Helped",
      value: stats.peopleHelped.toLocaleString(),
      icon: Heart,
      color: "text-primary",
    },
    {
      label: "Donations Received",
      value: stats.donationsReceived,
      icon: Package,
      color: "text-chart-3",
    },
    {
      label: "Active Volunteers",
      value: stats.volunteersActive,
      icon: Users,
      color: "text-chart-4",
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((stat) => {
        const Icon = stat.icon
        return (
          <div
            key={stat.label}
            className="bg-card border border-border rounded-lg p-6 hover:border-accent/50 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-balance">{stat.value}</p>
              </div>
              <Icon className={`w-5 h-5 ${stat.color}`} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
