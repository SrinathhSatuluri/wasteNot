"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { notifications } from "@/lib/notifications";
import { API_ENDPOINTS } from "@/lib/api";
import { SocialLoginButtons } from "@/components/SocialLoginButtons";
import { Package, Truck, Building } from "lucide-react";

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "donor",
  });
  const [error, setError] = useState("");

  const roles = [
    {
      id: 'donor',
      title: 'Food Donor',
      description: 'Restaurants, grocery stores, bakeries, and individuals',
      icon: Package,
      color: 'bg-green-100 text-green-600'
    },
    {
      id: 'volunteer',
      title: 'Volunteer',
      description: 'Individuals who help pick up and deliver food',
      icon: Truck,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      id: 'agency',
      title: 'Agency/Organization',
      description: 'Food banks, shelters, and community organizations',
      icon: Building,
      color: 'bg-purple-100 text-purple-600'
    }
  ];

  // Check if role was selected on home page
  useEffect(() => {
    const selectedRole = localStorage.getItem("selectedRole");
    if (selectedRole) {
      setForm(prev => ({ ...prev, role: selectedRole }));
    }
  }, []);

  const handleRoleSelect = (role: string) => {
    setForm(prev => ({ ...prev, role }));
    localStorage.setItem('selectedRole', role);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch(API_ENDPOINTS.AUTH.REGISTER, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      // Store user role for dashboard access
      localStorage.setItem("userRole", form.role);
      notifications.registrationSuccess();
      router.push("/login");
    } else {
      const data = await res.json();
      setError(data.message || "Registration failed");
    }
  }

  const selectedRoleData = roles.find(r => r.id === form.role);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 min-h-[700px] w-full max-w-6xl">
        <CardContent className="grid p-0 md:grid-cols-2 h-full">
          <form className="p-6 md:p-8 flex flex-col justify-center" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Create your account</h1>
                <p className="text-muted-foreground text-balance">
                  Join WasteNot and start making a difference!
                </p>
              </div>

              {/* Role Selection */}
              <div className="space-y-3">
                <Label>Your Role</Label>
                <div className="grid grid-cols-3 gap-3">
                  {roles.map((role) => {
                    const IconComponent = role.icon;
                    return (
                      <div
                        key={role.id}
                        className={`cursor-pointer p-3 rounded-lg border-2 transition-all ${
                          form.role === role.id
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-green-300'
                        }`}
                        onClick={() => handleRoleSelect(role.id)}
                      >
                        <div className="text-center">
                          <div className={`mx-auto w-8 h-8 rounded-full flex items-center justify-center mb-2 ${role.color}`}>
                            <IconComponent className="h-4 w-4" />
                          </div>
                          <div className="text-xs font-medium">{role.title}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {selectedRoleData && (
                  <div className="flex items-center justify-center space-x-2">
                    <Badge className="bg-green-600">
                      {selectedRoleData.icon && <selectedRoleData.icon className="h-3 w-3 mr-1" />}
                      {selectedRoleData.title}
                    </Badge>
                  </div>
                )}
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="grid gap-3">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  required
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                />
              </div>

              <Button type="submit" className="w-full" suppressHydrationWarning>
                Register as {selectedRoleData?.title}
              </Button>
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Or continue with
                </span>
              </div>
              <SocialLoginButtons variant="register" />
              <div className="text-center text-sm">
                Already have an account?{" "}
                <a href="/login" className="underline underline-offset-4 text-green-700">
                  Login
                </a>
              </div>
            </div>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src="/auth-image.jpg"
              alt="WasteNot - Food rescue and community"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}