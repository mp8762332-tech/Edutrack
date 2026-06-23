import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Users,
  BookOpen,
  DollarSign,
  BarChart3,
  CheckCircle,
  ArrowRight,
  Zap,
  Shield,
  Globe,
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
      description: "Student profiles, marks tracking, and exam management",
    },
    {
      icon: DollarSign,
      title: "Payment Tracking",
      description: "Unique payment codes, receipts, and scholarship management",
    },
    {
      icon: BarChart3,
      title: "Advanced Reporting",
      description: "CSV import/export, analytics, and performance metrics",
    },
    {
      icon: Shield,
      title: "Role-Based Access",
      description: "Four-tier system: Author, School Owner, Teacher, Student",
    },
    {
      icon: Globe,
      title: "Mobile & Desktop",
      description: "Responsive design optimized for all devices",
    },
  ];

  const roles = [
    {
      title: "Super Admin (Author)",
      description: "Manage all schools and system operations",
      email: "admin@schoolmgmt.com",
      features: ["View all schools", "System administration", "Global reporting"],
    },
    {
      title: "School Owner/Admin",
      description: "Manage school operations and staff",
      email: "principal@nairobi-intl.edu",
      features: ["Student management", "Teacher management", "Payment tracking", "CSV import/export"],
    },
    {
      title: "Teacher",
      description: "Manage classes and student marks",
      email: "peter.kipchoge@school.edu",
      features: ["Record marks", "View assigned classes", "Export marks", "Student search"],
    },
    {
      title: "Student",
      description: "View profile and payment information",
      email: "alice.kariuki@student.edu",
      features: ["View profile", "Payment history", "Download receipts", "Academic results"],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-blue-600">SchoolMgmt</div>
          <div className="flex gap-2">
            <Button onClick={() => setLocation("/demo-login")} className="gap-2">
              <Zap size={18} /> Original Demo
            </Button>
            <Button onClick={() => setLocation("/edutrack-login")} className="gap-2 bg-green-600 hover:bg-green-700">
              🎓 EduTrack
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 md:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Complete School Management System
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            A powerful, scalable platform for managing schools with 100,000+ institutions and 50,000+ students each.
            Built for administrators, teachers, and students.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Button
              onClick={() => setLocation("/demo-login")}
              size="lg"
              className="gap-2 text-lg h-12 px-8"
            >
              <Zap size={20} /> Original Demo
            </Button>
            <Button
              onClick={() => setLocation("/edutrack-login")}
              size="lg"
              className="gap-2 text-lg h-12 px-8 bg-green-600 hover:bg-green-700"
            >
              🎓 EduTrack System
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <Card key={idx} className="p-6 hover:shadow-lg transition">
                  <Icon className="text-blue-600 mb-4" size={32} />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Demo Accounts Section */}
      <section className="py-20 px-4 md:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">Try Different Roles</h2>
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {roles.map((role, idx) => (
              <Card key={idx} className="p-8 hover:shadow-lg transition">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{role.title}</h3>
                <p className="text-gray-600 mb-4">{role.description}</p>
                <p className="text-sm text-blue-600 font-mono mb-4">{role.email}</p>
                <div className="space-y-2">
                  {role.features.map((feature, fidx) => (
                    <div key={fidx} className="flex items-center gap-2 text-gray-700">
                      <CheckCircle size={16} className="text-green-600" />
                      {feature}
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
          <div className="text-center">
            <Button
              onClick={() => setLocation("/demo-login")}
              size="lg"
              className="gap-2 text-lg h-12 px-8"
            >
              <Zap size={20} /> Start Demo Now
            </Button>
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section className="py-20 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">System Capabilities</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h3>
              <ul className="space-y-3">
                {[
                  "Manage 100,000+ schools",
                  "Student and teacher management",
                  "Payment tracking by unique codes",
                  "CSV bulk import/export",
                  "Scholarship management",
                  "Comprehensive reporting",
                  "Activity audit logs",
                  "Role-based access control",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-gray-700">
                    <CheckCircle size={20} className="text-green-600 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Teacher & Student Features</h3>
              <ul className="space-y-3">
                {[
                  "Record and manage marks",
                  "Search students by name/class",
                  "View assigned classes only",
                  "Subject-specific access",
                  "Student profile pages",
                  "Payment history tracking",
                  "Receipt download & print",
                  "Academic results by term",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-gray-700">
                    <CheckCircle size={20} className="text-green-600 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 md:px-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to See It in Action?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Explore the interactive demo with pre-loaded data and all features enabled.
          </p>
          <Button
            onClick={() => setLocation("/demo-login")}
            size="lg"
            className="gap-2 text-lg h-12 px-8 bg-white text-blue-600 hover:bg-gray-100"
          >
            <Zap size={20} /> Launch Demo
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="mb-4">School Management System - Demo Version</p>
          <p className="text-sm">
            This is a fully functional demo showcasing the system capabilities. All data is simulated for demonstration purposes.
          </p>
          <p className="text-xs mt-4">© 2024 School Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
