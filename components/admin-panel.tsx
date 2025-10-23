"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle, Users, Lock, X } from "lucide-react"
import type { Mission } from "@/lib/types"

interface AdminPanelProps {
  mission: Mission
  deviceId: string
  onClose: () => void
  onUpdateMission: (updatedMission: Mission) => void
}

export function AdminPanel({ mission, deviceId, onClose, onUpdateMission }: AdminPanelProps) {
  const [pinInput, setPinInput] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [error, setError] = useState("")

  const isOrganizerDevice = mission.organizerDeviceId === deviceId

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (pinInput === mission.organizerPin) {
      setIsAuthenticated(true)
    } else {
      setError("Incorrect PIN. Please try again.")
      setPinInput("")
    }
  }

  const handleCompleteMission = () => {
    const updatedMission = {
      ...mission,
      status: "completed" as const,
    }
    onUpdateMission(updatedMission)
    onClose()
  }

  if (!isOrganizerDevice && !isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#ff4500]" />
              Mission Admin Panel
            </h2>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pin">Enter Organizer PIN</Label>
              <Input
                id="pin"
                type="password"
                placeholder="Enter 4-digit PIN"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                maxLength={4}
              />
              {error && <p className="text-sm text-destructive flex items-center gap-1">{error}</p>}
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded p-3">
              <p className="text-xs text-blue-500">
                Only the mission organizer can manage this mission. Enter the PIN to proceed.
              </p>
            </div>

            <Button type="submit" className="w-full bg-[#ff4500] text-[#ff4500]-foreground hover:bg-[#ff4500]/90">
              Unlock Admin Panel
            </Button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Mission Admin Panel</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Mission Status */}
          <div>
            <h3 className="font-semibold mb-3">Mission Status</h3>
            <div className="flex items-center gap-2 mb-4">
              {mission.status === "completed" ? (
                <Badge className="gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Completed
                </Badge>
              ) : mission.status === "urgent" ? (
                <Badge variant="destructive" className="gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Urgent
                </Badge>
              ) : (
                <Badge variant="secondary">Active</Badge>
              )}
            </div>
          </div>

          {/* Volunteer Count */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Volunteers Joined
            </h3>
            <div className="bg-secondary rounded-lg p-4">
              <p className="text-2xl font-bold text-[#ff4500]">{mission.volunteers.length}</p>
              <p className="text-sm text-muted-foreground">
                out of {mission.peopleNeeded} needed (
                {Math.round((mission.volunteers.length / mission.peopleNeeded) * 100)}%)
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2 pt-4 border-t border-border">
            {mission.status !== "completed" && (
              <Button onClick={handleCompleteMission} className="w-full bg-green-600 hover:bg-green-700 text-white">
                <CheckCircle className="w-4 h-4 mr-2" />
                Mark Mission as Complete
              </Button>
            )}

            {mission.status === "completed" && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <p className="text-sm text-green-500 font-medium">This mission has been completed.</p>
              </div>
            )}

            <Button onClick={onClose} variant="outline" className="w-full bg-transparent">
              Close
            </Button>
          </div>

          {/* Info */}
          <div className="bg-[#ff4500]/10 border border-[#ff4500]/20 rounded-lg p-3">
            <p className="text-xs text-[#ff4500]">
              {isOrganizerDevice
                ? "You are accessing this as the original organizer device."
                : "You are accessing this with the correct PIN."}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
