"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Package, Truck, Heart } from "lucide-react";

export default function HomePage() {
  const router = useRouter();

  const handleRoleSelection = (role: string) => {
    // Store the selected role in localStorage or state management
    localStorage.setItem("selectedRole", role);
    router.push("/register");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            WasteNot 🌱
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Connecting businesses with surplus food to local shelters and food banks. 
            Together, we can reduce waste and feed those in need.
          </p>
          
          {/* Impact Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-6 transform hover:scale-105 transition">
              <div className="text-3xl font-bold text-green-600">50,000+</div>
              <div className="text-gray-600">Meals Rescued</div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 transform hover:scale-105 transition">
              <div className="text-3xl font-bold text-blue-600">200+</div>
              <div className="text-gray-600">Partner Businesses</div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 transform hover:scale-105 transition">
              <div className="text-3xl font-bold text-purple-600">30+</div>
              <div className="text-gray-600">Active Agencies</div>
            </div>
          </div>

          {/* Sign Up Options */}
          <h2 className="text-2xl font-semibold mb-6">Join Our Mission</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <button
              onClick={() => handleRoleSelection('donor')}
              className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition transform hover:-translate-y-1"
            >
              <Package className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">I'm a Business</h3>
              <p className="text-gray-600">Donate surplus food instead of throwing it away</p>
            </button>
            
            <button
              onClick={() => handleRoleSelection('volunteer')}
              className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition transform hover:-translate-y-1"
            >
              <Truck className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">I'm a Volunteer</h3>
              <p className="text-gray-600">Help transport food to those who need it</p>
            </button>
            
            <button
              onClick={() => handleRoleSelection('agency')}
              className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition transform hover:-translate-y-1"
            >
              <Heart className="w-16 h-16 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">I'm an Agency</h3>
              <p className="text-gray-600">Receive food donations for your community</p>
            </button>
          </div>

          {/* Login Link */}
          <div className="mt-8">
            <p className="text-gray-600">
              Already have an account?{" "}
              <button
                onClick={() => router.push("/login")}
                className="text-green-600 hover:text-green-700 underline"
              >
                Login here
              </button>
            </p>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">1</span>
              </div>
              <h3 className="font-semibold mb-2">Post Surplus Food</h3>
              <p className="text-gray-600">Businesses post available food with pickup details</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="font-semibold mb-2">Match & Coordinate</h3>
              <p className="text-gray-600">Volunteers or agencies claim and arrange pickup</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="font-semibold mb-2">Deliver & Track</h3>
              <p className="text-gray-600">Food reaches those in need, impact is tracked</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}