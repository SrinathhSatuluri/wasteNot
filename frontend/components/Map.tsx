'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Leaflet components with no SSR
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

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

// Client-side only component
const MapComponent = ({ items, onItemClick, center = [40.7128, -74.0060], zoom = 10 }: MapProps) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const getMarkerIcon = (item: MapItem) => {
    // Import Leaflet only on client side
    const L = require('leaflet');
    
    // Fix Leaflet marker icons
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
    
    let iconHtml = '🍞'; // Default for donations
    let color = '#10b981'; // Default green
    
    if (item.type === 'request') {
      iconHtml = '🏠';
      color = '#3b82f6'; // Blue for requests
    }
    
    if (item.status === 'claimed' || item.status === 'fulfilled') {
      color = '#6b7280'; // Gray for completed
    }
    
    if (item.urgency === 'high') {
      color = '#ef4444'; // Red for high urgency
    }
    
    return L.divIcon({
      html: `<div style="
        background-color: ${color};
        border: 2px solid white;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      ">${iconHtml}</div>`,
      className: 'custom-marker',
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });
  };

  if (!isClient) {
    return (
      <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-gray-500">Loading map...</div>
      </div>
    );
  }

  return (
    <MapContainer 
      center={center} 
      zoom={zoom} 
      className="w-full h-96 rounded-lg"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      {items.map((item) => {
        if (!item.coordinates?.coordinates) return null;
        
        const [lng, lat] = item.coordinates.coordinates;
        
        return (
          <Marker
            key={`${item.type}-${item._id}`}
            position={[lat, lng]}
            icon={getMarkerIcon(item)}
            eventHandlers={{
              click: () => onItemClick?.(item)
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold text-sm">{item.title}</h3>
                <p className="text-xs text-gray-600 mt-1">{item.description}</p>
                <p className="text-xs text-gray-500 mt-1">{item.location}</p>
                {item.quantity && (
                  <p className="text-xs text-gray-500">Quantity: {item.quantity}</p>
                )}
                {item.status && (
                  <p className="text-xs text-gray-500">Status: {item.status}</p>
                )}
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

// Export a wrapper component that handles the dynamic import
const Map = (props: MapProps) => {
  return <MapComponent {...props} />;
};

export default Map; 