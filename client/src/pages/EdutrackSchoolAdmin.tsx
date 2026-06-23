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
  demoTeachers,
  demoSchools,
  calculateSecondaryFinalScore,
  getSecondaryRemark,
  getPrimaryGrade,
} from "@/lib/edutrackData";
import {
  Users,
  BookOpen,
  DollarSign,
  Plus,
  Trash2,
  Download,
  Search,
  Eye,
  LogOut,
  Settings,
  FileText,
  MoreVertical,
} from "lucide-react";
import { toast } from "sonner";

export default function EdutrackSchoolAdmin() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("students");
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [showAddTeacher, setShowAddTeacher] = useState(false);
  const [showMarksEntry, setShowMarksEntry] = useState(false);
  const [students, setStudents] = useState(demoStudents);
  const [teachers, setTeachers] = useState(demoTeachers);
  const [school] = useState(demoSchools[0]);

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.paymentRef.includes(searchQuery) ||
      s.class.includes(searchQuery)
  );

  const handleLogout = () => {
    localStorage.removeItem("edutrackUser");
    setLocation("/edutrack-login");
  };

  const handleAddStudent = () => {
    toast.success("Student added successfully!");
    setShowAddStudent(false);
  };

  const handleAddTeacher = () => {
    toast.success("Teacher added successfully!");
    setShowAddTeacher(false);
  };

  const handleDeleteTeacher = (teacherId: string) => {
    setTeachers(teachers.map((t) => (t.id === teacherId ? { ...t, status: "deleted" } : t)));
    toast.success("Teacher permanently deleted");
  };

  const handleRecordPayment = (studentId: string) => {
    toast.success("Payment recorded successfully!");
  };

  const handleGenerateReports = () => {
    toast.success("Term reports generated!");
  };

  const totalFees = students.reduce((sum, s) => sum + s.totalFees, 0);
  const collectedFees = students.reduce((sum, s) => sum + s.paidAmount, 0);
  const outstandingFees = totalFees - collectedFees;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Yellow Banner - Mark in School Mode */}
      <div className="bg-yellow-400 text-yellow-900 px-4 py-2 text-center font-medium">
        ⚠️ Platform Owner Mode: You are managing {school.name}
      </div>

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-8 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{school.name}</h1>
            <p className="text-sm text-gray-600">{school.currentTerm}</p>
          </div>
          <div className="flex items-center gap-4">
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
                <p className="text-3xl font-bold text-gray-900 mt-2">{students.length}</p>
              </div>
              <Users className="text-blue-600" size={32} />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Expected Fees</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">KES {(totalFees / 1000).toFixed(0)}K</p>
              </div>
              <DollarSign className="text-green-600" size={32} />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Collected</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">KES {(collectedFees / 1000).toFixed(0)}K</p>
              </div>
              <DollarSign className="text-purple-600" size={32} />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Outstanding</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">KES {(outstandingFees / 1000).toFixed(0)}K</p>
              </div>
              <DollarSign className="text-orange-600" size={32} />
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="teachers">Teachers</TabsTrigger>
            <TabsTrigger value="marks">Marks Entry</TabsTrigger>
            <TabsTrigger value="reports">Term Reports</TabsTrigger>
          </TabsList>

          {/* Students Tab */}
          <TabsContent value="students">
            <Card className="p-6">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                  <Input
                    placeholder="Search by name, class, or payment ref..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button onClick={() => setShowAddStudent(true)} className="gap-2">
                  <Plus size={18} /> Add Student
                </Button>
                <Button variant="outline" className="gap-2">
                  <Download size={18} /> CSV Import
                </Button>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Payment Ref</TableHead>
                      <TableHead>Total Fees</TableHead>
                      <TableHead>Paid</TableHead>
                      <TableHead>Balance</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell>{student.class}</TableCell>
                        <TableCell className="font-mono text-sm">{student.paymentRef}</TableCell>
                        <TableCell>KES {student.totalFees.toLocaleString()}</TableCell>
                        <TableCell className="text-green-600 font-medium">KES {student.paidAmount.toLocaleString()}</TableCell>
                        <TableCell className="text-red-600 font-medium">
                          KES {(student.totalFees - student.paidAmount).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRecordPayment(student.id)}
                              title="Record payment"
                            >
                              <DollarSign size={14} />
                            </Button>
                            <Button size="sm" variant="outline" title="View profile">
                              <Eye size={14} />
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

          {/* Teachers Tab */}
          <TabsContent value="teachers">
            <Card className="p-6">
              <div className="flex gap-4 mb-6">
                <Button onClick={() => setShowAddTeacher(true)} className="gap-2">
                  <Plus size={18} /> Add Teacher
                </Button>
              </div>

              <div className="space-y-3">
                {teachers.map((teacher) => (
                  <div
                    key={teacher.id}
                    className={`p-4 border rounded flex items-center justify-between ${
                      teacher.status === "deleted" ? "bg-red-50 border-red-200" : "bg-white"
                    }`}
                  >
                    <div className="flex-1">
                      <p className="font-medium">{teacher.name}</p>
                      <p className="text-sm text-gray-600">{teacher.subjects.join(", ")}</p>
                      <p className="text-xs text-gray-500">Classes: {teacher.classes.join(", ")}</p>
                      {teacher.status === "deleted" && (
                        <Badge variant="destructive" className="mt-2">
                          Permanently Deleted
                        </Badge>
                      )}
                    </div>
                    {teacher.status === "active" && (
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" title="Download marks">
                          <Download size={14} />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600"
                          onClick={() => handleDeleteTeacher(teacher.id)}
                          title="Permanently delete"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Marks Entry Tab */}
          <TabsContent value="marks">
            <Card className="p-6">
              <div className="mb-6">
                <Button onClick={() => setShowMarksEntry(true)} className="gap-2">
                  <BookOpen size={18} /> Record Marks
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded">
                  <h3 className="font-bold mb-2">Secondary School (New Curriculum)</h3>
                  <ul className="text-sm space-y-1 text-gray-700">
                    <li>• Mark Scale: 1.0 to 3.0</li>
                    <li>• Integration: 20% of final score</li>
                    <li>• Exam: 80% of final score</li>
                    <li>• Auto-calculated grades: Distinction, Merit, Credit, Pass, Developing</li>
                  </ul>
                </div>

                <div className="p-4 bg-green-50 border border-green-200 rounded">
                  <h3 className="font-bold mb-2">Primary School (Old Curriculum)</h3>
                  <ul className="text-sm space-y-1 text-gray-700">
                    <li>• Mark Scale: 0 to 100</li>
                    <li>• Grades: D1, D2, C3-C6, P7-P8, F9</li>
                    <li>• Best 8 subjects summed</li>
                    <li>• Auto-calculated division: I, II, III, IV, U</li>
                  </ul>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Term Reports Tab */}
          <TabsContent value="reports">
            <Card className="p-6">
              <div className="mb-6">
                <Button onClick={handleGenerateReports} className="gap-2">
                  <FileText size={18} /> Generate Term Reports
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-4 bg-gray-50 border rounded">
                  <h3 className="font-bold mb-3">Report Features</h3>
                  <ul className="text-sm space-y-2 text-gray-700">
                    <li>✓ School logo and name</li>
                    <li>✓ Student photo and details</li>
                    <li>✓ All subjects with marks and grades</li>
                    <li>✓ Position in class (auto-ranked)</li>
                    <li>✓ Overall average / Division</li>
                    <li>✓ Space for teacher remarks</li>
                    <li>✓ Printable format</li>
                  </ul>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded">
                  <h3 className="font-bold mb-3">Available Reports</h3>
                  <div className="space-y-2">
                    <Button className="w-full justify-start gap-2" variant="outline">
                      <FileText size={16} /> Print All S3 East Reports
                    </Button>
                    <Button className="w-full justify-start gap-2" variant="outline">
                      <FileText size={16} /> Print All S4 Sciences Reports
                    </Button>
                    <Button className="w-full justify-start gap-2" variant="outline">
                      <Download size={16} /> Download Fee Overview CSV
                    </Button>
                    <Button className="w-full justify-start gap-2" variant="outline">
                      <Download size={16} /> Download Marks CSV
                    </Button>
                  </div>
                </div>
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
            <Input placeholder="Gender" />
            <Input placeholder="Parent/Guardian Name" />
            <Input placeholder="Parent Phone" />
            <select className="w-full border border-gray-300 rounded px-3 py-2">
              <option>Select Class</option>
              <option>S1</option>
              <option>S2</option>
              <option>S3 East</option>
              <option>S3 West</option>
              <option>S4 Sciences</option>
            </select>
            <Input placeholder="Total Fees" type="number" />
            <Input placeholder="Discount/Bursary" type="number" />
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

      {/* Add Teacher Modal */}
      <Dialog open={showAddTeacher} onOpenChange={setShowAddTeacher}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Teacher</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input placeholder="Full Name" />
            <Input placeholder="Phone" />
            <Input placeholder="Username" />
            <Input placeholder="Password" type="password" />
            <Input placeholder="Subjects (comma-separated)" />
            <Input placeholder="Classes (comma-separated)" />
            <div className="flex gap-2 pt-4">
              <Button onClick={handleAddTeacher} className="flex-1">
                Add Teacher
              </Button>
              <Button onClick={() => setShowAddTeacher(false)} variant="outline" className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Marks Entry Modal */}
      <Dialog open={showMarksEntry} onOpenChange={setShowMarksEntry}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Student Marks</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <select className="w-full border border-gray-300 rounded px-3 py-2">
              <option>Select Student</option>
              {students.map((s) => (
                <option key={s.id}>{s.name}</option>
              ))}
            </select>
            <select className="w-full border border-gray-300 rounded px-3 py-2">
              <option>Select Subject</option>
              <option>Mathematics</option>
              <option>Physics</option>
              <option>Chemistry</option>
              <option>English</option>
            </select>
            <Tabs defaultValue="integration" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="integration">Integration</TabsTrigger>
                <TabsTrigger value="exam">Exam</TabsTrigger>
              </TabsList>
              <TabsContent value="integration">
                <Input placeholder="Integration Mark (1.0 - 3.0 or 0 - 100)" type="number" />
              </TabsContent>
              <TabsContent value="exam">
                <Input placeholder="Exam Mark (1.0 - 3.0 or 0 - 100)" type="number" />
              </TabsContent>
            </Tabs>
            <div className="flex gap-2 pt-4">
              <Button className="flex-1">Save Marks</Button>
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
