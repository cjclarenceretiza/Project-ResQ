"use client"

import { Navigation } from "@/components/navigation"
import { mockMissions } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"
import { MapPin, AlertCircle, Users } from "lucide-react"
import { useState, useEffect } from "react"
import type { Mission } from "@/lib/types"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function MapPage() {
  const [selectedCategory, setSelectedCategory] = useState<Mission["category"] | "all">("all")
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const filteredMissions = mockMissions.filter((mission) => {
    const hasCoordinates = mission.coordinates !== undefined
    const matchesCategory = selectedCategory === "all" || mission.category === selectedCategory
    return hasCoordinates && matchesCategory
  })

  const categoryOptions: Array<Mission["category"] | "all"> = [
    "all",
    "food",
    "medical",
    "shelter",
    "rescue",
    "supplies",
  ]

  const getMarkerColor = (status: Mission["status"]) => {
    switch (status) {
      case "urgent":
        return "bg-destructive"
      case "active":
        return "bg-primary"
      case "completed":
        return "bg-muted"
      default:
        return "bg-accent"
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen dark">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="h-[600px] bg-card border border-border rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">Loading map...</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen dark">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-2">Mission Map</h1>
          <p className="text-muted-foreground">
            View all active relief missions and donation sites across Metro Manila
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">Filter by category:</span>
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

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Map Container */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              {/* Simple visual map representation */}
              <div className="relative h-[600px] bg-secondary/20">
                {/* Map background with grid */}
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
                    backgroundSize: "50px 50px",
                  }}
                />

                {/* Mission markers */}
                {filteredMissions.map((mission, index) => {
                  // Simple positioning based on coordinates (normalized for display)
                  const x = ((mission.coordinates!.lng - 120.9) / 0.2) * 100
                  const y = ((14.75 - mission.coordinates!.lat) / 0.15) * 100

                  return (
                    <button
                      key={mission.id}
                      className={`absolute w-8 h-8 rounded-full ${getMarkerColor(
                        mission.status,
                      )} border-2 border-background shadow-lg hover:scale-110 transition-transform cursor-pointer flex items-center justify-center`}
                      style={{
                        left: `${x}%`,
                        top: `${y}%`,
                        transform: "translate(-50%, -50%)",
                      }}
                      onClick={() => setSelectedMission(mission)}
                      title={mission.title}
                    >
                      <MapPin className="w-4 h-4 text-white" />
                    </button>
                  )
                })}

                {/* Legend */}
                <div className="absolute bottom-4 left-4 bg-card/95 backdrop-blur-sm border border-border rounded-lg p-4 space-y-2">
                  <p className="text-xs font-semibold mb-2">Legend</p>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 rounded-full bg-destructive" />
                    <span>Urgent</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 rounded-full bg-primary" />
                    <span>Active</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 rounded-full bg-muted" />
                    <span>Completed</span>
                  </div>
                </div>

                {/* Map label */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-card/95 backdrop-blur-sm border border-border rounded-lg px-4 py-2">
                  <p className="text-sm font-semibold">Metro Manila</p>
                </div>
              </div>
            </div>
          </div>

          {/* Mission Details Sidebar */}
          <div className="space-y-6">
            {selectedMission ? (
              <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {selectedMission.status === "urgent" && (
                        <Badge variant="destructive" className="gap-1">
                          <AlertCircle className="w-3 h-3" />
                          Urgent
                        </Badge>
                      )}
                      <Badge variant="outline" className="capitalize">
                        {selectedMission.category}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-lg text-balance leading-tight">{selectedMission.title}</h3>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{selectedMission.location}</span>
                  </div>

                  <p className="text-sm text-muted-foreground text-pretty">{selectedMission.description}</p>

                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {selectedMission.currentVolunteers} / {selectedMission.peopleNeeded} volunteers
                        </span>
                      </div>
                      <span className="font-medium">
                        {Math.round((selectedMission.currentVolunteers / selectedMission.peopleNeeded) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          selectedMission.status === "urgent" ? "bg-destructive" : "bg-accent"
                        }`}
                        style={{
                          width: `${Math.min(
                            (selectedMission.currentVolunteers / selectedMission.peopleNeeded) * 100,
                            100,
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 space-y-2">
                  <Link href={`/missions/${selectedMission.id}`}>
                    <Button className="w-full bg-primary hover:bg-primary/90">View Full Details</Button>
                  </Link>
                  <Button variant="outline" className="w-full bg-transparent" onClick={() => setSelectedMission(null)}>
                    Close
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-card border border-border rounded-lg p-6 text-center">
                <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">Click on a marker to view mission details</p>
              </div>
            )}

            {/* Mission List */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-semibold mb-4">Active Missions ({filteredMissions.length})</h3>
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {filteredMissions.map((mission) => (
                  <button
                    key={mission.id}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedMission?.id === mission.id
                        ? "border-accent bg-accent/10"
                        : "border-border hover:border-accent/50"
                    }`}
                    onClick={() => setSelectedMission(mission)}
                  >
                    <div className="flex items-start gap-2">
                      <div className={`w-3 h-3 rounded-full ${getMarkerColor(mission.status)} mt-1 flex-shrink-0`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{mission.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{mission.location}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
