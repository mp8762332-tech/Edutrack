import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Lock, Wifi, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function EnterpriseLogin() {
  const [, setLocation] = useLocation();
  const [role, setRole] = useState<"platform" | "admin" | "teacher" | "">("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [lanConnected, setLanConnected] = useState(true);

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

    if (!lanConnected && role !== "platform") {
      toast.error("LAN connection required for school staff");
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
      setLocation("/enterprise-teacher");
    }
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

        {/* LAN Security Status */}
        <Card className="p-4 mb-6 border-0">
          <div className="flex items-center gap-3 mb-3">
            <Wifi className={lanConnected ? "text-green-600" : "text-red-600"} size={20} />
            <div className="flex-1">
              <p className="font-medium text-sm">Network Status</p>
              <p className="text-xs text-gray-600">
                {lanConnected ? "Connected to NIS-STAFF-NETWORK" : "No LAN connection detected"}
              </p>
            </div>
            <Badge className={lanConnected ? "bg-green-600" : "bg-red-600"}>
              {lanConnected ? "✓ Secure" : "✗ Offline"}
            </Badge>
          </div>
          {!lanConnected && (
            <div className="p-2 bg-red-50 border border-red-200 rounded text-xs text-red-900 flex gap-2">
              <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
              <span>LAN connection required for school staff access</span>
            </div>
          )}
        </Card>

        {/* Login Form */}
        <Card className="p-6 border-0">
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Role Selection */}
            <div>
              <label className="text-sm font-medium block mb-3">Select Your Role</label>
              <div className="grid grid-cols-2 gap-3">
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
                  <p className="text-xs text-gray-600">Global Admin</p>
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
                  <p className="text-xs text-gray-600">LAN Required</p>
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
                  <p className="text-xs text-gray-600">LAN Required</p>
                </button>
                <button
                  type="button"
                  onClick={() => setRole("")}
                  className={`p-3 rounded border-2 transition ${
                    role === ""
                      ? "border-purple-600 bg-purple-50"
                      : "border-gray-200 hover:border-purple-300"
                  }`}
                >
                  <p className="font-medium text-sm">Student</p>
                  <p className="text-xs text-gray-600">Coming Soon</p>
                </button>
              </div>
            </div>

            {/* Demo Credentials */}
            {role && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-900">
                <p className="font-medium mb-1">Demo Credentials:</p>
                <p>
                  Username: <code className="bg-white px-1 rounded">{role === "platform" ? "mark" : role === "admin" ? "admin" : "peter"}</code>
                </p>
                <p>
                  Password: <code className="bg-white px-1 rounded">demo123</code>
                </p>
              </div>
            )}

            {/* Username */}
            <div>
              <label className="text-sm font-medium block mb-2">Username</label>
              <Input
                type="text"
                placeholder={role === "platform" ? "mark" : role === "admin" ? "admin" : "peter"}
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

            {/* LAN Warning */}
            {role && role !== "platform" && !lanConnected && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-900 flex gap-2">
                <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                <span>School staff must be connected to the school network (NIS-STAFF-NETWORK) to access the system</span>
              </div>
            )}

            {/* Login Button */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
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
            <div className="text-2xl mb-1">🔒</div>
            <p className="text-xs">LAN Security</p>
            <p className="text-xs text-purple-200">IP-based access control</p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">📊</div>
            <p className="text-xs">Intelligent Grading</p>
            <p className="text-xs text-purple-200">Auto-calculation & results</p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">⚡</div>
            <p className="text-xs">Fast Reports</p>
            <p className="text-xs text-purple-200">10,000 in 3-5 seconds</p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">🎓</div>
            <p className="text-xs">Multi-Level</p>
            <p className="text-xs text-purple-200">Primary, O & A Level</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Import missing icon
import { BookOpen } from "lucide-react";
