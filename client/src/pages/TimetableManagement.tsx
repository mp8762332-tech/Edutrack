import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Plus, Trash2, AlertCircle, CheckCircle2, Loader } from "lucide-react";

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
const TIME_SLOTS = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30",
  "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00",
];

export default function TimetableManagement() {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [timetableType, setTimetableType] = useState<"academic" | "mid_term_exam" | "end_of_term_exam">("academic");
  const [isAdding, setIsAdding] = useState(false);
  const [newEntry, setNewEntry] = useState({
    dayOfWeek: "monday" as const,
    startTime: "08:00",
    endTime: "09:00",
    subjectId: "",
    teacherId: "",
    room: "",
  });

  // Fetch data
  const { data: classes = [] } = trpc.classes.list.useQuery();
  const { data: teachers = [] } = trpc.teachers.listBySchool.useQuery({} as any);
  const { data: subjects = [] } = trpc.subjects.list.useQuery({} as any);

  // Fetch timetables
  const { data: classTimetable = [] } = trpc.timetables.getByClass.useQuery(
    { classId: parseInt(selectedClass) || 0, type: timetableType },
    { enabled: !!selectedClass }
  );

  const { data: teacherTimetable = [] } = trpc.timetables.getTeacherTimetable.useQuery(
    { teacherId: parseInt(selectedTeacher) || 0, type: timetableType },
    { enabled: !!selectedTeacher }
  );

  // Mutations
  const createMutation = trpc.timetables.create.useMutation({
    onSuccess: () => {
      toast.success("✅ Timetable entry created successfully");
      setNewEntry({
        dayOfWeek: "monday",
        startTime: "08:00",
        endTime: "09:00",
        subjectId: "",
        teacherId: "",
        room: "",
      });
      setIsAdding(false);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create entry");
    },
  });

  const deleteMutation = trpc.timetables.delete.useMutation({
    onSuccess: () => {
      toast.success("✅ Entry deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete entry");
    },
  });

  const handleAddEntry = async () => {
    if (!selectedClass || !newEntry.subjectId || !newEntry.teacherId) {
      toast.error("Please fill in all required fields");
      return;
    }

    await createMutation.mutateAsync({
      classId: parseInt(selectedClass),
      type: timetableType,
      dayOfWeek: newEntry.dayOfWeek,
      startTime: newEntry.startTime,
      endTime: newEntry.endTime,
      subjectId: parseInt(newEntry.subjectId),
      teacherId: parseInt(newEntry.teacherId),
      room: newEntry.room || undefined,
    });
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this entry?")) {
      await deleteMutation.mutateAsync({ id });
    }
  };

  // Build visual timetable grid
  const buildTimetableGrid = (timetableData: any[]) => {
    const grid: any = {};

    DAYS.forEach((day) => {
      grid[day] = {};
      TIME_SLOTS.forEach((time) => {
        grid[day][time] = null;
      });
    });

    timetableData.forEach((entry) => {
      const daySlots = grid[entry.dayOfWeek] || {};
      const startIdx = TIME_SLOTS.indexOf(entry.startTime);
      const endIdx = TIME_SLOTS.indexOf(entry.endTime);

      for (let i = startIdx; i < endIdx && i < TIME_SLOTS.length; i++) {
        daySlots[TIME_SLOTS[i]] = entry;
      }
    });

    return grid;
  };

  const timetableGrid = selectedClass ? buildTimetableGrid(classTimetable) : {};

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Timetable Management</h1>
          <p className="text-muted-foreground mt-2">Create and manage class and exam timetables with conflict detection</p>
        </div>

        <Tabs defaultValue="class" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="class">Class Timetable</TabsTrigger>
            <TabsTrigger value="teacher">Teacher Timetable</TabsTrigger>
          </TabsList>

          {/* Class Timetable Tab */}
          <TabsContent value="class" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="classSelect">Select Class *</Label>
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
              </div>

              <div>
                <Label htmlFor="typeSelect">Timetable Type</Label>
                <Select value={timetableType} onValueChange={(v: any) => setTimetableType(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="academic">Academic</SelectItem>
                    <SelectItem value="mid_term_exam">Mid Term Exam</SelectItem>
                    <SelectItem value="end_of_term_exam">End of Term Exam</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={() => setIsAdding(!isAdding)} className="mt-6 gap-2">
                <Plus className="w-4 h-4" />
                Add Entry
              </Button>
            </div>

            {/* Add Entry Form */}
            {isAdding && (
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="text-base">Add Timetable Entry</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Day *</Label>
                      <Select value={newEntry.dayOfWeek} onValueChange={(v: any) => setNewEntry({ ...newEntry, dayOfWeek: v })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {DAYS.map((day) => (
                            <SelectItem key={day} value={day}>
                              {day.charAt(0).toUpperCase() + day.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Start Time *</Label>
                      <Select value={newEntry.startTime} onValueChange={(v) => setNewEntry({ ...newEntry, startTime: v })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {TIME_SLOTS.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>End Time *</Label>
                      <Select value={newEntry.endTime} onValueChange={(v) => setNewEntry({ ...newEntry, endTime: v })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {TIME_SLOTS.filter((t) => t > newEntry.startTime).map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Subject *</Label>
                      <Select value={newEntry.subjectId} onValueChange={(v) => setNewEntry({ ...newEntry, subjectId: v })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                        <SelectContent>
                          {subjects.map((subj: any) => (
                            <SelectItem key={subj.id} value={subj.id.toString()}>
                              {subj.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Teacher *</Label>
                      <Select value={newEntry.teacherId} onValueChange={(v) => setNewEntry({ ...newEntry, teacherId: v })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select teacher" />
                        </SelectTrigger>
                        <SelectContent>
                          {teachers.map((teacher: any) => (
                            <SelectItem key={teacher.id} value={teacher.id.toString()}>
                              {teacher.id}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Room</Label>
                      <Input
                        placeholder="e.g., A101"
                        value={newEntry.room}
                        onChange={(e) => setNewEntry({ ...newEntry, room: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleAddEntry} disabled={createMutation.isPending} className="gap-2">
                      {createMutation.isPending ? (
                        <>
                          <Loader className="w-4 h-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        "Create Entry"
                      )}
                    </Button>
                    <Button onClick={() => setIsAdding(false)} variant="outline">
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Visual Timetable Grid */}
            {selectedClass && classTimetable.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Class Timetable</CardTitle>
                  <CardDescription>{classTimetable.length} entries</CardDescription>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                  <div className="min-w-full">
                    <div className="grid gap-1" style={{ gridTemplateColumns: "120px repeat(6, 1fr)" }}>
                      {/* Header */}
                      <div className="font-bold p-2 bg-gray-100">Time</div>
                      {DAYS.map((day) => (
                        <div key={day} className="font-bold p-2 bg-gray-100 text-center capitalize">
                          {day.substring(0, 3)}
                        </div>
                      ))}

                      {/* Time slots */}
                      {TIME_SLOTS.map((time) => (
                        <div key={`row-${time}`}>
                          <div className="font-mono text-sm p-2 bg-gray-50 border">{time}</div>
                          {DAYS.map((day) => {
                            const entry = timetableGrid[day]?.[time];
                            return (
                              <div key={`${day}-${time}`} className="border p-1 min-h-12 bg-white text-xs">
                                {entry && (
                                  <div className="bg-blue-100 p-1 rounded cursor-pointer hover:bg-blue-200">
                                    <p className="font-semibold">{entry.subject?.name || "Subject"}</p>
                                    <p className="text-gray-600">{entry.room || "Room TBA"}</p>
                                    <button
                                      onClick={() => handleDelete(entry.id)}
                                      className="text-red-600 hover:text-red-800 text-xs mt-1"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Entries Table */}
            {selectedClass && classTimetable.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>All Entries</CardTitle>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Day</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Teacher</TableHead>
                        <TableHead>Room</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {classTimetable.map((entry: any) => (
                        <TableRow key={entry.id}>
                          <TableCell className="capitalize">{entry.dayOfWeek}</TableCell>
                          <TableCell className="font-mono">{entry.startTime} - {entry.endTime}</TableCell>
                          <TableCell>{entry.subject?.name || "Subject"}</TableCell>
                          <TableCell>{entry.teacher?.id || "TBA"}</TableCell>
                          <TableCell>{entry.room || "-"}</TableCell>
                          <TableCell>
                            <button
                              onClick={() => handleDelete(entry.id)}
                              className="text-red-600 hover:text-red-800"
                              disabled={deleteMutation.isPending}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}

            {selectedClass && classTimetable.length === 0 && (
              <Card className="border-yellow-200 bg-yellow-50">
                <CardContent className="pt-6">
                  <p className="text-yellow-800">📋 No timetable entries yet. Click "Add Entry" to create one.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Teacher Timetable Tab */}
          <TabsContent value="teacher" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="teacherSelect">Select Teacher *</Label>
                <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose teacher" />
                  </SelectTrigger>
                  <SelectContent>
                    {teachers.map((teacher: any) => (
                      <SelectItem key={teacher.id} value={teacher.id.toString()}>
                        Teacher {teacher.id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="typeSelect2">Timetable Type</Label>
                <Select value={timetableType} onValueChange={(v: any) => setTimetableType(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="academic">Academic</SelectItem>
                    <SelectItem value="mid_term_exam">Mid Term Exam</SelectItem>
                    <SelectItem value="end_of_term_exam">End of Term Exam</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Teacher Timetable Table */}
            {selectedTeacher && teacherTimetable.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Teacher Schedule</CardTitle>
                  <CardDescription>{teacherTimetable.length} classes</CardDescription>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Class</TableHead>
                        <TableHead>Day</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Room</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {teacherTimetable.map((entry: any) => (
                        <TableRow key={entry.id}>
                          <TableCell>{entry.class?.name || "Class"}</TableCell>
                          <TableCell className="capitalize">{entry.dayOfWeek}</TableCell>
                          <TableCell className="font-mono">{entry.startTime} - {entry.endTime}</TableCell>
                          <TableCell>{entry.subject?.name || "Subject"}</TableCell>
                          <TableCell>{entry.room || "-"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}

            {selectedTeacher && teacherTimetable.length === 0 && (
              <Card className="border-yellow-200 bg-yellow-50">
                <CardContent className="pt-6">
                  <p className="text-yellow-800">📋 No timetable entries for this teacher.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
