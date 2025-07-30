"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, MapPin, Clock, User, RefreshCw, Settings } from "lucide-react";
import { notifications } from "@/lib/notifications";
import { useAutoRefresh } from "@/hooks/useAutoRefresh";
import { API_ENDPOINTS } from "@/lib/api";

type Donation = {
  _id: string;
  title: string;
  description: string;
  quantity: string;
  pickupTime: string;
  location: string;
  status: string;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
};

export default function DonationsPage() {
  const router = useRouter();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [claiming, setClaiming] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch donations function
  const fetchDonations = async (useLocation = false) => {
    try {
      setRefreshing(true);
      const token = localStorage.getItem("token");
      let url = API_ENDPOINTS.DONATIONS.LIST;
      
      // Add location-based filtering if requested and available
      if (useLocation && navigator.geolocation) {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        
        const { latitude, longitude } = position.coords;
        url += `?latitude=${latitude}&longitude=${longitude}&radius=10`;
      }
      
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setDonations(data);
    } catch (error) {
      console.error("Failed to fetch donations:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    
    if (!userData || !token) {
      router.push("/login");
      return;
    }

    setUser(JSON.parse(userData));
    fetchDonations();
    
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(() => fetchDonations(), 30000);
    
    return () => clearInterval(interval);
  }, [router]);

  const handleClaim = async (donationId: string) => {
    setClaiming(donationId);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(API_ENDPOINTS.DONATIONS.CLAIM(donationId), {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Refresh the donations list
        const updatedDonations = donations.map(donation => 
          donation._id === donationId 
            ? { ...donation, status: "claimed" }
            : donation
        );
        setDonations(updatedDonations);
        notifications.donationClaimed();
      }
    } catch (error) {
      console.error("Failed to claim donation:", error);
    } finally {
      setClaiming(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading donations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-green-700">Available Donations</h1>
              <Badge variant="secondary" className="ml-4">
                {donations.length} available
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                onClick={() => fetchDonations(false)}
                disabled={refreshing}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button 
                variant="outline" 
                onClick={() => fetchDonations(true)}
                disabled={refreshing}
              >
                <MapPin className="h-4 w-4 mr-2" />
                Find Nearby
              </Button>
              {user?.role === "donor" && (
                <Button onClick={() => router.push("/donations/new")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Donation
                </Button>
              )}
              <Button 
                variant="ghost" 
                onClick={() => router.push("/profile")}
                className="flex items-center"
              >
                <Settings className="h-4 w-4 mr-2" />
                Profile
              </Button>
              <Button variant="outline" onClick={() => router.push("/dashboard")}>
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {donations.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-6xl mb-4">🍽️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No donations available</h3>
              <p className="text-gray-600 mb-6">Check back later for new food donations!</p>
              {user?.role === "donor" && (
                <Button onClick={() => router.push("/donations/new")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Donation
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {donations.map((donation) => (
              <Card key={donation._id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{donation.title}</CardTitle>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          {donation.createdBy.name}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {new Date(donation.pickupTime).toLocaleString()}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {donation.location}
                        </div>
                      </div>
                    </div>
                    <Badge 
                      variant={donation.status === "available" ? "default" : "secondary"}
                      className="ml-4"
                    >
                      {donation.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {donation.description && (
                      <p className="text-gray-700">{donation.description}</p>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-semibold text-gray-900">Quantity:</span>
                        <p className="text-gray-600">{donation.quantity}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-900">Posted:</span>
                        <p className="text-gray-600">
                          {new Date(donation.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-900">Status:</span>
                        <p className="text-gray-600 capitalize">{donation.status}</p>
                      </div>
                    </div>
                    
                    {/* Claim Button for Volunteers and Agencies */}
                    {donation.status === "available" && 
                     (user?.role === "volunteer" || user?.role === "agency") && (
                      <div className="pt-4 border-t">
                        <Button 
                          onClick={() => handleClaim(donation._id)}
                          disabled={claiming === donation._id}
                          className="w-full md:w-auto"
                        >
                          {claiming === donation._id ? "Claiming..." : "Claim Donation"}
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}