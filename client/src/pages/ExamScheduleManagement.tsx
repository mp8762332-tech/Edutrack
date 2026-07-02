import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Plus, Trash2, Save, AlertCircle, CheckCircle2, Calendar, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { ExamCalendar } from "@/components/ExamCalendar";

export default function ExamScheduleManagement() {
  const [selectedExam, setSelectedExam] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [selectedInvigilators, setSelectedInvigilators] = useState<number[]>([]);
  const [invigilatorConflicts, setInvigilatorConflicts] = useState<{ [key: number]: string[] }>({});
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [viewMode, setViewMode] = useState<"calendar" | "table">("calendar");
  const [newSchedule, setNewSchedule] = useState({
    examDate: "",
    startTime: "08:00",
    endTime: "10:00",
    room: "",
    invigilators: [] as number[],
  });

  // Fetch data
  const { data: exams = [] } = trpc.exams.list.useQuery({} as any);
  const { data: classes = [] } = trpc.classes.list.useQuery();
  const { data: teachers = [] } = trpc.teachers.listBySchool.useQuery({} as any);

  // Fetch timetables for exam schedule
  const { data: examSchedule = [] } = trpc.timetables.getByClass.useQuery(
    { classId: parseInt(selectedClass) || 0, type: "end_of_term_exam" },
    { enabled: !!selectedClass }
  );

  // Fetch all exam schedules to check for conflicts
  const { data: allExamSchedules = [] } = trpc.timetables.getByClass.useQuery(
    { classId: parseInt(selectedClass) || 0, type: "end_of_term_exam" },
    { enabled: !!selectedClass }
  );

  // Mutations
  const createScheduleMutation = trpc.timetables.create.useMutation({
    onSuccess: () => {
      toast.success("✅ Exam schedule created successfully");
      setNewSchedule({
        examDate: "",
        startTime: "08:00",
        endTime: "10:00",
        room: "",
        invigilators: [],
      });
      setSelectedInvigilators([]);
      setIsAdding(false);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create schedule");
    },
  });

  const deleteScheduleMutation = trpc.timetables.delete.useMutation({
    onSuccess: () => {
      toast.success("✅ Schedule deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete schedule");
    },
  });

  const handleAddSchedule = async () => {
    if (!selectedExam || !selectedClass || !newSchedule.examDate || !newSchedule.startTime || !newSchedule.endTime) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(newSchedule.examDate)) {
      toast.error("Please use YYYY-MM-DD format for date");
      return;
    }

    // Validate time format
    const timeRegex = /^\d{2}:\d{2}$/;
    if (!timeRegex.test(newSchedule.startTime) || !timeRegex.test(newSchedule.endTime)) {
      toast.error("Please use HH:MM format for times");
      return;
    }

    // Validate end time > start time
    if (newSchedule.endTime <= newSchedule.startTime) {
      toast.error("End time must be after start time");
      return;
    }

    // Validate date is in future
    const examDate = new Date(newSchedule.examDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (examDate < today) {
      toast.error("Exam date cannot be in the past");
      return;
    }

    // Get subject for this class (use first subject as placeholder)
    const subjectId = 1; // In real scenario, would select from dropdown

    await createScheduleMutation.mutateAsync({
      classId: parseInt(selectedClass),
      type: "end_of_term_exam",
      dayOfWeek: "monday", // Will be overridden by actual date
      startTime: newSchedule.startTime,
      endTime: newSchedule.endTime,
      subjectId,
      teacherId: selectedInvigilators[0] || 1,
      room: newSchedule.room || undefined,
      examTypeId: parseInt(selectedExam),
      invigilators: selectedInvigilators.length > 0 ? selectedInvigilators : undefined,
    });
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this exam schedule?")) {
      await deleteScheduleMutation.mutateAsync({ id });
    }
  };

  const toggleInvigilator = (teacherId: number) => {
    setSelectedInvigilators((prev) =>
      prev.includes(teacherId) ? prev.filter((t) => t !== teacherId) : [...prev, teacherId]
    );

    // Check for conflicts
    checkInvigilatorConflicts(teacherId, !selectedInvigilators.includes(teacherId));
  };

  const checkInvigilatorConflicts = (teacherId: number, isAdding: boolean) => {
    if (!isAdding || !newSchedule.startTime || !newSchedule.endTime) {
      setInvigilatorConflicts({});
      return;
    }

    const newStart = parseInt(newSchedule.startTime.replace(":", ""));
    const newEnd = parseInt(newSchedule.endTime.replace(":", ""));

    const conflicts: string[] = [];

    // Check all exam schedules for time conflicts
    examSchedule.forEach((schedule: any) => {
      if (!schedule.invigilators) return;

      const invigilators = JSON.parse(schedule.invigilators);
      if (!invigilators.includes(teacherId)) return;

      const existingStart = parseInt(schedule.startTime.replace(":", ""));
      const existingEnd = parseInt(schedule.endTime.replace(":", ""));

      // Check for time overlap
      if (newStart < existingEnd && newEnd > existingStart) {
        const subject = schedule.subject?.name || "Unknown Subject";
        const room = schedule.room || "TBA";
        conflicts.push(`${subject} (${schedule.startTime}-${schedule.endTime}) in ${room}`);
      }
    });

    if (conflicts.length > 0) {
      setInvigilatorConflicts((prev) => ({
        ...prev,
        [teacherId]: conflicts,
      }));
    } else {
      setInvigilatorConflicts((prev) => {
        const updated = { ...prev };
        delete updated[teacherId];
        return updated;
      });
    }
  };

  // Calculate exam duration
  const calculateDuration = () => {
    if (!newSchedule.startTime || !newSchedule.endTime) return 0;
    const [startH, startM] = newSchedule.startTime.split(":").map(Number);
    const [endH, endM] = newSchedule.endTime.split(":").map(Number);
    return (endH * 60 + endM) - (startH * 60 + startM);
  };

  const duration = calculateDuration();

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Exam Schedule Management</h1>
          <p className="text-muted-foreground mt-2">Create and manage exam schedules with invigilator assignments</p>
        </div>

        {/* Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Select Exam *</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedExam} onValueChange={setSelectedExam}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose exam" />
                </SelectTrigger>
                <SelectContent>
                  {exams.map((exam: any) => (
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
              <CardTitle className="text-sm font-medium">Select Class *</CardTitle>
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

          <div className="flex items-end">
            <Button onClick={() => setIsAdding(!isAdding)} className="w-full gap-2">
              <Plus className="w-4 h-4" />
              Add Schedule
            </Button>
          </div>
        </div>

        {/* Add Schedule Form */}
        {isAdding && (
          <Card className="border-blue-200 bg-blue-50 mb-6">
            <CardHeader>
              <CardTitle className="text-base">Create Exam Schedule</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Date and Time Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="examDate" className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Exam Date (YYYY-MM-DD) *
                  </Label>
                  <Input
                    id="examDate"
                    type="date"
                    value={newSchedule.examDate}
                    onChange={(e) => setNewSchedule({ ...newSchedule, examDate: e.target.value })}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="startTime" className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Start Time (HH:MM) *
                  </Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={newSchedule.startTime}
                    onChange={(e) => setNewSchedule({ ...newSchedule, startTime: e.target.value })}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="endTime" className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    End Time (HH:MM) *
                  </Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={newSchedule.endTime}
                    onChange={(e) => setNewSchedule({ ...newSchedule, endTime: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Duration Display */}
              {duration > 0 && (
                <div className="bg-white p-3 rounded border border-blue-200">
                  <p className="text-sm text-gray-600">
                    Exam Duration: <span className="font-bold text-blue-600">{Math.floor(duration / 60)}h {duration % 60}m</span>
                  </p>
                </div>
              )}

              {/* Room */}
              <div>
                <Label htmlFor="room">Exam Room/Hall</Label>
                <Input
                  id="room"
                  placeholder="e.g., Main Hall, Lab A, Classroom 5"
                  value={newSchedule.room}
                  onChange={(e) => setNewSchedule({ ...newSchedule, room: e.target.value })}
                  className="mt-1"
                />
              </div>

              {/* Invigilators Selection */}
              <div>
                <Label className="mb-3 block">Assign Invigilators (Teachers who will supervise)</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-48 overflow-y-auto border rounded p-3 bg-white">
                  {teachers.length > 0 ? (
                    teachers.map((teacher: any) => {
                      const hasConflict = invigilatorConflicts[teacher.id]?.length > 0;
                      const isSelected = selectedInvigilators.includes(teacher.id);

                      return (
                        <div key={teacher.id}>
                          <div className={`flex items-center gap-2 p-2 rounded ${
                            hasConflict && isSelected ? "bg-red-50 border border-red-200" : ""
                          }`}>
                            <Checkbox
                              id={`invigilator-${teacher.id}`}
                              checked={isSelected}
                              onCheckedChange={() => toggleInvigilator(teacher.id)}
                            />
                            <Label htmlFor={`invigilator-${teacher.id}`} className="cursor-pointer flex-1">
                              Teacher {teacher.id}
                            </Label>
                            {hasConflict && isSelected && (
                              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                            )}
                          </div>
                          {hasConflict && isSelected && (
                            <div className="ml-6 mt-1 text-xs bg-red-50 border-l-2 border-red-600 p-2 rounded">
                              <p className="font-semibold text-red-700 mb-1">⚠️ Conflict detected:</p>
                              {invigilatorConflicts[teacher.id].map((conflict, idx) => (
                                <p key={idx} className="text-red-600 text-xs">
                                  • {conflict}
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-gray-500">No teachers available</p>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {selectedInvigilators.length} invigilator(s) selected
                  {Object.keys(invigilatorConflicts).length > 0 && (
                    <span className="text-red-600 font-semibold ml-2">
                      ({Object.keys(invigilatorConflicts).length} with conflicts)
                    </span>
                  )}
                </p>
              </div>

              {/* Conflict Warning */}
              {Object.keys(invigilatorConflicts).length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded p-3 flex gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-700 text-sm">⚠️ Invigilator Conflicts Detected</p>
                    <p className="text-red-600 text-xs mt-1">
                      {Object.keys(invigilatorConflicts).length} teacher(s) have overlapping exam duties. Please resolve conflicts before saving.
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  onClick={handleAddSchedule}
                  disabled={createScheduleMutation.isPending || Object.keys(invigilatorConflicts).length > 0}
                  className="gap-2 bg-green-600 hover:bg-green-700"
                >
                  {createScheduleMutation.isPending ? "Creating..." : "Create Schedule"}
                </Button>
                <Button onClick={() => setIsAdding(false)} variant="outline">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Exam Schedule Table */}
        {selectedClass && examSchedule.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Exam Schedules</CardTitle>
              <CardDescription>{examSchedule.length} exam(s) scheduled</CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Exam</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Room</TableHead>
                    <TableHead>Invigilators</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {examSchedule.map((schedule: any) => {
                    const invigilators = schedule.invigilators ? JSON.parse(schedule.invigilators) : [];
                    const [startH, startM] = schedule.startTime.split(":").map(Number);
                    const [endH, endM] = schedule.endTime.split(":").map(Number);
                    const durationMins = (endH * 60 + endM) - (startH * 60 + startM);

                    return (
                      <TableRow key={schedule.id}>
                        <TableCell className="font-medium">{schedule.examType?.name || "Exam"}</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell className="font-mono">
                          {schedule.startTime} - {schedule.endTime}
                        </TableCell>
                        <TableCell>{Math.floor(durationMins / 60)}h {durationMins % 60}m</TableCell>
                        <TableCell>{schedule.room || "-"}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {invigilators.length > 0 ? (
                              invigilators.map((inv: number) => (
                                <span key={inv} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                                  T{inv}
                                </span>
                              ))
                            ) : (
                              <span className="text-gray-500 text-xs">None assigned</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <button
                            onClick={() => handleDelete(schedule.id)}
                            className="text-red-600 hover:text-red-800"
                            disabled={deleteScheduleMutation.isPending}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {selectedClass && examSchedule.length === 0 && !isAdding && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="pt-6">
              <p className="text-yellow-800">📋 No exam schedules yet. Click "Add Schedule" to create one.</p>
            </CardContent>
          </Card>
        )}

        {/* Help Section */}
        <Card className="mt-8 border-purple-200 bg-purple-50">
          <CardHeader>
            <CardTitle className="text-base">📌 Exam Schedule Tips</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-700 space-y-2">
            <p>✓ Set exam dates in the future only</p>
            <p>✓ Assign at least one invigilator per exam</p>
            <p>✓ Ensure no teacher has overlapping exam duties</p>
            <p>✓ Typical exam duration: 2-3 hours</p>
            <p>✓ Include buffer time between exams (30 min minimum)</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
