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
  demoPayments,
  demoReceipts,
  demoReports,
  demoScholarships,
} from "@/lib/demoData";
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
} from "lucide-react";
import { toast } from "sonner";

export default function DemoAdminDashboard() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [showAddTeacher, setShowAddTeacher] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  const filteredStudents = demoStudents.filter(
    (s) =>
      s.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.paymentCode.includes(searchQuery)
  );

  const handleLogout = () => {
    localStorage.removeItem("demoUser");
    setLocation("/demo-login");
  };

  const handleAddStudent = () => {
    toast.success("New student added successfully!");
    setShowAddStudent(false);
  };

  const handleAddTeacher = () => {
    toast.success("New teacher added successfully!");
    setShowAddTeacher(false);
  };

  const handleRecordPayment = () => {
    toast.success("Payment recorded successfully! Receipt generated.");
    setShowPaymentModal(false);
  };

  const handleDownloadCSV = (type: string) => {
    toast.success(`${type} data exported as CSV`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-600">Nairobi International School</p>
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
                <p className="text-3xl font-bold text-gray-900 mt-2">{demoReports.totalStudents}</p>
              </div>
              <Users className="text-blue-600" size={32} />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Teachers</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{demoReports.totalTeachers}</p>
              </div>
              <BookOpen className="text-green-600" size={32} />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">KES {demoReports.totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="text-purple-600" size={32} />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Pending Payments</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">KES {demoReports.pendingPayments.toLocaleString()}</p>
              </div>
              <TrendingUp className="text-orange-600" size={32} />
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="students" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="teachers">Teachers</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          {/* Students Tab */}
          <TabsContent value="students">
            <Card className="p-6">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                  <Input
                    placeholder="Search by name or payment code..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button onClick={() => setShowAddStudent(true)} className="gap-2">
                  <Plus size={18} /> Add Student
                </Button>
                <Button onClick={() => handleDownloadCSV("Students")} variant="outline" className="gap-2">
                  <Download size={18} /> Export
                </Button>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Payment Code</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Paid / Required</TableHead>
                      <TableHead>Balance</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">
                          {student.firstName} {student.lastName}
                        </TableCell>
                        <TableCell className="font-mono text-xs">{student.paymentCode}</TableCell>
                        <TableCell>{student.currentClass}</TableCell>
                        <TableCell>
                          KES {student.totalPaid.toLocaleString()} / KES {student.totalFeesRequired.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge variant={student.balance === 0 ? "default" : "secondary"}>
                            KES {student.balance.toLocaleString()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-1"
                              onClick={() => {
                                setSelectedStudent(student);
                                setShowPaymentModal(true);
                              }}
                            >
                              <DollarSign size={14} />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => toast.success(`Viewing ${student.firstName}'s profile`)}
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

          {/* Teachers Tab */}
          <TabsContent value="teachers">
            <Card className="p-6">
              <div className="flex gap-4 mb-6">
                <Button onClick={() => setShowAddTeacher(true)} className="gap-2">
                  <Plus size={18} /> Add Teacher
                </Button>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Subjects</TableHead>
                      <TableHead>Classes</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {demoTeachers.map((teacher) => (
                      <TableRow key={teacher.id}>
                        <TableCell className="font-medium">
                          {teacher.firstName} {teacher.lastName}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1 flex-wrap">
                            {teacher.subjects.map((s) => (
                              <Badge key={s} variant="secondary" className="text-xs">
                                {s}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>{teacher.classes.join(", ")}</TableCell>
                        <TableCell className="text-sm">{teacher.email}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-1"
                              onClick={() => handleDownloadCSV("Teacher Marks")}
                            >
                              <Download size={14} />
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

          {/* Payments Tab */}
          <TabsContent value="payments">
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4">Recent Payments</h3>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Payment Code</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Receipt</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {demoPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">{payment.studentName}</TableCell>
                        <TableCell className="font-mono text-xs">{payment.paymentCode}</TableCell>
                        <TableCell className="font-semibold">KES {payment.amount.toLocaleString()}</TableCell>
                        <TableCell>{payment.paymentDate}</TableCell>
                        <TableCell>{payment.paymentMethod}</TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1"
                            onClick={() => toast.success("Receipt downloaded")}
                          >
                            <FileText size={14} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Award size={20} />
                  Scholarship Status
                </h3>
                <div className="space-y-3">
                  {demoScholarships.map((scholarship) => (
                    <div key={scholarship.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div>
                        <p className="font-medium">{scholarship.studentName}</p>
                        <p className="text-sm text-gray-600 capitalize">{scholarship.type} Scholarship</p>
                      </div>
                      <Badge>KES {scholarship.amount.toLocaleString()}</Badge>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-bold mb-4">School Performance</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <p className="text-sm font-medium">Average Attendance</p>
                      <p className="font-bold">{demoReports.averageAttendance}%</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${demoReports.averageAttendance}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <p className="text-sm font-medium">Average GPA</p>
                      <p className="font-bold">{demoReports.averageGPA}/4.0</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${(demoReports.averageGPA / 4) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </div>
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
            <Input placeholder="Phone (Optional)" />
            <select className="w-full border border-gray-300 rounded px-3 py-2">
              <option>Select Class</option>
              <option>Form 1D</option>
              <option>Form 2C</option>
              <option>Form 3B</option>
              <option>Form 4A</option>
            </select>
            <Input placeholder="Total Fees Required" type="number" />
            <select className="w-full border border-gray-300 rounded px-3 py-2">
              <option>Select Gender</option>
              <option>Male</option>
              <option>Female</option>
            </select>
            <Input placeholder="Scholarship Amount (Optional)" type="number" />
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
            <Input placeholder="First Name" />
            <Input placeholder="Last Name" />
            <Input placeholder="Email" type="email" />
            <Input placeholder="Phone" />
            <Input placeholder="Qualifications" />
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

      {/* Payment Modal */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Payment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedStudent && (
              <div className="p-3 bg-blue-50 rounded">
                <p className="text-sm text-gray-600">Student</p>
                <p className="font-bold">{selectedStudent.firstName} {selectedStudent.lastName}</p>
                <p className="text-xs text-gray-500 mt-1">{selectedStudent.paymentCode}</p>
              </div>
            )}
            <Input placeholder="Amount" type="number" />
            <select className="w-full border border-gray-300 rounded px-3 py-2">
              <option>Select Payment Method</option>
              <option>Bank Transfer</option>
              <option>Mobile Money</option>
              <option>Cash</option>
              <option>Cheque</option>
            </select>
            <Input placeholder="Reference Number" />
            <div className="flex gap-2 pt-4">
              <Button onClick={handleRecordPayment} className="flex-1">
                Record Payment
              </Button>
              <Button onClick={() => setShowPaymentModal(false)} variant="outline" className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
