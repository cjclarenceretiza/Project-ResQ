"use client"

import { Navigation } from "@/components/navigation"
import { mockMissions } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users, Calendar, AlertCircle, CheckCircle, ArrowLeft, Share2, ImageIcon, Lock } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { getOrCreateDeviceId } from "@/lib/device-id"
import { AdminPanel } from "@/components/admin-panel"
import type { Mission } from "@/lib/types"

export default function MissionDetailPage() {
  const params = useParams()
  const [mission, setMission] = useState<Mission | null>(null)
  const [hasJoined, setHasJoined] = useState(false)
  const [deviceId, setDeviceId] = useState("")
  const [showAdminPanel, setShowAdminPanel] = useState(false)

  useEffect(() => {
    const id = getOrCreateDeviceId()
    setDeviceId(id)

    const foundMission = mockMissions.find((m) => m.id === params.id)
    setMission(foundMission || null)
  }, [params.id])

  if (!mission) {
    return (
      <div className="min-h-screen dark">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-2">Mission Not Found</h1>
            <p className="text-muted-foreground mb-4">The mission you're looking for doesn't exist.</p>
            <Link href="/missions">
              <Button>Back to Missions</Button>
            </Link>
          </div>
        </main>
      </div>
    )
  }

  const progress = (mission.currentVolunteers / mission.peopleNeeded) * 100
  const isUrgent = mission.status === "urgent"
  const isCompleted = mission.status === "completed"
  const isOrganizerDevice = mission.organizerDeviceId === deviceId

  const categoryColors = {
    food: "bg-[#f49700]/10 text-[#f49700] border-[#f49700]/20",
    medical: "bg-[#df000d]/10 text-[#df000d] border-[#df000d]/20",
    shelter: "bg-[#0081f1]/10 text-[#0081f1] border-[#0081f1]/20",
    rescue: "bg-[#ff4500]/10 text-[#ff4500] border-[#ff4500]/20",
    supplies: "bg-[#00af67]/10 text-[#00af67] border-[#00af67]/20",
  }

  const handleJoinMission = () => {
    if (!hasJoined && !mission.volunteers.includes(deviceId)) {
      const updatedMission = {
        ...mission,
        volunteers: [...mission.volunteers, deviceId],
      }
      setMission(updatedMission)
      setHasJoined(true)
    }
  }

  const handleUpdateMission = (updatedMission: Mission) => {
    setMission(updatedMission)
    setShowAdminPanel(false)
  }

  return (
    <div className="min-h-screen dark">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href="/missions"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Missions
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                {isUrgent && (
                  <Badge variant="destructive" className="gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Urgent
                  </Badge>
                )}
                {isCompleted && (
                  <Badge variant="secondary" className="gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Completed
                  </Badge>
                )}
                <Badge variant="outline" className={categoryColors[mission.category]}>
                  {mission.category}
                </Badge>
              </div>

              <h1 className="text-4xl font-bold text-balance leading-tight">{mission.title}</h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{mission.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Created {formatDistanceToNow(mission.createdAt, { addSuffix: true })}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-3">Mission Details</h2>
              <p className="text-muted-foreground leading-relaxed text-pretty">{mission.description}</p>
            </div>

            {/* Transparency Section */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-3">Transparency & Updates</h2>
              <p className="text-sm text-muted-foreground mb-4">
                All donations and activities are documented with receipts and photos for full transparency.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="aspect-square bg-secondary rounded-lg flex items-center justify-center border border-border hover:border-[#ff4500]/50 transition-colors cursor-pointer"
                  >
                    <ImageIcon className="w-8 h-8 text-muted-foreground" />
                  </div>
                ))}
              </div>

              <p className="text-xs text-muted-foreground mt-4">
                Photos and receipts will be uploaded as the mission progresses
              </p>
            </div>

            {/* Organizer Info */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-3">Organized By</h2>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#ff4500] rounded-full flex items-center justify-center">
                  <span className="text-[#ff4500]-foreground font-bold text-lg">{mission.createdBy.charAt(0)}</span>
                </div>
                <div>
                  <p className="font-medium">{mission.createdBy}</p>
                  <p className="text-sm text-muted-foreground">Local Government Unit</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Action Card */}
            <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
              <div className="space-y-4">
                {/* Progress */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Volunteers</span>
                    </div>
                    <span className="text-sm font-bold">
                      {mission.currentVolunteers} / {mission.peopleNeeded}
                    </span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full transition-all ${isUrgent ? "bg-[#df000d]" : "bg-[#ff4500]"}`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {mission.peopleNeeded - mission.currentVolunteers} more volunteers needed
                  </p>
                </div>

                {/* CTA Buttons */}
                <div className="space-y-2 pt-2">
                  {!isCompleted && (
                    <Button
                      className="w-full bg-[#0081f1] hover:bg-[#0081f1]/90"
                      size="lg"
                      onClick={handleJoinMission}
                      disabled={hasJoined}
                    >
                      {hasJoined ? "You've Joined!" : "Join This Mission"}
                    </Button>
                  )}
                  {isCompleted && (
                    <Button className="w-full" size="lg" variant="secondary" disabled>
                      Mission Completed
                    </Button>
                  )}
                  <Button variant="outline" className="w-full gap-2 bg-transparent">
                    <Share2 className="w-4 h-4" />
                    Share Mission
                  </Button>
                </div>

                {/* Admin Panel Button */}
                <Button
                  onClick={() => setShowAdminPanel(true)}
                  className="w-full gap-2 bg-[#ff4500]/20 text-[#ff4500] hover:bg-[#ff4500]/30 border border-[#ff4500]/30"
                  variant="outline"
                >
                  <Lock className="w-4 h-4" />
                  Manage Mission
                </Button>

                {hasJoined && (
                  <div className="bg-[#ff4500]/10 border border-[#ff4500]/20 rounded-lg p-4 mt-4">
                    <p className="text-sm text-[#ff4500] font-medium">
                      Thank you for joining! The organizer will contact you with further details.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Info */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-semibold mb-4">Quick Info</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className="font-medium capitalize">{mission.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category</span>
                  <span className="font-medium capitalize">{mission.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span className="font-medium">{formatDistanceToNow(mission.createdAt, { addSuffix: true })}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Admin Panel Modal */}
      {showAdminPanel && (
        <AdminPanel
          mission={mission}
          deviceId={deviceId}
          onClose={() => setShowAdminPanel(false)}
          onUpdateMission={handleUpdateMission}
        />
      )}

    </div>
  )
}
