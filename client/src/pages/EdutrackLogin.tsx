import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Lock } from "lucide-react";
import { toast } from "sonner";

export default function EdutrackLogin() {
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [lanWarning, setLanWarning] = useState(false);
  const [detectedIP, setDetectedIP] = useState("");

  // Simulate LAN IP detection using WebRTC
  const detectLANIP = async () => {
    try {
      const pc = new RTCPeerConnection({ iceServers: [] });
      pc.createDataChannel("");
      pc.createOffer().then((offer) => pc.setLocalDescription(offer));

      pc.onicecandidate = (ice) => {
        if (!ice || !ice.candidate) return;
        const ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3})/;
        const ipAddress = ipRegex.exec(ice.candidate.candidate)?.[1];
        if (ipAddress) {
          setDetectedIP(ipAddress);
        }
      };
    } catch (e) {
      console.log("LAN detection not available");
    }
  };

  const handleLogin = (role: string) => {
    if (!username || !password) {
      toast.error("Please enter username and password");
      return;
    }

    // Detect LAN IP
    detectLANIP();

    // Simulate LAN restriction check
    if (role !== "mark") {
      const isSchoolNetwork = detectedIP?.startsWith("192.168");
      if (!isSchoolNetwork) {
        setLanWarning(true);
        toast.error("LAN restriction enabled: You must be on the school network");
        return;
      }
    }

    // Store user
    localStorage.setItem(
      "edutrackUser",
      JSON.stringify({
        role,
        username,
        detectedIP,
      })
    );

    // Redirect based on role
    if (role === "mark") {
      setLocation("/edutrack-platform-owner");
    } else if (role === "admin") {
      setLocation("/edutrack-school-admin");
    } else if (role === "teacher") {
      setLocation("/edutrack-teacher");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Side - Info */}
          <div className="hidden md:flex flex-col justify-center text-white">
            <h1 className="text-4xl font-bold mb-4">EduTrack</h1>
            <p className="text-xl text-blue-100 mb-6">
              Complete School Management System with Dual Curriculum Support
            </p>
            <ul className="space-y-3 text-blue-100">
              <li className="flex items-center gap-2">
                <span className="text-2xl">🏫</span> Multi-school platform
              </li>
              <li className="flex items-center gap-2">
                <span className="text-2xl">📚</span> Primary & Secondary curricula
              </li>
              <li className="flex items-center gap-2">
                <span className="text-2xl">🔒</span> LAN security restriction
              </li>
              <li className="flex items-center gap-2">
                <span className="text-2xl">📊</span> Auto-grading & reports
              </li>
              <li className="flex items-center gap-2">
                <span className="text-2xl">💰</span> Fee tracking (no payments)
              </li>
            </ul>
          </div>

          {/* Right Side - Login */}
          <div className="space-y-6">
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-bold text-white mb-2">Login</h2>
              <p className="text-blue-100">Select your role and login</p>
            </div>

            {lanWarning && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  LAN restriction is enabled. You must be on the school network (192.168.x.x). Your IP: {detectedIP}
                </AlertDescription>
              </Alert>
            )}

            {/* Demo Accounts */}
            <div className="space-y-4">
              {/* Platform Owner */}
              <Card className="p-4 bg-white cursor-pointer hover:shadow-lg transition">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-lg">Platform Owner</h3>
                    <p className="text-sm text-gray-600">Manage all schools globally</p>
                  </div>
                  <span className="text-2xl">👑</span>
                </div>
                <div className="space-y-2 mb-4 text-sm">
                  <p>
                    <strong>Username:</strong> mark
                  </p>
                  <p>
                    <strong>Password:</strong> edutrack2026
                  </p>
                </div>
                <Button
                  onClick={() => {
                    setUsername("mark");
                    setPassword("edutrack2026");
                    setTimeout(() => handleLogin("mark"), 100);
                  }}
                  className="w-full"
                >
                  Login as Owner
                </Button>
              </Card>

              {/* School Admin */}
              <Card className="p-4 bg-white cursor-pointer hover:shadow-lg transition">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-lg">School Admin</h3>
                    <p className="text-sm text-gray-600">Manage one school</p>
                  </div>
                  <span className="text-2xl">🎓</span>
                </div>
                <div className="space-y-2 mb-4 text-sm">
                  <p>
                    <strong>Username:</strong> admin@nairobi-intl.edu
                  </p>
                  <p>
                    <strong>Password:</strong> admin123
                  </p>
                </div>
                <Button
                  onClick={() => {
                    setUsername("admin@nairobi-intl.edu");
                    setPassword("admin123");
                    setTimeout(() => handleLogin("admin"), 100);
                  }}
                  className="w-full"
                >
                  Login as Admin
                </Button>
              </Card>

              {/* Teacher */}
              <Card className="p-4 bg-white cursor-pointer hover:shadow-lg transition">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-lg">Teacher</h3>
                    <p className="text-sm text-gray-600">Record marks & manage students</p>
                  </div>
                  <span className="text-2xl">👨‍🏫</span>
                </div>
                <div className="space-y-2 mb-4 text-sm">
                  <p>
                    <strong>Username:</strong> peter.kipchoge@school.edu
                  </p>
                  <p>
                    <strong>Password:</strong> teacher123
                  </p>
                </div>
                <Button
                  onClick={() => {
                    setUsername("peter.kipchoge@school.edu");
                    setPassword("teacher123");
                    setTimeout(() => handleLogin("teacher"), 100);
                  }}
                  className="w-full"
                >
                  Login as Teacher
                </Button>
              </Card>
            </div>

            {/* Manual Login */}
            <div className="border-t pt-6">
              <h3 className="font-bold mb-4 text-white">Manual Login</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Username</label>
                  <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    className="bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Password</label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="bg-white"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => handleLogin("mark")} className="flex-1">
                    Login
                  </Button>
                  <Button onClick={() => handleLogin("admin")} variant="outline" className="flex-1">
                    Admin
                  </Button>
                  <Button onClick={() => handleLogin("teacher")} variant="outline" className="flex-1">
                    Teacher
                  </Button>
                </div>
              </div>
            </div>

            {/* LAN Info */}
            <div className="bg-blue-50 border border-blue-200 rounded p-4 text-sm">
              <div className="flex gap-2 items-start">
                <Lock className="text-blue-600 mt-1" size={18} />
                <div>
                  <p className="font-medium text-blue-900">LAN Security</p>
                  <p className="text-blue-700">
                    Teachers and admins can enable LAN-only login to restrict access to school network only. Platform owner can always login from anywhere.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
