import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import { Upload, Plus, CheckCircle2, AlertCircle, Loader } from "lucide-react";

export default function StudentRegistration() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("single");

  // Single Registration State
  const [singleForm, setSingleForm] = useState({
    classId: "",
    admissionNumber: "",
    dateOfBirth: "",
    gender: "",
    parentName: "",
    parentPhone: "",
    healthStatus: "",
  });

  // CSV Import State
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<any[]>([]);
  const [csvClass, setCsvClass] = useState("");
  const [csvProgress, setCsvProgress] = useState({ total: 0, imported: 0, failed: 0 });
  const [showCsvProgress, setShowCsvProgress] = useState(false);

  // Fetch classes
  const { data: classes = [] } = trpc.classes.list.useQuery();

  // Fetch students in selected class
  const { data: students = [] } = trpc.students.list.useQuery(
    { classId: parseInt(singleForm.classId) || 0 },
    { enabled: !!singleForm.classId }
  );

  // Mutations
  const createStudentMutation = trpc.students.create.useMutation({
    onSuccess: () => {
      toast.success("✅ Student registered successfully");
      setSingleForm({
        classId: "",
        admissionNumber: "",
        dateOfBirth: "",
        gender: "",
        parentName: "",
        parentPhone: "",
        healthStatus: "",
      });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to register student");
    },
  });

  const bulkImportMutation = trpc.students.bulkImport.useMutation({
    onSuccess: (result) => {
      setCsvProgress({ total: csvData.length, imported: result.imported || 0, failed: result.failed || 0 });
      toast.success(`✅ Imported ${result.imported} students (${result.failed} failed)`);
      setCsvData([]);
      setCsvFile(null);
      setTimeout(() => setShowCsvProgress(false), 2000);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to import students");
      setShowCsvProgress(false);
    },
  });

  const handleSingleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!singleForm.classId || !singleForm.admissionNumber) {
      toast.error("Please fill in required fields");
      return;
    }

    await createStudentMutation.mutateAsync({
      classId: parseInt(singleForm.classId),
      admissionNumber: singleForm.admissionNumber,
      dateOfBirth: singleForm.dateOfBirth || undefined,
      gender: (singleForm.gender as any) || undefined,
      parentName: singleForm.parentName || undefined,
      parentPhone: singleForm.parentPhone || undefined,
      healthStatus: singleForm.healthStatus || undefined,
    });
  };

  const handleCsvFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCsvFile(file);

    // Parse CSV
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split("\n").filter((line) => line.trim());

      // Skip header row
      const data = lines.slice(1).map((line) => {
        const [admissionNumber, name, dateOfBirth, gender, parentName, parentPhone] = line.split(",").map((v) => v.trim());
        return {
          admissionNumber,
          name,
          dateOfBirth,
          gender: gender?.toLowerCase() === "male" || gender?.toLowerCase() === "female" ? gender.toLowerCase() : undefined,
          parentName,
          parentPhone,
        };
      });

      setCsvData(data);
      toast.success(`✅ Loaded ${data.length} students from CSV`);
    };

    reader.readAsText(file);
  };

  const handleCsvImport = async () => {
    if (!csvClass) {
      toast.error("Please select a class");
      return;
    }

    if (csvData.length === 0) {
      toast.error("No students to import");
      return;
    }

    setShowCsvProgress(true);
    setCsvProgress({ total: csvData.length, imported: 0, failed: 0 });

    await bulkImportMutation.mutateAsync({
      classId: parseInt(csvClass),
      students: csvData,
    });
  };

  if (!user || user.role !== "school_admin") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Only school administrators can manage student registrations.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Student Registration</h1>
          <p className="text-muted-foreground mt-2">Register students individually or import from CSV</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="single" className="gap-2">
              <Plus className="w-4 h-4" />
              Single Registration
            </TabsTrigger>
            <TabsTrigger value="bulk" className="gap-2">
              <Upload className="w-4 h-4" />
              Bulk Import
            </TabsTrigger>
          </TabsList>

          {/* Single Registration Tab */}
          <TabsContent value="single" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Register New Student</CardTitle>
                <CardDescription>Enter student details and parent information</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSingleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="classId">Class *</Label>
                      <Select value={singleForm.classId} onValueChange={(value) => setSingleForm({ ...singleForm, classId: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select class" />
                        </SelectTrigger>
                        <SelectContent>
                          {classes.map((cls: any) => (
                            <SelectItem key={cls.id} value={cls.id.toString()}>
                              {cls.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="admissionNumber">Admission Number *</Label>
                      <Input
                        id="admissionNumber"
                        placeholder="ADM001"
                        value={singleForm.admissionNumber}
                        onChange={(e) => setSingleForm({ ...singleForm, admissionNumber: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={singleForm.dateOfBirth}
                        onChange={(e) => setSingleForm({ ...singleForm, dateOfBirth: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="gender">Gender</Label>
                      <Select value={singleForm.gender} onValueChange={(value) => setSingleForm({ ...singleForm, gender: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="parentName">Parent Name</Label>
                      <Input
                        id="parentName"
                        placeholder="Parent/Guardian name"
                        value={singleForm.parentName}
                        onChange={(e) => setSingleForm({ ...singleForm, parentName: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="parentPhone">Parent Phone</Label>
                      <Input
                        id="parentPhone"
                        placeholder="+256 700 000000"
                        value={singleForm.parentPhone}
                        onChange={(e) => setSingleForm({ ...singleForm, parentPhone: e.target.value })}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="healthStatus">Health Status</Label>
                      <Input
                        id="healthStatus"
                        placeholder="Any allergies or medical conditions"
                        value={singleForm.healthStatus}
                        onChange={(e) => setSingleForm({ ...singleForm, healthStatus: e.target.value })}
                      />
                    </div>
                  </div>

                  <Button type="submit" disabled={createStudentMutation.isPending} className="w-full">
                    {createStudentMutation.isPending ? "Registering..." : "Register Student"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Students List */}
            {singleForm.classId && students.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Students in Class ({students.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Admission No.</TableHead>
                          <TableHead>Date of Birth</TableHead>
                          <TableHead>Gender</TableHead>
                          <TableHead>Parent Name</TableHead>
                          <TableHead>Parent Phone</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {students.map((student: any) => (
                          <TableRow key={student.id}>
                            <TableCell className="font-mono">{student.admissionNumber}</TableCell>
                            <TableCell>{student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : "-"}</TableCell>
                            <TableCell className="capitalize">{student.gender || "-"}</TableCell>
                            <TableCell>{student.parentName || "-"}</TableCell>
                            <TableCell>{student.parentPhone || "-"}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Bulk Import Tab */}
          <TabsContent value="bulk" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Bulk Import Students</CardTitle>
                <CardDescription>Import students from CSV file (max 10,000 students)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="csvClass">Select Class *</Label>
                    <Select value={csvClass} onValueChange={setCsvClass}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                      <SelectContent>
                        {classes.map((cls: any) => (
                          <SelectItem key={cls.id} value={cls.id.toString()}>
                            {cls.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="csvFile">CSV File *</Label>
                    <Input
                      id="csvFile"
                      type="file"
                      accept=".csv"
                      onChange={handleCsvFileSelect}
                    />
                  </div>
                </div>

                {/* CSV Format Help */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded">
                  <p className="font-semibold text-blue-900 mb-2">📋 CSV Format:</p>
                  <p className="text-sm text-blue-800 font-mono">
                    admissionNumber,name,dateOfBirth,gender,parentName,parentPhone
                  </p>
                  <p className="text-sm text-blue-800 mt-2">Example:</p>
                  <p className="text-sm text-blue-800 font-mono">
                    ADM001,John Doe,2010-05-15,male,Jane Doe,+256700000000
                  </p>
                </div>

                {/* CSV Preview */}
                {csvData.length > 0 && (
                  <div>
                    <p className="font-semibold mb-3">Preview ({csvData.length} students)</p>
                    <div className="overflow-x-auto max-h-64 border rounded">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Admission No.</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>DOB</TableHead>
                            <TableHead>Gender</TableHead>
                            <TableHead>Parent</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {csvData.slice(0, 10).map((row, idx) => (
                            <TableRow key={idx}>
                              <TableCell className="font-mono text-sm">{row.admissionNumber}</TableCell>
                              <TableCell className="text-sm">{row.name}</TableCell>
                              <TableCell className="text-sm">{row.dateOfBirth}</TableCell>
                              <TableCell className="text-sm capitalize">{row.gender || "-"}</TableCell>
                              <TableCell className="text-sm">{row.parentName || "-"}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    {csvData.length > 10 && <p className="text-sm text-muted-foreground mt-2">... and {csvData.length - 10} more</p>}
                  </div>
                )}

                {/* Progress Indicator */}
                {showCsvProgress && (
                  <Card className="border-blue-200 bg-blue-50">
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          {csvProgress.failed === 0 ? (
                            <CheckCircle2 className="text-green-600" size={20} />
                          ) : (
                            <AlertCircle className="text-orange-600" size={20} />
                          )}
                          <span className="font-semibold">
                            {csvProgress.imported}/{csvProgress.total} students imported
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(csvProgress.imported / csvProgress.total) * 100}%` }}
                          />
                        </div>
                        {csvProgress.failed > 0 && (
                          <p className="text-sm text-orange-700">{csvProgress.failed} failed - check data format</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Button
                  onClick={handleCsvImport}
                  disabled={bulkImportMutation.isPending || csvData.length === 0 || !csvClass}
                  className="w-full gap-2"
                >
                  {bulkImportMutation.isPending ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Importing {csvProgress.imported}/{csvProgress.total}...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Import {csvData.length} Students
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
