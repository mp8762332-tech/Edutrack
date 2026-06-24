import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  generateTermReport,
  generateFeeReport,
  generatePerformanceAnalytics,
  exportReportToCSV,
  type TermReport,
  type FeeReport,
  type PerformanceAnalytics,
} from "@/lib/reportGenerator";
import { FileText, Download, Printer, TrendingUp, DollarSign, Users } from "lucide-react";
import { toast } from "sonner";

// Mock data for demo
const mockStudents = [
  { id: "1", name: "Alice Kariuki", class: "S3 East", totalFees: 50000, paymentRef: "SMS001" },
  { id: "2", name: "John Kipchoge", class: "S3 East", totalFees: 50000, paymentRef: "SMS002" },
  { id: "3", name: "Grace Mwangi", class: "S3 West", totalFees: 50000, paymentRef: "SMS003" },
  { id: "4", name: "David Omondi", class: "S3 West", totalFees: 50000, paymentRef: "SMS004" },
  { id: "5", name: "Sarah Njeri", class: "S4 Sciences", totalFees: 55000, paymentRef: "SMS005" },
];

const mockMarks = [
  { studentId: "1", subject: "Mathematics", integrationMark: 2.8, examMark: 2.9 },
  { studentId: "1", subject: "Physics", integrationMark: 2.6, examMark: 2.7 },
  { studentId: "2", subject: "Mathematics", integrationMark: 2.5, examMark: 2.4 },
  { studentId: "2", subject: "Physics", integrationMark: 2.3, examMark: 2.2 },
  { studentId: "3", subject: "Mathematics", integrationMark: 2.9, examMark: 3.0 },
  { studentId: "3", subject: "English", integrationMark: 2.7, examMark: 2.8 },
  { studentId: "4", subject: "Mathematics", integrationMark: 2.4, examMark: 2.3 },
  { studentId: "4", subject: "English", integrationMark: 2.6, examMark: 2.5 },
  { studentId: "5", subject: "Chemistry", integrationMark: 2.8, examMark: 2.9 },
  { studentId: "5", subject: "Biology", integrationMark: 2.7, examMark: 2.8 },
];

const mockPayments = [
  { studentId: "1", amount: 25000, date: "2026-01-15", paymentRef: "SMS001" },
  { studentId: "2", amount: 50000, date: "2026-01-10", paymentRef: "SMS002" },
  { studentId: "3", amount: 30000, date: "2026-01-20", paymentRef: "SMS003" },
  { studentId: "4", amount: 50000, date: "2026-01-05", paymentRef: "SMS004" },
  { studentId: "5", amount: 55000, date: "2026-01-12", paymentRef: "SMS005" },
];

