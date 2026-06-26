import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Upload, Eye, EyeOff, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function SchoolOnboarding() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<"verify" | "setup" | "branding" | "complete">("verify");
  const [schoolCode, setSchoolCode] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [motto, setMotto] = useState("");
  const [vision, setVision] = useState("");
  const [logoUploaded, setLogoUploaded] = useState(false);

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (schoolCode.length !== 6) {
      toast.error("Please enter a valid 6-digit school code");
      return;
    }
    // Demo: accept any 6-digit code
    setStep("setup");
    toast.success("Code verified! Please set up your account.");
  };

  const handleSetupAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolName) {
      toast.error("Please enter your school name as username");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setStep("branding");
    toast.success("Account created! Now upload your school branding.");
  };

  const handleUploadLogo = () => {
    setLogoUploaded(true);
    toast.success("Logo uploaded successfully!");
  };

  const handleComplete = () => {
    if (!motto || !vision) {
      toast.error("Please fill in motto and vision");
      return;
    }
    setStep("complete");
    toast.success("School setup complete! Redirecting to dashboard...");
    setTimeout(() => {
      setLocation("/enterprise-admin");
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            <span className="text-purple-600">Edu</span>Track
          </h1>
          <p className="text-gray-600 mt-2">School Management Platform</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {["Verify", "Setup", "Branding", "Done"].map((label, i) => {
            const stepIndex = ["verify", "setup", "branding", "complete"].indexOf(step);
            const isActive = i <= stepIndex;
            return (
              <div key={label} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  isActive ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-500"
                }`}>
                  {i < stepIndex ? "✓" : i + 1}
                </div>
                <span className={`text-xs ${isActive ? "text-purple-600 font-medium" : "text-gray-400"}`}>
                  {label}
                </span>
                {i < 3 && <div className={`w-8 h-0.5 ${isActive ? "bg-purple-600" : "bg-gray-200"}`} />}
              </div>
            );
          })}
        </div>

        {/* Step 1: Verify Code */}
        {step === "verify" && (
          <Card className="p-8 border-0 shadow-lg">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Welcome to EduTrack!</h2>
              <p className="text-gray-600 mt-2">Enter the 6-digit code sent to your school email</p>
            </div>

            <form onSubmit={handleVerifyCode} className="space-y-6">
              <div>
                <label className="text-sm font-medium block mb-2">School Registration Code</label>
                <Input
                  type="text"
                  maxLength={6}
                  placeholder="e.g. AB3X7K"
                  value={schoolCode}
                  onChange={(e) => setSchoolCode(e.target.value.toUpperCase())}
                  className="text-center text-2xl font-mono tracking-widest h-14"
                />
              </div>

              <Button type="submit" className="w-full h-12 gap-2 bg-purple-600 hover:bg-purple-700">
                Verify Code <ArrowRight size={18} />
              </Button>
            </form>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
              <p className="text-xs text-blue-900">
                Check your school email for the registration code. If you haven't received it, contact the EduTrack platform administrator.
              </p>
            </div>

            {/* Demo hint */}
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-xs text-yellow-900">
                <strong>Demo:</strong> Enter any 6-digit code (e.g. AB3X7K) to proceed.
              </p>
            </div>
          </Card>
        )}

        {/* Step 2: Set Username & Password */}
        {step === "setup" && (
          <Card className="p-8 border-0 shadow-lg">
            <div className="text-center mb-6">
              <Badge className="bg-green-600 mb-3">Code Verified</Badge>
              <h2 className="text-2xl font-bold text-gray-900">Set Up Your Account</h2>
              <p className="text-gray-600 mt-2">Create your login credentials</p>
            </div>

            <form onSubmit={handleSetupAccount} className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-2">Username (School Name)</label>
                <Input
                  type="text"
                  placeholder="e.g. Gideon High School Naggalama"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">This will be your login username</p>
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">Password</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Min 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">Confirm Password</label>
                <Input
                  type="password"
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <Button type="submit" className="w-full h-12 gap-2 bg-purple-600 hover:bg-purple-700">
                Create Account <ArrowRight size={18} />
              </Button>
            </form>
          </Card>
        )}

        {/* Step 3: Upload Branding */}
        {step === "branding" && (
          <Card className="p-8 border-0 shadow-lg">
            <div className="text-center mb-6">
              <Badge className="bg-green-600 mb-3">Account Created</Badge>
              <h2 className="text-2xl font-bold text-gray-900">School Branding</h2>
              <p className="text-gray-600 mt-2">Upload your school logo, motto, and vision</p>
            </div>

            <div className="space-y-6">
              {/* Logo Upload */}
              <div>
                <label className="text-sm font-medium block mb-2">School Logo</label>
                <div
                  onClick={handleUploadLogo}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${
                    logoUploaded
                      ? "border-green-300 bg-green-50"
                      : "border-gray-300 hover:border-purple-400 hover:bg-purple-50"
                  }`}
                >
                  {logoUploaded ? (
                    <div>
                      <CheckCircle2 className="mx-auto text-green-600 mb-2" size={40} />
                      <p className="text-green-700 font-medium">Logo Uploaded!</p>
                      <p className="text-xs text-green-600 mt-1">school_logo.png</p>
                    </div>
                  ) : (
                    <div>
                      <Upload className="mx-auto text-gray-400 mb-2" size={40} />
                      <p className="text-gray-600 font-medium">Click to upload logo</p>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG (max 2MB)</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Motto */}
              <div>
                <label className="text-sm font-medium block mb-2">School Motto</label>
                <Input
                  placeholder="e.g. Learn and Shine"
                  value={motto}
                  onChange={(e) => setMotto(e.target.value)}
                />
              </div>

              {/* Vision */}
              <div>
                <label className="text-sm font-medium block mb-2">School Vision</label>
                <textarea
                  placeholder="e.g. To produce well-rounded students who excel academically and morally..."
                  value={vision}
                  onChange={(e) => setVision(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 min-h-[80px] resize-none"
                />
              </div>

              <Button onClick={handleComplete} className="w-full h-12 gap-2 bg-purple-600 hover:bg-purple-700">
                Go to Dashboard <ArrowRight size={18} />
              </Button>
            </div>
          </Card>
        )}

        {/* Step 4: Complete */}
        {step === "complete" && (
          <Card className="p-8 border-0 shadow-lg text-center">
            <CheckCircle2 className="mx-auto text-green-600 mb-4" size={64} />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Setup Complete!</h2>
            <p className="text-gray-600 mb-6">
              Your school <strong>{schoolName}</strong> is now registered on EduTrack.
            </p>
            <div className="p-4 bg-green-50 border border-green-200 rounded mb-6">
              <p className="text-sm text-green-900">Redirecting to your admin dashboard in 3 seconds...</p>
            </div>
            <Button onClick={() => setLocation("/enterprise-admin")} className="gap-2">
              Go to Dashboard Now <ArrowRight size={18} />
            </Button>
          </Card>
        )}

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 mt-8">
          EduTrack School Management Platform &copy; 2026
        </p>
      </div>
    </div>
  );
}
