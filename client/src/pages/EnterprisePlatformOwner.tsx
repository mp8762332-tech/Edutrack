import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
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
  Loader2,
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
  const [schoolType, setSchoolType] = useState<"primary" | "secondary">("secondary");
  const [isGenerating, setIsGenerating] = useState(false);

  // Fetch schools
  const { data: schools = [], isLoading: isLoadingSchools } = trpc.schools.list.useQuery();
  
  // Generate unique 6-digit school code
  const generateSchoolCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  // Create school mutation
  const createSchoolMutation = trpc.schools.register.useMutation({
    onSuccess: (result: any) => {
      toast.success(`School registered with code: ${result.code}`);
      setShowAddSchool(false);
      setSchoolName("");
      setSchoolEmail("");
      setShowCodeGenerated(true);
      setGeneratedCode(result.code);
      setGeneratedLink(`${window.location.origin}/school-onboarding/${result.code}`);
    },
    onError: (error: any) => {
      toast.error(`Failed to register school: ${error?.message || 'Unknown error'}`);
    },
  });

  const filteredSchools = schools.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.includes(searchQuery)
  );

  const handleLogout = () => {
    setLocation("/");
  };

  const handleGenerateCode = async () => {
    if (!schoolName) {
      toast.error("Please fill in school name first");
      return;
    }
    
    setIsGenerating(true);
    try {
      const code = generateSchoolCode();
      await createSchoolMutation.mutateAsync({
        name: schoolName,
        code: code,
        type: schoolType,
        principalPhone: "",
        district: "",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    toast.success("Code copied to clipboard");
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    toast.success("Link copied to clipboard");
  };

  const handleSendToSchool = async () => {
    try {
      const subject = `EduTrack School Registration Code: ${generatedCode}`;
      const body = `
Dear ${schoolName} Administrator,

Your school registration code is: ${generatedCode}

Click here to complete registration: ${generatedLink}

This code expires in 30 days.

Best regards,
EduTrack Team
      `.trim();

      // Open email client
      window.location.href = `mailto:${schoolEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      toast.success("Email client opened. Please send the email.");
    } catch (error) {
      toast.error("Failed to open email client");
    }
  };

  // Calculate stats
  const totalSchools = schools.length;
  const activeSchools = schools.filter(s => s.isActive).length;
  const totalStudents = 0; // Will be calculated from classes/students table
  const totalTeachers = 0; // Will be calculated from teachers table

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Building2 className="text-purple-600" size={28} />
            <h1 className="text-2xl font-bold text-gray-900">EduTrack Platform</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut size={18} className="mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Schools</p>
                <p className="text-3xl font-bold">{totalSchools}</p>
              </div>
              <Building2 className="text-purple-600" size={32} />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active Schools</p>
                <p className="text-3xl font-bold">{activeSchools}</p>
              </div>
              <CheckCircle2 className="text-green-600" size={32} />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Students</p>
                <p className="text-3xl font-bold">{totalStudents.toLocaleString()}</p>
              </div>
              <Users className="text-blue-600" size={32} />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Teachers</p>
                <p className="text-3xl font-bold">{totalTeachers.toLocaleString()}</p>
              </div>
              <Users className="text-orange-600" size={32} />
            </div>
          </Card>
        </div>

        {/* Schools Management */}
        <Card className="mb-8">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-bold">Registered Schools</h2>
            <Button onClick={() => setShowAddSchool(true)} className="bg-purple-600 hover:bg-purple-700">
              <Plus size={18} className="mr-2" />
              Register School
            </Button>
          </div>

          <div className="p-6">
            <div className="mb-4">
              <Input
                placeholder="Search by school name or code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {isLoadingSchools ? (
              <div className="text-center py-8">
                <Loader2 className="animate-spin mx-auto mb-2" />
                <p>Loading schools...</p>
              </div>
            ) : filteredSchools.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Building2 size={32} className="mx-auto mb-2 opacity-50" />
                <p>No schools registered yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>School Name</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Students</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSchools.map((school) => (
                      <TableRow key={school.id}>
                        <TableCell className="font-medium">{school.name}</TableCell>
                        <TableCell className="font-mono">{school.code}</TableCell>
                        <TableCell className="capitalize">{school.type}</TableCell>
                        <TableCell>
                          <Badge variant={school.isActive ? "default" : "secondary"}>
                            {school.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>0</TableCell>
                        <TableCell>{new Date(school.createdAt).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </Card>
      </main>

      {/* Add School Dialog */}
      <Dialog open={showAddSchool} onOpenChange={setShowAddSchool}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Register New School</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">School Name</label>
              <Input
                placeholder="e.g., Gideon High School"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">School Type</label>
              <select
                value={schoolType}
                onChange={(e) => setSchoolType(e.target.value as "primary" | "secondary")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="primary">Primary School</option>
                <option value="secondary">Secondary School</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Principal Email</label>
              <Input
                type="email"
                placeholder="principal@school.com"
                value={schoolEmail}
                onChange={(e) => setSchoolEmail(e.target.value)}
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowAddSchool(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleGenerateCode}
                disabled={isGenerating || createSchoolMutation.isPending}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={18} />
                    Registering...
                  </>
                ) : (
                  "Register School"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Code Generated Dialog */}
      <Dialog open={showCodeGenerated} onOpenChange={setShowCodeGenerated}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>School Registration Code Generated</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-2">Registration Code:</p>
              <div className="flex items-center gap-2">
                <code className="text-2xl font-mono font-bold text-green-600">{generatedCode}</code>
                <Button size="sm" variant="ghost" onClick={handleCopyCode}>
                  <Copy size={18} />
                </Button>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-2">Registration Link:</p>
              <div className="flex items-center gap-2 break-all">
                <code className="text-xs font-mono text-blue-600">{generatedLink}</code>
                <Button size="sm" variant="ghost" onClick={handleCopyLink}>
                  <Copy size={18} />
                </Button>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm font-medium text-amber-900 mb-2">⏰ Code expires in 30 days</p>
              <p className="text-xs text-amber-800">
                Send this code to the school administrator. They will use it to complete registration.
              </p>
            </div>

            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowCodeGenerated(false)}>
                Done
              </Button>
              <Button onClick={handleSendToSchool} className="bg-purple-600 hover:bg-purple-700">
                <Send size={18} className="mr-2" />
                Send via Email
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
