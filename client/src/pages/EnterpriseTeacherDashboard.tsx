import { useState, useEffect } from "react";
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
  demoSubjects,
  demoClasses,
  demoSubjectMarks,
  demoTimetable,
  demoSyllabus,
  demoExamSchedule,
  calculateGrade,
  calculateAverageScore,
} from "@/lib/enterpriseData";
import {
  BookOpen,
  Users,
  TrendingUp,
  Plus,
  Download,
  Search,
  LogOut,
  Wifi,
  FileText,
  Eye,
  Calendar,
  Clock,
} from "lucide-react";
import { toast } from "sonner";

// ============================================
// ATTENDANCE TAB COMPONENT
// ============================================
function AttendanceTab({
  teacherClasses,
  filteredStudents,
  selectedClass,
  setSelectedClass,
}: {
  teacherClasses: any[];
  filteredStudents: any[];
  selectedClass: string;
  setSelectedClass: (v: string) => void;
}) {
  const [attendance, setAttendance] = useState<Record<string, boolean[]>>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const initial: Record<string, boolean[]> = {};
    filteredStudents.forEach((s: any) => {
      if (!attendance[s.id]) {
        initial[s.id] = [false, false, false, false, false, false];
      }
    });
    if (Object.keys(initial).length > 0) {
      setAttendance((prev) => ({ ...prev, ...initial }));
    }
  }, [filteredStudents]);

  const toggleAttendance = (studentId: string, dayIndex: number) => {
    if (saved) return;
    setAttendance((prev) => {
      const current = prev[studentId] || [false, false, false, false, false, false];
      const updated = [...current];
      updated[dayIndex] = !updated[dayIndex];
      return { ...prev, [studentId]: updated };
    });
  };

  const handleSave = () => {
    setSaved(true);
    toast.success("Attendance saved! Absent students marked with X.");
  };

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <Card className="p-6">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <label className="text-sm font-medium">Select Class</label>
          <select
            value={selectedClass}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedClass(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 mt-2"
          >
            {teacherClasses.map((c: any) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="text-sm font-medium">Select Week</label>
          <select className="w-full border border-gray-300 rounded px-3 py-2 mt-2">
            <option>Week 24 (Jun 9 - Jun 14)</option>
            <option>Week 25 (Jun 16 - Jun 21)</option>
            <option>Week 26 (Jun 23 - Jun 28)</option>
          </select>
        </div>
      </div>

      <div className="p-4 bg-blue-50 border border-blue-200 rounded mb-4">
        <p className="text-sm text-blue-900">
          <strong>Roll Call Instructions:</strong> Click the box next to each student's name for each day they are present.
          A bold <span className="text-green-700 font-bold">✓</span> appears. Leave blank for absent. After saving, all blank
          boxes automatically get a red <span className="text-red-600 font-bold">✗</span>.
        </p>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[180px]">Student Name</TableHead>
              {days.map((day) => (
                <TableHead key={day} className="text-center w-16">
                  {day}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.map((student: any) => {
              const studentAttendance = attendance[student.id] || [false, false, false, false, false, false];
              return (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">
                    {student.firstName} {student.lastName}
                  </TableCell>
                  {studentAttendance.map((present: boolean, dayIdx: number) => (
                    <TableCell key={dayIdx} className="text-center p-1">
                      <button
                        onClick={() => toggleAttendance(student.id, dayIdx)}
                        className={`w-10 h-10 rounded border-2 transition flex items-center justify-center font-bold text-lg ${
                          present
                            ? "border-green-500 bg-green-50"
                            : saved
                            ? "border-red-400 bg-red-50"
                            : "border-gray-300 hover:border-green-400 bg-white"
                        }`}
                        disabled={saved}
                      >
                        {present ? (
                          <span className="text-green-600 font-bold">✓</span>
                        ) : saved ? (
                          <span className="text-red-600 font-bold">✗</span>
                        ) : (
                          ""
                        )}
                      </button>
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <div className="mt-6 flex gap-3">
        {!saved ? (
          <Button onClick={handleSave} className="gap-2 bg-green-600 hover:bg-green-700">
            <Calendar size={18} /> Save Attendance
          </Button>
        ) : (
          <Button onClick={() => setSaved(false)} variant="outline" className="gap-2">
            Edit Attendance
          </Button>
        )}
        <Button onClick={() => toast.success("Attendance report downloaded as CSV")} variant="outline" className="gap-2">
          <Download size={18} /> Download Report
        </Button>
      </div>

      {saved && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
          <p className="text-sm text-green-900">
            <strong>✅ Attendance saved successfully!</strong> All absent students have been marked with a red X. Admin and
            class teacher can access this record.
          </p>
        </div>
      )}
    </Card>
  );
}

// ============================================
// MAIN TEACHER DASHBOARD
// ============================================
export default function EnterpriseTeacherDashboard() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState("class-s1e");
  const [selectedSubject, setSelectedSubject] = useState("subj-s1");
  const [showMarksModal, setShowMarksModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  // Teacher is assigned to specific subjects and classes only
  const teacherSubjects = demoSubjects.filter((s) => ["subj-s1", "subj-s3"].includes(s.id)); // Math & Physics
  const teacherClasses = demoClasses.filter((c) => ["class-s1e", "class-s1w", "class-s2e"].includes(c.id));

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

  // Get timetable entries for this teacher
  const teacherTimetable = demoTimetable.filter((t) => ["t-1", "t-3"].includes(t.teacherId));

  // Get syllabus for teacher's subjects
  const teacherSyllabus = demoSyllabus.filter((s) =>
    teacherSubjects.some((subj) => subj.id === s.subjectId)
  );

  // Get exam schedule for teacher's classes
  const teacherExams = demoExamSchedule.filter(
    (e) => teacherSubjects.some((s) => s.id === e.subjectId) && teacherClasses.some((c) => c.id === e.classId)
  );

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
            <div className="flex items-center gap-3">
              <Badge className="bg-green-100 text-green-800 border border-green-300 gap-1">
                <Wifi size={14} />
                Online
              </Badge>
              <Button onClick={handleLogout} variant="outline" size="sm" className="gap-2">
                <LogOut size={18} />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* KPI Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
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

          <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Upcoming Exams</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{teacherExams.length}</p>
              </div>
              <Calendar className="text-orange-600" size={32} />
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="marks" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="marks">Record Marks</TabsTrigger>
            <TabsTrigger value="timetable">Timetable</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="students">My Students</TabsTrigger>
            <TabsTrigger value="syllabus">Syllabus</TabsTrigger>
            <TabsTrigger value="exams">Exam Schedule</TabsTrigger>
          </TabsList>

          {/* ============================================ */}
          {/* RECORD MARKS TAB - Paper 1 & Paper 2 System */}
          {/* ============================================ */}
          <TabsContent value="marks">
            <Card className="p-6">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded mb-6">
                <p className="text-sm text-yellow-900">
                  <strong>Grading System:</strong> A (80-100) Exceptional | B (60-79) Outstanding | C (49-59) Satisfactory | D (20-48) Basic | E (0-19) Elementary
                </p>
                <p className="text-sm text-yellow-900 mt-1">
                  <strong>Paper Averaging:</strong> If a subject has Paper 1 & Paper 2, the system adds both marks and divides by 2 to get the Average Score.
                </p>
              </div>

              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <label className="text-sm font-medium">Select Subject</label>
                  <select
                    value={selectedSubject}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedSubject(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 mt-2"
                  >
                    {teacherSubjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} {s.hasPapers ? "(Paper 1 & 2)" : "(Single Paper)"}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium">Select Class</label>
                  <select
                    value={selectedClass}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedClass(e.target.value)}
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

              {/* Marks Table with Paper 1 & Paper 2 */}
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Student ID</TableHead>
                      <TableHead>Paper 1 (0-100)</TableHead>
                      {teacherSubjects.find((s) => s.id === selectedSubject)?.hasPapers && (
                        <TableHead>Paper 2 (0-100)</TableHead>
                      )}
                      <TableHead>Average Score</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Remarks</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => {
                      const existingMark = demoSubjectMarks.find(
                        (m) => m.studentId === student.id && m.subjectId === selectedSubject
                      );
                      const subjectHasPapers = teacherSubjects.find((s) => s.id === selectedSubject)?.hasPapers;
                      const p1 = existingMark?.paper1Mark || 0;
                      const p2 = existingMark?.paper2Mark || 0;
                      const avg = existingMark ? existingMark.averageScore : calculateAverageScore(p1, subjectHasPapers ? p2 : undefined);
                      const gradeInfo = calculateGrade(avg);

                      return (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">
                            {student.firstName} {student.lastName}
                          </TableCell>
                          <TableCell className="font-mono text-xs">{student.studentId}</TableCell>
                          <TableCell>
                            <Input type="number" min="0" max="100" defaultValue={p1} className="w-20" />
                          </TableCell>
                          {subjectHasPapers && (
                            <TableCell>
                              <Input type="number" min="0" max="100" defaultValue={p2} className="w-20" />
                            </TableCell>
                          )}
                          <TableCell>
                            <Badge className="bg-blue-600">{avg}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                gradeInfo.grade === "A"
                                  ? "bg-green-600"
                                  : gradeInfo.grade === "B"
                                  ? "bg-blue-600"
                                  : gradeInfo.grade === "C"
                                  ? "bg-yellow-600"
                                  : gradeInfo.grade === "D"
                                  ? "bg-orange-600"
                                  : "bg-red-600"
                              }
                            >
                              {gradeInfo.grade}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">{gradeInfo.remarks}</TableCell>
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
                  <Download size={18} /> Export Marks CSV
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* ============================================ */}
          {/* TIMETABLE TAB */}
          {/* ============================================ */}
          <TabsContent value="timetable">
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Clock size={20} /> My Weekly Timetable
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Your teaching schedule for this week. Shows which class you should be in and at what time.
              </p>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Day</TableHead>
                      <TableHead>Period</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Room</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => {
                      const dayEntries = teacherTimetable
                        .filter((t) => t.day === day)
                        .sort((a, b) => a.period - b.period);
                      return dayEntries.map((entry, idx) => (
                        <TableRow key={entry.id} className={idx === 0 ? "border-t-2 border-gray-300" : ""}>
                          {idx === 0 && (
                            <TableCell rowSpan={dayEntries.length} className="font-bold bg-gray-50 align-top">
                              {day}
                            </TableCell>
                          )}
                          <TableCell>Period {entry.period}</TableCell>
                          <TableCell className="font-mono text-sm">
                            {entry.startTime} - {entry.endTime}
                          </TableCell>
                          <TableCell className="font-medium">
                            {demoSubjects.find((s) => s.id === entry.subjectId)?.name || entry.subjectId}
                          </TableCell>
                          <TableCell>
                            {demoClasses.find((c) => c.id === entry.classId)?.name || entry.classId}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{entry.room}</Badge>
                          </TableCell>
                        </TableRow>
                      ));
                    })}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>

          {/* ============================================ */}
          {/* ATTENDANCE TAB */}
          {/* ============================================ */}
          <TabsContent value="attendance">
            <AttendanceTab
              teacherClasses={teacherClasses}
              filteredStudents={filteredStudents}
              selectedClass={selectedClass}
              setSelectedClass={setSelectedClass}
            />
          </TabsContent>

          {/* ============================================ */}
          {/* MY STUDENTS TAB */}
          {/* ============================================ */}
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
                        <TableCell>
                          {demoClasses.find((c) => c.id === student.classId)?.name || student.level}
                        </TableCell>
                        <TableCell>{student.gender}</TableCell>
                        <TableCell>{student.admissionDate}</TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1"
                            onClick={() => toast.success(`Viewing ${student.firstName}'s marks for your subjects only`)}
                          >
                            <Eye size={14} /> View Marks
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                <p className="text-sm text-blue-900">
                  <strong>Note:</strong> You can only view marks for subjects you teach (Mathematics & Physics). Other subjects are not accessible.
                </p>
              </div>
            </Card>
          </TabsContent>

          {/* ============================================ */}
          {/* SYLLABUS TAB */}
          {/* ============================================ */}
          <TabsContent value="syllabus">
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4">Government Syllabus - Term Topics</h3>
              <p className="text-sm text-gray-600 mb-6">
                Follow the government book syllabus for each class and subject. Check off topics as you cover them.
              </p>

              <div className="space-y-6">
                {teacherSubjects.map((subject) => {
                  const subjectSyllabus = teacherSyllabus.filter((s) => s.subjectId === subject.id);
                  const completedTopics = subjectSyllabus.filter((s) => s.completed).length;
                  const totalTopics = subjectSyllabus.length;
                  const progress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

                  return (
                    <div key={subject.id} className="p-4 border border-gray-200 rounded">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-bold text-lg">{subject.name}</p>
                          <p className="text-sm text-gray-600">
                            {subject.level} • {completedTopics}/{totalTopics} topics completed ({progress}%)
                          </p>
                        </div>
                        <Button size="sm" variant="outline" className="gap-1">
                          <FileText size={14} /> Download Syllabus PDF
                        </Button>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                        <div
                          className="bg-green-600 h-2 rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>

                      {/* Topics */}
                      <div className="space-y-2">
                        {subjectSyllabus.map((topic) => (
                          <div
                            key={topic.id}
                            className={`p-3 rounded border ${
                              topic.completed ? "bg-green-50 border-green-200" : "bg-white border-gray-200"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <input
                                  type="checkbox"
                                  checked={topic.completed}
                                  onChange={() => toast.success(`Topic "${topic.topic}" marked as ${topic.completed ? "incomplete" : "completed"}`)}
                                  className="w-5 h-5 rounded"
                                />
                                <div>
                                  <p className={`font-medium ${topic.completed ? "line-through text-gray-500" : ""}`}>
                                    {topic.topic}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {topic.weeksAllocated} weeks allocated • Subtopics: {topic.subtopics.join(", ")}
                                  </p>
                                </div>
                              </div>
                              <Badge className={topic.completed ? "bg-green-600" : "bg-gray-400"}>
                                {topic.completed ? "Done" : "Pending"}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </TabsContent>

          {/* ============================================ */}
          {/* EXAM SCHEDULE TAB */}
          {/* ============================================ */}
          <TabsContent value="exams">
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Calendar size={20} /> Exam Schedule
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Upcoming exams for your subjects. Set by the admin.
              </p>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Paper</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Venue</TableHead>
                      <TableHead>Invigilator</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teacherExams.map((exam) => (
                      <TableRow key={exam.id}>
                        <TableCell className="font-medium">{exam.date}</TableCell>
                        <TableCell>
                          {demoSubjects.find((s) => s.id === exam.subjectId)?.name || exam.subjectId}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{exam.paper}</Badge>
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {exam.startTime} - {exam.endTime}
                        </TableCell>
                        <TableCell>
                          {demoClasses.find((c) => c.id === exam.classId)?.name || exam.classId}
                        </TableCell>
                        <TableCell>{exam.venue}</TableCell>
                        <TableCell>{exam.invigilator}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Marks Save Modal */}
      <Dialog open={showMarksModal} onOpenChange={setShowMarksModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Marks for {selectedStudent?.firstName} {selectedStudent?.lastName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded">
              <p className="text-sm text-blue-900">
                <strong>Paper Averaging:</strong> If the subject has Paper 1 & Paper 2, the system adds both marks and divides by 2.
              </p>
              <p className="text-sm text-blue-900 mt-1">
                <strong>Example:</strong> Paper 1 = 80, Paper 2 = 60 → Average Score = (80+60)/2 = 70 → Grade B (Outstanding)
              </p>
            </div>
            <div className="p-3 bg-green-50 border border-green-200 rounded">
              <p className="text-sm text-green-900">
                <strong>Grading:</strong> A (80-100) | B (60-79) | C (49-59) | D (20-48) | E (0-19)
              </p>
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={handleRecordMarks} className="flex-1">
                Confirm & Save
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
