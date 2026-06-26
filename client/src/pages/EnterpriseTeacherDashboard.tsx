import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { demoStudents, demoSubjects, demoClasses, demoAOIMarks, demoExamMarks } from "@/lib/enterpriseData";
import {
  BookOpen,
  Users,
  TrendingUp,
  Plus,
  Download,
  Search,
  LogOut,
  Lock,
  Wifi,
  FileText,
  Eye,
} from "lucide-react";
import { toast } from "sonner";

export default function EnterpriseTeacherDashboard() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState("class-1");
  const [selectedSubject, setSelectedSubject] = useState("subj-8");
  const [showMarksModal, setShowMarksModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  const teacherSubjects = demoSubjects.filter((s) => ["subj-8", "subj-9", "subj-10"].includes(s.id));
  const teacherClasses = demoClasses.filter((c) => ["class-1", "class-2", "class-3"].includes(c.id));

  const filteredStudents = demoStudents.filter(
    (s) =>
      (s.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.studentId.includes(searchQuery)) &&
      teacherClasses.some((c) => c.id === s.classId)
  );

  const handleLogout = () => {
    localStorage.removeItem("demoUser");
    setLocation("/enterprise-login");
  };

  const handleRecordMarks = () => {
    toast.success("Marks recorded successfully!");
    setShowMarksModal(false);
  };

  const handleDownloadMarks = () => {
    toast.success("Marks exported as CSV");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Teacher Dashboard</h1>
              <p className="text-sm text-gray-600">Peter Kipchoge • Mathematics & Physics</p>
            </div>
            <Button onClick={handleLogout} variant="outline" size="sm" className="gap-2">
              <LogOut size={18} />
              Logout
            </Button>
          </div>

          {/* LAN Security Status */}
          <div className="p-3 bg-green-50 border border-green-200 rounded flex items-center gap-2">
            <Wifi className="text-green-600" size={18} />
            <span className="text-sm text-green-900">
              <strong>✓ LAN Connected:</strong> 192.168.1.45 • NIS-STAFF-NETWORK • Secure
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* KPI Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">My Subjects</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{teacherSubjects.length}</p>
              </div>
              <BookOpen className="text-blue-600" size={32} />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">My Classes</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{teacherClasses.length}</p>
              </div>
              <Users className="text-green-600" size={32} />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Students</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{filteredStudents.length}</p>
              </div>
              <TrendingUp className="text-purple-600" size={32} />
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="marks" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="marks">Record Marks</TabsTrigger>
            <TabsTrigger value="aoi">AOI & Project Work</TabsTrigger>
            <TabsTrigger value="students">My Students</TabsTrigger>
            <TabsTrigger value="syllabus">Syllabus</TabsTrigger>
          </TabsList>

          {/* Record Marks Tab */}
          <TabsContent value="marks">
            <Card className="p-6">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <label className="text-sm font-medium">Select Subject</label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 mt-2"
                  >
                    {teacherSubjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium">Select Class</label>
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 mt-2"
                  >
                    {teacherClasses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium">Select Term</label>
                  <select className="w-full border border-gray-300 rounded px-3 py-2 mt-2">
                    <option>Term 1</option>
                    <option>Term 2</option>
                    <option>Term 3</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Student ID</TableHead>
                      <TableHead>Integration Mark (0-40)</TableHead>
                      <TableHead>Exam Mark (0-60)</TableHead>
                      <TableHead>Total Mark</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => {
                      const examMark = demoExamMarks.find((e) => e.studentId === student.id);
                      return (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">
                            {student.firstName} {student.lastName}
                          </TableCell>
                          <TableCell className="font-mono text-xs">{student.studentId}</TableCell>
                          <TableCell>
                            <Input type="number" min="0" max="40" defaultValue={examMark?.integrationMark || 0} className="w-20" />
                          </TableCell>
                          <TableCell>
                            <Input type="number" min="0" max="60" defaultValue={examMark?.examMark || 0} className="w-20" />
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-blue-600">{(examMark?.integrationMark || 0) + (examMark?.examMark || 0)}</Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedStudent(student);
                                setShowMarksModal(true);
                              }}
                            >
                              Save
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-6 flex gap-2">
                <Button onClick={handleRecordMarks} className="gap-2">
                  <Plus size={18} /> Save All Marks
                </Button>
                <Button onClick={handleDownloadMarks} variant="outline" className="gap-2">
                  <Download size={18} /> Export Marks
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* AOI & Project Work Tab */}
          <TabsContent value="aoi">
            <Card className="p-6">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <label className="text-sm font-medium">Select Subject</label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 mt-2"
                  >
                    {teacherSubjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium">Select Term</label>
                  <select className="w-full border border-gray-300 rounded px-3 py-2 mt-2">
                    <option>Term 1</option>
                    <option>Term 2</option>
                    <option>Term 3</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student Name</TableHead>
                      <TableHead>AOI Mark (1.0-3.0)</TableHead>
                      <TableHead>Project Work (1.0-3.0)</TableHead>
                      <TableHead>Total AOI</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => {
                      const aoiMark = demoAOIMarks.find((a) => a.studentId === student.id);
                      return (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">
                            {student.firstName} {student.lastName}
                          </TableCell>
                          <TableCell>
                            <Input type="number" min="1.0" max="3.0" step="0.1" defaultValue={aoiMark?.aoiMark || 1.0} className="w-24" />
                          </TableCell>
                          <TableCell>
                            <Input type="number" min="1.0" max="3.0" step="0.1" defaultValue={aoiMark?.projectWorkMark || 1.0} className="w-24" />
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-green-600">{(aoiMark?.totalAOI || 2.0).toFixed(1)}</Badge>
                          </TableCell>
                          <TableCell>
                            <Button size="sm" onClick={() => toast.success(`AOI marks saved for ${student.firstName}`)}>
                              Save
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
                <p className="text-sm text-blue-900">
                  <strong>📌 Note:</strong> AOI marks (1.0-3.0) and Project Work marks (1.0-3.0) together make up 20% of the final mark. Exam marks make up 80%.
                </p>
              </div>
            </Card>
          </TabsContent>

          {/* My Students Tab */}
          <TabsContent value="students">
            <Card className="p-6">
              <div className="flex gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                  <Input
                    placeholder="Search by name or student ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
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
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1"
                            onClick={() => toast.success(`Viewing ${student.firstName}'s profile`)}
                          >
                            <Eye size={14} /> View
                          </Button>
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
              <h3 className="text-lg font-bold mb-4">Term Syllabus & Topics</h3>
              <div className="space-y-4">
                {teacherSubjects.map((subject) => (
                  <div key={subject.id} className="p-4 border border-gray-200 rounded">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-bold">{subject.name}</p>
                        <p className="text-sm text-gray-600">{subject.level}</p>
                      </div>
                      <Button size="sm" variant="outline" className="gap-1">
                        <FileText size={14} /> Download Syllabus
                      </Button>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-700">
                        <strong>Topics covered this term:</strong>
                      </p>
                      <ul className="list-disc list-inside text-gray-600 space-y-1">
                        <li>Topic 1: Introduction & Fundamentals</li>
                        <li>Topic 2: Core Concepts & Applications</li>
                        <li>Topic 3: Advanced Techniques</li>
                        <li>Topic 4: Problem Solving & Analysis</li>
                        <li>Topic 5: Revision & Assessment</li>
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Marks Modal */}
      <Dialog open={showMarksModal} onOpenChange={setShowMarksModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Marks for {selectedStudent?.firstName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded">
              <p className="text-sm text-blue-900">
                <strong>Integration Mark:</strong> 0-40 (20% of exam)
              </p>
              <p className="text-sm text-blue-900 mt-1">
                <strong>Exam Mark:</strong> 0-60 (80% of exam)
              </p>
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={handleRecordMarks} className="flex-1">
                Save Marks
              </Button>
              <Button onClick={() => setShowMarksModal(false)} variant="outline" className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
