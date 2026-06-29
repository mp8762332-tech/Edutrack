import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Users,
  BookOpen,
  BarChart3,
  CheckCircle,
  ArrowRight,
  Zap,
  Shield,
  Globe,
  FileText,
  Cloud,
  Smartphone,
  Calendar,
} from "lucide-react";

export default function Home() {
  const [, setLocation] = useLocation();

  const features = [
    {
      icon: Users,
      title: "Multi-Tenant Architecture",
      description: "Support for 100,000+ schools with 50,000+ students each",
    },
    {
      icon: BookOpen,
      title: "Complete Academic Management",
      description: "Student profiles, marks tracking, auto-grading, and report cards",
    },
    {
      icon: Calendar,
      title: "Daily Attendance",
      description: "Mon-Sat roll call with automatic absence marking and term reports",
    },
    {
      icon: BarChart3,
      title: "Intelligent Grading",
      description: "Auto-calculates grades, remarks, positions, and result classifications",
    },
    {
      icon: Cloud,
      title: "Cloud Storage",
      description: "All data stored securely on cloud - accessible from any device",
    },
    {
      icon: Globe,
      title: "Access Anywhere",
      description: "Teachers access from any device, anytime. Under 100MB on mobile",
    },
    {
      icon: Shield,
      title: "Role-Based Access",
      description: "Platform Owner, School Admin, Teacher - strict data isolation",
    },
    {
      icon: Smartphone,
      title: "Multi-School Teachers",
      description: "Teachers with multiple schools see all accounts listed separately",
    },
    {
      icon: FileText,
      title: "Bulk CSV Import",
      description: "Upload 10,000 students from Excel in under 5 minutes",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="text-purple-600" size={28} />
            <span className="text-2xl font-bold text-purple-600">EduTrack</span>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => setLocation("/multi-school-teacher-login")}
            >
              Teacher Login
            </Button>
            <Button
              variant="ghost"
              onClick={() => setLocation("/author-dashboard")}
            >
              Admin
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-4 px-4 py-2 bg-purple-100 rounded-full">
            <span className="text-purple-700 text-sm font-semibold">
              ☁️ Cloud-Based • Access Anywhere • Ultra Fast
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            School Management Made Simple
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            A powerful, lightweight platform for managing academics, attendance, and report cards.
            Teachers access from any device. Schools data is safe on cloud even if computers are stolen.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => setLocation("/school-onboarding")}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Zap className="mr-2" size={20} />
              Register Your School
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setLocation("/multi-school-teacher-login")}
            >
              <ArrowRight className="mr-2" size={20} />
              Teacher Access
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-purple-600 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold mb-2">100K+</div>
            <div className="text-purple-100">Schools Supported</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">50K+</div>
            <div className="text-purple-100">Students Per School</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">&lt;5min</div>
            <div className="text-purple-100">10,000 CSV Import</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">&lt;100MB</div>
            <div className="text-purple-100">Mobile Storage</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <Card key={i} className="p-6 hover:shadow-lg transition-shadow">
                  <Icon className="text-purple-600 mb-4" size={32} />
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your School?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Start managing your school's academics, attendance, and report cards today.
            No credit card required.
          </p>
          <Button
            size="lg"
            onClick={() => setLocation("/school-onboarding")}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <CheckCircle className="mr-2" size={20} />
            Register Your School Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 border-t border-gray-200 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-purple-600">Features</a></li>
                <li><a href="#" className="hover:text-purple-600">Pricing</a></li>
                <li><a href="#" className="hover:text-purple-600">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-purple-600">About</a></li>
                <li><a href="#" className="hover:text-purple-600">Blog</a></li>
                <li><a href="#" className="hover:text-purple-600">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-purple-600">Privacy</a></li>
                <li><a href="#" className="hover:text-purple-600">Terms</a></li>
                <li><a href="#" className="hover:text-purple-600">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-purple-600">Twitter</a></li>
                <li><a href="#" className="hover:text-purple-600">LinkedIn</a></li>
                <li><a href="#" className="hover:text-purple-600">Facebook</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-300 pt-8 text-center text-gray-600">
            <p>&copy; 2026 EduTrack. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
