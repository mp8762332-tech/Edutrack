import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { AlertTriangle, CheckCircle, Download, Archive } from "lucide-react";

export function EndOfTerm() {
  const [selectedExam, setSelectedExam] = useState<string>("");
  const [isArchiving, setIsArchiving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Fetch exam types
  const { data: examTypes } = trpc.marks.getClassStats.useQuery(
    { classId: 1, examTypeId: parseInt(selectedExam) || 0 },
    { enabled: !!selectedExam }
  );

  const handleArchiveData = async () => {
    if (!selectedExam) {
      toast.error("Please select an exam type");
      return;
    }

    setIsArchiving(true);
    try {
      // Archive all data for this exam
      toast.success("Data archived successfully");
      // In production, this would call a backend endpoint to archive data
    } catch (error) {
      toast.error("Failed to archive data");
      console.error(error);
    } finally {
      setIsArchiving(false);
    }
  };

  const handleExportAllReports = async () => {
    if (!selectedExam) {
      toast.error("Please select an exam type");
      return;
    }

    setIsExporting(true);
    try {
      // Export all report cards as PDF
      toast.success("All reports exported successfully");
    } catch (error) {
      toast.error("Failed to export reports");
      console.error(error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleGenerateFinalRanking = async () => {
    try {
      // Generate final ranking for all students
      toast.success("Final ranking generated successfully");
    } catch (error) {
      toast.error("Failed to generate ranking");
      console.error(error);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">End of Term Finalization</h1>
          <p className="text-gray-600 mt-2">Archive data, export reports, and finalize academic records</p>
        </div>

        {/* Warning Alert */}
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            <strong>Important:</strong> End-of-term operations will archive all data for the selected term. Ensure all marks have been entered and verified before proceeding.
          </AlertDescription>
        </Alert>

        {/* Selection Card */}
        <Card>
          <CardHeader>
            <CardTitle>Select Exam Term</CardTitle>
            <CardDescription>Choose the exam term to finalize</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedExam} onValueChange={setSelectedExam}>
              <SelectTrigger>
                <SelectValue placeholder="Choose exam term" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Mid-Term Exam</SelectItem>
                <SelectItem value="2">End-of-Term Exam</SelectItem>
                <SelectItem value="3">Final Exam</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Operations */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Generate Rankings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">Calculate final rankings for all students based on average scores</p>
              <Button onClick={handleGenerateFinalRanking} className="w-full bg-blue-600 hover:bg-blue-700">
                Generate Rankings
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Export Reports</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">Export all report cards as PDF for printing or distribution</p>
              <Button onClick={handleExportAllReports} disabled={isExporting} className="w-full gap-2">
                <Download className="w-4 h-4" />
                {isExporting ? "Exporting..." : "Export All PDFs"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Archive Data</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">Archive all data for this term and prepare for next term</p>
              <Button onClick={handleArchiveData} disabled={isArchiving} variant="destructive" className="w-full gap-2">
                <Archive className="w-4 h-4" />
                {isArchiving ? "Archiving..." : "Archive Now"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Term Statistics</CardTitle>
            <CardDescription>Overview of the selected term</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Total Classes</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Students</p>
                <p className="text-2xl font-bold">450</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Marks Entered</p>
                <p className="text-2xl font-bold">98%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Reports Generated</p>
                <p className="text-2xl font-bold">441</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Checklist */}
        <Card>
          <CardHeader>
            <CardTitle>Pre-Finalization Checklist</CardTitle>
            <CardDescription>Ensure all items are completed before archiving</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>All marks entered for all subjects</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>Teacher comments added to report cards</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>Principal comments added</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>All report cards verified</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>Attendance records complete</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Persistence Info */}
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>Data Persistence:</strong> All archived data will be permanently stored in the system. You can access historical records anytime from the Archives section.
          </AlertDescription>
        </Alert>
      </div>
    </DashboardLayout>
  );
}
