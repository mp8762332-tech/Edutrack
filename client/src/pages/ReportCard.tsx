import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Printer, Download, Eye } from "lucide-react";
import { downloadReportCard, printReportCard, type ReportCardData } from "@/lib/reportCardGenerator";
import { toast } from "sonner";

// Mock data for demo
const mockStudents = [
  {
    id: "1",
    name: "Alice Kariuki",
    class: "S3 East",
    admissionNumber: "SMS001",
    photoUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23E5E7EB'/%3E%3Ccircle cx='50' cy='35' r='15' fill='%239CA3AF'/%3E%3Cpath d='M 30 70 Q 50 55 70 70 L 70 100 L 30 100 Z' fill='%239CA3AF'/%3E%3C/svg%3E",
  },
  {
    id: "2",
    name: "John Kipchoge",
    class: "S3 East",
    admissionNumber: "SMS002",
    photoUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23E5E7EB'/%3E%3Ccircle cx='50' cy='35' r='15' fill='%239CA3AF'/%3E%3Cpath d='M 30 70 Q 50 55 70 70 L 70 100 L 30 100 Z' fill='%239CA3AF'/%3E%3C/svg%3E",
  },
  {
    id: "3",
    name: "Grace Mwangi",
    class: "S3 West",
    admissionNumber: "SMS003",
    photoUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23E5E7EB'/%3E%3Ccircle cx='50' cy='35' r='15' fill='%239CA3AF'/%3E%3Cpath d='M 30 70 Q 50 55 70 70 L 70 100 L 30 100 Z' fill='%239CA3AF'/%3E%3C/svg%3E",
  },
];

const mockMarks = {
  "1": [
    { subject: "Mathematics", integrationMark: 28, examMark: 29, totalMark: 285, grade: "A", remark: "Excellent" },
    { subject: "Physics", integrationMark: 26, examMark: 27, totalMark: 265, grade: "A", remark: "Excellent" },
    { subject: "Chemistry", integrationMark: 25, examMark: 26, totalMark: 255, grade: "B", remark: "Very Good" },
    { subject: "Biology", integrationMark: 24, examMark: 25, totalMark: 245, grade: "B", remark: "Very Good" },
    { subject: "English", integrationMark: 27, examMark: 28, totalMark: 275, grade: "A", remark: "Excellent" },
    { subject: "History", integrationMark: 23, examMark: 24, totalMark: 235, grade: "B", remark: "Very Good" },
  ],
  "2": [
    { subject: "Mathematics", integrationMark: 25, examMark: 24, totalMark: 245, grade: "B", remark: "Very Good" },
    { subject: "Physics", integrationMark: 23, examMark: 22, totalMark: 225, grade: "B", remark: "Very Good" },
    { subject: "Chemistry", integrationMark: 22, examMark: 21, totalMark: 215, grade: "C", remark: "Good" },
    { subject: "Biology", integrationMark: 24, examMark: 23, totalMark: 235, grade: "B", remark: "Very Good" },
    { subject: "English", integrationMark: 26, examMark: 25, totalMark: 255, grade: "B", remark: "Very Good" },
    { subject: "History", integrationMark: 21, examMark: 20, totalMark: 205, grade: "C", remark: "Good" },
  ],
  "3": [
    { subject: "Mathematics", integrationMark: 29, examMark: 30, totalMark: 295, grade: "A", remark: "Excellent" },
    { subject: "Physics", integrationMark: 27, examMark: 28, totalMark: 275, grade: "A", remark: "Excellent" },
    { subject: "Chemistry", integrationMark: 28, examMark: 29, totalMark: 285, grade: "A", remark: "Excellent" },
    { subject: "Biology", integrationMark: 26, examMark: 27, totalMark: 265, grade: "A", remark: "Excellent" },
    { subject: "English", integrationMark: 28, examMark: 29, totalMark: 285, grade: "A", remark: "Excellent" },
    { subject: "History", integrationMark: 25, examMark: 26, totalMark: 255, grade: "B", remark: "Very Good" },
  ],
};

