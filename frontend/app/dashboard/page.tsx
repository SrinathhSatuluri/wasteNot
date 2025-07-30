"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { notifications } from "@/lib/notifications";
import { User } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user info from localStorage
    const userData = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    
    if (!userData || !token) {
      router.push("/login");
      return;
    }

    try {
      setUser(JSON.parse(userData));
    } catch (error) {
      console.error("Error parsing user data:", error);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("selectedRole");
    notifications.logoutSuccess();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
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
              <h1 className="text-2xl font-bold text-green-700">WasteNot</h1>
              <Badge variant="secondary" className="ml-4">
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user.name}</span>
              <Button 
                variant="ghost" 
                onClick={() => router.push("/profile")}
                className="flex items-center"
              >
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {user.role === "donor" && <DonorDashboard user={user} />}
        {user.role === "volunteer" && <VolunteerDashboard user={user} />}
        {user.role === "agency" && <AgencyDashboard user={user} />}
      </main>
    </div>
  );
}

// Donor Dashboard Component
function DonorDashboard({ user }: { user: User }) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Donor Dashboard</h2>
        <p className="mt-2 text-gray-600">Manage your food donations and track their impact</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <span className="text-green-600">📦</span>
              <span className="ml-2">Active Donations</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">3</div>
            <p className="text-sm text-gray-600">Currently available</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <span className="text-blue-600">✅</span>
              <span className="ml-2">Completed</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">12</div>
            <p className="text-sm text-gray-600">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <span className="text-purple-600">🌱</span>
              <span className="ml-2">Impact</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">150</div>
            <p className="text-sm text-gray-600">Meals provided</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full" onClick={() => window.location.href = '/donations/new'}>
              Create New Donation
            </Button>
            <Button variant="outline" className="w-full" onClick={() => window.location.href = '/donations'}>
              View All Donations
            </Button>
            <Button variant="outline" className="w-full" onClick={() => window.location.href = '/donations/manage'}>
              Manage Active Posts
            </Button>
            <Button variant="outline" className="w-full" onClick={() => window.location.href = '/map'}>
              🗺️ Map View
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Fresh bread claimed by City Shelter</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm">Vegetables picked up by Volunteer John</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm">New donation: 20 sandwiches</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Volunteer Dashboard Component
function VolunteerDashboard({ user }: { user: User }) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Volunteer Dashboard</h2>
        <p className="mt-2 text-gray-600">Find pickup opportunities and track your contributions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <span className="text-orange-600">🚚</span>
              <span className="ml-2">Upcoming Pickups</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">2</div>
            <p className="text-sm text-gray-600">This week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <span className="text-green-600">✅</span>
              <span className="ml-2">Completed</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">8</div>
            <p className="text-sm text-gray-600">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <span className="text-blue-600">🌱</span>
              <span className="ml-2">Impact</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">45</div>
            <p className="text-sm text-gray-600">Meals delivered</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full" onClick={() => window.location.href = '/donations'}>
              Find Pickup Opportunities
            </Button>
            <Button variant="outline" className="w-full" onClick={() => window.location.href = '/pickups/scheduled'}>
              My Scheduled Pickups
            </Button>
            <Button variant="outline" className="w-full" onClick={() => window.location.href = '/profile'}>
              Update Availability
            </Button>
            <Button variant="outline" className="w-full" onClick={() => window.location.href = '/map'}>
              🗺️ Map View
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Available Pickups</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 border rounded-lg">
                <div className="font-medium">Fresh Bread - Downtown Bakery</div>
                <div className="text-sm text-gray-600">Pickup by 3:00 PM today</div>
                <Button size="sm" className="mt-2">Claim Pickup</Button>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="font-medium">Vegetables - Local Market</div>
                <div className="text-sm text-gray-600">Pickup by 6:00 PM today</div>
                <Button size="sm" className="mt-2">Claim Pickup</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Agency Dashboard Component
function AgencyDashboard({ user }: { user: User }) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Agency Dashboard</h2>
        <p className="mt-2 text-gray-600">Manage incoming donations and coordinate with volunteers</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <span className="text-green-600">📦</span>
              <span className="ml-2">Incoming Donations</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">5</div>
            <p className="text-sm text-gray-600">This week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <span className="text-blue-600">👥</span>
              <span className="ml-2">Active Volunteers</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">12</div>
            <p className="text-sm text-gray-600">Available today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <span className="text-purple-600">🍽️</span>
              <span className="ml-2">Meals Served</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">250</div>
            <p className="text-sm text-gray-600">This month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full" onClick={() => window.location.href = '/donations'}>
              Browse Available Donations
            </Button>
            <Button variant="outline" className="w-full" onClick={() => window.location.href = '/volunteers'}>
              Manage Volunteers
            </Button>
            <Button variant="outline" className="w-full" onClick={() => window.location.href = '/requests'}>
              Request Specific Items
            </Button>
            <Button variant="outline" className="w-full" onClick={() => window.location.href = '/map'}>
              🗺️ Map View
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Donations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 border rounded-lg">
                <div className="font-medium">Fresh Bread - Downtown Bakery</div>
                <div className="text-sm text-gray-600">Claimed by Volunteer Sarah</div>
                <div className="text-xs text-green-600">Expected delivery: 3:30 PM</div>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="font-medium">Canned Goods - Grocery Store</div>
                <div className="text-sm text-gray-600">Available for pickup</div>
                <Button size="sm" className="mt-2">Claim Donation</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 