import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { demoStudents, demoTeachers, calculateSecondaryFinalScore, getSecondaryRemark } from "@/lib/edutrackData";
import { Search, LogOut, BookOpen, Users, Download, Plus } from "lucide-react";
import { toast } from "sonner";

export default function EdutrackTeacher() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState("S3 East");
  const [showMarksEntry, setShowMarksEntry] = useState(false);
  const [teacher] = useState(demoTeachers[0]);
  const [students] = useState(demoStudents);

  // Filter students by teacher's classes
  const teacherStudents = students.filter((s) => teacher.classes.includes(s.class));

  const filteredStudents = teacherStudents.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.paymentRef.includes(searchQuery) ||
      s.class.includes(searchQuery)
  );

  const handleLogout = () => {
    localStorage.removeItem("edutrackUser");
    setLocation("/edutrack-login");
  };

  const handleSaveMarks = () => {
    toast.success("Marks saved successfully!");
    setShowMarksEntry(false);
  };

  const handleDownloadMarks = () => {
    toast.success("Marks CSV downloaded!");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{teacher.name}</h1>
            <p className="text-sm text-gray-600">
              Teaching: {teacher.subjects.join(", ")} | Classes: {teacher.classes.join(", ")}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary">{teacher.subjects.length} Subjects</Badge>
            <Button onClick={handleLogout} variant="outline" size="sm" className="gap-2">
              <LogOut size={18} />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* KPI Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">My Students</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{teacherStudents.length}</p>
              </div>
              <Users className="text-blue-600" size={32} />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">My Subjects</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{teacher.subjects.length}</p>
              </div>
              <BookOpen className="text-green-600" size={32} />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">My Classes</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{teacher.classes.length}</p>
              </div>
              <Users className="text-purple-600" size={32} />
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="students" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="students">My Students</TabsTrigger>
            <TabsTrigger value="marks">Record Marks</TabsTrigger>
          </TabsList>

          {/* Students Tab */}
          <TabsContent value="students">
            <Card className="p-6">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                  <Input
                    placeholder="Search students by name..."
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
                  {teacher.classes.map((cls) => (
                    <option key={cls}>{cls}</option>
                  ))}
                </select>
                <Button onClick={handleDownloadMarks} variant="outline" className="gap-2">
                  <Download size={18} /> Export Marks
                </Button>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Gender</TableHead>
                      <TableHead>Parent</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell>{student.class}</TableCell>
                        <TableCell>{student.gender}</TableCell>
                        <TableCell>{student.parentName}</TableCell>
                        <TableCell>{student.parentPhone}</TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setShowMarksEntry(true)}
                          >
                            Record Marks
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>

          {/* Marks Tab */}
          <TabsContent value="marks">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-bold mb-4">How Marks Are Calculated</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded">
                    <h4 className="font-bold mb-2">Secondary (New Curriculum)</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Enter integration marks (1.0 - 3.0)</li>
                      <li>• Enter exam marks (1.0 - 3.0)</li>
                      <li>• System calculates: (avg integration × 20%) + (exam × 80%)</li>
                      <li>• Grade auto-assigned: Distinction, Merit, Credit, Pass, Developing</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-green-50 border border-green-200 rounded">
                    <h4 className="font-bold mb-2">Primary (Old Curriculum)</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Enter marks (0 - 100)</li>
                      <li>• System assigns grade: D1-D2, C3-C6, P7-P8, F9</li>
                      <li>• Best 8 subjects summed for aggregate</li>
                      <li>• Division auto-calculated: I, II, III, IV, U</li>
                    </ul>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-bold mb-4">Your Subjects</h3>
                <div className="space-y-2">
                  {teacher.subjects.map((subject) => (
                    <div key={subject} className="p-3 bg-gray-50 rounded border">
                      <p className="font-medium">{subject}</p>
                      <p className="text-xs text-gray-600">
                        Teaching in: {teacher.classes.filter((c) => c.includes(subject.charAt(0))).join(", ") || teacher.classes.join(", ")}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Marks Entry Modal */}
      <Dialog open={showMarksEntry} onOpenChange={setShowMarksEntry}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Record Student Marks</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Student</label>
                <select className="w-full border border-gray-300 rounded px-3 py-2">
                  <option>Select Student</option>
                  {filteredStudents.map((s) => (
                    <option key={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Subject</label>
                <select className="w-full border border-gray-300 rounded px-3 py-2">
                  <option>Select Subject</option>
                  {teacher.subjects.map((subj) => (
                    <option key={subj}>{subj}</option>
                  ))}
                </select>
              </div>
            </div>

            <Tabs defaultValue="integration" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="integration">Integration Marks</TabsTrigger>
                <TabsTrigger value="exam">Exam Result</TabsTrigger>
              </TabsList>

              <TabsContent value="integration" className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Integration Mark (1.0 - 3.0 or 0 - 100)</label>
                  <Input type="number" placeholder="Enter mark" min="0" max="100" />
                </div>
                <div className="p-3 bg-blue-50 rounded text-sm">
                  <p className="font-medium">Tip:</p>
                  <p>Enter multiple integration marks throughout the term. The system will average them.</p>
                </div>
              </TabsContent>

              <TabsContent value="exam" className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Exam Mark (1.0 - 3.0 or 0 - 100)</label>
                  <Input type="number" placeholder="Enter exam mark" min="0" max="100" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Session</label>
                  <select className="w-full border border-gray-300 rounded px-3 py-2">
                    <option>End of Term 1 2026</option>
                    <option>End of Term 2 2026</option>
                    <option>End of Term 3 2026</option>
                  </select>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleSaveMarks} className="flex-1">
                Save Marks
              </Button>
              <Button onClick={() => setShowMarksEntry(false)} variant="outline" className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
