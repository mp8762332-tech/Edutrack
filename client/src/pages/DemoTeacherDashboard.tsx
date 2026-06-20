import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { demoStudents, demoMarks, demoTeachers } from "@/lib/demoData";
import { Search, Plus, LogOut, Settings, Download, BookOpen } from "lucide-react";
import { toast } from "sonner";

export default function DemoTeacherDashboard() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddMarks, setShowAddMarks] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [marks, setMarks] = useState(demoMarks);

  const teacher = demoTeachers[0]; // Mr. Peter Kipchoge
  const assignedClasses = teacher.classes;
  const assignedSubjects = teacher.subjects;

  // Filter students by assigned classes
  const filteredStudents = demoStudents.filter((s) =>
    assignedClasses.includes(s.currentClass) &&
    (s.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.lastName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleLogout = () => {
    localStorage.removeItem("demoUser");
    setLocation("/demo-login");
  };

  const handleAddMarks = () => {
    toast.success("Marks recorded successfully!");
    setShowAddMarks(false);
  };

  const handleDownloadMarks = () => {
    toast.success("Marks exported as CSV");
  };

  const getStudentMarks = (studentId: number) => {
    return marks.filter((m) => m.studentId === studentId && assignedSubjects.includes(m.subject));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Teacher Dashboard</h1>
            <p className="text-sm text-gray-600">
              {teacher.firstName} {teacher.lastName}
            </p>
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
        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Classes Teaching</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{assignedClasses.length}</p>
              </div>
              <BookOpen className="text-blue-600" size={32} />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Subjects</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{assignedSubjects.length}</p>
              </div>
              <BookOpen className="text-green-600" size={32} />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Students</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{filteredStudents.length}</p>
              </div>
              <BookOpen className="text-purple-600" size={32} />
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="students" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="students">My Students</TabsTrigger>
            <TabsTrigger value="marks">Marks</TabsTrigger>
          </TabsList>

          {/* Students Tab */}
          <TabsContent value="students">
            <Card className="p-6">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                  <Input
                    placeholder="Search students..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button onClick={() => setShowAddMarks(true)} className="gap-2">
                  <Plus size={18} /> Add Marks
                </Button>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Marks Recorded</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => {
                      const studentMarks = getStudentMarks(student.id);
                      return (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">
                            {student.firstName} {student.lastName}
                          </TableCell>
                          <TableCell>{student.currentClass}</TableCell>
                          <TableCell className="text-sm">{student.email}</TableCell>
                          <TableCell>
                            <Badge variant={studentMarks.length > 0 ? "default" : "secondary"}>
                              {studentMarks.length} subjects
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedStudent(student);
                                setShowAddMarks(true);
                              }}
                            >
                              Add Marks
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>

          {/* Marks Tab */}
          <TabsContent value="marks">
            <Card className="p-6">
              <div className="flex gap-4 mb-6">
                <Button onClick={handleDownloadMarks} variant="outline" className="gap-2">
                  <Download size={18} /> Export Marks
                </Button>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Exam</TableHead>
                      <TableHead>Remarks</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {marks
                      .filter((m) => assignedSubjects.includes(m.subject))
                      .map((mark) => (
                        <TableRow key={mark.id}>
                          <TableCell className="font-medium">{mark.studentName}</TableCell>
                          <TableCell>{mark.subject}</TableCell>
                          <TableCell className="font-bold">{mark.score}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                mark.grade === "A" || mark.grade === "A+"
                                  ? "default"
                                  : mark.grade === "B" || mark.grade === "B+"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {mark.grade}
                            </Badge>
                          </TableCell>
                          <TableCell>{mark.exam}</TableCell>
                          <TableCell className="text-sm">{mark.remarks}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Add Marks Modal */}
      <Dialog open={showAddMarks} onOpenChange={setShowAddMarks}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Student Marks</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedStudent && (
              <div className="p-3 bg-blue-50 rounded">
                <p className="text-sm text-gray-600">Student</p>
                <p className="font-bold">
                  {selectedStudent.firstName} {selectedStudent.lastName}
                </p>
                <p className="text-xs text-gray-500 mt-1">{selectedStudent.currentClass}</p>
              </div>
            )}

            <select className="w-full border border-gray-300 rounded px-3 py-2">
              <option>Select Subject</option>
              {assignedSubjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>

            <select className="w-full border border-gray-300 rounded px-3 py-2">
              <option>Select Exam</option>
              <option>Term 1 2024</option>
              <option>Term 2 2024</option>
              <option>Term 3 2024</option>
            </select>

            <Input placeholder="Score (0-100)" type="number" min="0" max="100" />

            <select className="w-full border border-gray-300 rounded px-3 py-2">
              <option>Select Grade</option>
              <option>A+</option>
              <option>A</option>
              <option>B+</option>
              <option>B</option>
              <option>C+</option>
              <option>C</option>
              <option>D+</option>
              <option>D</option>
              <option>E</option>
            </select>

            <Input placeholder="Remarks (optional)" />

            <div className="flex gap-2 pt-4">
              <Button onClick={handleAddMarks} className="flex-1">
                Save Marks
              </Button>
              <Button onClick={() => setShowAddMarks(false)} variant="outline" className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
