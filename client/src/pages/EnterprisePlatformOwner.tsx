import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { demoPlatformStats, demoSchools } from "@/lib/enterpriseData";
import {
  BarChart3,
  Building2,
  Users,
  TrendingUp,
  Plus,
  Eye,
  Trash2,
  LogOut,
  Settings,
  AlertCircle,
  MessageSquare,
  DollarSign,
  Calendar,
  Send,
  Copy,
  CheckCircle2,
  Link,
} from "lucide-react";
import { toast } from "sonner";

export default function EnterprisePlatformOwner() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddSchool, setShowAddSchool] = useState(false);
  const [showCodeGenerated, setShowCodeGenerated] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");
  const [schoolEmail, setSchoolEmail] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [codeSent, setCodeSent] = useState(false);

  const filteredSchools = demoSchools.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.includes(searchQuery) ||
      s.district.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLogout = () => {
    localStorage.removeItem("demoUser");
    setLocation("/enterprise-login");
  };

  // Generate unique 6-digit school code
  const generateSchoolCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const handleGenerateCode = () => {
    if (!schoolName || !schoolEmail) {
      toast.error("Please fill in school name and email first");
      return;
    }
    const code = generateSchoolCode();
    const link = `${window.location.origin}/school-onboarding/${code}`;
    setGeneratedCode(code);
    setGeneratedLink(link);
    setShowCodeGenerated(true);
    toast.success(`School code generated: ${code}`);
  };

  const handleSendToSchool = () => {
    setIsSending(true);
    // Simulate sending email
    setTimeout(() => {
      setIsSending(false);
      setCodeSent(true);
      toast.success(`Registration link sent to ${schoolEmail}!`);
    }, 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    toast.success("Link copied to clipboard!");
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    toast.success("Code copied to clipboard!");
  };

  const handleCloseRegistration = () => {
    setShowAddSchool(false);
    setShowCodeGenerated(false);
    setGeneratedCode("");
    setGeneratedLink("");
    setSchoolEmail("");
    setSchoolName("");
    setIsSending(false);
    setCodeSent(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-purple-700 text-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">EduTrack Platform Owner</h1>
            <p className="text-sm text-purple-100">Global School Management System</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" className="gap-2 text-white border-white hover:bg-purple-700">
              <Settings size={18} />
              Settings
            </Button>
            <Button onClick={handleLogout} variant="outline" size="sm" className="gap-2 text-white border-white hover:bg-purple-700">
              <LogOut size={18} />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* KPI Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Schools</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{demoPlatformStats.totalSchools}</p>
                <p className="text-xs text-green-600 mt-1">+12 this month</p>
              </div>
              <Building2 className="text-blue-600" size={32} />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Active Schools</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{demoPlatformStats.activeSchools}</p>
                <p className="text-xs text-green-600 mt-1">{((demoPlatformStats.activeSchools / demoPlatformStats.totalSchools) * 100).toFixed(1)}% active</p>
              </div>
              <TrendingUp className="text-green-600" size={32} />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Students</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{(demoPlatformStats.totalStudents / 1000).toFixed(1)}K</p>
                <p className="text-xs text-green-600 mt-1">Across all schools</p>
              </div>
              <Users className="text-purple-600" size={32} />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">My Subscription Revenue</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">UGX {(demoPlatformStats.monthlySubscriptionIncome / 1000000).toFixed(1)}M</p>
                <p className="text-xs text-green-600 mt-1">+8% from last month (Author only)</p>
              </div>
              <DollarSign className="text-yellow-600" size={32} />
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="schools" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="schools">Schools</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
            <TabsTrigger value="support">Support</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          {/* Schools Tab */}
          <TabsContent value="schools">
            <Card className="p-6">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Input
                    placeholder="Search by school name, code, or district..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button onClick={() => setShowAddSchool(true)} className="gap-2 bg-purple-600 hover:bg-purple-700">
                  <Plus size={18} /> Register New School
                </Button>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>School Name</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Students</TableHead>
                      <TableHead>Subscription</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSchools.map((school) => (
                      <TableRow key={school.id}>
                        <TableCell className="font-medium">{school.name}</TableCell>
                        <TableCell className="font-mono text-xs bg-gray-100 rounded px-2">{school.code}</TableCell>
                        <TableCell>{school.type}</TableCell>
                        <TableCell>{school.city}, {school.district}</TableCell>
                        <TableCell>{school.currentStudents}/{school.maxStudents}</TableCell>
                        <TableCell>
                          <Badge className="bg-blue-600">{school.subscriptionPlan}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={school.status === "Active" ? "bg-green-600" : "bg-red-600"}>
                            {school.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => toast.success(`Viewing ${school.name}`)}
                            >
                              <Eye size={14} />
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-600">
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <BarChart3 size={20} />
                  School Distribution
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span className="text-sm font-medium">Active Schools</span>
                    <span className="font-bold text-green-600">{demoPlatformStats.activeSchools}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span className="text-sm font-medium">Suspended Schools</span>
                    <span className="font-bold text-red-600">{demoPlatformStats.suspendedSchools}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span className="text-sm font-medium">Total Teachers</span>
                    <span className="font-bold text-blue-600">{demoPlatformStats.totalTeachers}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span className="text-sm font-medium">Total Students</span>
                    <span className="font-bold text-purple-600">{demoPlatformStats.totalStudents}</span>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-bold mb-4">My Platform Revenue (Author Only)</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <p className="text-sm font-medium">Total Revenue</p>
                      <p className="font-bold">UGX {(demoPlatformStats.subscriptionRevenue / 1000000).toFixed(1)}M</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full" style={{ width: "100%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <p className="text-sm font-medium">Monthly Revenue</p>
                      <p className="font-bold">UGX {(demoPlatformStats.monthlySubscriptionIncome / 1000000).toFixed(1)}M</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full" style={{ width: "65%" }} />
                    </div>
                  </div>
                  <div className="p-3 bg-green-50 border border-green-200 rounded mt-4">
                    <p className="text-sm text-green-900">
                      <strong>Average Revenue Per School:</strong> UGX {(demoPlatformStats.subscriptionRevenue / demoPlatformStats.totalSchools / 1000).toFixed(0)}K
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Subscriptions Tab */}
          <TabsContent value="subscriptions">
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Calendar size={20} />
                Subscription Management
              </h3>
              <div className="space-y-3">
                <div className="p-4 bg-red-50 border border-red-200 rounded flex items-center justify-between">
                  <div>
                    <p className="font-bold text-red-900">Expiring Soon</p>
                    <p className="text-sm text-red-700">{demoPlatformStats.expiringSubscriptions} subscriptions expiring in 30 days</p>
                  </div>
                  <AlertCircle className="text-red-600" size={24} />
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded">
                    <p className="text-sm font-medium text-blue-900">Free Plan</p>
                    <p className="text-2xl font-bold text-blue-600 mt-2">24</p>
                    <p className="text-xs text-blue-700 mt-1">Active schools</p>
                  </div>
                  <div className="p-4 bg-green-50 border border-green-200 rounded">
                    <p className="text-sm font-medium text-green-900">Professional Plan</p>
                    <p className="text-2xl font-bold text-green-600 mt-2">78</p>
                    <p className="text-xs text-green-700 mt-1">Active schools</p>
                  </div>
                  <div className="p-4 bg-purple-50 border border-purple-200 rounded">
                    <p className="text-sm font-medium text-purple-900">Enterprise Plan</p>
                    <p className="text-2xl font-bold text-purple-600 mt-2">40</p>
                    <p className="text-xs text-purple-700 mt-1">Active schools</p>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Support Tab */}
          <TabsContent value="support">
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <MessageSquare size={20} />
                Support Tickets
              </h3>
              <div className="space-y-3">
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded flex items-center justify-between">
                  <div>
                    <p className="font-bold text-yellow-900">Open Tickets</p>
                    <p className="text-sm text-yellow-700">{demoPlatformStats.expiringSubscriptions} subscriptions expiring soon</p>
                  </div>
                  <span className="text-3xl font-bold text-yellow-600">{demoPlatformStats.expiringSubscriptions}</span>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-red-50 border border-red-200 rounded">
                    <p className="text-sm font-medium text-red-900">Critical</p>
                    <p className="text-2xl font-bold text-red-600 mt-2">3</p>
                  </div>
                  <div className="p-4 bg-orange-50 border border-orange-200 rounded">
                    <p className="text-sm font-medium text-orange-900">High Priority</p>
                    <p className="text-2xl font-bold text-orange-600 mt-2">8</p>
                  </div>
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded">
                    <p className="text-sm font-medium text-blue-900">Normal</p>
                    <p className="text-2xl font-bold text-blue-600 mt-2">17</p>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports">
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4">Generate Reports</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <Button onClick={() => toast.success("Generating school performance report...")} className="h-20 gap-2 flex flex-col">
                  <BarChart3 size={24} />
                  School Performance Report
                </Button>
                <Button onClick={() => toast.success("Generating revenue report...")} variant="outline" className="h-20 gap-2 flex flex-col">
                  <DollarSign size={24} />
                  Revenue Report
                </Button>
                <Button onClick={() => toast.success("Generating student analytics...")} variant="outline" className="h-20 gap-2 flex flex-col">
                  <Users size={24} />
                  Student Analytics
                </Button>
                <Button onClick={() => toast.success("Generating subscription report...")} variant="outline" className="h-20 gap-2 flex flex-col">
                  <Calendar size={24} />
                  Subscription Report
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Register School Modal - Step 1: Fill Details */}
      <Dialog open={showAddSchool && !showCodeGenerated} onOpenChange={handleCloseRegistration}>
        <DialogContent className="max-h-[90vh] overflow-y-auto max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl">Register New School</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-3 bg-purple-50 border border-purple-200 rounded">
              <p className="text-sm text-purple-900">
                Fill in the school details below. A unique <strong>6-digit code</strong> and registration link will be generated and sent to the school's email.
              </p>
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">School Name *</label>
              <Input
                placeholder="e.g. Gideon High School Naggalama"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">School Email *</label>
              <Input
                placeholder="e.g. admin@gideonhigh.ac.ug"
                type="email"
                value={schoolEmail}
                onChange={(e) => setSchoolEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">School Type *</label>
              <select className="w-full border border-gray-300 rounded px-3 py-2">
                <option>Select Type</option>
                <option>Primary</option>
                <option>Secondary</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Primary = Kindergarten + Lower Primary + Upper Primary (P1-P7) | Secondary = O-Level (S1-S4) + A-Level (S5-S6)
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium block mb-1">Ownership</label>
                <select className="w-full border border-gray-300 rounded px-3 py-2">
                  <option>Select Ownership</option>
                  <option>Government</option>
                  <option>Private</option>
                  <option>Religious</option>
                  <option>NGO</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">District</label>
                <Input placeholder="e.g. Mukono" />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">Principal Name</label>
              <Input placeholder="e.g. Mr. John Ssempijja" />
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">Principal Phone</label>
              <Input placeholder="e.g. 0700123456" />
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">School Phone</label>
              <Input placeholder="e.g. 0414123456" />
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">Subscription Plan</label>
              <select className="w-full border border-gray-300 rounded px-3 py-2">
                <option>Select Plan</option>
                <option>Free (50 students max)</option>
                <option>Basic - UGX 100,000/month (500 students)</option>
                <option>Professional - UGX 300,000/month (5,000 students)</option>
                <option>Enterprise - UGX 800,000/month (50,000 students)</option>
              </select>
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleGenerateCode} className="flex-1 gap-2 bg-purple-600 hover:bg-purple-700">
                <Link size={18} /> Generate Code & Link
              </Button>
              <Button onClick={handleCloseRegistration} variant="outline" className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Register School Modal - Step 2: Code Generated */}
      <Dialog open={showCodeGenerated} onOpenChange={handleCloseRegistration}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <CheckCircle2 className="text-green-600" size={24} />
              School Code Generated!
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* School Code Display */}
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Unique School Code</p>
              <div className="flex items-center justify-center gap-3">
                <span className="text-4xl font-mono font-bold tracking-wider text-purple-700">
                  {generatedCode}
                </span>
                <Button size="sm" variant="outline" onClick={handleCopyCode}>
                  <Copy size={16} />
                </Button>
              </div>
            </div>

            {/* Registration Link */}
            <div className="p-4 bg-gray-50 border border-gray-200 rounded">
              <p className="text-sm font-medium mb-2">Registration Link:</p>
              <div className="flex items-center gap-2">
                <code className="text-xs bg-white border px-2 py-1 rounded flex-1 overflow-hidden text-ellipsis">
                  {generatedLink}
                </code>
                <Button size="sm" variant="outline" onClick={handleCopyLink}>
                  <Copy size={14} />
                </Button>
              </div>
            </div>

            {/* School Info */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded">
              <p className="text-sm text-blue-900">
                <strong>School:</strong> {schoolName}
              </p>
              <p className="text-sm text-blue-900">
                <strong>Email:</strong> {schoolEmail}
              </p>
            </div>

            {/* Send Button */}
            {!codeSent ? (
              <Button
                onClick={handleSendToSchool}
                disabled={isSending}
                className="w-full gap-2 bg-green-600 hover:bg-green-700 h-12"
              >
                {isSending ? (
                  <>
                    <span className="animate-spin">&#9696;</span> Sending to {schoolEmail}...
                  </>
                ) : (
                  <>
                    <Send size={18} /> Send Code & Link to School Email
                  </>
                )}
              </Button>
            ) : (
              <div className="p-4 bg-green-50 border border-green-200 rounded text-center">
                <CheckCircle2 className="text-green-600 mx-auto mb-2" size={32} />
                <p className="font-bold text-green-900">Successfully Sent!</p>
                <p className="text-sm text-green-700 mt-1">
                  Registration link sent to <strong>{schoolEmail}</strong>
                </p>
                <p className="text-xs text-green-600 mt-2">
                  The school will receive an email with the code and link to set up their account.
                </p>
              </div>
            )}

            {/* What happens next */}
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-sm font-medium text-yellow-900 mb-2">What happens next:</p>
              <ol className="text-xs text-yellow-800 space-y-1 list-decimal list-inside">
                <li>School receives email with code and registration link</li>
                <li>School clicks link and sees EduTrack onboarding page</li>
                <li>School sets username (school name) and password</li>
                <li>School uploads logo, motto, and vision</li>
                <li>School gets access to their admin dashboard</li>
              </ol>
            </div>

            <Button onClick={handleCloseRegistration} variant="outline" className="w-full">
              Done - Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
