'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Package, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { API_ENDPOINTS } from '@/lib/api';

// Dynamically import Map component with no SSR
const Map = dynamic(() => import('@/components/Map'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
      <div className="text-gray-500">Loading map...</div>
    </div>
  )
});

interface Donation {
  _id: string;
  title: string;
  description: string;
  quantity: string;
  pickupTime: string;
  location: string;
  coordinates?: {
    coordinates: [number, number];
  };
  status: string;
  createdBy: string;
  claimedBy?: string;
}

interface Request {
  _id: string;
  title: string;
  description: string;
  quantity: string;
  deadline: string;
  location: string;
  coordinates?: {
    coordinates: [number, number];
  };
  urgency: string;
  status: string;
  createdBy: string;
  fulfilledBy?: string;
}

interface MapItem {
  _id: string;
  title: string;
  description: string;
  location: string;
  coordinates?: {
    coordinates: [number, number];
  };
  type: "donation" | "request";
  status?: string;
  urgency?: string;
  quantity?: string;
  pickupTime?: string;
  deadline?: string;
}

export default function MapPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [mapItems, setMapItems] = useState<MapItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<MapItem | null>(null);
  const [showDonations, setShowDonations] = useState(true);
  const [showRequests, setShowRequests] = useState(true);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    setUserRole(role || '');

    if (!token) {
      toast.error('Please login to view the map');
      return;
    }

    fetchDonations(token);
    fetchRequests(token);
  }, []);

  useEffect(() => {
    const items: MapItem[] = [];
    
    if (showDonations) {
      items.push(...donations.map(donation => ({
        ...donation,
        type: 'donation' as const
      })));
    }
    
    if (showRequests) {
      items.push(...requests.map(request => ({
        ...request,
        type: 'request' as const
      })));
    }
    
    setMapItems(items);
  }, [donations, requests, showDonations, showRequests]);

  const fetchDonations = async (token: string) => {
    try {
      const response = await fetch(API_ENDPOINTS.DONATIONS.LIST, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setDonations(data);
      }
    } catch (error) {
      console.error('Error fetching donations:', error);
    }
  };

  const fetchRequests = async (token: string) => {
    try {
      const response = await fetch(API_ENDPOINTS.REQUESTS.LIST, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setRequests(data);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleItemClick = (item: MapItem) => {
    setSelectedItem(item);
  };

  const handleClaimDonation = async (donationId: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to claim donations');
      return;
    }

    try {
      const response = await fetch(API_ENDPOINTS.DONATIONS.CLAIM(donationId), {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        toast.success('Donation claimed successfully!');
        fetchDonations(token);
        setSelectedItem(null);
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to claim donation');
      }
    } catch (error) {
      console.error('Error claiming donation:', error);
      toast.error('Failed to claim donation');
    }
  };

  const handleFulfillRequest = async (requestId: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to fulfill requests');
      return;
    }

    try {
      const response = await fetch(API_ENDPOINTS.REQUESTS.FULFILL(requestId), {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        toast.success('Request fulfilled successfully!');
        fetchRequests(token);
        setSelectedItem(null);
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to fulfill request');
      }
    } catch (error) {
      console.error('Error fulfilling request:', error);
      toast.error('Failed to fulfill request');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
      case 'open':
        return 'bg-green-100 text-green-800';
      case 'claimed':
      case 'partially_fulfilled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
      case 'fulfilled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-gray-500">Loading map data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Interactive Map</h1>
        <p className="text-gray-600">View and interact with food donations and requests in your area</p>
      </div>

      {/* Filter Controls */}
      <div className="mb-6 flex gap-4">
        <Button
          variant={showDonations ? "default" : "outline"}
          onClick={() => setShowDonations(!showDonations)}
          className="flex items-center gap-2"
        >
          🍞 Donations ({donations.length})
        </Button>
        <Button
          variant={showRequests ? "default" : "outline"}
          onClick={() => setShowRequests(!showRequests)}
          className="flex items-center gap-2"
        >
          🏠 Requests ({requests.length})
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Map View</CardTitle>
            </CardHeader>
            <CardContent>
              <Map 
                items={mapItems}
                onItemClick={handleItemClick}
                center={[40.7128, -74.0060]}
                zoom={10}
              />
            </CardContent>
          </Card>
        </div>

        {/* Details Panel */}
        <div className="lg:col-span-1">
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Item Details</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedItem ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">{selectedItem.title}</h3>
                    <p className="text-gray-600 text-sm mt-1">{selectedItem.description}</p>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{selectedItem.location}</span>
                  </div>

                  {selectedItem.quantity && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Package className="w-4 h-4" />
                      <span>Quantity: {selectedItem.quantity}</span>
                    </div>
                  )}

                  {selectedItem.pickupTime && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>Pickup: {new Date(selectedItem.pickupTime).toLocaleString()}</span>
                    </div>
                  )}

                  {selectedItem.deadline && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Deadline: {new Date(selectedItem.deadline).toLocaleString()}</span>
                    </div>
                  )}

                  {selectedItem.status && (
                    <Badge className={getStatusColor(selectedItem.status)}>
                      {selectedItem.status.replace('_', ' ')}
                    </Badge>
                  )}

                  {selectedItem.urgency && (
                    <Badge className={getUrgencyColor(selectedItem.urgency)}>
                      {selectedItem.urgency} urgency
                    </Badge>
                  )}

                  {/* Action Buttons */}
                  <div className="pt-4 space-y-2">
                    {selectedItem.type === 'donation' && 
                     selectedItem.status === 'available' && 
                     (userRole === 'volunteer' || userRole === 'agency') && (
                      <Button 
                        onClick={() => handleClaimDonation(selectedItem._id)}
                        className="w-full"
                      >
                        Claim Donation
                      </Button>
                    )}

                    {selectedItem.type === 'request' && 
                     selectedItem.status === 'open' && 
                     (userRole === 'donor' || userRole === 'volunteer') && (
                      <Button 
                        onClick={() => handleFulfillRequest(selectedItem._id)}
                        className="w-full"
                      >
                        Fulfill Request
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Click on a marker to view details</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 