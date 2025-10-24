"use client";

import { Navigation } from "@/components/navigation";
import { mockMissions } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { MapPin, AlertCircle, Users } from "lucide-react";
import { useState, useEffect } from "react";
import type { Mission } from "@/lib/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// --- We are now importing Leaflet components directly into the page ---
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// --- Icon fix for Leaflet ---
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon.src,
  iconRetinaUrl: markerIcon2x.src,
  shadowUrl: markerShadow.src,
});
// --- End of Icon Fix ---


export default function MapPage() {
  const [selectedCategory, setSelectedCategory] = useState<Mission["category"] | "all">("all");
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [isMounted, setIsMounted] = useState(false); // For preventing SSR issues

  // Set mounted state only on the client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const filteredMissions = mockMissions.filter((mission) => {
    const hasCoordinates = mission.coordinates !== undefined;
    const matchesCategory = selectedCategory === "all" || mission.category === selectedCategory;
    return hasCoordinates && matchesCategory;
  });

  const categoryOptions: Array<Mission["category"] | "all"> = [
    "all",
    "food",
    "medical",
    "shelter",
    "rescue",
    "supplies",
  ];

  const getMarkerColor = (status: Mission["status"]) => {
    switch (status) {
      case "urgent": return "bg-[#df000d]";
      case "active": return "bg-[#0081f1]";
      case "completed": return "bg-muted";
      default: return "bg-[#ff4500]";
    }
  };
  const getMapPathOptions = (status: Mission["status"]) => {
    let color;
    switch (status) {
      case "urgent":
        color = "#df000d"; // From your getMarkerColor function
        break;
      case "active":
        color = "#0081f1"; // From your getMarkerColor function
        break;
      case "completed":
        color = "#9ca3af"; // A gray color for "muted"
        break;
      default:
        color = "#ff4500"; // From your getMarkerColor function
    }

    return {
      fillColor: color,
      color: "#ffffff", // White border
      weight: 2,
      opacity: 1,
      fillOpacity: 0.9,
    };
  };

  return (
    <div className="min-h-screen dark">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        {/* Header and Filters remain the same */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-2">Mission Map</h1>
          <p className="text-muted-foreground">
            View all active relief missions and donation sites across Metro Manila
          </p>
        </div>
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">Filter by category:</span>
            {categoryOptions.map((category) => (
              <Badge key={category} variant={selectedCategory === category ? "default" : "outline"} className="cursor-pointer capitalize" onClick={() => setSelectedCategory(category)}>
                {category}
              </Badge>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* --- The Real Map Container --- */}
          <div className="lg:col-span-2 h-[600px] bg-card border border-border rounded-lg overflow-hidden">
            {isMounted && (
              <MapContainer center={[14.6760, 121.0437]} zoom={11} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {filteredMissions.map((mission) => (
                  mission.coordinates && (
                    <CircleMarker
                      key={mission.id}
                      center={[mission.coordinates.lat, mission.coordinates.lng]}
                      pathOptions={getMapPathOptions(mission.status)}
                      radius={10} // You can change this number to make the circles bigger/smaller
                      eventHandlers={{
                        click: () => {
                          setSelectedMission(mission);
                        },
                      }}
                    >
                      <Popup>{mission.title}</Popup>
                    </CircleMarker>
                  )
                ))}
              </MapContainer>
            )}
          </div>
          {/* --- End of Real Map Container --- */}

          {/* Mission Details Sidebar */}
          <div className="space-y-6">
            {selectedMission ? (
              <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                {/* ... The rest of your sidebar code is the same ... */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {selectedMission.status === "urgent" && (<Badge variant="destructive" className="gap-1"><AlertCircle className="w-3 h-3" />Urgent</Badge>)}
                      <Badge variant="outline" className="capitalize">{selectedMission.category}</Badge>
                    </div>
                    <h3 className="font-semibold text-lg text-balance leading-tight">{selectedMission.title}</h3>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground"><MapPin className="w-4 h-4" /><span>{selectedMission.location}</span></div>
                  <p className="text-sm text-muted-foreground text-pretty">{selectedMission.description}</p>
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2"><Users className="w-4 h-4 text-muted-foreground" /><span className="text-muted-foreground">{selectedMission.currentVolunteers} / {selectedMission.peopleNeeded} volunteers</span></div>
                      <span className="font-medium">{Math.round((selectedMission.currentVolunteers / selectedMission.peopleNeeded) * 100)}%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                      <div className={`h-full transition-all ${selectedMission.status === "urgent" ? "bg-[#df000d]" : "bg-[#ff4500]"}`} style={{width: `${Math.min((selectedMission.currentVolunteers / selectedMission.peopleNeeded) * 100,100)}%`,}}/>
                    </div>
                  </div>
                </div>
                <div className="pt-2 space-y-2">
                  <Link href={`/missions/${selectedMission.id}`}><Button className="w-full bg-[#0081f1] hover:bg-[#0081f1]/90">View Full Details</Button></Link>
                  <Button variant="outline" className="w-full bg-transparent" onClick={() => setSelectedMission(null)}>Close</Button>
                </div>
              </div>
            ) : (
              <div className="bg-card border border-border rounded-lg p-6 text-center">
                <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">Click on a marker to view mission details</p>
              </div>
            )}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-semibold mb-4">Active Missions ({filteredMissions.length})</h3>
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {filteredMissions.map((mission) => (
                  <button key={mission.id} className={`w-full text-left p-3 rounded-lg border transition-colors ${selectedMission?.id === mission.id ? "border-[#ff4500] bg-[#ff4500]/10" : "border-border hover:border-[#ff4500]/50"}`} onClick={() => setSelectedMission(mission)}>
                    <div className="flex items-start gap-2">
                      <div className={`w-3 h-3 rounded-full ${getMarkerColor(mission.status)} mt-1 flex-shrink-0`} />
                      <div className="flex-1 min-w-0"><p className="text-sm font-medium truncate">{mission.title}</p><p className="text-xs text-muted-foreground truncate">{mission.location}</p></div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}