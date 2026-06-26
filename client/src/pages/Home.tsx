import { useState } from "react";
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

  const roles = [
    {
      title: "Platform Owner (Mark)",
      description: "Manage all schools globally, track revenue, register new schools",
      credentials: "mark / demo123",
      features: ["Register schools with 6-digit codes", "Track subscription revenue", "Global analytics", "School management"],
    },
    {
      title: "School Admin",
      description: "Manage school operations, students, teachers, and academics",
      credentials: "Gideon High School / demo123",
      features: ["Student management", "Teacher registration via WhatsApp/Email", "CSV bulk import", "Report cards", "Attendance reports"],
    },
    {
      title: "Teacher",
      description: "Record marks, take attendance, access from anywhere",
      credentials: "peter / demo123",
      features: ["Record marks for assigned subjects only", "Daily attendance (Mon-Sat)", "Multi-school access", "Export marks as CSV"],
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
          <div className="flex gap-2 flex-wrap">
            <Button onClick={() => setLocation("/enterprise-login")} className="gap-2 bg-purple-600 hover:bg-purple-700">
              <Zap size={18} /> Launch Demo
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 md:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Cloud size={16} /> Cloud-Based • Access Anywhere • Ultra Fast
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            School Management Made Simple
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            A powerful, lightweight platform for managing academics, attendance, and report cards.
            Teachers access from any device. Schools data is safe on cloud even if computers are stolen.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Button
              onClick={() => setLocation("/enterprise-login")}
              size="lg"
              className="gap-2 text-lg h-12 px-8 bg-purple-600 hover:bg-purple-700"
            >
              <Zap size={20} /> Try Interactive Demo
            </Button>
            <Button
              onClick={() => setLocation("/school-onboarding")}
              size="lg"
              variant="outline"
              className="gap-2 text-lg h-12 px-8"
            >
              <ArrowRight size={20} /> School Onboarding
            </Button>
          </div>
        </div>
      </section>

      {/* Key Stats */}
      <section className="py-12 px-4 md:px-8 bg-purple-600 text-white">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-4xl font-bold">100K+</p>
            <p className="text-purple-200 text-sm">Schools Supported</p>
          </div>
          <div>
            <p className="text-4xl font-bold">50K+</p>
            <p className="text-purple-200 text-sm">Students Per School</p>
          </div>
          <div>
            <p className="text-4xl font-bold">&lt;5min</p>
            <p className="text-purple-200 text-sm">10,000 CSV Import</p>
          </div>
          <div>
            <p className="text-4xl font-bold">&lt;100MB</p>
            <p className="text-purple-200 text-sm">Mobile Storage</p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-900">Key Features</h2>
          <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
            Everything a school needs to manage academics efficiently - no payment processing, just pure academic management.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <Card key={idx} className="p-6 hover:shadow-lg transition">
                  <Icon className="text-purple-600 mb-4" size={32} />
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
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-900">Three Access Levels</h2>
          <p className="text-center text-gray-600 mb-16">Each role sees only what they need - strict data isolation</p>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {roles.map((role, idx) => (
              <Card key={idx} className="p-8 hover:shadow-lg transition">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{role.title}</h3>
                <p className="text-gray-600 mb-4">{role.description}</p>
                <p className="text-sm text-purple-600 font-mono mb-4 bg-purple-50 px-2 py-1 rounded">{role.credentials}</p>
                <div className="space-y-2">
                  {role.features.map((feature, fidx) => (
                    <div key={fidx} className="flex items-center gap-2 text-gray-700 text-sm">
                      <CheckCircle size={14} className="text-green-600 flex-shrink-0" />
                      {feature}
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
          <div className="text-center">
            <Button
              onClick={() => setLocation("/enterprise-login")}
              size="lg"
              className="gap-2 text-lg h-12 px-8 bg-purple-600 hover:bg-purple-700"
            >
              <Zap size={20} /> Try All Roles Now
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Register School", desc: "Platform owner generates 6-digit code and sends link to school email" },
              { step: "2", title: "School Setup", desc: "School clicks link, sets username/password, uploads logo and motto" },
              { step: "3", title: "Import Data", desc: "Admin uploads CSV from Excel - 10,000 students created in under 5 minutes" },
              { step: "4", title: "Start Teaching", desc: "Teachers get invite links, set credentials, and start recording marks" },
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 md:px-8 bg-gradient-to-r from-purple-600 to-purple-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to See It in Action?</h2>
          <p className="text-xl mb-8 text-purple-100">
            Explore the interactive demo with pre-loaded data and all features enabled.
            No sign-up required.
          </p>
          <Button
            onClick={() => setLocation("/enterprise-login")}
            size="lg"
            className="gap-2 text-lg h-12 px-8 bg-white text-purple-600 hover:bg-gray-100"
          >
            <Zap size={20} /> Launch Demo
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BookOpen className="text-purple-400" size={24} />
            <span className="text-xl font-bold text-white">EduTrack</span>
          </div>
          <p className="mb-4">Enterprise School Management System</p>
          <p className="text-sm">
            Cloud-based academic management for schools of all sizes. Access from any device, anywhere.
          </p>
          <p className="text-xs mt-4">© 2024 EduTrack. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
