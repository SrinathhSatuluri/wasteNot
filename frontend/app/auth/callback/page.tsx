"use client";
import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { notifications } from '@/lib/notifications';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get('token');
    const user = searchParams.get('user');

    if (token && user) {
      try {
        const userData = JSON.parse(decodeURIComponent(user));
        
        // Store authentication data
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("userRole", userData.role);
        
        // Show success notification
        notifications.loginSuccess(userData.name);
        
        // Redirect to dashboard
        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
      } catch (error) {
        setError("Failed to process authentication data");
        setLoading(false);
      }
    } else {
      setError("Authentication failed - missing token or user data");
      setLoading(false);
    }
  }, [searchParams, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Completing Login...</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <LoadingSpinner size="lg" text="Setting up your account..." />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-red-600">Authentication Error</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => router.push("/login")}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Back to Login
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Loading...</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <LoadingSpinner size="lg" text="Initializing..." />
          </CardContent>
        </Card>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
} 