export default function ReportCard() {
  const [selectedStudentId, setSelectedStudentId] = useState<string>("1");
  const [showPreview, setShowPreview] = useState(false);

  const selectedStudent = mockStudents.find((s) => s.id === selectedStudentId);
  const studentMarks = mockMarks[selectedStudentId as keyof typeof mockMarks] || [];
  const averageMark = Math.round(
    studentMarks.reduce((sum, m) => sum + m.totalMark, 0) / studentMarks.length / 10
  );

  const reportCardData: ReportCardData = {
    schoolName: "Nairobi International School",
    schoolMotto: "Learn and Shine",
    schoolVision: "Excellence in Education for Global Leadership",
    schoolLogoUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='45' fill='%234F46E5'/%3E%3Ctext x='50' y='60' font-size='50' font-weight='bold' fill='white' text-anchor='middle'%3EN%3C/text%3E%3C/svg%3E",
    studentName: selectedStudent?.name || "Student",
    studentPhotoUrl: selectedStudent?.photoUrl,
    admissionNumber: selectedStudent?.admissionNumber || "N/A",
    class: selectedStudent?.class || "N/A",
    term: "Term 1",
    year: 2026,
    marks: studentMarks,
    overallAverage: averageMark,
    position: selectedStudentId === "1" ? 1 : selectedStudentId === "3" ? 2 : 3,
    totalStudents: mockStudents.length,
    attendance: 95,
    teacherComments: "Excellent academic performance. Demonstrates strong understanding of concepts and active participation in class.",
    principalComments: "Outstanding achievement. Continue to maintain this level of excellence and be a role model to other students.",
    nextTermDate: "April 15, 2026",
  };

  const handlePrint = () => {
    printReportCard(reportCardData);
    toast.success("Opening print dialog...");
  };

  const handleDownload = () => {
    downloadReportCard(reportCardData);
    toast.success("Report card downloaded!");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Term Report Cards</h1>
          <p className="text-gray-600">
            View, download, and print individual student report cards
          </p>
        </div>

        {/* Student Selection */}
        <Card className="p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Student
              </label>
              <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {mockStudents.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name} - {student.class}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setShowPreview(!showPreview)} variant="outline" className="gap-2">
                <Eye size={18} /> {showPreview ? "Hide" : "Preview"}
              </Button>
              <Button onClick={handlePrint} className="gap-2 bg-blue-600 hover:bg-blue-700">
                <Printer size={18} /> Print
              </Button>
              <Button onClick={handleDownload} variant="outline" className="gap-2">
                <Download size={18} /> Download
              </Button>
            </div>
          </div>
        </Card>

        {/* Report Card Preview */}
        {showPreview && (
          <Card className="p-6 mb-8 bg-white">
            <div className="border-2 border-gray-200 rounded-lg p-8 bg-gradient-to-b from-white to-gray-50">
              {/* Header */}
              <div className="flex items-center justify-between mb-8 pb-6 border-b-4 border-blue-600">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  N
                </div>
                <div className="flex-1 text-center mx-6">
                  <h2 className="text-2xl font-bold text-gray-900">Nairobi International School</h2>
                  <p className="text-sm text-blue-600 font-bold">Learn and Shine</p>
                  <p className="text-xs text-gray-600 italic">Excellence in Education for Global Leadership</p>
                </div>
                <div className="w-20 h-28 bg-gray-300 rounded flex items-center justify-center text-gray-500 text-xs">
                  Photo
                </div>
              </div>

              {/* Student Info */}
              <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-100 rounded">
                <div>
                  <span className="font-bold text-blue-600">Student Name:</span>
                  <span className="ml-2">{selectedStudent?.name}</span>
                </div>
                <div>
                  <span className="font-bold text-blue-600">Admission No:</span>
                  <span className="ml-2">{selectedStudent?.admissionNumber}</span>
                </div>
                <div>
                  <span className="font-bold text-blue-600">Class:</span>
                  <span className="ml-2">{selectedStudent?.class}</span>
                </div>
                <div>
                  <span className="font-bold text-blue-600">Term:</span>
                  <span className="ml-2">Term 1 2026</span>
                </div>
              </div>

              {/* Marks Table */}
              <div className="mb-6">
                <h3 className="bg-blue-600 text-white px-4 py-2 rounded mb-3 font-bold">ACADEMIC PERFORMANCE</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="border p-2 text-left">Subject</th>
                        <th className="border p-2 text-center">Integration</th>
                        <th className="border p-2 text-center">Exam</th>
                        <th className="border p-2 text-center">Total</th>
                        <th className="border p-2 text-center">Grade</th>
                        <th className="border p-2 text-left">Remark</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentMarks.map((mark, idx) => (
                        <tr key={idx} className="border-b hover:bg-gray-50">
                          <td className="border p-2">{mark.subject}</td>
                          <td className="border p-2 text-center">{mark.integrationMark}</td>
                          <td className="border p-2 text-center">{mark.examMark}</td>
                          <td className="border p-2 text-center font-bold">{mark.totalMark}</td>
                          <td className="border p-2 text-center">
                            <Badge className="bg-blue-600">{mark.grade}</Badge>
                          </td>
                          <td className="border p-2">{mark.remark}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Summary */}
              <div className="grid grid-cols-4 gap-3 mb-6">
                <div className="bg-gray-100 p-3 rounded border-l-4 border-blue-600">
                  <p className="text-xs text-gray-600 font-bold">AVERAGE MARK</p>
                  <p className="text-xl font-bold text-gray-900">{averageMark}</p>
                </div>
                <div className="bg-gray-100 p-3 rounded border-l-4 border-blue-600">
                  <p className="text-xs text-gray-600 font-bold">POSITION</p>
                  <p className="text-xl font-bold text-gray-900">
                    {selectedStudentId === "1" ? "1" : selectedStudentId === "3" ? "2" : "3"}/3
                  </p>
                </div>
                <div className="bg-gray-100 p-3 rounded border-l-4 border-blue-600">
                  <p className="text-xs text-gray-600 font-bold">ATTENDANCE</p>
                  <p className="text-xl font-bold text-gray-900">95%</p>
                </div>
                <div className="bg-gray-100 p-3 rounded border-l-4 border-blue-600">
                  <p className="text-xs text-gray-600 font-bold">OVERALL GRADE</p>
                  <p className="text-xl font-bold text-gray-900">{averageMark >= 80 ? "A" : averageMark >= 70 ? "B" : "C"}</p>
                </div>
              </div>

              {/* Comments */}
              <div className="mb-6">
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-3 rounded">
                  <p className="text-xs font-bold text-yellow-600 mb-1">TEACHER'S COMMENTS:</p>
                  <p className="text-sm text-gray-700">
                    Excellent academic performance. Demonstrates strong understanding of concepts and active participation in class.
                  </p>
                </div>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
                  <p className="text-xs font-bold text-yellow-600 mb-1">PRINCIPAL'S COMMENTS:</p>
                  <p className="text-sm text-gray-700">
                    Outstanding achievement. Continue to maintain this level of excellence and be a role model to other students.
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-between pt-6 border-t text-xs text-gray-600">
                <div className="text-center">
                  <div className="w-24 border-t border-gray-900 mb-1"></div>
                  <p>Class Teacher</p>
                </div>
                <div className="text-center">
                  <div className="w-24 border-t border-gray-900 mb-1"></div>
                  <p>Principal</p>
                </div>
                <div className="text-right">
                  <p>Next Term: April 15, 2026</p>
                  <p className="text-gray-400 mt-2">Generated: {new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Info Box */}
        <Card className="p-6 bg-blue-50 border-blue-200">
          <h3 className="font-bold text-blue-900 mb-2">📋 About Report Cards</h3>
          <p className="text-sm text-blue-800">
            Professional term report cards are generated for each student showing their academic performance, grades, position in class, and teacher/principal comments. Students can download and print their report cards for records and sharing with parents.
          </p>
        </Card>
      </div>
    </div>
  );
}
