// /components/LazyMap.tsx
"use client";

import dynamic from 'next/dynamic';

// Define the dynamically imported map component outside of the function
const Map = dynamic(
  () => import('@/components/Map'), // Adjust path to your Map component
  {
    loading: () => <p>A map is loading...</p>,
    ssr: false // This is the most important part
  }
);

export default function LazyMap() {
  return <Map />;
}