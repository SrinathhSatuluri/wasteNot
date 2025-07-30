"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowLeft, MapPin, Clock, User, CheckCircle, Truck, Calendar } from "lucide-react";
import { notifications } from "@/lib/notifications";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Donation {
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
  claimedBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function ScheduledPickupsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [pickups, setPickups] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in and is a volunteer
    const userData = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    
    if (!userData || !token) {
      router.push("/login");
      return;
    }

    try {
      const user = JSON.parse(userData);
      if (user.role !== "volunteer") {
        router.push("/dashboard");
        return;
      }
      setUser(user);
      fetchMyPickups(token);
    } catch (error) {
      router.push("/login");
    }
  }, [router]);

  const fetchMyPickups = async (token: string) => {
    try {
      const response = await fetch("http://localhost:5000/api/donations/my-pickups", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPickups(data);
      } else {
        notifications.error("Failed to load your pickups");
      }
    } catch (error) {
      notifications.error("Network error loading pickups");
    } finally {
      setLoading(false);
    }
  };

  const handleCompletePickup = async (donationId: string) => {
    setUpdating(donationId);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/donations/${donationId}/complete`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setPickups(pickups.map(pickup => 
          pickup._id === donationId 
            ? { ...pickup, status: "completed" }
            : pickup
        ));
        notifications.success("Pickup marked as completed!");
      } else {
        notifications.error("Failed to complete pickup");
      }
    } catch (error) {
      notifications.error("Network error completing pickup");
    } finally {
      setUpdating(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "claimed":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "claimed":
        return "🚚";
      case "completed":
        return "✅";
      default:
        return "⏳";
    }
  };

  const getUpcomingPickups = () => {
    return pickups.filter(pickup => 
      pickup.status === "claimed" && 
      new Date(pickup.pickupTime) > new Date()
    );
  };

  const getCompletedPickups = () => {
    return pickups.filter(pickup => pickup.status === "completed");
  };

  const getOverduePickups = () => {
    return pickups.filter(pickup => 
      pickup.status === "claimed" && 
      new Date(pickup.pickupTime) < new Date()
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your pickups...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const upcomingPickups = getUpcomingPickups();
  const completedPickups = getCompletedPickups();
  const overduePickups = getOverduePickups();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={() => router.push("/dashboard")}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-2xl font-bold text-green-700">My Scheduled Pickups</h1>
              <Badge variant="secondary" className="ml-4">
                {pickups.length} total
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={() => router.push("/donations")}>
                <Truck className="h-4 w-4 mr-2" />
                Find More Pickups
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {pickups.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-6xl mb-4">🚚</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No pickups scheduled</h3>
              <p className="text-gray-600 mb-6">Start helping by claiming available donations!</p>
              <Button onClick={() => router.push("/donations")}>
                <Truck className="h-4 w-4 mr-2" />
                Find Pickup Opportunities
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-blue-600">
                    {upcomingPickups.length}
                  </div>
                  <p className="text-sm text-gray-600">Upcoming</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-red-600">
                    {overduePickups.length}
                  </div>
                  <p className="text-sm text-gray-600">Overdue</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-green-600">
                    {completedPickups.length}
                  </div>
                  <p className="text-sm text-gray-600">Completed</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-purple-600">
                    {pickups.length}
                  </div>
                  <p className="text-sm text-gray-600">Total</p>
                </CardContent>
              </Card>
            </div>

            {/* Overdue Pickups */}
            {overduePickups.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-red-700 mb-4 flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Overdue Pickups ({overduePickups.length})
                </h2>
                <div className="space-y-4">
                  {overduePickups.map((pickup) => (
                    <Card key={pickup._id} className="border-red-200 bg-red-50">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <CardTitle className="text-xl flex items-center text-red-800">
                              {pickup.title}
                              <span className="ml-2">⚠️</span>
                            </CardTitle>
                            <div className="flex items-center space-x-4 mt-2 text-sm text-red-600">
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                {new Date(pickup.pickupTime).toLocaleString()}
                              </div>
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-1" />
                                {pickup.location}
                              </div>
                            </div>
                          </div>
                          <Badge className="bg-red-100 text-red-800">
                            Overdue
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {pickup.description && (
                            <p className="text-red-700">{pickup.description}</p>
                          )}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="font-semibold text-red-900">Quantity:</span>
                              <p className="text-red-700">{pickup.quantity}</p>
                            </div>
                            <div>
                              <span className="font-semibold text-red-900">From:</span>
                              <p className="text-red-700">{pickup.createdBy.name}</p>
                            </div>
                            <div>
                              <span className="font-semibold text-red-900">Status:</span>
                              <p className="text-red-700">Overdue</p>
                            </div>
                          </div>
                          <div className="pt-4 border-t border-red-200">
                            <Button 
                              onClick={() => handleCompletePickup(pickup._id)}
                              disabled={updating === pickup._id}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              {updating === pickup._id ? "Completing..." : "Mark as Completed"}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Upcoming Pickups */}
            {upcomingPickups.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-blue-700 mb-4 flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Upcoming Pickups ({upcomingPickups.length})
                </h2>
                <div className="space-y-4">
                  {upcomingPickups.map((pickup) => (
                    <Card key={pickup._id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <CardTitle className="text-xl flex items-center">
                              {pickup.title}
                              <span className="ml-2">{getStatusIcon(pickup.status)}</span>
                            </CardTitle>
                            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                {new Date(pickup.pickupTime).toLocaleString()}
                              </div>
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-1" />
                                {pickup.location}
                              </div>
                            </div>
                          </div>
                          <Badge className={getStatusColor(pickup.status)}>
                            {pickup.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {pickup.description && (
                            <p className="text-gray-700">{pickup.description}</p>
                          )}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="font-semibold text-gray-900">Quantity:</span>
                              <p className="text-gray-600">{pickup.quantity}</p>
                            </div>
                            <div>
                              <span className="font-semibold text-gray-900">From:</span>
                              <p className="text-gray-600">{pickup.createdBy.name}</p>
                            </div>
                            <div>
                              <span className="font-semibold text-gray-900">Pickup Time:</span>
                              <p className="text-gray-600">
                                {new Date(pickup.pickupTime).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Completed Pickups */}
            {completedPickups.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-green-700 mb-4 flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Completed Pickups ({completedPickups.length})
                </h2>
                <div className="space-y-4">
                  {completedPickups.map((pickup) => (
                    <Card key={pickup._id} className="border-green-200 bg-green-50">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <CardTitle className="text-xl flex items-center text-green-800">
                              {pickup.title}
                              <span className="ml-2">✅</span>
                            </CardTitle>
                            <div className="flex items-center space-x-4 mt-2 text-sm text-green-600">
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                {new Date(pickup.pickupTime).toLocaleString()}
                              </div>
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-1" />
                                {pickup.location}
                              </div>
                            </div>
                          </div>
                          <Badge className="bg-green-100 text-green-800">
                            Completed
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {pickup.description && (
                            <p className="text-green-700">{pickup.description}</p>
                          )}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="font-semibold text-green-900">Quantity:</span>
                              <p className="text-green-700">{pickup.quantity}</p>
                            </div>
                            <div>
                              <span className="font-semibold text-green-900">From:</span>
                              <p className="text-green-700">{pickup.createdBy.name}</p>
                            </div>
                            <div>
                              <span className="font-semibold text-green-900">Completed:</span>
                              <p className="text-green-700">
                                {new Date(pickup.updatedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
} 