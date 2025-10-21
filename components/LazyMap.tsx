// /components/LazyMap.tsx
"use client";

import dynamic from 'next/dynamic';
import type { Mission } from '@/lib/types';

// Define the props this component will accept
interface LazyMapProps {
  missions: Mission[];
  onMarkerClick: (mission: Mission) => void;
}

// Define the dynamically imported map component outside of the function
const Map = dynamic(
  () => import('@/components/Map'),
  {
    loading: () => <p className="text-center p-4">A map is loading...</p>,
    ssr: false
  }
);

// The component now accepts props and passes them down to the real Map
export default function LazyMap({ missions, onMarkerClick }: LazyMapProps) {
  return <Map missions={missions} onMarkerClick={onMarkerClick} />;
}