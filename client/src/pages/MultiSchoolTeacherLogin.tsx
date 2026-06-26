import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Lock, LogOut, ChevronRight, Search } from "lucide-react";
import { toast } from "sonner";

interface TeacherSchool {
  id: string;
  name: string;
  logo: string;
  position: string;
  classes: string[];
  subjects: string[];
  lastAccess: string;
}

export default function MultiSchoolTeacherLogin() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<"schools" | "login">("schools");
  const [selectedSchool, setSelectedSchool] = useState<TeacherSchool | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Demo: Teacher with multiple school accounts
  const teacherSchools: TeacherSchool[] = [
    {
      id: "sch-1",
      name: "Nairobi International School",
      logo: "🏫",
      position: "Mathematics Teacher",
      classes: ["S1A", "S1B", "S2A"],
      subjects: ["Mathematics", "Physics"],
      lastAccess: "Today, 2:30 PM",
    },
    {
      id: "sch-2",
      name: "St. Mary's Academy",
      logo: "⛪",
      position: "Class Teacher (S3B)",
      classes: ["S3B"],
      subjects: ["English", "Literature"],
      lastAccess: "Yesterday, 4:15 PM",
    },
    {
      id: "sch-3",
      name: "Kampala High School",
      logo: "🎓",
      position: "Science Coordinator",
      classes: ["S1A", "S1B", "S2A", "S2B"],
      subjects: ["Chemistry", "Biology", "Physics"],
      lastAccess: "3 days ago",
    },
    {
      id: "sch-4",
      name: "Kigali International",
      logo: "🌍",
      position: "Regular Teacher",
      classes: ["S4A"],
      subjects: ["Mathematics"],
      lastAccess: "1 week ago",
    },
  ];

  const filteredSchools = teacherSchools.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectSchool = (school: TeacherSchool) => {
    setSelectedSchool(school);
    setStep("login");
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      toast.error("Please enter username and password");
      return;
    }

    if (username === "peter" && password === "demo123") {
      localStorage.setItem("demoUser", JSON.stringify({
        role: "teacher",
        username,
        schoolId: selectedSchool?.id,
        schoolName: selectedSchool?.name,
      }));
      toast.success(`Logged in to ${selectedSchool?.name}`);
      setTimeout(() => {
        setLocation("/enterprise-teacher");
      }, 1000);
    } else {
      toast.error("Invalid credentials");
    }
  };

  // Step 1: School Selection
  if (step === "schools") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Select Your School</h1>
            <p className="text-gray-600">You have access to {teacherSchools.length} schools</p>
          </div>

          {/* Search */}
          <div className="mb-6 relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <Input
              placeholder="Search schools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Schools Grid */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {filteredSchools.map((school) => (
              <Card
                key={school.id}
                onClick={() => handleSelectSchool(school)}
                className="p-6 cursor-pointer hover:shadow-lg hover:border-blue-300 transition border-2"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl">{school.logo}</div>
                  <Badge className="bg-blue-600">{school.position}</Badge>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2">{school.name}</h3>

                <div className="space-y-2 mb-4 text-sm">
                  <p className="text-gray-600">
                    <strong>Classes:</strong> {school.classes.join(", ")}
                  </p>
                  <p className="text-gray-600">
                    <strong>Subjects:</strong> {school.subjects.join(", ")}
                  </p>
                  <p className="text-xs text-gray-500">Last accessed: {school.lastAccess}</p>
                </div>

                <Button className="w-full gap-2" onClick={() => handleSelectSchool(school)}>
                  Login <ChevronRight size={18} />
                </Button>
              </Card>
            ))}
          </div>

          {filteredSchools.length === 0 && (
            <Card className="p-8 text-center">
              <p className="text-gray-600">No schools found matching "{searchQuery}"</p>
            </Card>
          )}

          {/* Info Box */}
          <Card className="p-4 bg-blue-50 border-blue-200">
            <p className="text-sm text-blue-900">
              <strong>💡 Tip:</strong> You can teach at multiple schools. Each school has separate data and access.
            </p>
          </Card>
        </div>
      </div>
    );
  }

  // Step 2: Login
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Button
          onClick={() => {
            setStep("schools");
            setSelectedSchool(null);
            setUsername("");
            setPassword("");
          }}
          variant="outline"
          className="mb-6 gap-2"
        >
          ← Back to Schools
        </Button>

        <Card className="p-8 border-0 shadow-lg">
          {/* School Info */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">{selectedSchool?.logo}</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">{selectedSchool?.name}</h2>
            <Badge className="bg-blue-600">{selectedSchool?.position}</Badge>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm font-medium block mb-2">Username</label>
              <Input
                type="text"
                placeholder="peter"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium block mb-2">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Demo Credentials */}
            <div className="p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-900">
              <p className="font-medium mb-1">Demo Credentials:</p>
              <p>Username: <code className="bg-white px-1 rounded">peter</code></p>
              <p>Password: <code className="bg-white px-1 rounded">demo123</code></p>
            </div>

            <Button type="submit" className="w-full gap-2">
              <Lock size={18} /> Login to {selectedSchool?.name}
            </Button>
          </form>

          {/* Features */}
          <div className="mt-6 p-4 bg-gray-50 rounded space-y-2 text-sm">
            <p className="font-medium text-gray-900">✓ Access Anywhere</p>
            <p className="text-gray-600">Login from any device, anytime. No LAN restriction.</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
