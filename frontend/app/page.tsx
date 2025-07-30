"use client";
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Users, 
  MapPin, 
  Clock, 
  Shield, 
  Globe,
  ArrowRight,
  Leaf,
  Package,
  Truck,
  Building
} from 'lucide-react';

export default function HomePage() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    localStorage.setItem('selectedRole', role);
  };

  const handleGetStarted = () => {
    if (!selectedRole) {
      // If no role selected, show role selection
      return;
    }
    // Role is already stored in localStorage, proceed to register
  };

  const roles = [
    {
      id: 'donor',
      title: 'Food Donor',
      description: 'Restaurants, grocery stores, bakeries, and individuals with excess food to donate',
      icon: Package,
      color: 'bg-green-100 text-green-600',
      features: ['Post excess food items', 'Set pickup times', 'Track donation impact', 'Reduce food waste']
    },
    {
      id: 'volunteer',
      title: 'Volunteer',
      description: 'Individuals who help pick up and deliver food donations to those in need',
      icon: Truck,
      color: 'bg-blue-100 text-blue-600',
      features: ['Find pickup opportunities', 'Coordinate deliveries', 'Track your impact', 'Flexible scheduling']
    },
    {
      id: 'agency',
      title: 'Agency/Organization',
      description: 'Food banks, shelters, and community organizations that receive donations',
      icon: Building,
      color: 'bg-purple-100 text-purple-600',
      features: ['Browse available donations', 'Request specific items', 'Manage volunteers', 'Coordinate pickups']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-stone-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-stone-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="flex items-center space-x-2 bg-green-100 px-4 py-2 rounded-full">
                <Leaf className="h-5 w-5 text-green-600" />
                <span className="text-green-800 font-medium">Food Waste Rescue Platform</span>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              WasteNot
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Connect food donors with local shelters and food banks. Reduce waste, feed communities, 
              and make a real impact on food insecurity.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button 
                  size="lg" 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={handleGetStarted}
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Role Selection Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Choose Your Role
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Select how you want to contribute to reducing food waste and helping communities
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {roles.map((role) => {
              const IconComponent = role.icon;
              return (
                <Card 
                  key={role.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                    selectedRole === role.id 
                      ? 'ring-2 ring-green-500 shadow-lg' 
                      : 'hover:border-green-300'
                  }`}
                  onClick={() => handleRoleSelect(role.id)}
                >
                  <CardHeader className="text-center">
                    <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${role.color}`}>
                      <IconComponent className="h-8 w-8" />
                    </div>
                    <CardTitle className="text-xl">{role.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {role.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      {role.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    {selectedRole === role.id && (
                      <div className="mt-4">
                        <Badge className="bg-green-600">Selected</Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {selectedRole && (
            <div className="text-center">
              <Link href="/register">
                <Button size="lg" className="bg-green-600 hover:bg-green-700">
                  Continue as {roles.find(r => r.id === selectedRole)?.title}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How WasteNot Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform makes it easy to donate excess food and connect with those who need it most.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Donate Food</CardTitle>
                <CardDescription>
                  Easily post excess food items with details about quantity, location, and pickup times.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <MapPin className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Find Recipients</CardTitle>
                <CardDescription>
                  Connect with local shelters, food banks, and individuals who can use your donations.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Coordinate Pickup</CardTitle>
                <CardDescription>
                  Arrange safe and convenient pickup times with volunteers and recipients.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Making a Real Impact
            </h2>
            <p className="text-green-100 text-lg">
              Join thousands of users already making a difference
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">1,000+</div>
              <div className="text-green-100">Food Donations</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">500+</div>
              <div className="text-green-100">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">50+</div>
              <div className="text-green-100">Partner Organizations</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">10,000+</div>
              <div className="text-green-100">Meals Saved</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-stone-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join our community of food waste warriors and help feed those in need while reducing environmental impact.
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-green-600 hover:bg-green-700">
              Start Donating Today
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">WasteNot</h3>
              <p className="text-gray-400">
                Connecting food donors with those who need it most.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/donations" className="hover:text-white">Donations</Link></li>
                <li><Link href="/requests" className="hover:text-white">Requests</Link></li>
                <li><Link href="/volunteers" className="hover:text-white">Volunteers</Link></li>
                <li><Link href="/map" className="hover:text-white">Map</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Account</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/login" className="hover:text-white">Sign In</Link></li>
                <li><Link href="/register" className="hover:text-white">Register</Link></li>
                <li><Link href="/profile" className="hover:text-white">Profile</Link></li>
                <li><Link href="/dashboard" className="hover:text-white">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>support@wastenot.com</li>
                <li>+1 (555) 123-4567</li>
                <li>123 Food Street, City, State</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 WasteNot. All rights reserved. | Deployed successfully on Vercel</p>
          </div>
        </div>
      </footer>
    </div>
  );
}