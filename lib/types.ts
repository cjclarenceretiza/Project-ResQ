export type MissionStatus = "active" | "completed" | "urgent"

export interface Mission {
  id: string
  title: string
  location: string
  description: string
  peopleNeeded: number
  currentVolunteers: number
  status: MissionStatus
  createdBy: string
  createdAt: Date
  imageUrl?: string
  coordinates?: {
    lat: number
    lng: number
  }
  category: "food" | "medical" | "shelter" | "rescue" | "supplies"
  organizerDeviceId: string
  organizerPin: string
  volunteers: string[] // Array of device IDs who joined
}

export interface Donation {
  id: string
  type: "goods" | "money"
  amount?: number
  description: string
  donorName: string
  missionId?: string
  receiptUrl?: string
  createdAt: Date
  status: "pending" | "verified" | "distributed"
}

export interface CommunityUpdate {
  id: string
  title: string
  content: string
  author: string
  createdAt: Date
  imageUrl?: string
  type: "announcement" | "success" | "urgent"
}

export interface Statistics {
  activeMissions: number
  peopleHelped: number
  donationsReceived: number
  volunteersActive: number
}
