"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowLeft, Edit, Trash2, Eye, Plus, MapPin, Clock, User } from "lucide-react";
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
  claimedBy?: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function ManageDonationsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in and is a donor
    const userData = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    
    if (!userData || !token) {
      router.push("/login");
      return;
    }

    try {
      const user = JSON.parse(userData);
      if (user.role !== "donor") {
        router.push("/dashboard");
        return;
      }
      setUser(user);
      fetchMyDonations(token);
    } catch (error) {
      router.push("/login");
    }
  }, [router]);

  const fetchMyDonations = async (token: string) => {
    try {
      const response = await fetch("http://localhost:5000/api/donations/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDonations(data);
      } else {
        notifications.error("Failed to load your donations");
      }
    } catch (error) {
      notifications.error("Network error loading donations");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (donationId: string) => {
    if (!confirm("Are you sure you want to delete this donation?")) {
      return;
    }

    setDeleting(donationId);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/donations/${donationId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setDonations(donations.filter(d => d._id !== donationId));
        notifications.success("Donation deleted successfully");
      } else {
        notifications.error("Failed to delete donation");
      }
    } catch (error) {
      notifications.error("Network error deleting donation");
    } finally {
      setDeleting(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "claimed":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "available":
        return "🟢";
      case "claimed":
        return "🔵";
      case "completed":
        return "✅";
      default:
        return "⚪";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your donations...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

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
              <h1 className="text-2xl font-bold text-green-700">Manage My Donations</h1>
              <Badge variant="secondary" className="ml-4">
                {donations.length} total
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={() => router.push("/donations/new")}>
                <Plus className="h-4 w-4 mr-2" />
                Create New Donation
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
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No donations yet</h3>
              <p className="text-gray-600 mb-6">Start making a difference by creating your first donation!</p>
              <Button onClick={() => router.push("/donations/new")}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Donation
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-green-600">
                    {donations.filter(d => d.status === "available").length}
                  </div>
                  <p className="text-sm text-gray-600">Available</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-blue-600">
                    {donations.filter(d => d.status === "claimed").length}
                  </div>
                  <p className="text-sm text-gray-600">Claimed</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-gray-600">
                    {donations.filter(d => d.status === "completed").length}
                  </div>
                  <p className="text-sm text-gray-600">Completed</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-purple-600">
                    {donations.length}
                  </div>
                  <p className="text-sm text-gray-600">Total</p>
                </CardContent>
              </Card>
            </div>

            {/* Donations List */}
            <div className="space-y-4">
              {donations.map((donation) => (
                <Card key={donation._id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-xl flex items-center">
                          {donation.title}
                          <span className="ml-2">{getStatusIcon(donation.status)}</span>
                        </CardTitle>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
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
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(donation.status)}>
                          {donation.status}
                        </Badge>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/donations/${donation._id}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {donation.status === "available" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => router.push(`/donations/${donation._id}/edit`)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(donation._id)}
                            disabled={deleting === donation._id}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
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
                      
                      {donation.claimedBy && (
                        <div className="pt-4 border-t">
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium text-gray-900">
                              Claimed by: {donation.claimedBy.name}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 