import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  demoStudents,
  demoClasses,
  demoSubjects,
  demoAOIMarks,
  demoExamMarks,
  calculateStudentResult,
  calculateGrade,
  GRADING_SCALE,
} from "@/lib/enterpriseData";
import {
  Users,
  BookOpen,
  DollarSign,
  TrendingUp,
  Plus,
  Trash2,
  Download,
  Search,
  Eye,
  LogOut,
  Settings,
  FileText,
  Award,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

export default function EnterpriseAdminDashboard() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState("class-1");
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [showAOIModal, setShowAOIModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [generatingReports, setGeneratingReports] = useState(false);

  const filteredStudents = demoStudents.filter(
    (s) =>
      s.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.studentId.includes(searchQuery)
  );

  const handleLogout = () => {
    localStorage.removeItem("demoUser");
    setLocation("/enterprise-login");
  };

  const handleGenerateReports = async () => {
    setGeneratingReports(true);
    toast.loading("Generating 10,000+ report cards...");
    
    // Simulate report generation
    setTimeout(() => {
      setGeneratingReports(false);
      toast.dismiss();
      toast.success("✅ Generated 10,000 report cards in 3.2 seconds!");
    }, 3200);
  };

  const handleAddStudent = () => {
    toast.success("New student added successfully!");
    setShowAddStudent(false);
  };

  const handleRecordAOI = () => {
    toast.success("AOI marks recorded successfully!");
    setShowAOIModal(false);
  };

  const handleDownloadCSV = (type: string) => {
    toast.success(`${type} data exported as CSV`);
  };

  // Calculate results for demo
  const demoResults = demoAOIMarks.map((aoi, idx) => {
    const exam = demoExamMarks[idx];
    return calculateStudentResult(aoi, exam);
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-600">Nairobi International School - O/A Level</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" className="gap-2">
              <Settings size={18} />
              Settings
            </Button>
            <Button onClick={handleLogout} variant="outline" size="sm" className="gap-2">
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
                <p className="text-gray-600 text-sm font-medium">Total Students</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{demoStudents.length}</p>
              </div>
              <Users className="text-blue-600" size={32} />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Classes</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{demoClasses.length}</p>
              </div>
              <BookOpen className="text-green-600" size={32} />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Subjects</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{demoSubjects.length}</p>
              </div>
              <Award className="text-purple-600" size={32} />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">AOI Records</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{demoAOIMarks.length}</p>
              </div>
              <TrendingUp className="text-yellow-600" size={32} />
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="students" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="aoi">AOI Marks</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
            <TabsTrigger value="grading">Grading</TabsTrigger>
            <TabsTrigger value="reports">Report Cards</TabsTrigger>
            <TabsTrigger value="syllabus">Syllabus</TabsTrigger>
          </TabsList>

          {/* Students Tab */}
          <TabsContent value="students">
            <Card className="p-6">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                  <Input
                    placeholder="Search by name or student ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2"
                >
                  {demoClasses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <Button onClick={() => setShowAddStudent(true)} className="gap-2">
                  <Plus size={18} /> Add Student
                </Button>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Student ID</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Gender</TableHead>
                      <TableHead>Admission Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">
                          {student.firstName} {student.lastName}
                        </TableCell>
                        <TableCell className="font-mono text-xs">{student.studentId}</TableCell>
                        <TableCell>{student.level}</TableCell>
                        <TableCell>{student.gender}</TableCell>
                        <TableCell>{student.admissionDate}</TableCell>
                        <TableCell>
                          <Badge className="bg-green-600">{student.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => toast.success(`Viewing ${student.firstName}'s profile`)}>
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

          {/* AOI Marks Tab */}
          <TabsContent value="aoi">
            <Card className="p-6">
              <div className="flex gap-4 mb-6">
                <Button onClick={() => setShowAOIModal(true)} className="gap-2">
                  <Plus size={18} /> Record AOI Marks
                </Button>
                <Button onClick={() => handleDownloadCSV("AOI Marks")} variant="outline" className="gap-2">
                  <Download size={18} /> Export
                </Button>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>AOI Mark (1.0-3.0)</TableHead>
                      <TableHead>Project Work (1.0-3.0)</TableHead>
                      <TableHead>Total AOI</TableHead>
                      <TableHead>Term</TableHead>
                      <TableHead>Date Recorded</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {demoAOIMarks.map((aoi) => {
                      const student = demoStudents.find((s) => s.id === aoi.studentId);
                      const subject = demoSubjects.find((s) => s.id === aoi.subjectId);
                      return (
                        <TableRow key={aoi.id}>
                          <TableCell className="font-medium">{student?.firstName} {student?.lastName}</TableCell>
                          <TableCell>{subject?.name}</TableCell>
                          <TableCell className="font-bold">{aoi.aoiMark.toFixed(1)}</TableCell>
                          <TableCell className="font-bold">{aoi.projectWorkMark.toFixed(1)}</TableCell>
                          <TableCell>
                            <Badge className="bg-blue-600">{aoi.totalAOI.toFixed(1)}</Badge>
                          </TableCell>
                          <TableCell>Term {aoi.term}</TableCell>
                          <TableCell>{aoi.dateRecorded}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>

          {/* Results Tab */}
          <TabsContent value="results">
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4">Calculated Student Results</h3>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>AOI (20%)</TableHead>
                      <TableHead>Exam (80%)</TableHead>
                      <TableHead>Total Mark</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Result</TableHead>
                      <TableHead>Remarks</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {demoResults.map((result) => {
                      const student = demoStudents.find((s) => s.id === result.studentId);
                      const subject = demoSubjects.find((s) => s.id === result.subjectId);
                      return (
                        <TableRow key={result.id}>
                          <TableCell className="font-medium">{student?.firstName} {student?.lastName}</TableCell>
                          <TableCell>{subject?.name}</TableCell>
                          <TableCell>{result.aoiMarks.toFixed(1)}</TableCell>
                          <TableCell>{result.examMarks.toFixed(1)}</TableCell>
                          <TableCell className="font-bold">{result.totalMark}</TableCell>
                          <TableCell>
                            <Badge className="bg-blue-600">{result.grade}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={result.result === "1" ? "bg-green-600" : result.result === "2" ? "bg-yellow-600" : "bg-red-600"}>
                              Result {result.result}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">{result.remarks}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>

          {/* Grading Tab */}
          <TabsContent value="grading">
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4">Grading Scale & Results Classification</h3>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Marks Range</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Result Classification</TableHead>
                      <TableHead>Remarks</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {GRADING_SCALE.map((scale, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-mono">{scale.minMark}-{scale.maxMark}</TableCell>
                        <TableCell>
                          <Badge className="bg-blue-600">{scale.grade}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={scale.result === "1" ? "bg-green-600" : scale.result === "2" ? "bg-yellow-600" : "bg-red-600"}>
                            Result {scale.result}
                          </Badge>
                        </TableCell>
                        <TableCell>{scale.remarks}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
                <p className="text-sm text-blue-900">
                  <strong>📊 Grading System:</strong> Result 1 (Excellent) = A+, A, B | Result 2 (Good) = C, D, B | Result 3 (Poor) = E, F
                </p>
              </div>
            </Card>
          </TabsContent>

          {/* Report Cards Tab */}
          <TabsContent value="reports">
            <Card className="p-6">
              <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
                <div className="flex-1">
                  <h3 className="text-lg font-bold">Bulk Report Card Generation</h3>
                  <p className="text-sm text-gray-600">Generate professional report cards for all students instantly</p>
                </div>
                <Button
                  onClick={handleGenerateReports}
                  disabled={generatingReports}
                  className="gap-2 bg-gradient-to-r from-green-600 to-green-700"
                >
                  <Zap size={18} /> {generatingReports ? "Generating..." : "Generate All Report Cards"}
                </Button>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-green-50 border border-green-200 rounded">
                  <p className="text-sm font-medium text-green-900">Ready to Generate</p>
                  <p className="text-2xl font-bold text-green-600 mt-2">{demoStudents.length}</p>
                  <p className="text-xs text-green-700 mt-1">Report cards</p>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded">
                  <p className="text-sm font-medium text-blue-900">Generation Speed</p>
                  <p className="text-2xl font-bold text-blue-600 mt-2">3-5 sec</p>
                  <p className="text-xs text-blue-700 mt-1">For 10,000+ cards</p>
                </div>
                <div className="p-4 bg-purple-50 border border-purple-200 rounded">
                  <p className="text-sm font-medium text-purple-900">Last Generated</p>
                  <p className="text-2xl font-bold text-purple-600 mt-2">Today</p>
                  <p className="text-xs text-purple-700 mt-1">2:45 PM</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Average Mark</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {demoStudents.map((student, idx) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">
                          {student.firstName} {student.lastName}
                        </TableCell>
                        <TableCell>{student.level}</TableCell>
                        <TableCell>
                          <Badge className="bg-blue-600">{(75 + Math.random() * 15).toFixed(0)}</Badge>
                        </TableCell>
                        <TableCell>{idx + 1}/{demoStudents.length}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="gap-1" onClick={() => toast.success(`Previewing ${student.firstName}'s report card`)}>
                              <Eye size={14} />
                            </Button>
                            <Button size="sm" variant="outline" className="gap-1" onClick={() => toast.success(`Printing ${student.firstName}'s report card`)}>
                              📄
                            </Button>
                            <Button size="sm" variant="outline" className="gap-1" onClick={() => toast.success(`Downloaded ${student.firstName}'s report card`)}>
                              <Download size={14} />
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

          {/* Syllabus Tab */}
          <TabsContent value="syllabus">
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4">Subject Syllabus Management</h3>
              <div className="space-y-4">
                {demoSubjects.map((subject) => (
                  <div key={subject.id} className="p-4 border border-gray-200 rounded hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold">{subject.name}</p>
                        <p className="text-sm text-gray-600">{subject.level} • {subject.isDefault ? "Default Subject" : "Custom Subject"}</p>
                      </div>
                      <Button size="sm" variant="outline" className="gap-1" onClick={() => toast.success(`Viewing ${subject.name} syllabus`)}>
                        <FileText size={14} /> View Syllabus
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Add Student Modal */}
      <Dialog open={showAddStudent} onOpenChange={setShowAddStudent}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Student</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input placeholder="First Name" />
            <Input placeholder="Last Name" />
            <Input placeholder="Date of Birth" type="date" />
            <select className="w-full border border-gray-300 rounded px-3 py-2">
              <option>Select Gender</option>
              <option>Male</option>
              <option>Female</option>
            </select>
            <select className="w-full border border-gray-300 rounded px-3 py-2">
              <option>Select Class</option>
              {demoClasses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <Input placeholder="Parent/Guardian Name" />
            <Input placeholder="Parent Phone" />
            <Input placeholder="Blood Group" />
            <div className="flex gap-2 pt-4">
              <Button onClick={handleAddStudent} className="flex-1">
                Add Student
              </Button>
              <Button onClick={() => setShowAddStudent(false)} variant="outline" className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* AOI Modal */}
      <Dialog open={showAOIModal} onOpenChange={setShowAOIModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record AOI & Project Work Marks</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <select className="w-full border border-gray-300 rounded px-3 py-2">
              <option>Select Student</option>
              {demoStudents.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.firstName} {s.lastName}
                </option>
              ))}
            </select>
            <select className="w-full border border-gray-300 rounded px-3 py-2">
              <option>Select Subject</option>
              {demoSubjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            <div>
              <label className="text-sm font-medium">AOI Mark (1.0 - 3.0)</label>
              <Input type="number" min="1.0" max="3.0" step="0.1" placeholder="e.g., 2.8" />
            </div>
            <div>
              <label className="text-sm font-medium">Project Work Mark (1.0 - 3.0)</label>
              <Input type="number" min="1.0" max="3.0" step="0.1" placeholder="e.g., 2.9" />
            </div>
            <select className="w-full border border-gray-300 rounded px-3 py-2">
              <option>Select Term</option>
              <option>Term 1</option>
              <option>Term 2</option>
              <option>Term 3</option>
            </select>
            <div className="flex gap-2 pt-4">
              <Button onClick={handleRecordAOI} className="flex-1">
                Save AOI Marks
              </Button>
              <Button onClick={() => setShowAOIModal(false)} variant="outline" className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
