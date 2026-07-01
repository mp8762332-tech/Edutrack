import { useState, useRef } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { ProductionReportCard } from "@/components/ProductionReportCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { Download, Printer, Share2, Loader } from "lucide-react";
import { exportElementToPDF, shareViaWhatsApp } from "@/lib/pdfExport";

export function ReportCardGeneration() {
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedExam, setSelectedExam] = useState<string>("");
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const reportCardRef = useRef<HTMLDivElement>(null);

  // Fetch real data from database
  const { data: classes = [] } = trpc.classes.list.useQuery({} as any);
  const { data: examTypes = [] } = trpc.examTypes.list.useQuery({} as any);

  // Fetch students in selected class
  const { data: students = [] } = trpc.students.list.useQuery(
    { classId: parseInt(selectedClass) || 0 },
    { enabled: !!selectedClass }
  );

  // Fetch marks for selected student
  const { data: studentMarks = [] } = trpc.marks.getByStudent.useQuery(
    { studentId: parseInt(selectedStudent) || 0, examTypeId: parseInt(selectedExam) || 0 },
    { enabled: !!selectedStudent && !!selectedExam }
  );

  // Fetch all marks for class to calculate position
  const { data: classMarks = [] } = trpc.marks.getByClass.useQuery(
    { classId: parseInt(selectedClass) || 0, examTypeId: parseInt(selectedExam) || 0 },
    { enabled: !!selectedClass && !!selectedExam }
  );

  // Create mutation at component level
  const generateClassMutation = trpc.reportCards.generateClass.useMutation();

  const handleGenerateClass = async () => {
    if (!selectedClass || !selectedExam) {
      toast.error("Please select class and exam");
      return;
    }

    setIsGenerating(true);
    try {
      const result = await generateClassMutation.mutateAsync({
        classId: parseInt(selectedClass),
        examTypeId: parseInt(selectedExam),
      });

      toast.success(`✅ Generated ${result.generated} report cards`);
    } catch (error: any) {
      toast.error(error?.message || "Failed to generate report cards");
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportPDF = async () => {
    if (!reportCardRef.current) {
      toast.error("No report card to export");
      return;
    }

    try {
      const selectedStudentData = students.find((s) => s.id === parseInt(selectedStudent));
      const filename = selectedStudentData
        ? `report_card_${selectedStudentData.admissionNumber}.pdf`
        : `report_card_${selectedStudent}.pdf`;

      await exportElementToPDF(reportCardRef.current, {
        filename,
        format: "a4",
        orientation: "portrait",
        margin: [15, 15, 15, 15],
      });
      toast.success("✅ Report card exported as PDF");
    } catch (error: any) {
      toast.error(error?.message || "Failed to export PDF");
      console.error(error);
    }
  };

  const handlePrint = () => {
    if (!reportCardRef.current) {
      toast.error("No report card to print");
      return;
    }

    const printWindow = window.open("", "", "height=600,width=800");
    if (printWindow) {
      printWindow.document.write(reportCardRef.current.innerHTML);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleShareWhatsApp = () => {
    const className = classes.find((c) => c.id === parseInt(selectedClass))?.name || selectedClass;
    const examName = examTypes.find((e) => e.id === parseInt(selectedExam))?.name || selectedExam;
    const studentData = students.find((s) => s.id === parseInt(selectedStudent));
    const studentName = studentData ? studentData.admissionNumber : selectedStudent;

    const message = `📊 Report Card: ${studentName} - ${className} - ${examName}\n\nView your detailed report card in EduTrack.`;
    shareViaWhatsApp(message);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Report Card Generation</h1>
          <p className="text-gray-600 mt-2">Generate and manage student report cards</p>
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
                  {classes.map((cls: any) => (
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
                  {examTypes.map((exam: any) => (
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
              <CardTitle className="text-sm font-medium">Select Student</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose student" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student: any) => (
                    <SelectItem key={student.id} value={student.id.toString()}>
                      {student.admissionNumber}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 flex-wrap">
          <Button
            onClick={handleGenerateClass}
            disabled={isGenerating || !selectedClass || !selectedExam}
            className="bg-blue-600 hover:bg-blue-700 gap-2"
          >
            {isGenerating ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate All for Class"
            )}
          </Button>

          <Button onClick={handleExportPDF} variant="outline" className="gap-2" disabled={!selectedStudent}>
            <Download className="w-4 h-4" />
            Export PDF
          </Button>

          <Button onClick={handlePrint} variant="outline" className="gap-2" disabled={!selectedStudent}>
            <Printer className="w-4 h-4" />
            Print
          </Button>

          <Button onClick={handleShareWhatsApp} variant="outline" className="gap-2" disabled={!selectedStudent}>
            <Share2 className="w-4 h-4" />
            Share WhatsApp
          </Button>
        </div>

        {/* Report Card Preview */}
        {selectedStudent && studentMarks.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Report Card Preview</CardTitle>
              <CardDescription>A4 format - ready for printing</CardDescription>
            </CardHeader>
            <CardContent className="overflow-auto">
              {(() => {
                const student = students.find((s: any) => s.id === parseInt(selectedStudent));
                const marksData = studentMarks.map((mark: any) => ({
                  subject: mark.subject?.name || "Subject",
                  paper1: parseFloat(mark.paper1Mark),
                  paper2: parseFloat(mark.paper2Mark),
                  average: parseFloat(mark.averageScore),
                  grade: mark.grade,
                  remark:
                    mark.grade === "A"
                      ? "Excellent"
                      : mark.grade === "B"
                        ? "Very Good"
                        : mark.grade === "C"
                          ? "Good"
                          : "Needs Improvement",
                }));

                const averageScore =
                  marksData.length > 0 ? marksData.reduce((sum, m) => sum + m.average, 0) / marksData.length : 0;

                // Calculate position based on average score
                const studentAverages = classMarks.reduce((acc: any, m: any) => {
                  const studentId = m.studentId;
                  if (!acc[studentId]) acc[studentId] = [];
                  acc[studentId].push(parseFloat(m.averageScore));
                  return acc;
                }, {});

                const studentAverageList = Object.entries(studentAverages)
                  .map(([id, scores]: any) => ({
                    studentId: parseInt(id),
                    average: scores.reduce((a: number, b: number) => a + b, 0) / scores.length,
                  }))
                  .sort((a, b) => b.average - a.average);

                const position = studentAverageList.findIndex((s) => s.studentId === parseInt(selectedStudent)) + 1;

                return (
                  <ProductionReportCard
                    ref={reportCardRef}
                    studentName={student?.admissionNumber || "Student"}
                    admissionNumber={student?.admissionNumber || "ADM001"}
                    className={classes.find((c: any) => c.id === parseInt(selectedClass))?.name || "Class"}
                    term="Term 1"
                    year={new Date().getFullYear()}
                    schoolName="EduTrack School"
                    marks={marksData}
                    position={position}
                    totalStudents={students.length}
                    averageScore={averageScore}
                    teacherComment="Student is performing well. Keep up the good work!"
                    principalComment="Excellent performance. Continue with the same dedication."
                    principalName="Principal"
                    classTeacher="Class Teacher"
                  />
                );
              })()}
            </CardContent>
          </Card>
        )}

        {/* No Marks Message */}
        {selectedStudent && studentMarks.length === 0 && selectedExam && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="pt-6">
              <p className="text-yellow-800">
                📋 No marks found for this student in the selected exam. Please enter marks first.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
