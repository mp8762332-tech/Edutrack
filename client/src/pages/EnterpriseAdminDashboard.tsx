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
import { useAuth } from "@/_core/hooks/useAuth";
import {
  Users,
  BookOpen,
  TrendingUp,
  Plus,
  Download,
  Search,
  LogOut,
  Settings,
  FileText,
  Award,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

export default function EnterpriseAdminDashboard() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [generatingReports, setGeneratingReports] = useState(false);

  // Fetch school data
  const { data: school, isLoading: isLoadingSchool } = trpc.schools.getById.useQuery(
    { id: user?.schoolId || 0 },
    { enabled: !!user?.schoolId }
  );

  // Fetch students (will filter by class in UI)
  const { data: students = [], isLoading: isLoadingStudents } = trpc.students.list.useQuery(
    { classId: selectedClass || 0 },
    { enabled: !!selectedClass }
  );

  // Mock classes for now - will be replaced with real data
  const classes = [
    { id: 1, name: "Class 1" },
    { id: 2, name: "Class 2" },
    { id: 3, name: "Class 3" },
  ];

  // Create report cards mutation
  const generateReportsMutation = trpc.reportCards.generateClass.useMutation({
    onSuccess: () => {
      toast.success("Report cards generated successfully!");
      setGeneratingReports(false);
    },
    onError: (error: any) => {
      toast.error(`Failed to generate reports: ${error?.message || 'Unknown error'}`);
      setGeneratingReports(false);
    },
  });

  const filteredStudents = students.filter(
    (s: any) =>
      s.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.admissionNumber.includes(searchQuery)
  );

  const handleLogout = () => {
    setLocation("/");
  };

  const handleGenerateReports = async () => {
    if (!selectedClass) {
      toast.error("Please select a class first");
      return;
    }
    setGeneratingReports(true);
    await generateReportsMutation.mutateAsync({
      classId: selectedClass,
      examTypeId: 1, // Default to first exam type
    });
  };

  const handleDownloadCSV = (type: string) => {
    toast.success(`${type} data exported as CSV`);
  };

  const isLoading = isLoadingSchool || isLoadingStudents;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="text-purple-600" size={28} />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">School Admin</h1>
              {school && <p className="text-sm text-gray-600">{school.name}</p>}
            </div>
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
        {isLoading ? (
          <div className="text-center py-12">
            <Loader2 className="animate-spin mx-auto mb-4" size={32} />
            <p>Loading dashboard...</p>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Classes</p>
                    <p className="text-3xl font-bold">{classes.length}</p>
                  </div>
                  <BookOpen className="text-purple-600" size={32} />
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Students</p>
                    <p className="text-3xl font-bold">{students.length}</p>
                  </div>
                  <Users className="text-blue-600" size={32} />
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">School Type</p>
                    <p className="text-xl font-bold capitalize">{school?.type}</p>
                  </div>
                  <Award className="text-orange-600" size={32} />
                </div>
              </Card>
            </div>

            {/* Main Content */}
            <Tabs defaultValue="students" className="space-y-4">
              <TabsList>
                <TabsTrigger value="students">Students</TabsTrigger>
                <TabsTrigger value="reports">Report Cards</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              {/* Students Tab */}
              <TabsContent value="students">
                <Card>
                  <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-xl font-bold">Student Management</h2>
                    <Button className="bg-purple-600 hover:bg-purple-700">
                      <Plus size={18} className="mr-2" />
                      Add Student
                    </Button>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="flex gap-4">
                      <select
                        value={selectedClass || ""}
                        onChange={(e) => setSelectedClass(e.target.value ? parseInt(e.target.value) : null)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="">Select a class...</option>
                        {classes.map((cls: any) => (
                          <option key={cls.id} value={cls.id}>
                            {cls.name}
                          </option>
                        ))}
                      </select>
                      <Input
                        placeholder="Search students..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1"
                      />
                    </div>

                    {filteredStudents.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Users size={32} className="mx-auto mb-2 opacity-50" />
                        <p>No students found</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead>Admission #</TableHead>
                              <TableHead>Gender</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredStudents.map((student) => (
                              <TableRow key={student.id}>
                                <TableCell className="font-medium">{student.admissionNumber}</TableCell>
                                <TableCell>{student.admissionNumber}</TableCell>
                                <TableCell className="capitalize">{student.gender || "N/A"}</TableCell>
                                <TableCell>
                                  <Button size="sm" variant="ghost">
                                    View
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </div>
                </Card>
              </TabsContent>

              {/* Report Cards Tab */}
              <TabsContent value="reports">
                <Card>
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold mb-4">Report Card Generation</h2>
                    <div className="flex gap-4">
                      <select
                        value={selectedClass || ""}
                        onChange={(e) => setSelectedClass(e.target.value ? parseInt(e.target.value) : null)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="">Select a class...</option>
                        {classes.map((cls) => (
                          <option key={cls.id} value={cls.id}>
                            {cls.name}
                          </option>
                        ))}
                      </select>
                      <Button
                        onClick={handleGenerateReports}
                        disabled={generatingReports || !selectedClass}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        {generatingReports ? (
                          <>
                            <Loader2 className="animate-spin mr-2" size={18} />
                            Generating...
                          </>
                        ) : (
                          <>
                            <FileText size={18} className="mr-2" />
                            Generate Reports
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-900">
                        Select a class and click "Generate Reports" to create report cards for all students in that class.
                      </p>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings">
                <Card className="p-6">
                  <h2 className="text-xl font-bold mb-4">School Settings</h2>
                  {school && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">School Name</label>
                        <Input value={school.name} disabled />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">School Type</label>
                        <Input value={school.type} disabled />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Principal Name</label>
                        <Input value={school.principalName || "N/A"} disabled />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Motto</label>
                        <Input value={school.motto || "N/A"} disabled />
                      </div>
                    </div>
                  )}
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </main>
    </div>
  );
}
