// /components/Map.tsx
'use client';

// Make sure CircleMarker is imported
import { MapContainer, TileLayer, Popup, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import { useEffect, useState } from 'react';
import type { Mission } from "@/lib/types"; // Import the Mission type

// This is to fix the default icon issue with React Leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// We keep this block. It's the fallback icon, which is fine.
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon.src,
  iconRetinaUrl: markerIcon2x.src,
  shadowUrl: markerShadow.src,
});

// Define the props our map will accept
interface MapProps {
  missions: Mission[]; // An array of missions
  onMarkerClick: (mission: Mission) => void; // A function to call when a marker is clicked
}

// +++ HELPER FUNCTION +++
// This goes OUTSIDE the component. It's cleaner.
const getMissionPathOptions = (category: string) => {
  // This maps categories to the same colors used in the mission list
  const colorMapping: { [key: string]: string } = {
    Food: "#ef4444",     // red-500
    Medical: "#3b82f6",  // blue-500
    Shelter: "#06b6d4",  // cyan-500
    Rescue: "#f97316",   // orange-500
    Supplies: "#22c55e", // green-500
    Default: "#9ca3af",  // gray-400
  };

  const color = colorMapping[category] || colorMapping.Default;

  return {
    fillColor: color,    // The fill color
    color: "#ffffff",      // The border color (white)
    weight: 2,             // The border width
    opacity: 1,            // Border opacity
    fillOpacity: 0.9,      // Fill opacity
  };
};

const Map: React.FC<MapProps> = ({ missions, onMarkerClick }) => {
  const [isMounted, setIsMounted] = useState(false);
  const defaultPosition: [number, number] = [14.6760, 121.0437]; // Coordinates for Metro Manila

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <MapContainer center={defaultPosition} zoom={11} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* Loop through the missions and create a CircleMarker for each one */}
      {missions.map((mission) => (
        mission.coordinates && (
          // +++ THIS IS THE CHANGED PART +++
          <CircleMarker
            key={mission.id}
            center={[mission.coordinates.lat, mission.coordinates.lng]}
            pathOptions={getMissionPathOptions(mission.category)}
            radius={10} // You can change this number
            eventHandlers={{
              click: () => {
                onMarkerClick(mission);
              },
            }}
          >
            <Popup>{mission.title}</Popup>
          </CircleMarker>
          // +++ END OF CHANGED PART +++
        )
      ))}
    </MapContainer>
  );
};

export default Map;