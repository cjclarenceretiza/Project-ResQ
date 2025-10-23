// Device ID utility for anonymous user tracking
// Generates and stores a unique ID per device in localStorage

export function getOrCreateDeviceId(): string {
  const DEVICE_ID_KEY = "resq_device_id"

  // Check if device ID already exists
  if (typeof window !== "undefined") {
    const existingId = localStorage.getItem(DEVICE_ID_KEY)
    if (existingId) {
      return existingId
    }

    // Generate new device ID
    const newId = `device_${Math.random().toString(36).substr(2, 9)}_${Date.now()}`
    localStorage.setItem(DEVICE_ID_KEY, newId)
    return newId
  }

  return ""
}

// Generate a random PIN for mission organizers
export function generateMissionPin(): string {
  return Math.random().toString().slice(2, 6)
}