"use client"

import { Navigation } from "@/components/navigation"
import { MissionCard } from "@/components/mission-card"
import { mockMissions } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Plus, Search } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import type { Mission, MissionStatus } from "@/lib/types"

export default function MissionsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<MissionStatus | "all">("all")
  const [selectedCategory, setSelectedCategory] = useState<Mission["category"] | "all">("all")

  const filteredMissions = mockMissions.filter((mission) => {
    const matchesSearch =
      mission.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mission.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mission.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = selectedStatus === "all" || mission.status === selectedStatus
    const matchesCategory = selectedCategory === "all" || mission.category === selectedCategory

    return matchesSearch && matchesStatus && matchesCategory
  })

  const statusOptions: Array<MissionStatus | "all"> = ["all", "active", "urgent", "completed"]
  const categoryOptions: Array<Mission["category"] | "all"> = [
    "all",
    "food",
    "medical",
    "shelter",
    "rescue",
    "supplies",
  ]

  return (
    <div className="min-h-screen dark">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Relief Missions</h1>
            <p className="text-muted-foreground">Browse and join active disaster relief operations</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search missions by title, location, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Status:</span>
              {statusOptions.map((status) => (
                <Badge
                  key={status}
                  variant={selectedStatus === status ? "default" : "outline"}
                  className="cursor-pointer capitalize"
                  onClick={() => setSelectedStatus(status)}
                >
                  {status}
                </Badge>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Category:</span>
              {categoryOptions.map((category) => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className="cursor-pointer capitalize"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            Showing {filteredMissions.length} {filteredMissions.length === 1 ? "mission" : "missions"}
          </p>
        </div>

        {/* Missions Grid */}
        {filteredMissions.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredMissions.map((mission) => (
              <Link key={mission.id} href={`/missions/${mission.id}`}>
                <MissionCard mission={mission} />
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No missions found matching your criteria.</p>
            <Button
              variant="link"
              onClick={() => {
                setSearchQuery("")
                setSelectedStatus("all")
                setSelectedCategory("all")
              }}
            >
              Clear filters
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
