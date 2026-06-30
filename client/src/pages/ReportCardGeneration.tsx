import React, { useRef, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { ProductionReportCard } from "@/components/ProductionReportCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { Download, Printer, Share2 } from "lucide-react";
import { exportElementToPDF, shareViaWhatsApp } from "@/lib/pdfExport";

export function ReportCardGeneration() {
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedExam, setSelectedExam] = useState<string>("");
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const reportCardRef = useRef<HTMLDivElement>(null);

  // Fetch real data from database
  const { data: classes = [] } = trpc.classes.list.useQuery({} as any);
  const { data: examTypes = [] } = trpc.examTypes.list.useQuery({} as any);

  // Fetch students in selected class
  const { data: students = [] } = trpc.students.list.useQuery(
    { classId: parseInt(selectedClass) || 0 },
    { enabled: !!selectedClass }
  );

  // Fetch report cards for selected class
  const { data: reportCards = [] } = trpc.reportCards.getByClass.useQuery(
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

    try {
      const result = await generateClassMutation.mutateAsync({
        classId: parseInt(selectedClass),
        examTypeId: parseInt(selectedExam),
      });

      toast.success(`Generated ${result.generated} report cards`);
    } catch (error: any) {
      toast.error(error?.message || "Failed to generate report cards");
      console.error(error);
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
      toast.success("Report card exported as PDF");
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

    const message = `Report Card: ${studentName} - ${className} - ${examName}`;
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
              <CardTitle className="text-sm font-medium">Select Student</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose student" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student) => (
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
          <Button onClick={handleGenerateClass} className="bg-blue-600 hover:bg-blue-700">
            Generate All for Class
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
        {selectedStudent && students.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Report Card Preview</CardTitle>
              <CardDescription>A4 format - ready for printing</CardDescription>
            </CardHeader>
            <CardContent className="overflow-auto">
              <ProductionReportCard
                ref={reportCardRef}
                studentName={students.find((s) => s.id === parseInt(selectedStudent))?.admissionNumber || "Student"}
                admissionNumber={students.find((s) => s.id === parseInt(selectedStudent))?.admissionNumber || "ADM001"}
                className={classes.find((c) => c.id === parseInt(selectedClass))?.name || "Class"}
                term="Term 1"
                year={new Date().getFullYear()}
                schoolName="EduTrack School"
                marks={[
                  { subject: "Mathematics", paper1: 85, paper2: 88, average: 86.5, grade: "A", remark: "Excellent" },
                  { subject: "English", paper1: 78, paper2: 82, average: 80, grade: "A", remark: "Very Good" },
                  { subject: "Science", paper1: 92, paper2: 90, average: 91, grade: "A", remark: "Outstanding" },
                  { subject: "Social Studies", paper1: 75, paper2: 79, average: 77, grade: "B", remark: "Good" },
                ]}
                position={3}
                totalStudents={students.length}
                averageScore={83.6}
                teacherComment="Student is performing well across all subjects."
                principalComment="Keep up the excellent work!"
                principalName="Principal"
                classTeacher="Class Teacher"
              />
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
