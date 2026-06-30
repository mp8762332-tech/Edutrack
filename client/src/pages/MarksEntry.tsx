import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { Download, Share2, Printer } from "lucide-react";
import { exportElementToPDF, shareViaWhatsApp } from "@/lib/pdfExport";

export function MarksEntry() {
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedExam, setSelectedExam] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [marks, setMarks] = useState<Array<{ studentId: number; paper1: number; paper2: number; comment: string }>>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch real data from database
  const { data: classes = [] } = trpc.classes.list.useQuery({} as any);
  const { data: examTypes = [] } = trpc.examTypes.list.useQuery({} as any);
  const { data: subjects = [] } = trpc.subjects.list.useQuery({} as any);

  // Fetch students in selected class
  const { data: students = [] } = trpc.students.list.useQuery(
    { classId: parseInt(selectedClass) || 0 },
    { enabled: !!selectedClass }
  );

  // Create mutation at component level
  const marksMutation = trpc.marks.bulkEnter.useMutation();

  const handleMarkChange = (studentId: number, field: string, value: number | string) => {
    setMarks((prev) => {
      const existing = prev.find((m) => m.studentId === studentId);
      if (existing) {
        return prev.map((m) =>
          m.studentId === studentId ? { ...m, [field]: value } : m
        );
      }
      return [...prev, { studentId, paper1: 0, paper2: 0, comment: "", [field]: value }];
    });
  };

  const handleSubmit = async () => {
    if (!selectedClass || !selectedExam || !selectedSubject) {
      toast.error("Please select class, exam, and subject");
      return;
    }

    if (marks.length === 0) {
      toast.error("Please enter marks for at least one student");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await marksMutation.mutateAsync({
        examTypeId: parseInt(selectedExam),
        subjectId: parseInt(selectedSubject),
        classId: parseInt(selectedClass),
        marks: marks.map((m) => ({
          studentId: m.studentId,
          paper1Mark: m.paper1,
          paper2Mark: m.paper2,
          teacherComment: m.comment,
        })),
      });

      toast.success(`Marks entered successfully: ${result.entered} students`);
      setMarks([]);
    } catch (error: any) {
      toast.error(error?.message || "Failed to enter marks");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExportPDF = async () => {
    if (marks.length === 0) {
      toast.error("No marks to export");
      return;
    }

    try {
      const htmlContent = `
        <div style="font-family: Arial; padding: 20px;">
          <h2>Marks Report</h2>
          <p><strong>Class:</strong> ${classes.find((c) => c.id === parseInt(selectedClass))?.name || selectedClass}</p>
          <p><strong>Exam:</strong> ${examTypes.find((e) => e.id === parseInt(selectedExam))?.name || selectedExam}</p>
          <p><strong>Subject:</strong> ${subjects.find((s) => s.id === parseInt(selectedSubject))?.name || selectedSubject}</p>
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr style="background-color: #f0f0f0;">
              <th style="border: 1px solid #000; padding: 8px;">Student ID</th>
              <th style="border: 1px solid #000; padding: 8px;">Paper 1</th>
              <th style="border: 1px solid #000; padding: 8px;">Paper 2</th>
              <th style="border: 1px solid #000; padding: 8px;">Average</th>
            </tr>
            ${marks
              .map(
                (m) => `
              <tr>
                <td style="border: 1px solid #000; padding: 8px;">${m.studentId}</td>
                <td style="border: 1px solid #000; padding: 8px;">${m.paper1}</td>
                <td style="border: 1px solid #000; padding: 8px;">${m.paper2}</td>
                <td style="border: 1px solid #000; padding: 8px;">${((m.paper1 + m.paper2) / 2).toFixed(1)}</td>
              </tr>
            `
              )
              .join("")}
          </table>
        </div>
      `;
      const element = document.createElement("div");
      element.innerHTML = htmlContent;
      await exportElementToPDF(element, { filename: "marks_report.pdf" });
      toast.success("Report card PDF generated");
    } catch (error: any) {
      toast.error(error?.message || "Failed to generate PDF");
      console.error(error);
    }
  };

  const handleShareWhatsApp = () => {
    if (marks.length === 0) {
      toast.error("No marks to share");
      return;
    }

    const className = classes.find((c) => c.id === parseInt(selectedClass))?.name || selectedClass;
    const examName = examTypes.find((e) => e.id === parseInt(selectedExam))?.name || selectedExam;
    const subjectName = subjects.find((s) => s.id === parseInt(selectedSubject))?.name || selectedSubject;

    const message = `Marks Entry Summary:\nClass: ${className}\nExam: ${examName}\nSubject: ${subjectName}\nStudents: ${marks.length}`;
    shareViaWhatsApp(message);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Marks Entry</h1>
          <p className="text-gray-600 mt-2">Enter marks for students in Paper 1 and Paper 2</p>
        </div>

        {/* Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Select Class</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id.toString()}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Select Exam</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedExam} onValueChange={setSelectedExam}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose exam" />
                </SelectTrigger>
                <SelectContent>
                  {examTypes.map((exam) => (
                    <SelectItem key={exam.id} value={exam.id.toString()}>
                      {exam.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Select Subject</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subj) => (
                    <SelectItem key={subj.id} value={subj.id.toString()}>
                      {subj.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>

        {/* Marks Entry Table */}
        {selectedClass && students && students.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Enter Marks</CardTitle>
              <CardDescription>Paper 1 (out of 100) | Paper 2 (out of 100)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Admission No.</TableHead>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Paper 1</TableHead>
                      <TableHead>Paper 2</TableHead>
                      <TableHead>Average</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Comment</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student) => {
                      const studentMarks = marks.find((m) => m.studentId === student.id);
                      const paper1 = studentMarks?.paper1 || 0;
                      const paper2 = studentMarks?.paper2 || 0;
                      const average = (paper1 + paper2) / 2;
                      const grade =
                        average >= 80
                          ? "A"
                          : average >= 60
                            ? "B"
                            : average >= 49
                              ? "C"
                              : average >= 20
                                ? "D"
                                : "E";

                      return (
                        <TableRow key={student.id}>
                          <TableCell className="font-mono text-sm">{student.admissionNumber}</TableCell>
                          <TableCell>{student.admissionNumber}</TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              value={paper1}
                              onChange={(e) =>
                                handleMarkChange(student.id, "paper1", parseFloat(e.target.value) || 0)
                              }
                              className="w-20"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              value={paper2}
                              onChange={(e) =>
                                handleMarkChange(student.id, "paper2", parseFloat(e.target.value) || 0)
                              }
                              className="w-20"
                            />
                          </TableCell>
                          <TableCell className="font-semibold">{average.toFixed(1)}</TableCell>
                          <TableCell className="font-bold">{grade}</TableCell>
                          <TableCell>
                            <Textarea
                              placeholder="Add comment..."
                              value={studentMarks?.comment || ""}
                              onChange={(e) => handleMarkChange(student.id, "comment", e.target.value)}
                              className="w-32 h-10"
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 flex-wrap">
          <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
            {isSubmitting ? "Saving..." : "Save Marks"}
          </Button>

          <Button onClick={handleExportPDF} variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export PDF
          </Button>

          <Button onClick={handleShareWhatsApp} variant="outline" className="gap-2">
            <Share2 className="w-4 h-4" />
            Share WhatsApp
          </Button>

          <Button onClick={handlePrint} variant="outline" className="gap-2">
            <Printer className="w-4 h-4" />
            Print
          </Button>
        </div>

        {/* Statistics */}
        {marks.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold">{marks.length}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Average Score</p>
                  <p className="text-2xl font-bold">
                    {(marks.reduce((sum, m) => sum + (m.paper1 + m.paper2) / 2, 0) / marks.length).toFixed(1)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Highest Score</p>
                  <p className="text-2xl font-bold">
                    {Math.max(...marks.map((m) => (m.paper1 + m.paper2) / 2))}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Lowest Score</p>
                  <p className="text-2xl font-bold">
                    {Math.min(...marks.map((m) => (m.paper1 + m.paper2) / 2))}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
