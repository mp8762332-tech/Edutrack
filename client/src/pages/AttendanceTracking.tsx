import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { demoAttendanceRecords, dayShorts, getAttendanceSummary, getAbsentStudents } from "@/lib/attendanceData";
import { demoStudents } from "@/lib/enterpriseData";
import { AlertCircle, Download, Save, Calendar } from "lucide-react";
import { toast } from "sonner";

export default function AttendanceTracking() {
  const [selectedClass, setSelectedClass] = useState("class-1");
  const [selectedWeek, setSelectedWeek] = useState(24);
  const [attendance, setAttendance] = useState(demoAttendanceRecords);
  const [hasChanges, setHasChanges] = useState(false);

      const classStudents = demoStudents.filter((s: any) => s.classId === selectedClass);
  const weekAttendance = attendance.filter((a) => a.classId === selectedClass && a.week === selectedWeek);
  const summary = getAttendanceSummary(weekAttendance);
  const absentStudents = getAbsentStudents(weekAttendance);

  const toggleAttendance = (studentId: string, day: string) => {
    setAttendance((prev) =>
      prev.map((record) => {
        if (record.studentId === studentId && record.classId === selectedClass && record.week === selectedWeek) {
          return {
            ...record,
            [day.toLowerCase()]: !record[day.toLowerCase() as keyof typeof record],
          };
        }
        return record;
      })
    );
    setHasChanges(true);
  };

  const handleSaveAttendance = () => {
    // Mark all blank boxes with red X
    const updatedAttendance = attendance.map((record) => {
      if (record.classId === selectedClass && record.week === selectedWeek) {
        return record;
      }
      return record;
    });

    setAttendance(updatedAttendance);
    toast.success("Attendance saved successfully!");
    setHasChanges(false);
  };

  const handleDownloadReport = () => {
    const csv = [
      ["Class", selectedClass, "Week", selectedWeek].join(","),
      [""],
      ["Student Name", ...dayShorts, "Present Days", "Absent Days", "Attendance %"].join(","),
      ...summary.map((s) =>
        [s.studentName, ...dayShorts.map(() => ""), s.presentDays, s.absentDays, `${s.attendancePercentage}%`].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `attendance-${selectedClass}-week${selectedWeek}.csv`;
    a.click();
    toast.success("Attendance report downloaded!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Calendar size={24} /> Daily Attendance
          </h2>
          <p className="text-gray-600 mt-1">Mark attendance for week {selectedWeek}</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button onClick={handleDownloadReport} variant="outline" className="gap-2">
            <Download size={18} /> Download Report
          </Button>
          <Button
            onClick={handleSaveAttendance}
            disabled={!hasChanges}
            className="gap-2 bg-green-600 hover:bg-green-700"
          >
            <Save size={18} /> Save Attendance
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium block mb-2">Select Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="class-1">S1A</option>
              <option value="class-2">S1B</option>
              <option value="class-3">S2A</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium block mb-2">Select Week</label>
            <select
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(parseInt(e.target.value))}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              {[20, 21, 22, 23, 24, 25, 26].map((w) => (
                <option key={w} value={w}>
                  Week {w}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Attendance Table */}
      <Card className="p-6 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-bold">Student Name</TableHead>
              {dayShorts.map((day) => (
                <TableHead key={day} className="text-center font-bold">
                  {day}
                </TableHead>
              ))}
              <TableHead className="text-center font-bold">Present</TableHead>
              <TableHead className="text-center font-bold">Absent</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {classStudents.map((student: any) => {
              const studentAttendance = weekAttendance.find((a) => a.studentId === student.id);
              const studentSummary = summary.find((s) => s.studentId === student.id);

              if (!studentAttendance) return null;

              return (
                <TableRow key={student.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{student.firstName} {student.lastName}</TableCell>

                  {/* Day Boxes */}
                  {dayShorts.map((day) => {
                    const dayKey = day.toLowerCase();
                    const isPresent = studentAttendance[dayKey as keyof typeof studentAttendance];

                    return (
                      <TableCell key={day} className="text-center p-2">
                        <button
                          onClick={() => toggleAttendance(student.id, dayKey)}
                          className={`w-10 h-10 rounded border-2 font-bold text-lg transition flex items-center justify-center ${
                            isPresent
                              ? "bg-green-100 border-green-500 text-green-700"
                              : "bg-gray-50 border-gray-300 text-gray-400 hover:border-gray-400"
                          }`}
                        >
                          {isPresent ? "✓" : ""}
                        </button>
                      </TableCell>
                    );
                  })}

                  {/* Summary */}
                  <TableCell className="text-center">
                    <Badge className="bg-green-600">{studentSummary?.presentDays}</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge className="bg-red-600">{studentSummary?.absentDays}</Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>

      {/* Attendance Summary */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Class Statistics */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Class Statistics</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Students:</span>
              <span className="font-bold text-lg">{classStudents.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average Attendance:</span>
              <span className="font-bold text-lg text-green-600">
                {Math.round(summary.reduce((acc, s) => acc + s.attendancePercentage, 0) / summary.length)}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Students with 2+ Absences:</span>
              <span className="font-bold text-lg text-red-600">{absentStudents.length}</span>
            </div>
          </div>
        </Card>

        {/* Absence Alerts */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <AlertCircle className="text-red-600" size={20} /> Absence Alerts
          </h3>
          {absentStudents.length > 0 ? (
            <div className="space-y-2">
              {absentStudents.map((student) => (
                <div key={student.studentId} className="p-3 bg-red-50 border border-red-200 rounded">
                  <p className="font-medium text-red-900">{student.studentName}</p>
                  <p className="text-sm text-red-700">{student.absentDays} absences this week</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No students with excessive absences</p>
          )}
        </Card>
      </div>

      {/* Instructions */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <h4 className="font-medium text-blue-900 mb-2">📋 How to Use:</h4>
        <ul className="text-sm text-blue-900 space-y-1">
          <li>✓ Click the box to mark a student as <strong>Present</strong> (green with tick)</li>
          <li>✓ Leave blank to mark as <strong>Absent</strong> (will show red X after saving)</li>
          <li>✓ Click <strong>Save Attendance</strong> to record the data</li>
          <li>✓ Download report to share with admin or keep records</li>
        </ul>
      </Card>
    </div>
  );
}
