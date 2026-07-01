import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Mail, MessageCircle, ArrowRight, Lock } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

interface RegistrationStep {
  step: 1 | 2 | 3;
  teacherName?: string;
  contact?: string;
  contactMethod?: "whatsapp" | "email";
  role?: string;
  classes?: string[];
  subjects?: string[];
  position?: "class_teacher" | "dos" | "regular";
}

export default function TeacherRegistration() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState<RegistrationStep>({ step: 1 });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);

  // Use real tRPC mutation for teacher creation
  const createTeacherMutation = trpc.teachers.create.useMutation({
    onSuccess: () => {
      toast.success("Teacher invitation sent successfully");
      setRegistrationComplete(true);
      setTimeout(() => {
        setLocation("/enterprise-admin");
      }, 2000);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to register teacher");
    },
  });

  const handleStep1 = () => {
    if (!formData.teacherName || !formData.contact || !formData.contactMethod) {
      toast.error("Please fill all fields");
      return;
    }
    setStep(2);
  };

  const handleStep2 = () => {
    if (!formData.role || !formData.classes || formData.classes.length === 0) {
      toast.error("Please select role and at least one class");
      return;
    }
    setStep(3);
  };

  const handleSendInvitation = () => {
    if (!formData.position) {
      toast.error("Please select position");
      return;
    }
    setShowConfirmation(true);
  };

  const confirmSend = async () => {
    if (!user?.schoolId) {
      toast.error("School ID not found");
      return;
    }

    try {
      await createTeacherMutation.mutateAsync({
        schoolId: user.schoolId,
        name: formData.teacherName || "",
        email: formData.contact || "",
        phone: "",
        employeeId: `EMP${Date.now()}`,
        qualification: formData.role || "",
        position: (formData.position as any) || "regular_teacher",
      });
      setShowConfirmation(false);
    } catch (error) {
      console.error("Error creating teacher:", error);
    }
  };

  if (registrationComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
        <Card className="p-8 max-w-md text-center border-0">
          <CheckCircle2 className="text-green-600 mx-auto mb-4" size={64} />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Complete!</h2>
          <p className="text-gray-600 mb-6">
            Invitation sent to {formData.contact}. Teacher will receive setup instructions shortly.
          </p>
          <Button onClick={() => setLocation("/enterprise-admin")} className="w-full">
            Back to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button onClick={() => setLocation("/enterprise-admin")} variant="outline" className="gap-2">
            ← Back
          </Button>
        </div>

        {/* Progress */}
        <div className="flex gap-4 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex-1">
              <div
                className={`h-2 rounded-full transition ${
                  s <= step ? "bg-blue-600" : "bg-gray-300"
                }`}
              />
              <p className="text-xs font-medium mt-2 text-gray-600">
                {s === 1 ? "Contact Info" : s === 2 ? "Assignment" : "Confirmation"}
              </p>
            </div>
          ))}
        </div>

        {/* Step 1: Contact Information */}
        {step === 1 && (
          <Card className="p-8 border-0 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Register New Teacher</h2>

            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium block mb-2">Teacher Full Name</label>
                <Input
                  placeholder="e.g., John Kipchoge"
                  value={formData.teacherName || ""}
                  onChange={(e) => setFormData({ ...formData, teacherName: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">Contact Method</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setFormData({ ...formData, contactMethod: "whatsapp" })}
                    className={`p-4 rounded border-2 transition ${
                      formData.contactMethod === "whatsapp"
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 hover:border-green-300"
                    }`}
                  >
                    <MessageCircle className="mx-auto mb-2 text-green-600" size={24} />
                    <p className="font-medium text-sm">WhatsApp</p>
                  </button>
                  <button
                    onClick={() => setFormData({ ...formData, contactMethod: "email" })}
                    className={`p-4 rounded border-2 transition ${
                      formData.contactMethod === "email"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <Mail className="mx-auto mb-2 text-blue-600" size={24} />
                    <p className="font-medium text-sm">Email</p>
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">
                  {formData.contactMethod === "whatsapp" ? "WhatsApp Number" : "Email Address"}
                </label>
                <Input
                  placeholder={
                    formData.contactMethod === "whatsapp"
                      ? "+256 701 234 567"
                      : "teacher@school.edu"
                  }
                  value={formData.contact || ""}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                />
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded text-sm text-blue-900">
                <p className="font-medium mb-1">📧 How it works:</p>
                <p>Teacher will receive a setup link via {formData.contactMethod || "selected method"}. They'll create their own username and password.</p>
              </div>

              <Button onClick={handleStep1} className="w-full gap-2">
                Continue <ArrowRight size={18} />
              </Button>
            </div>
          </Card>
        )}

        {/* Step 2: Assignment */}
        {step === 2 && (
          <Card className="p-8 border-0 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Assign Classes & Subjects</h2>

            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium block mb-2">Teacher Role</label>
                <select
                  value={formData.role || ""}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option value="">Select role...</option>
                  <option value="math">Mathematics Teacher</option>
                  <option value="english">English Teacher</option>
                  <option value="science">Science Teacher</option>
                  <option value="history">History Teacher</option>
                  <option value="pe">Physical Education</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium block mb-3">Assign to Classes</label>
                <div className="space-y-2">
                  {["S1A", "S1B", "S2A", "S2B", "S3A"].map((cls) => (
                    <label key={cls} className="flex items-center gap-3 p-3 border border-gray-200 rounded hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={formData.classes?.includes(cls) || false}
                        onChange={(e) => {
                          const classes = formData.classes || [];
                          if (e.target.checked) {
                            setFormData({ ...formData, classes: [...classes, cls] });
                          } else {
                            setFormData({
                              ...formData,
                              classes: classes.filter((c) => c !== cls),
                            });
                          }
                        }}
                        className="w-4 h-4"
                      />
                      <span className="font-medium">{cls}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium block mb-3">Subjects to Teach</label>
                <div className="space-y-2">
                  {["Mathematics", "English", "Physics", "Chemistry", "Biology"].map((subj) => (
                    <label key={subj} className="flex items-center gap-3 p-3 border border-gray-200 rounded hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={formData.subjects?.includes(subj) || false}
                        onChange={(e) => {
                          const subjects = formData.subjects || [];
                          if (e.target.checked) {
                            setFormData({ ...formData, subjects: [...subjects, subj] });
                          } else {
                            setFormData({
                              ...formData,
                              subjects: subjects.filter((s) => s !== subj),
                            });
                          }
                        }}
                        className="w-4 h-4"
                      />
                      <span className="font-medium">{subj}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={() => setStep(1)} variant="outline" className="flex-1">
                  Back
                </Button>
                <Button onClick={handleStep2} className="flex-1 gap-2">
                  Continue <ArrowRight size={18} />
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && (
          <Card className="p-8 border-0 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Confirm & Send Invitation</h2>

            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium block mb-2">Position in School</label>
                <select
                  value={formData.position || ""}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value as any })}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option value="">Select position...</option>
                  <option value="class_teacher">Class Teacher</option>
                  <option value="dos">Deputy of Studies (DOS)</option>
                  <option value="regular">Regular Teacher</option>
                </select>
              </div>

              {/* Summary */}
              <div className="p-4 bg-gray-50 rounded space-y-3">
                <h3 className="font-bold text-gray-900">Registration Summary</h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Teacher:</strong> {formData.teacherName}
                  </p>
                  <p>
                    <strong>Contact:</strong> {formData.contactMethod === "whatsapp" ? "📱" : "📧"} {formData.contact}
                  </p>
                  <p>
                    <strong>Role:</strong> {formData.role}
                  </p>
                  <p>
                    <strong>Position:</strong> {formData.position?.replace("_", " ")}
                  </p>
                  <p>
                    <strong>Classes:</strong> {formData.classes?.join(", ")}
                  </p>
                  <p>
                    <strong>Subjects:</strong> {formData.subjects?.join(", ")}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded text-sm text-blue-900">
                <p className="font-medium mb-1">🔐 Security Note:</p>
                <p>Teacher will set their own password via the setup link. They can access from any device, anytime.</p>
              </div>

              <div className="flex gap-3">
                <Button onClick={() => setStep(2)} variant="outline" className="flex-1">
                  Back
                </Button>
              <Button onClick={handleSendInvitation} className="flex-1 gap-2 bg-green-600 hover:bg-green-700" disabled={createTeacherMutation.isPending}>
                <MessageCircle size={18} /> {createTeacherMutation.isPending ? "Sending..." : "Send Invitation"}
              </Button>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Registration Invitation?</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-600">
              Send invitation to <strong>{formData.contact}</strong> via{" "}
              <strong>{formData.contactMethod === "whatsapp" ? "WhatsApp" : "Email"}</strong>?
            </p>
            <p className="text-sm text-gray-500">
              Teacher will receive a setup link and can create their account immediately.
            </p>
            <div className="flex gap-3">
              <Button onClick={() => setShowConfirmation(false)} variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button onClick={confirmSend} className="flex-1 bg-green-600 hover:bg-green-700" disabled={createTeacherMutation.isPending}>
                {createTeacherMutation.isPending ? "Sending..." : "Send Invitation"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
