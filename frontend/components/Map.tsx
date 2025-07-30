'use client';

import { useEffect, useState } from 'react';
// Temporarily disabled for deployment - Vercel fix
// import dynamic from 'next/dynamic';

// // Dynamically import Leaflet components with no SSR
// const MapContainer = dynamic(
//   () => import('react-leaflet').then((mod) => mod.MapContainer),
//   { ssr: false }
// );

// const TileLayer = dynamic(
//   () => import('react-leaflet').then((mod) => mod.TileLayer),
//   { ssr: false }
// );

// const Marker = dynamic(
//   () => import('react-leaflet').then((mod) => mod.Marker),
//   { ssr: false }
// );

// const Popup = dynamic(
//   () => import('react-leaflet').then((mod) => mod.Popup),
//   { ssr: false }
// );

export interface MapItem {
  _id: string;
  title: string;
  description: string;
  location: string;
  coordinates?: {
    coordinates: [number, number]; // [longitude, latitude]
  };
  type: "donation" | "request";
  status?: string;
  urgency?: string;
  quantity?: string;
  pickupTime?: string;
  deadline?: string;
}

interface MapProps {
  items: MapItem[];
  onItemClick?: (item: MapItem) => void;
  center?: [number, number];
  zoom?: number;
}

// Client-side only component - temporarily simplified for deployment
const MapComponent = ({ items, onItemClick, center = [40.7128, -74.0060], zoom = 10 }: MapProps) => {
  return (
    <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <div className="text-gray-500 mb-2">🗺️ Interactive Map</div>
        <div className="text-sm text-gray-400">
          {items.length} items available
        </div>
        <div className="text-xs text-gray-400 mt-1">
          Map temporarily disabled for deployment
        </div>
      </div>
    </div>
  );
};

// Export a wrapper component that handles the dynamic import
const Map = (props: MapProps) => {
  return <MapComponent {...props} />;
};

export default Map; 