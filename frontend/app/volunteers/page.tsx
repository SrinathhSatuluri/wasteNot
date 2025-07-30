"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, User, Phone, Mail, MapPin, Clock, Star } from "lucide-react";
import { notifications } from "@/lib/notifications";
import { API_ENDPOINTS } from "@/lib/api";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Volunteer {
  _id: string;
  name: string;
  email: string;
  role: string;
  // Mock data for demonstration
  phone?: string;
  location?: string;
  availability?: string;
  rating?: number;
  completedPickups?: number;
  isAvailable?: boolean;
}

export default function VolunteersPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all"); // all, available, busy

  // Fetch volunteers from API
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);

  useEffect(() => {
    // Check if user is logged in and is an agency
    const userData = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    
    if (!userData || !token) {
      router.push("/login");
      return;
    }

    try {
      const user = JSON.parse(userData);
      if (user.role !== "agency") {
        router.push("/dashboard");
        return;
      }
      setUser(user);
      fetchVolunteers(token);
    } catch (error) {
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  const fetchVolunteers = async (token: string) => {
    try {
      const response = await fetch(API_ENDPOINTS.VOLUNTEERS.LIST, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setVolunteers(data);
      } else {
        notifications.error("Failed to load volunteers");
      }
    } catch (error) {
      notifications.error("Network error loading volunteers");
    }
  };

  const filteredVolunteers = volunteers.filter(volunteer => {
    const matchesSearch = volunteer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         volunteer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         volunteer.location?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === "all" || 
                         (filter === "available" && volunteer.isAvailable) ||
                         (filter === "busy" && !volunteer.isAvailable);
    
    return matchesSearch && matchesFilter;
  });

  const handleContactVolunteer = (volunteer: Volunteer) => {
    notifications.success(`Contacting ${volunteer.name}...`);
    // In a real app, this would open a chat or email interface
  };

  const handleAssignPickup = (volunteer: Volunteer) => {
    notifications.success(`Assigning pickup to ${volunteer.name}...`);
    // In a real app, this would open a pickup assignment interface
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading volunteers...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const availableCount = volunteers.filter(v => v.isAvailable).length;
  const totalCount = volunteers.length;

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
              <h1 className="text-2xl font-bold text-green-700">Manage Volunteers</h1>
              <Badge variant="secondary" className="ml-4">
                {availableCount}/{totalCount} available
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={() => router.push("/donations")}>
                View Available Donations
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Volunteers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{totalCount}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Available Now</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{availableCount}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Avg Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">4.8</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Pickups</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">87</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search volunteers by name, email, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant={filter === "all" ? "default" : "outline"}
                  onClick={() => setFilter("all")}
                >
                  All
                </Button>
                <Button
                  variant={filter === "available" ? "default" : "outline"}
                  onClick={() => setFilter("available")}
                >
                  Available
                </Button>
                <Button
                  variant={filter === "busy" ? "default" : "outline"}
                  onClick={() => setFilter("busy")}
                >
                  Busy
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Volunteers List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredVolunteers.map((volunteer) => (
            <Card key={volunteer._id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{volunteer.name}</CardTitle>
                      <p className="text-sm text-gray-600">{volunteer.email}</p>
                    </div>
                  </div>
                  <Badge variant={volunteer.isAvailable ? "default" : "secondary"}>
                    {volunteer.isAvailable ? "Available" : "Busy"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{volunteer.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{volunteer.location}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>{volunteer.availability}</span>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{volunteer.rating}</span>
                      <span className="text-sm text-gray-600">({volunteer.completedPickups} pickups)</span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleContactVolunteer(volunteer)}
                      >
                        Contact
                      </Button>
                      {volunteer.isAvailable && (
                        <Button
                          size="sm"
                          onClick={() => handleAssignPickup(volunteer)}
                        >
                          Assign Pickup
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredVolunteers.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-gray-600">No volunteers found matching your criteria.</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
} 