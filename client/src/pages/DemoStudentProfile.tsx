import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { demoStudents, demoPayments, demoReceipts, demoMarks } from "@/lib/demoData";
import { LogOut, Download, Printer, FileText, TrendingUp, DollarSign, Award } from "lucide-react";
import { toast } from "sonner";

export default function DemoStudentProfile() {
  const [, setLocation] = useLocation();
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  const student = demoStudents[0]; // Alice Kariuki
  const studentPayments = demoPayments.filter((p) => p.studentId === student.id);
  const studentReceipts = demoReceipts.filter((r) => r.paymentCode === student.paymentCode);
  const studentMarks = demoMarks.filter((m) => m.studentId === student.id);

  const handleLogout = () => {
    localStorage.removeItem("demoUser");
    setLocation("/demo-login");
  };

  const handleDownloadReceipt = (receipt: any) => {
    toast.success(`Receipt ${receipt.receiptNumber} downloaded`);
  };

  const handlePrintReceipt = (receipt: any) => {
    toast.success(`Receipt ${receipt.receiptNumber} sent to printer`);
  };

  const handleViewReceipt = (receipt: any) => {
    setSelectedReceipt(receipt);
    setShowReceiptModal(true);
  };

  const averageScore = studentMarks.length > 0 ? Math.round(studentMarks.reduce((sum, m) => sum + m.score, 0) / studentMarks.length) : 0;
  const paymentPercentage = Math.round((student.totalPaid / student.totalFeesRequired) * 100);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Student Profile</h1>
            <p className="text-sm text-gray-600">
              {student.firstName} {student.lastName}
            </p>
          </div>
          <Button onClick={handleLogout} variant="outline" size="sm" className="gap-2">
            <LogOut size={18} />
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Profile Header */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Profile Card */}
          <Card className="p-6 md:col-span-1">
            <div className="text-center">
              <img
                src={student.profilePhoto}
                alt={student.firstName}
                className="w-32 h-32 rounded-lg mx-auto mb-4 object-cover"
              />
              <h2 className="text-2xl font-bold text-gray-900">
                {student.firstName} {student.lastName}
              </h2>
              <p className="text-gray-600 mt-1">{student.currentClass}</p>
              <p className="text-sm text-gray-500 mt-2">{student.email}</p>
              <div className="mt-4 pt-4 border-t">
                <p className="text-xs text-gray-600 mb-1">Payment Code</p>
                <p className="font-mono text-sm font-bold text-blue-600">{student.paymentCode}</p>
              </div>
              <div className="mt-4 space-y-2">
                <Badge className="w-full justify-center">{student.gender}</Badge>
                <Badge variant="secondary" className="w-full justify-center">
                  {student.healthStatus}
                </Badge>
              </div>
            </div>
          </Card>

          {/* Quick Stats */}
          <div className="md:col-span-2 space-y-4">
            {/* Payment Status */}
            <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <DollarSign size={20} />
                  Payment Status
                </h3>
                <Badge variant="default">
                  {paymentPercentage}% Paid
                </Badge>
              </div>
              <Progress value={paymentPercentage} className="mb-4" />
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm text-gray-600">Paid</p>
                  <p className="text-lg font-bold text-green-600">KES {student.totalPaid.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Balance</p>
                  <p className="text-lg font-bold text-orange-600">KES {student.balance.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Required</p>
                  <p className="text-lg font-bold text-gray-900">KES {student.totalFeesRequired.toLocaleString()}</p>
                </div>
              </div>
            </Card>

            {/* Academic Performance */}
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <TrendingUp size={20} />
                  Academic Performance
                </h3>
                <Badge variant="default">
                  Average: {averageScore}%
                </Badge>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {studentMarks.map((mark) => (
                  <div key={mark.id} className="text-center p-2 bg-white rounded">
                    <p className="text-xs text-gray-600">{mark.subject}</p>
                    <p className="text-lg font-bold text-blue-600">{mark.score}</p>
                    <p className="text-xs font-semibold text-gray-700">{mark.grade}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="payments" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="payments">Payment History</TabsTrigger>
            <TabsTrigger value="receipts">Receipts</TabsTrigger>
            <TabsTrigger value="results">Academic Results</TabsTrigger>
          </TabsList>

          {/* Payment History Tab */}
          <TabsContent value="payments">
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4">Payment History</h3>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {studentPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>{payment.paymentDate}</TableCell>
                        <TableCell className="font-bold">KES {payment.amount.toLocaleString()}</TableCell>
                        <TableCell>{payment.paymentMethod}</TableCell>
                        <TableCell className="font-mono text-sm">{payment.referenceNumber}</TableCell>
                        <TableCell>
                          <Badge variant="default">Completed</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>

          {/* Receipts Tab */}
          <TabsContent value="receipts">
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4">Payment Receipts</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {studentReceipts.map((receipt) => (
                  <Card key={receipt.id} className="p-4 border-2 hover:border-blue-400 transition">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-sm text-gray-600">Receipt Number</p>
                        <p className="font-mono font-bold text-gray-900">{receipt.receiptNumber}</p>
                      </div>
                      <Badge variant="secondary">{receipt.paymentDate}</Badge>
                    </div>

                    <div className="space-y-2 mb-4 py-3 border-y">
                      <div className="flex justify-between">
                        <p className="text-sm text-gray-600">Amount Paid</p>
                        <p className="font-bold text-green-600">KES {receipt.amountPaid.toLocaleString()}</p>
                      </div>
                      <div className="flex justify-between">
                        <p className="text-sm text-gray-600">Remaining Balance</p>
                        <p className="font-bold text-orange-600">KES {receipt.remainingBalance.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 gap-1"
                        onClick={() => handleViewReceipt(receipt)}
                      >
                        <FileText size={14} /> View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 gap-1"
                        onClick={() => handleDownloadReceipt(receipt)}
                      >
                        <Download size={14} /> Download
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 gap-1"
                        onClick={() => handlePrintReceipt(receipt)}
                      >
                        <Printer size={14} /> Print
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Results Tab */}
          <TabsContent value="results">
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Award size={20} />
                Academic Results - Term 1 2024
              </h3>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Subject</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Remarks</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {studentMarks.map((mark) => (
                      <TableRow key={mark.id}>
                        <TableCell className="font-medium">{mark.subject}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-500 h-2 rounded-full"
                                style={{ width: `${mark.score}%` }}
                              />
                            </div>
                            <span className="font-bold">{mark.score}%</span>
                          </div>
                        </TableCell>
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

      {/* Receipt Detail Modal */}
      <Dialog open={showReceiptModal} onOpenChange={setShowReceiptModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Receipt Details</DialogTitle>
          </DialogHeader>

          {selectedReceipt && (
            <div className="space-y-6">
              {/* Receipt Preview */}
              <div className="border-2 border-gray-300 rounded-lg p-8 bg-white">
                {/* School Header */}
                <div className="text-center mb-6 pb-4 border-b-2">
                  <img src={selectedReceipt.schoolLogo} alt="School" className="w-16 h-16 mx-auto mb-2 rounded" />
                  <h2 className="text-2xl font-bold text-gray-900">{selectedReceipt.schoolName}</h2>
                  <p className="text-gray-600">Official Payment Receipt</p>
                </div>

                {/* Receipt Number and Date */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-xs text-gray-600 uppercase">Receipt Number</p>
                    <p className="font-mono font-bold text-lg">{selectedReceipt.receiptNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 uppercase">Date</p>
                    <p className="font-bold text-lg">{selectedReceipt.paymentDate}</p>
                  </div>
                </div>

                {/* Student Information */}
                <div className="mb-6 pb-4 border-b">
                  <p className="text-xs text-gray-600 uppercase mb-1">Student Name</p>
                  <p className="font-bold text-lg text-gray-900">{selectedReceipt.studentName}</p>
                  <p className="text-sm text-gray-600 mt-2">Payment Code: {selectedReceipt.paymentCode}</p>
                </div>

                {/* Payment Details */}
                <div className="mb-6 pb-4 border-b space-y-3">
                  <div className="flex justify-between">
                    <p className="text-gray-700">Amount Paid</p>
                    <p className="font-bold text-lg text-green-600">KES {selectedReceipt.amountPaid.toLocaleString()}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-gray-700">Remaining Balance</p>
                    <p className="font-bold text-lg text-orange-600">KES {selectedReceipt.remainingBalance.toLocaleString()}</p>
                  </div>
                </div>

                {/* Footer */}
                <div className="text-center text-xs text-gray-600 pt-4">
                  <p>This is an official receipt. Please keep for your records.</p>
                  <p className="mt-2">Thank you for your payment</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  onClick={() => handleDownloadReceipt(selectedReceipt)}
                  className="flex-1 gap-2"
                >
                  <Download size={18} /> Download PDF
                </Button>
                <Button
                  onClick={() => handlePrintReceipt(selectedReceipt)}
                  variant="outline"
                  className="flex-1 gap-2"
                >
                  <Printer size={18} /> Print
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
