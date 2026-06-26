import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Lock, Globe, CheckCircle2, BookOpen, Cloud } from "lucide-react";
import { toast } from "sonner";

export default function EnterpriseLogin() {
  const [, setLocation] = useLocation();
  const [role, setRole] = useState<"platform" | "admin" | "teacher" | "">("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!role) {
      toast.error("Please select a role");
      return;
    }

    if (!username || !password) {
      toast.error("Please enter username and password");
      return;
    }

    // Store demo user
    localStorage.setItem("demoUser", JSON.stringify({ role, username }));

    // Route based on role
    if (role === "platform") {
      setLocation("/enterprise-platform-owner");
    } else if (role === "admin") {
      setLocation("/enterprise-admin");
    } else if (role === "teacher") {
      // Check if teacher has multiple schools
      setLocation("/multi-school-teacher-login");
    }

    toast.success("Login successful!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-purple-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4">
            <BookOpen className="text-purple-600" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">EduTrack</h1>
          <p className="text-purple-100">Enterprise School Management System</p>
        </div>

        {/* Cloud Access Status */}
        <Card className="p-4 mb-6 border-0">
          <div className="flex items-center gap-3">
            <Cloud className="text-green-600" size={20} />
            <div className="flex-1">
              <p className="font-medium text-sm">Cloud Access</p>
              <p className="text-xs text-gray-600">
                Access from any device, anywhere, anytime
              </p>
            </div>
            <Badge className="bg-green-600">
              <Globe size={12} className="mr-1" /> Online
            </Badge>
          </div>
        </Card>

        {/* Login Form */}
        <Card className="p-6 border-0">
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Role Selection */}
            <div>
              <label className="text-sm font-medium block mb-3">Select Your Role</label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("platform")}
                  className={`p-3 rounded border-2 transition ${
                    role === "platform"
                      ? "border-purple-600 bg-purple-50"
                      : "border-gray-200 hover:border-purple-300"
                  }`}
                >
                  <p className="font-medium text-sm">Platform Owner</p>
                  <p className="text-xs text-gray-600">Super Admin</p>
                </button>
                <button
                  type="button"
                  onClick={() => setRole("admin")}
                  className={`p-3 rounded border-2 transition ${
                    role === "admin"
                      ? "border-purple-600 bg-purple-50"
                      : "border-gray-200 hover:border-purple-300"
                  }`}
                >
                  <p className="font-medium text-sm">School Admin</p>
                  <p className="text-xs text-gray-600">School Name</p>
                </button>
                <button
                  type="button"
                  onClick={() => setRole("teacher")}
                  className={`p-3 rounded border-2 transition ${
                    role === "teacher"
                      ? "border-purple-600 bg-purple-50"
                      : "border-gray-200 hover:border-purple-300"
                  }`}
                >
                  <p className="font-medium text-sm">Teacher</p>
                  <p className="text-xs text-gray-600">Any Device</p>
                </button>
              </div>
            </div>

            {/* Admin: School Name as Username */}
            {role === "admin" && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-900">
                <p className="font-medium mb-1">Login with School Name:</p>
                <p>Your school name is your username. All data is stored on cloud.</p>
              </div>
            )}

            {/* Teacher: Multi-school notice */}
            {role === "teacher" && (
              <div className="p-3 bg-green-50 border border-green-200 rounded text-xs text-green-900">
                <p className="font-medium mb-1">Multi-School Access:</p>
                <p>If you teach at multiple schools, you'll see all your schools after login.</p>
              </div>
            )}

            {/* Demo Credentials */}
            {role && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-900">
                <p className="font-medium mb-1">Demo Credentials:</p>
                <p>
                  Username: <code className="bg-white px-1 rounded">{role === "platform" ? "mark" : role === "admin" ? "Gideon High School" : "peter"}</code>
                </p>
                <p>
                  Password: <code className="bg-white px-1 rounded">demo123</code>
                </p>
              </div>
            )}

            {/* Username */}
            <div>
              <label className="text-sm font-medium block mb-2">
                {role === "admin" ? "School Name" : "Username"}
              </label>
              <Input
                type="text"
                placeholder={role === "platform" ? "mark" : role === "admin" ? "Gideon High School" : "peter.kipchoge"}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={!role}
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium block mb-2">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={!role}
              />
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 h-12"
              disabled={!role}
            >
              <Lock size={18} className="mr-2" />
              Login
            </Button>

            {/* Demo Mode Notice */}
            <div className="p-3 bg-gray-100 border border-gray-300 rounded text-xs text-gray-700 text-center">
              <CheckCircle2 size={14} className="inline mr-1" />
              Demo Mode - All features are simulated
            </div>
          </form>
        </Card>

        {/* Features */}
        <div className="mt-8 grid grid-cols-2 gap-4 text-white">
          <div className="text-center">
            <div className="text-2xl mb-1">☁️</div>
            <p className="text-xs">Cloud Storage</p>
            <p className="text-xs text-purple-200">Data safe on any device</p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">📊</div>
            <p className="text-xs">Auto Grading</p>
            <p className="text-xs text-purple-200">Intelligent calculations</p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">⚡</div>
            <p className="text-xs">Ultra Fast</p>
            <p className="text-xs text-purple-200">10,000 reports in seconds</p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">📱</div>
            <p className="text-xs">Any Device</p>
            <p className="text-xs text-purple-200">Desktop & Mobile</p>
          </div>
        </div>

        {/* Access Info */}
        <div className="mt-6 p-4 bg-white/10 rounded-lg">
          <p className="text-xs text-purple-100 text-center">
            Access from anywhere - Desktop, Mobile, Tablet. Data stored securely on cloud.
            Even if school computers are stolen, your data is safe.
          </p>
        </div>
      </div>
    </div>
  );
}
