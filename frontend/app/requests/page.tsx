"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Plus, Search, Clock, MapPin, AlertTriangle, CheckCircle, Users } from "lucide-react";
import { notifications } from "@/lib/notifications";
import { useAutoRefresh } from "@/hooks/useAutoRefresh";
import { API_ENDPOINTS } from "@/lib/api";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Request {
  _id: string;
  title: string;
  description: string;
  items: string[];
  quantity: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  deadline: string;
  location: string;
  status: 'open' | 'partially_fulfilled' | 'fulfilled' | 'expired';
  notes?: string;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  fulfilledBy: Array<{
    _id: string;
    name: string;
    email: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export default function RequestsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all"); // all, open, partially_fulfilled, fulfilled
  const [fulfilling, setFulfilling] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    
    if (!userData || !token) {
      router.push("/login");
      return;
    }

    try {
      const user = JSON.parse(userData);
      setUser(user);
      fetchRequests(token);
    } catch (error) {
      router.push("/login");
    }
  }, [router]);

  const fetchRequests = async (token: string) => {
    try {
      const response = await fetch(API_ENDPOINTS.REQUESTS.LIST, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRequests(data);
      } else {
        notifications.error("Failed to load requests");
      }
    } catch (error) {
      notifications.error("Network error loading requests");
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh requests every 30 seconds
  useAutoRefresh(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchRequests(token);
    }
  }, 30000);

  const handleFulfillRequest = async (requestId: string) => {
    if (!user || user.role !== "donor") {
      notifications.error("Only donors can fulfill requests");
      return;
    }

    setFulfilling(requestId);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(API_ENDPOINTS.REQUESTS.FULFILL(requestId), {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        notifications.success("Request marked as fulfilled!");
        // Refresh the requests list
        fetchRequests(token!);
      } else {
        const data = await response.json();
        notifications.error(data.message || "Failed to fulfill request");
      }
    } catch (error) {
      notifications.error("Network error fulfilling request");
    } finally {
      setFulfilling(null);
    }
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.items.some(item => item.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filter === "all" || request.status === filter;
    
    return matchesSearch && matchesFilter;
  });

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'partially_fulfilled': return 'bg-yellow-100 text-yellow-800';
      case 'fulfilled': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <AlertTriangle className="h-4 w-4" />;
      case 'partially_fulfilled': return <Clock className="h-4 w-4" />;
      case 'fulfilled': return <CheckCircle className="h-4 w-4" />;
      case 'expired': return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return "Expired";
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays <= 7) return `${diffDays} days left`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading requests...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const openCount = requests.filter(r => r.status === 'open').length;
  const fulfilledCount = requests.filter(r => r.status === 'fulfilled').length;

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
              <h1 className="text-2xl font-bold text-green-700">Food Requests</h1>
              <Badge variant="secondary" className="ml-4">
                {openCount} open, {fulfilledCount} fulfilled
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              {user.role === "agency" && (
                <Button onClick={() => router.push("/requests/new")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Request
                </Button>
              )}
              <Button variant="outline" onClick={() => {
                const token = localStorage.getItem("token");
                if (token) fetchRequests(token);
              }}>
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search requests by title, description, or items..."
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
                  variant={filter === "open" ? "default" : "outline"}
                  onClick={() => setFilter("open")}
                >
                  Open
                </Button>
                <Button
                  variant={filter === "partially_fulfilled" ? "default" : "outline"}
                  onClick={() => setFilter("partially_fulfilled")}
                >
                  Partially Fulfilled
                </Button>
                <Button
                  variant={filter === "fulfilled" ? "default" : "outline"}
                  onClick={() => setFilter("fulfilled")}
                >
                  Fulfilled
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Requests List */}
        <div className="space-y-6">
          {filteredRequests.map((request) => (
            <Card key={request._id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <CardTitle className="text-xl">{request.title}</CardTitle>
                      <Badge className={getUrgencyColor(request.urgency)}>
                        {request.urgency.charAt(0).toUpperCase() + request.urgency.slice(1)}
                      </Badge>
                      <Badge className={getStatusColor(request.status)}>
                        {getStatusIcon(request.status)}
                        <span className="ml-1">{request.status.replace('_', ' ')}</span>
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-2">{request.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{request.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{formatDeadline(request.deadline)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{request.fulfilledBy.length} fulfilled</span>
                      </div>
                    </div>
                  </div>
                  {user.role === "donor" && request.status !== "fulfilled" && (
                    <Button
                      onClick={() => handleFulfillRequest(request._id)}
                      disabled={fulfilling === request._id}
                      size="sm"
                    >
                      {fulfilling === request._id ? "Fulfilling..." : "Mark as Fulfilled"}
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Items Needed:</h4>
                    <div className="flex flex-wrap gap-2">
                      {request.items.map((item, index) => (
                        <Badge key={index} variant="outline">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Quantity:</h4>
                      <p className="text-gray-600">{request.quantity}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Requested by:</h4>
                      <p className="text-gray-600">{request.createdBy.name}</p>
                    </div>
                  </div>

                  {request.notes && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Notes:</h4>
                      <p className="text-gray-600">{request.notes}</p>
                    </div>
                  )}

                  {request.fulfilledBy.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Fulfilled by:</h4>
                      <div className="flex flex-wrap gap-2">
                        {request.fulfilledBy.map((fulfiller) => (
                          <Badge key={fulfiller._id} variant="secondary">
                            {fulfiller.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredRequests.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-gray-600">No requests found matching your criteria.</p>
              {user.role === "agency" && (
                <Button 
                  className="mt-4" 
                  onClick={() => router.push("/requests/new")}
                >
                  Create Your First Request
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
} 