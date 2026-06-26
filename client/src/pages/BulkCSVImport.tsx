import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Upload,
  Download,
  CheckCircle2,
  AlertCircle,
  FileText,
  Users,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

interface ImportedStudent {
  id: number;
  firstName: string;
  lastName: string;
  class: string;
  stream: string;
  gender: string;
  dob: string;
  parentName: string;
  parentPhone: string;
  status: "pending" | "created" | "error";
}

interface ImportedTeacher {
  id: number;
  firstName: string;
  lastName: string;
  subject: string;
  classes: string;
  phone: string;
  email: string;
  position: string;
  status: "pending" | "created" | "error";
}

export default function BulkCSVImport() {
  const [importType, setImportType] = useState<"students" | "teachers">("students");
  const [step, setStep] = useState<"upload" | "preview" | "processing" | "complete">("upload");
  const [progress, setProgress] = useState(0);
  const [processedCount, setProcessedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [importedStudents, setImportedStudents] = useState<ImportedStudent[]>([]);
  const [importedTeachers, setImportedTeachers] = useState<ImportedTeacher[]>([]);
  const [startTime, setStartTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Demo: Generate fake student data from CSV
  const generateFakeStudents = (count: number): ImportedStudent[] => {
    const firstNames = ["Alice", "Brian", "Catherine", "David", "Esther", "Francis", "Grace", "Henry", "Irene", "James", "Kezia", "Lawrence", "Mary", "Nathan", "Olivia", "Peter", "Queen", "Robert", "Sarah", "Timothy"];
    const lastNames = ["Nakamya", "Ssempijja", "Namugga", "Okello", "Achieng", "Mugisha", "Nalwanga", "Kizza", "Namutebi", "Wasswa", "Babirye", "Opio", "Nankya", "Lubega", "Atim", "Muwanga", "Nabirye", "Ddumba", "Kisakye", "Tumwine"];
    const classes = ["S1", "S2", "S3", "S4"];
    const streams = ["A", "B", "C"];
    const genders = ["Male", "Female"];

    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
      lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
      class: classes[Math.floor(Math.random() * classes.length)],
      stream: streams[Math.floor(Math.random() * streams.length)],
      gender: genders[Math.floor(Math.random() * genders.length)],
      dob: `200${Math.floor(Math.random() * 9)}-0${Math.floor(Math.random() * 9) + 1}-${Math.floor(Math.random() * 28) + 1}`,
      parentName: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
      parentPhone: `07${Math.floor(Math.random() * 9)}${Math.floor(1000000 + Math.random() * 9000000)}`,
      status: "pending" as const,
    }));
  };

  const generateFakeTeachers = (count: number): ImportedTeacher[] => {
    const firstNames = ["Peter", "Jane", "Moses", "Sarah", "John", "Agnes", "Paul", "Ruth", "Samuel", "Esther"];
    const lastNames = ["Kipchoge", "Namuli", "Okot", "Auma", "Wafula", "Nabirye", "Ochieng", "Nakato", "Mugisha", "Atim"];
    const subjects = ["Mathematics", "English", "Physics", "Chemistry", "Biology", "History", "Geography", "Agriculture", "ICT", "Art & Design"];
    const positions = ["Regular Teacher", "Class Teacher", "DOS", "HOD"];

    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
      lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
      subject: subjects[Math.floor(Math.random() * subjects.length)],
      classes: `S${Math.floor(Math.random() * 4) + 1}A, S${Math.floor(Math.random() * 4) + 1}B`,
      phone: `07${Math.floor(Math.random() * 9)}${Math.floor(1000000 + Math.random() * 9000000)}`,
      email: `teacher${i + 1}@school.edu`,
      position: positions[Math.floor(Math.random() * positions.length)],
      status: "pending" as const,
    }));
  };

  const handleFileUpload = () => {
    const count = importType === "students" ? 8000 : 45;
    if (importType === "students") {
      const students = generateFakeStudents(count);
      setImportedStudents(students);
      setTotalCount(count);
    } else {
      const teachers = generateFakeTeachers(count);
      setImportedTeachers(teachers);
      setTotalCount(count);
    }
    setStep("preview");
    toast.success(`CSV file loaded: ${count} ${importType} found`);
  };

  const handleStartImport = () => {
    setStep("processing");
    setStartTime(Date.now());
    setProgress(0);
    setProcessedCount(0);

    // Simulate fast processing (8000 students in ~10 seconds for demo)
    const batchSize = importType === "students" ? 200 : 3;
    const interval = 50; // 50ms per batch
    let processed = 0;

    const timer = setInterval(() => {
      processed += batchSize;
      if (processed >= totalCount) {
        processed = totalCount;
        clearInterval(timer);
        setStep("complete");
        toast.success(`All ${totalCount} ${importType} accounts created successfully!`);
      }
      setProcessedCount(processed);
      setProgress(Math.round((processed / totalCount) * 100));
      setElapsedTime(Math.round((Date.now() - Date.now() + 1000) / 1000));
    }, interval);
  };

  const handleDownloadTemplate = () => {
    const headers = importType === "students"
      ? "FirstName,LastName,Class,Stream,Gender,DateOfBirth,ParentName,ParentPhone"
      : "FirstName,LastName,Subject,Classes,Phone,Email,Position";

    const blob = new Blob([headers + "\n"], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${importType}_template.csv`;
    a.click();
    toast.success("Template downloaded!");
  };

  // Update elapsed time during processing
  useEffect(() => {
    if (step === "processing" && startTime > 0) {
      const timer = setInterval(() => {
        setElapsedTime(Math.round((Date.now() - startTime) / 1000));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step, startTime]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Bulk CSV Import</h1>
          <p className="text-gray-600 mt-2">Import students or teachers from Excel/CSV files</p>
        </div>

        {/* Import Type Selector */}
        <div className="flex gap-4 mb-8">
          <Button
            onClick={() => { setImportType("students"); setStep("upload"); }}
            variant={importType === "students" ? "default" : "outline"}
            className="gap-2"
          >
            <Users size={18} /> Import Students
          </Button>
          <Button
            onClick={() => { setImportType("teachers"); setStep("upload"); }}
            variant={importType === "teachers" ? "default" : "outline"}
            className="gap-2"
          >
            <Users size={18} /> Import Teachers
          </Button>
        </div>

        {/* Step 1: Upload */}
        {step === "upload" && (
          <Card className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-xl font-bold text-gray-900">
                Upload {importType === "students" ? "Students" : "Teachers"} CSV File
              </h2>
              <p className="text-gray-600 mt-2">
                {importType === "students"
                  ? "Upload your Excel/CSV file with student data. The system will create individual accounts for each student."
                  : "Upload your Excel/CSV file with teacher data. Each teacher will get a separate account."}
              </p>
            </div>

            {/* Download Template */}
            <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-blue-900">Download CSV Template</p>
                  <p className="text-sm text-blue-700">Use this template to format your data correctly</p>
                </div>
                <Button onClick={handleDownloadTemplate} variant="outline" className="gap-2">
                  <Download size={18} /> Download Template
                </Button>
              </div>
            </div>

            {/* Upload Area */}
            <div
              onClick={handleFileUpload}
              className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition"
            >
              <Upload className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-lg font-medium text-gray-700">Click to upload CSV file</p>
              <p className="text-sm text-gray-500 mt-2">or drag and drop here</p>
              <p className="text-xs text-gray-400 mt-4">Supports .csv, .xlsx files up to 50MB</p>
            </div>

            {/* Info */}
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded">
              <p className="text-sm text-green-900">
                <strong>Performance:</strong> The system can process up to 10,000 {importType} in under 5 minutes.
                Each {importType === "students" ? "student" : "teacher"} gets a separate individual account.
              </p>
            </div>

            {/* Demo hint */}
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-xs text-yellow-900">
                <strong>Demo:</strong> Click the upload area to simulate uploading a CSV with {importType === "students" ? "8,000 students" : "45 teachers"}.
              </p>
            </div>
          </Card>
        )}

        {/* Step 2: Preview */}
        {step === "preview" && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Preview Import Data</h2>
                <p className="text-gray-600 mt-1">
                  Found <strong>{totalCount}</strong> {importType} in the CSV file
                </p>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setStep("upload")} variant="outline">
                  Cancel
                </Button>
                <Button onClick={handleStartImport} className="gap-2 bg-green-600 hover:bg-green-700">
                  <ArrowRight size={18} /> Start Import ({totalCount} {importType})
                </Button>
              </div>
            </div>

            {/* Preview Table - Show first 10 */}
            <div className="overflow-x-auto">
              {importType === "students" ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>First Name</TableHead>
                      <TableHead>Last Name</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Stream</TableHead>
                      <TableHead>Gender</TableHead>
                      <TableHead>DOB</TableHead>
                      <TableHead>Parent</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {importedStudents.slice(0, 10).map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>{student.id}</TableCell>
                        <TableCell className="font-medium">{student.firstName}</TableCell>
                        <TableCell>{student.lastName}</TableCell>
                        <TableCell>{student.class}</TableCell>
                        <TableCell>{student.stream}</TableCell>
                        <TableCell>{student.gender}</TableCell>
                        <TableCell className="text-xs">{student.dob}</TableCell>
                        <TableCell className="text-xs">{student.parentName}</TableCell>
                        <TableCell>
                          <Badge className="bg-yellow-500">Pending</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>First Name</TableHead>
                      <TableHead>Last Name</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Classes</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {importedTeachers.slice(0, 10).map((teacher) => (
                      <TableRow key={teacher.id}>
                        <TableCell>{teacher.id}</TableCell>
                        <TableCell className="font-medium">{teacher.firstName}</TableCell>
                        <TableCell>{teacher.lastName}</TableCell>
                        <TableCell>{teacher.subject}</TableCell>
                        <TableCell>{teacher.classes}</TableCell>
                        <TableCell className="text-xs">{teacher.phone}</TableCell>
                        <TableCell>{teacher.position}</TableCell>
                        <TableCell>
                          <Badge className="bg-yellow-500">Pending</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>

            {totalCount > 10 && (
              <p className="text-sm text-gray-500 mt-4 text-center">
                Showing 10 of {totalCount} records. All will be imported.
              </p>
            )}
          </Card>
        )}

        {/* Step 3: Processing */}
        {step === "processing" && (
          <Card className="p-8">
            <div className="text-center mb-8">
              <Loader2 className="mx-auto text-blue-600 animate-spin mb-4" size={48} />
              <h2 className="text-xl font-bold text-gray-900">Creating Accounts...</h2>
              <p className="text-gray-600 mt-2">
                Processing {totalCount} {importType}. Please wait...
              </p>
            </div>

            {/* Progress Bar */}
            <div className="max-w-md mx-auto space-y-4">
              <Progress value={progress} className="h-4" />
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{processedCount} / {totalCount} processed</span>
                <span className="font-bold text-blue-600">{progress}%</span>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500">Elapsed: {elapsedTime}s</p>
                <p className="text-xs text-gray-500">
                  Speed: ~{Math.round(processedCount / Math.max(elapsedTime, 1))} accounts/second
                </p>
              </div>
            </div>

            {/* Live Feed */}
            <div className="mt-8 p-4 bg-gray-900 rounded text-green-400 font-mono text-xs max-h-40 overflow-y-auto">
              <p>Creating account: Student #{processedCount}...</p>
              <p>Assigning class and stream...</p>
              <p>Generating student ID...</p>
              <p>Account created successfully</p>
              <p className="text-yellow-400">Batch {Math.ceil(processedCount / 200)} complete</p>
            </div>
          </Card>
        )}

        {/* Step 4: Complete */}
        {step === "complete" && (
          <Card className="p-8 text-center">
            <CheckCircle2 className="mx-auto text-green-600 mb-4" size={64} />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Import Complete!</h2>
            <p className="text-gray-600 mb-6">
              Successfully created <strong>{totalCount}</strong> {importType} accounts
            </p>

            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="p-4 bg-green-50 border border-green-200 rounded">
                <p className="text-2xl font-bold text-green-600">{totalCount}</p>
                <p className="text-sm text-green-900">Accounts Created</p>
              </div>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded">
                <p className="text-2xl font-bold text-blue-600">0</p>
                <p className="text-sm text-blue-900">Errors</p>
              </div>
              <div className="p-4 bg-purple-50 border border-purple-200 rounded">
                <p className="text-2xl font-bold text-purple-600">{elapsedTime}s</p>
                <p className="text-sm text-purple-900">Total Time</p>
              </div>
            </div>

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded mb-6">
              <p className="text-sm text-yellow-900">
                <strong>Next Step:</strong> Go to the {importType === "students" ? "Students" : "Teachers"} tab to complete missing information
                (photos, additional details) for each account.
              </p>
            </div>

            <div className="flex gap-4 justify-center">
              <Button onClick={() => setStep("upload")} variant="outline" className="gap-2">
                <Upload size={18} /> Import More
              </Button>
              <Button onClick={() => toast.success("Navigating to dashboard...")} className="gap-2">
                <ArrowRight size={18} /> Go to Dashboard
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