export default function Reports() {
  const [termReport] = useState<TermReport>(
    generateTermReport("Nairobi International School", mockStudents, mockMarks)
  );

  const [feeReport] = useState<FeeReport>(
    generateFeeReport("Nairobi International School", mockStudents, mockPayments)
  );

  const [performanceAnalytics] = useState<PerformanceAnalytics>(
    generatePerformanceAnalytics("Nairobi International School", mockStudents, mockMarks)
  );

  const handleExportTermReport = () => {
    const classReportData = termReport.classReports.map((cr) => ({
      Class: cr.className,
      "Total Students": cr.totalStudents,
      "Average %": cr.averagePercentage,
      "Top Performer": cr.topPerformer,
      "Pass Rate %": cr.passRate,
      "Fail Rate %": cr.failRate,
    }));
    exportReportToCSV(classReportData, "term-report");
    toast.success("Term report exported as CSV");
  };

  const handleExportFeeReport = () => {
    exportReportToCSV(feeReport.studentPaymentDetails, "fee-report");
    toast.success("Fee report exported as CSV");
  };

  const handlePrintReport = () => {
    window.print();
    toast.success("Opening print dialog...");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Automatic Reports</h1>
          <p className="text-gray-600">
            Auto-generated term reports, fee summaries, and performance analytics
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Students</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{mockStudents.length}</p>
              </div>
              <Users className="text-blue-600" size={32} />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Collection Rate</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{feeReport.collectionRate}%</p>
              </div>
              <DollarSign className="text-green-600" size={32} />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Pass Rate</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{performanceAnalytics.passPercentage}%</p>
              </div>
              <TrendingUp className="text-purple-600" size={32} />
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="term" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="term">Term Report</TabsTrigger>
            <TabsTrigger value="fees">Fee Report</TabsTrigger>
            <TabsTrigger value="performance">Performance Analytics</TabsTrigger>
          </TabsList>

          {/* Term Report */}
          <TabsContent value="term">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Term Report</h2>
                  <p className="text-sm text-gray-600">Generated: {termReport.generatedDate}</p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleExportTermReport} variant="outline" className="gap-2">
                    <Download size={18} /> Export CSV
                  </Button>
                  <Button onClick={handlePrintReport} variant="outline" className="gap-2">
                    <Printer size={18} /> Print
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Class</TableHead>
                      <TableHead>Total Students</TableHead>
                      <TableHead>Average %</TableHead>
                      <TableHead>Top Performer</TableHead>
                      <TableHead>Pass Rate</TableHead>
                      <TableHead>Fail Rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {termReport.classReports.map((report, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">{report.className}</TableCell>
                        <TableCell>{report.totalStudents}</TableCell>
                        <TableCell>{report.averagePercentage}%</TableCell>
                        <TableCell>{report.topPerformer}</TableCell>
                        <TableCell>
                          <Badge variant="default" className="bg-green-600">
                            {report.passRate}%
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-red-600">
                            {report.failRate}%
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
                <p className="text-sm text-blue-900">
                  <strong>Auto-Generated:</strong> This report is automatically generated when marks are entered. It includes class-wise performance, top/bottom performers, and pass/fail rates.
                </p>
              </div>
            </Card>
          </TabsContent>

          {/* Fee Report */}
          <TabsContent value="fees">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Fee Collection Report</h2>
                  <p className="text-sm text-gray-600">Generated: {feeReport.generatedDate}</p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleExportFeeReport} variant="outline" className="gap-2">
                    <Download size={18} /> Export CSV
                  </Button>
                  <Button onClick={handlePrintReport} variant="outline" className="gap-2">
                    <Printer size={18} /> Print
                  </Button>
                </div>
              </div>

              {/* Summary Cards */}
              <div className="grid md:grid-cols-4 gap-4 mb-6">
                <div className="p-4 bg-gray-50 rounded border">
                  <p className="text-xs text-gray-600 mb-1">Expected Fees</p>
                  <p className="text-xl font-bold text-gray-900">
                    KES {(feeReport.totalExpectedFees / 1000).toFixed(0)}K
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded border border-green-200">
                  <p className="text-xs text-gray-600 mb-1">Collected</p>
                  <p className="text-xl font-bold text-green-600">
                    KES {(feeReport.totalCollected / 1000).toFixed(0)}K
                  </p>
                </div>
                <div className="p-4 bg-orange-50 rounded border border-orange-200">
                  <p className="text-xs text-gray-600 mb-1">Outstanding</p>
                  <p className="text-xl font-bold text-orange-600">
                    KES {(feeReport.totalOutstanding / 1000).toFixed(0)}K
                  </p>
                </div>
                <div className="p-4 bg-blue-50 rounded border border-blue-200">
                  <p className="text-xs text-gray-600 mb-1">Collection Rate</p>
                  <p className="text-xl font-bold text-blue-600">{feeReport.collectionRate}%</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Payment Ref</TableHead>
                      <TableHead>Total Fees</TableHead>
                      <TableHead>Paid</TableHead>
                      <TableHead>Balance</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {feeReport.studentPaymentDetails.map((detail, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">{detail.studentName}</TableCell>
                        <TableCell>{detail.class}</TableCell>
                        <TableCell className="font-mono text-sm">{detail.paymentRef}</TableCell>
                        <TableCell>KES {detail.totalFees.toLocaleString()}</TableCell>
                        <TableCell className="text-green-600 font-medium">
                          KES {detail.paidAmount.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-red-600 font-medium">
                          KES {detail.balance.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              detail.status === "Paid"
                                ? "default"
                                : detail.status === "Partial"
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {detail.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
                <p className="text-sm text-blue-900">
                  <strong>Auto-Generated:</strong> This report automatically tracks all student payments, calculates balances, and provides collection analytics. Updates in real-time as payments are recorded.
                </p>
              </div>
            </Card>
          </TabsContent>

          {/* Performance Analytics */}
          <TabsContent value="performance">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Performance Analytics</h2>
                  <p className="text-sm text-gray-600">Generated: {performanceAnalytics.generatedDate}</p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handlePrintReport} variant="outline" className="gap-2">
                    <Printer size={18} /> Print
                  </Button>
                </div>
              </div>

              {/* Summary */}
              <div className="grid md:grid-cols-5 gap-4 mb-6">
                <div className="p-4 bg-gray-50 rounded border">
                  <p className="text-xs text-gray-600 mb-1">Avg Score</p>
                  <p className="text-xl font-bold text-gray-900">{performanceAnalytics.averageScore}</p>
                </div>
                <div className="p-4 bg-green-50 rounded border border-green-200">
                  <p className="text-xs text-gray-600 mb-1">Pass %</p>
                  <p className="text-xl font-bold text-green-600">{performanceAnalytics.passPercentage}%</p>
                </div>
                <div className="p-4 bg-red-50 rounded border border-red-200">
                  <p className="text-xs text-gray-600 mb-1">Fail %</p>
                  <p className="text-xl font-bold text-red-600">{performanceAnalytics.failPercentage}%</p>
                </div>
                <div className="p-4 bg-blue-50 rounded border border-blue-200">
                  <p className="text-xs text-gray-600 mb-1">Highest</p>
                  <p className="text-xl font-bold text-blue-600">{performanceAnalytics.highestScore}</p>
                </div>
                <div className="p-4 bg-orange-50 rounded border border-orange-200">
                  <p className="text-xs text-gray-600 mb-1">Lowest</p>
                  <p className="text-xl font-bold text-orange-600">{performanceAnalytics.lowestScore}</p>
                </div>
              </div>

              {/* Subject Analytics */}
              <h3 className="text-lg font-bold mb-4 text-gray-900">Subject Performance</h3>
              <div className="overflow-x-auto mb-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Subject</TableHead>
                      <TableHead>Average</TableHead>
                      <TableHead>Pass Rate</TableHead>
                      <TableHead>Fail Rate</TableHead>
                      <TableHead>Top Score</TableHead>
                      <TableHead>Lowest Score</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {performanceAnalytics.subjectAnalytics.map((subject, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">{subject.subject}</TableCell>
                        <TableCell>{subject.averageScore}</TableCell>
                        <TableCell>
                          <Badge variant="default" className="bg-green-600">
                            {subject.passRate}%
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-red-600">
                            {subject.failRate}%
                          </Badge>
                        </TableCell>
                        <TableCell>{subject.topScore}</TableCell>
                        <TableCell>{subject.lowestScore}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Class Analytics */}
              <h3 className="text-lg font-bold mb-4 text-gray-900">Class Performance</h3>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Class</TableHead>
                      <TableHead>Average Score</TableHead>
                      <TableHead>Pass Rate</TableHead>
                      <TableHead>Total Students</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {performanceAnalytics.classAnalytics.map((cls, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">{cls.className}</TableCell>
                        <TableCell>{cls.averageScore}</TableCell>
                        <TableCell>
                          <Badge variant="default" className="bg-green-600">
                            {cls.passRate}%
                          </Badge>
                        </TableCell>
                        <TableCell>{cls.totalStudents}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
                <p className="text-sm text-blue-900">
                  <strong>Auto-Generated:</strong> This analytics dashboard automatically analyzes all student marks across subjects and classes. Provides insights into overall performance, subject-wise trends, and class comparisons.
                </p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
