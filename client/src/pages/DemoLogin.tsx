import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { demoAccounts } from "@/lib/demoData";
import { Lock, User, LogIn } from "lucide-react";

export default function DemoLogin() {
  const [, setLocation] = useLocation();
  const [selectedRole, setSelectedRole] = useState<keyof typeof demoAccounts>("schoolOwner");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (role: keyof typeof demoAccounts) => {
    setIsLoading(true);
    const account = demoAccounts[role];
    
    // Simulate login delay
    setTimeout(() => {
      // Store demo user in localStorage
      localStorage.setItem("demoUser", JSON.stringify(account));
      
      // Redirect to dashboard
      if (role === "author") {
        setLocation("/demo-author-dashboard");
      } else if (role === "schoolOwner") {
        setLocation("/admin-dashboard");
      } else if (role === "teacher") {
        setLocation("/teacher-dashboard");
      } else if (role === "student") {
        setLocation("/student-profile");
      }
      setIsLoading(false);
    }, 500);
  };

  const account = demoAccounts[selectedRole];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            School Management System
          </h1>
          <p className="text-xl text-blue-100">Demo Version - Interactive Showcase</p>
        </div>

        {/* Login Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Account Selection */}
          <Card className="p-8 bg-white shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Select Account Type</h2>
            
            <div className="space-y-3">
              {Object.entries(demoAccounts).map(([key, acc]) => (
                <button
                  key={key}
                  onClick={() => setSelectedRole(key as keyof typeof demoAccounts)}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    selectedRole === key
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 bg-gray-50 hover:border-blue-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${selectedRole === key ? "bg-blue-500" : "bg-gray-300"}`} />
                    <div>
                      <p className="font-semibold text-gray-900 capitalize">
                        {key === "schoolOwner" ? "School Owner/Admin" : key.charAt(0).toUpperCase() + key.slice(1)}
                      </p>
                      <p className="text-sm text-gray-600">{acc.email}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* Account Details */}
          <Card className="p-8 bg-white shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Account Details</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Full Name</label>
                <p className="text-lg font-semibold text-gray-900">
                  {account.firstName} {account.lastName}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Email</label>
                <p className="text-lg font-semibold text-gray-900">{account.email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Role</label>
                <p className="text-lg font-semibold text-blue-600 capitalize">
                  {selectedRole === "schoolOwner" ? "School Owner" : selectedRole}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Password</label>
                <div className="flex items-center gap-2">
                  <Lock size={18} className="text-gray-400" />
                  <p className="text-lg font-semibold text-gray-400">••••••••</p>
                </div>
              </div>

              <Button
                onClick={() => handleLogin(selectedRole)}
                disabled={isLoading}
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold gap-2"
              >
                <LogIn size={20} />
                {isLoading ? "Logging in..." : "Login as " + (selectedRole === "schoolOwner" ? "Admin" : selectedRole)}
              </Button>
            </div>
          </Card>
        </div>

        {/* Info Box */}
        <Card className="p-6 bg-white/95 shadow-lg">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <User size={20} />
            Demo Accounts Available
          </h3>
          <div className="grid md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="font-semibold text-gray-900">Super Admin</p>
              <p className="text-gray-600">Manage all schools</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900">School Owner</p>
              <p className="text-gray-600">Manage school operations</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Teacher</p>
              <p className="text-gray-600">Record marks & manage classes</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Student</p>
              <p className="text-gray-600">View profile & payments</p>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-blue-100">
          <p className="text-sm">This is a demo version showcasing the system capabilities</p>
          <p className="text-xs mt-2">All data is simulated for demonstration purposes</p>
        </div>
      </div>
    </div>
  );
}
