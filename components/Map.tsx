// /components/Map.tsx
'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useEffect, useState } from 'react';
import type { Mission } from "@/lib/types"; // Import the Mission type

// This is to fix the default icon issue with React Leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

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
      
      {/* Loop through the missions and create a Marker for each one */}
      {missions.map((mission) => (
        mission.coordinates && (
          <Marker
            key={mission.id}
            position={[mission.coordinates.lat, mission.coordinates.lng]}
            eventHandlers={{
              click: () => {
                onMarkerClick(mission);
              },
            }}
          >
            <Popup>{mission.title}</Popup>
          </Marker>
        )
      ))}
    </MapContainer>
  );
};

export default Map;