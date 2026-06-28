import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Copy, Plus, Eye, EyeOff, Mail, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface School {
  id: number;
  name: string;
  code: string;
  email: string;
  phone: string;
  registrationDate: string;
  status: "active" | "pending" | "inactive";
  studentCount: number;
  teacherCount: number;
  revenue: number;
}

interface RegistrationCode {
  id: number;
  code: string;
  createdAt: string;
  expiresAt: string;
  usedBy?: string;
  usedAt?: string;
  status: "active" | "used" | "expired";
}

export default function AuthorDashboard() {
  const [schools, setSchools] = useState<School[]>([
    {
      id: 1,
      name: "Kampala High School",
      code: "KHS001",
      email: "admin@kampalahs.edu.ug",
      phone: "+256701234567",
      registrationDate: "2026-01-15",
      status: "active",
      studentCount: 450,
      teacherCount: 28,
      revenue: 15000000,
    },
    {
      id: 2,
      name: "St. Mary's Academy",
      code: "SMA002",
      email: "info@stmarys.edu.ug",
      phone: "+256702345678",
      registrationDate: "2026-02-20",
      status: "active",
      studentCount: 320,
      teacherCount: 18,
      revenue: 9500000,
    },
  ]);

  const [registrationCodes, setRegistrationCodes] = useState<RegistrationCode[]>([
    {
      id: 1,
      code: "ABC123",
      createdAt: "2026-06-20",
      expiresAt: "2026-07-20",
      status: "active",
    },
    {
      id: 2,
      code: "DEF456",
      createdAt: "2026-06-15",
      expiresAt: "2026-07-15",
      usedBy: "Kampala High School",
      usedAt: "2026-06-18",
      status: "used",
    },
  ]);

  const [showNewSchoolForm, setShowNewSchoolForm] = useState(false);
  const [newSchoolName, setNewSchoolName] = useState("");
  const [newSchoolEmail, setNewSchoolEmail] = useState("");
  const [newSchoolPhone, setNewSchoolPhone] = useState("");
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);
  const [showCodes, setShowCodes] = useState(false);

  /**
   * Generate 6-digit registration code
   */
  const generateRegistrationCode = (): string => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  /**
   * Create new registration code
   */
  const handleGenerateCode = async () => {
    setIsGeneratingCode(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newCode: RegistrationCode = {
        id: registrationCodes.length + 1,
        code: generateRegistrationCode(),
        createdAt: new Date().toISOString().split("T")[0],
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        status: "active",
      };

      setRegistrationCodes([newCode, ...registrationCodes]);
      toast.success(`Code generated: ${newCode.code}`);
    } catch (error) {
      toast.error("Failed to generate code");
    } finally {
      setIsGeneratingCode(false);
    }
  };

  /**
   * Copy code to clipboard
   */
  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Code copied to clipboard");
    } catch {
      toast.error("Failed to copy code");
    }
  };

  /**
   * Send code via email
   */
  const handleSendCodeEmail = (code: string) => {
    const subject = "EduTrack School Registration Code";
    const body = `Your school registration code is: ${code}\n\nThis code will expire in 30 days.`;
    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
    toast.success("Email opened - paste the code and send");
  };

  /**
   * Register new school
   */
  const handleRegisterSchool = async () => {
    if (!newSchoolName || !newSchoolEmail || !newSchoolPhone) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      const newSchool: School = {
        id: schools.length + 1,
        name: newSchoolName,
        code: `SCH${String(schools.length + 1).padStart(3, "0")}`,
        email: newSchoolEmail,
        phone: newSchoolPhone,
        registrationDate: new Date().toISOString().split("T")[0],
        status: "pending",
        studentCount: 0,
        teacherCount: 0,
        revenue: 0,
      };

      setSchools([newSchool, ...schools]);
      setNewSchoolName("");
      setNewSchoolEmail("");
      setNewSchoolPhone("");
      setShowNewSchoolForm(false);
      toast.success("School registered successfully");
    } catch (error) {
      toast.error("Failed to register school");
    }
  };

  /**
   * Calculate total revenue
   */
  const totalRevenue = schools.reduce((sum, school) => sum + school.revenue, 0);
  const totalStudents = schools.reduce((sum, school) => sum + school.studentCount, 0);
  const totalTeachers = schools.reduce((sum, school) => sum + school.teacherCount, 0);
  const activeSchools = schools.filter((s) => s.status === "active").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">EduTrack Author Dashboard</h1>
          <p className="text-slate-400">Manage schools, generate registration codes, and track revenue</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Active Schools</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{activeSchools}</div>
              <p className="text-xs text-slate-400 mt-1">{schools.length} total registered</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Total Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{totalStudents.toLocaleString()}</div>
              <p className="text-xs text-slate-400 mt-1">Across all schools</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Total Teachers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{totalTeachers}</div>
              <p className="text-xs text-slate-400 mt-1">Across all schools</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">UGX {(totalRevenue / 1000000).toFixed(1)}M</div>
              <p className="text-xs text-slate-400 mt-1">Subscription revenue</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="schools" className="space-y-4">
          <TabsList className="bg-slate-800 border-slate-700">
            <TabsTrigger value="schools">Schools</TabsTrigger>
            <TabsTrigger value="codes">Registration Codes</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Schools Tab */}
          <TabsContent value="schools" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white">Registered Schools</h2>
              <Button
                onClick={() => setShowNewSchoolForm(!showNewSchoolForm)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus size={18} className="mr-2" />
                Register School
              </Button>
            </div>

            {showNewSchoolForm && (
              <Card className="bg-slate-800 border-slate-700 mb-4">
                <CardHeader>
                  <CardTitle className="text-white">Register New School</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-slate-300">School Name</Label>
                    <Input
                      placeholder="e.g., Kampala High School"
                      value={newSchoolName}
                      onChange={(e) => setNewSchoolName(e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300">Email</Label>
                    <Input
                      type="email"
                      placeholder="admin@school.edu.ug"
                      value={newSchoolEmail}
                      onChange={(e) => setNewSchoolEmail(e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300">Phone</Label>
                    <Input
                      placeholder="+256701234567"
                      value={newSchoolPhone}
                      onChange={(e) => setNewSchoolPhone(e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleRegisterSchool} className="bg-green-600 hover:bg-green-700">
                      Register
                    </Button>
                    <Button
                      onClick={() => setShowNewSchoolForm(false)}
                      variant="outline"
                      className="border-slate-600 text-slate-300"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="space-y-4">
              {schools.map((school) => (
                <Card key={school.id} className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-white">{school.name}</CardTitle>
                        <CardDescription className="text-slate-400">{school.code}</CardDescription>
                      </div>
                      <Badge
                        variant={school.status === "active" ? "default" : "secondary"}
                        className={school.status === "active" ? "bg-green-600" : "bg-yellow-600"}
                      >
                        {school.status.charAt(0).toUpperCase() + school.status.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-slate-400">Email</p>
                        <p className="text-sm text-white">{school.email}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Phone</p>
                        <p className="text-sm text-white">{school.phone}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Students</p>
                        <p className="text-sm text-white">{school.studentCount}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Teachers</p>
                        <p className="text-sm text-white">{school.teacherCount}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Registration Codes Tab */}
          <TabsContent value="codes" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white">Registration Codes</h2>
              <Button
                onClick={handleGenerateCode}
                disabled={isGeneratingCode}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isGeneratingCode ? (
                  <>
                    <Loader2 size={18} className="mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Plus size={18} className="mr-2" />
                    Generate Code
                  </>
                )}
              </Button>
            </div>

            <div className="space-y-4">
              {registrationCodes.map((code) => (
                <Card key={code.id} className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-4">
                        <div className="text-3xl font-bold text-white font-mono">{code.code}</div>
                        <div>
                          <p className="text-xs text-slate-400">Created</p>
                          <p className="text-sm text-white">{code.createdAt}</p>
                        </div>
                      </div>
                      <Badge
                        variant={code.status === "active" ? "default" : code.status === "used" ? "secondary" : "outline"}
                        className={
                          code.status === "active"
                            ? "bg-green-600"
                            : code.status === "used"
                              ? "bg-blue-600"
                              : "bg-red-600"
                        }
                      >
                        {code.status.charAt(0).toUpperCase() + code.status.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-xs text-slate-400">Expires</p>
                        <p className="text-sm text-white">{code.expiresAt}</p>
                        {code.usedBy && (
                          <>
                            <p className="text-xs text-slate-400 mt-2">Used by</p>
                            <p className="text-sm text-white">{code.usedBy}</p>
                          </>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleCopyCode(code.code)}
                          variant="outline"
                          className="border-slate-600 text-slate-300"
                        >
                          <Copy size={16} />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleSendCodeEmail(code.code)}
                          variant="outline"
                          className="border-slate-600 text-slate-300"
                        >
                          <Mail size={16} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">System Analytics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-700 p-4 rounded-lg">
                    <p className="text-sm text-slate-400">Average Students per School</p>
                    <p className="text-2xl font-bold text-white">{Math.round(totalStudents / schools.length)}</p>
                  </div>
                  <div className="bg-slate-700 p-4 rounded-lg">
                    <p className="text-sm text-slate-400">Average Teachers per School</p>
                    <p className="text-2xl font-bold text-white">{Math.round(totalTeachers / schools.length)}</p>
                  </div>
                  <div className="bg-slate-700 p-4 rounded-lg">
                    <p className="text-sm text-slate-400">Average Revenue per School</p>
                    <p className="text-2xl font-bold text-white">UGX {(totalRevenue / schools.length / 1000000).toFixed(1)}M</p>
                  </div>
                  <div className="bg-slate-700 p-4 rounded-lg">
                    <p className="text-sm text-slate-400">Active Registration Codes</p>
                    <p className="text-2xl font-bold text-white">
                      {registrationCodes.filter((c) => c.status === "active").length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
