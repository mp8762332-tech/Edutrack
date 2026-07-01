import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import { ChevronRight } from "lucide-react";

export default function TeacherAssignment() {
  const { user } = useAuth();
  const [selectedTeacherId, setSelectedTeacherId] = useState<number | null>(null);
  const [selectedClasses, setSelectedClasses] = useState<number[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<number[]>([]);
  const [saving, setSaving] = useState(false);

  // Fetch teachers
  const { data: teachers = [], isLoading: loadingTeachers } = trpc.teachers.listBySchool.useQuery(
    { schoolId: user?.schoolId || 0 },
    { enabled: !!user?.schoolId && user?.role === "school_admin" }
  );

  // Fetch classes
  const { data: classes = [], isLoading: loadingClasses } = trpc.classes.list.useQuery();

  // Fetch subjects
  const { data: subjects = [], isLoading: loadingSubjects } = trpc.subjects.list.useQuery({});

  // Get selected teacher details
  const selectedTeacher = teachers.find((t: any) => t.id === selectedTeacherId);

  // Mutations
  const assignClassesMutation = trpc.teachers.assignClasses.useMutation({
    onSuccess: () => {
      toast.success("Classes assigned successfully");
      setSelectedClasses([]);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to assign classes");
    },
  });

  const assignSubjectsMutation = trpc.teachers.assignSubjects.useMutation({
    onSuccess: () => {
      toast.success("Subjects assigned successfully");
      setSelectedSubjects([]);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to assign subjects");
    },
  });

  const handleAssignClasses = async () => {
    if (!selectedTeacherId) {
      toast.error("Please select a teacher");
      return;
    }

    setSaving(true);
    try {
      await assignClassesMutation.mutateAsync({
        teacherId: selectedTeacherId,
        classIds: selectedClasses,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAssignSubjects = async () => {
    if (!selectedTeacherId) {
      toast.error("Please select a teacher");
      return;
    }

    setSaving(true);
    try {
      await assignSubjectsMutation.mutateAsync({
        teacherId: selectedTeacherId,
        subjectIds: selectedSubjects,
      });
    } finally {
      setSaving(false);
    }
  };

  if (!user || user.role !== "school_admin") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Only school administrators can manage teacher assignments.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Teacher Assignments</h1>
          <p className="text-muted-foreground mt-2">Assign classes and subjects to teachers</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Teachers List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Teachers</CardTitle>
                <CardDescription>Select a teacher to assign classes/subjects</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingTeachers ? (
                  <div className="text-center py-8">Loading...</div>
                ) : teachers.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No teachers found</div>
                ) : (
                  <div className="space-y-2">
                    {teachers.map((teacher: any) => (
                      <button
                        key={teacher.id}
                        onClick={() => {
                          setSelectedTeacherId(teacher.id);
                          setSelectedClasses(teacher.assignedClasses || []);
                          setSelectedSubjects(teacher.assignedSubjects || []);
                        }}
                        className={`w-full text-left p-3 rounded border-2 transition ${
                          selectedTeacherId === teacher.id
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <p className="font-medium">{teacher.name}</p>
                        <p className="text-xs text-muted-foreground">{teacher.email}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {teacher.assignedClasses?.length || 0} classes • {teacher.assignedSubjects?.length || 0} subjects
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Assignment Panel */}
          <div className="lg:col-span-2 space-y-6">
            {selectedTeacher ? (
              <>
                {/* Teacher Info */}
                <Card>
                  <CardHeader>
                    <CardTitle>{selectedTeacher.name}</CardTitle>
                    <CardDescription>{selectedTeacher.email}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Employee ID</p>
                        <p className="text-lg font-semibold">{selectedTeacher.employeeId}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Position</p>
                        <p className="text-lg font-semibold capitalize">{selectedTeacher.position?.replace("_", " ")}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Assign Classes */}
                <Card>
                  <CardHeader>
                    <CardTitle>Assign Classes</CardTitle>
                    <CardDescription>Select classes this teacher will teach</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loadingClasses ? (
                      <div className="text-center py-8">Loading...</div>
                    ) : classes.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">No classes found</div>
                    ) : (
                      <div className="space-y-3">
                        {classes.map((cls: any) => (
                          <label key={cls.id} className="flex items-center gap-3 p-3 border rounded hover:bg-muted/50 cursor-pointer">
                            <Checkbox
                              checked={selectedClasses.includes(cls.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedClasses([...selectedClasses, cls.id]);
                                } else {
                                  setSelectedClasses(selectedClasses.filter((id) => id !== cls.id));
                                }
                              }}
                            />
                            <div>
                              <p className="font-medium">{cls.name}</p>
                              <p className="text-xs text-muted-foreground capitalize">{cls.level?.replace("_", " ")}</p>
                            </div>
                          </label>
                        ))}
                      </div>
                    )}
                    <Button
                      onClick={handleAssignClasses}
                      disabled={saving || assignClassesMutation.isPending}
                      className="w-full mt-4"
                    >
                      {assignClassesMutation.isPending ? "Saving..." : "Save Classes"}
                    </Button>
                  </CardContent>
                </Card>

                {/* Assign Subjects */}
                <Card>
                  <CardHeader>
                    <CardTitle>Assign Subjects</CardTitle>
                    <CardDescription>Select subjects this teacher will teach</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loadingSubjects ? (
                      <div className="text-center py-8">Loading...</div>
                    ) : subjects.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">No subjects found</div>
                    ) : (
                      <div className="space-y-3">
                        {subjects.map((subject: any) => (
                          <label
                            key={subject.id}
                            className="flex items-center gap-3 p-3 border rounded hover:bg-muted/50 cursor-pointer"
                          >
                            <Checkbox
                              checked={selectedSubjects.includes(subject.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedSubjects([...selectedSubjects, subject.id]);
                                } else {
                                  setSelectedSubjects(selectedSubjects.filter((id) => id !== subject.id));
                                }
                              }}
                            />
                            <div>
                              <p className="font-medium">{subject.name}</p>
                              <p className="text-xs text-muted-foreground">Code: {subject.code}</p>
                            </div>
                            {subject.isCore && <span className="ml-auto text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Core</span>}
                          </label>
                        ))}
                      </div>
                    )}
                    <Button
                      onClick={handleAssignSubjects}
                      disabled={saving || assignSubjectsMutation.isPending}
                      className="w-full mt-4"
                    >
                      {assignSubjectsMutation.isPending ? "Saving..." : "Save Subjects"}
                    </Button>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center min-h-96">
                  <div className="text-center">
                    <ChevronRight className="mx-auto mb-4 text-muted-foreground" size={48} />
                    <p className="text-lg font-medium">Select a teacher to assign classes and subjects</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
