import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { demoSchools, demoStudents, demoTeachers } from "@/lib/demoData";
import {
  Building2,
  Users,
  BookOpen,
  DollarSign,
  TrendingUp,
  Plus,
  Trash2,
  Download,
  Search,
  Eye,
  LogOut,
  Settings,
  BarChart3,
  Globe,
} from "lucide-react";
import { toast } from "sonner";

export default function DemoAuthorDashboard() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddSchool, setShowAddSchool] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<any>(demoSchools[0]);
  const [schools, setSchools] = useState(demoSchools);

  const filteredSchools = schools.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLogout = () => {
    localStorage.removeItem("demoUser");
    setLocation("/demo-login");
  };

  const handleAddSchool = () => {
    toast.success("New school added successfully!");
    setShowAddSchool(false);
  };

  const handleDownloadReport = (type: string) => {
    toast.success(`${type} report exported`);
  };

  const totalStudents = schools.reduce((sum, s) => sum + s.studentCount, 0);
  const totalTeachers = schools.reduce((sum, s) => sum + s.teacherCount, 0);
  const totalRevenue = schools.reduce((sum, s) => sum + s.totalRevenue, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Super Admin Dashboard</h1>
            <p className="text-sm text-gray-600">System Administration & Monitoring</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" className="gap-2">
              <Settings size={18} />
              System Settings
            </Button>
            <Button onClick={handleLogout} variant="outline" size="sm" className="gap-2">
              <LogOut size={18} />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* System KPI Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Schools</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{schools.length}</p>
              </div>
              <Building2 className="text-blue-600" size={32} />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Students</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{totalStudents.toLocaleString()}</p>
              </div>
              <Users className="text-green-600" size={32} />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Teachers</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{totalTeachers.toLocaleString()}</p>
              </div>
              <BookOpen className="text-purple-600" size={32} />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">KES {(totalRevenue / 1000000).toFixed(1)}M</p>
              </div>
              <DollarSign className="text-orange-600" size={32} />
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="schools" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="schools">Schools</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="settings">System Settings</TabsTrigger>
          </TabsList>

          {/* Schools Tab */}
          <TabsContent value="schools">
            <Card className="p-6">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                  <Input
                    placeholder="Search schools by name or city..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button onClick={() => setShowAddSchool(true)} className="gap-2">
                  <Plus size={18} /> Add School
                </Button>
                <Button onClick={() => handleDownloadReport("Schools")} variant="outline" className="gap-2">
                  <Download size={18} /> Export
                </Button>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>School Name</TableHead>
                      <TableHead>Principal</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Students</TableHead>
                      <TableHead>Teachers</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSchools.map((school) => (
                      <TableRow key={school.id}>
                        <TableCell className="font-medium">{school.name}</TableCell>
                        <TableCell>{school.principalName}</TableCell>
                        <TableCell>
                          {school.city}, {school.country}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{school.studentCount}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{school.teacherCount}</Badge>
                        </TableCell>
                        <TableCell className="font-semibold">KES {school.totalRevenue.toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedSchool(school);
                                toast.success(`Viewing ${school.name}`);
                              }}
                            >
                              <Eye size={14} />
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-600">
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid md:grid-cols-2 gap-6">
              {/* School Performance */}
              <Card className="p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <BarChart3 size={20} />
                  Top Schools by Revenue
                </h3>
                <div className="space-y-3">
                  {schools
                    .sort((a, b) => b.totalRevenue - a.totalRevenue)
                    .slice(0, 5)
                    .map((school, idx) => (
                      <div key={school.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <div>
                          <p className="font-medium">{idx + 1}. {school.name}</p>
                          <p className="text-xs text-gray-500">{school.studentCount} students</p>
                        </div>
                        <Badge>KES {(school.totalRevenue / 1000000).toFixed(1)}M</Badge>
                      </div>
                    ))}
                </div>
              </Card>

              {/* System Health */}
              <Card className="p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <TrendingUp size={20} />
                  System Health
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <p className="text-sm font-medium">Database Status</p>
                      <Badge variant="default">Healthy</Badge>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: "100%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <p className="text-sm font-medium">API Response Time</p>
                      <Badge variant="secondary">45ms</Badge>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: "95%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <p className="text-sm font-medium">Server Uptime</p>
                      <Badge variant="default">99.9%</Badge>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: "99.9%" }} />
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-bold mb-4">Generate Reports</h3>
                <div className="space-y-3">
                  <Button
                    onClick={() => handleDownloadReport("All Schools")}
                    className="w-full justify-start gap-2"
                    variant="outline"
                  >
                    <Download size={18} /> All Schools Report
                  </Button>
                  <Button
                    onClick={() => handleDownloadReport("All Students")}
                    className="w-full justify-start gap-2"
                    variant="outline"
                  >
                    <Download size={18} /> All Students Report
                  </Button>
                  <Button
                    onClick={() => handleDownloadReport("All Teachers")}
                    className="w-full justify-start gap-2"
                    variant="outline"
                  >
                    <Download size={18} /> All Teachers Report
                  </Button>
                  <Button
                    onClick={() => handleDownloadReport("Revenue Summary")}
                    className="w-full justify-start gap-2"
                    variant="outline"
                  >
                    <Download size={18} /> Revenue Summary
                  </Button>
                  <Button
                    onClick={() => handleDownloadReport("System Audit")}
                    className="w-full justify-start gap-2"
                    variant="outline"
                  >
                    <Download size={18} /> System Audit Log
                  </Button>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-bold mb-4">System Statistics</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded">
                    <p className="text-sm text-gray-600">Active Schools</p>
                    <p className="text-2xl font-bold text-blue-600">{schools.length}</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded">
                    <p className="text-sm text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-green-600">{(totalStudents + totalTeachers + schools.length).toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded">
                    <p className="text-sm text-gray-600">System Revenue</p>
                    <p className="text-2xl font-bold text-purple-600">KES {(totalRevenue / 1000000).toFixed(1)}M</p>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* System Settings Tab */}
          <TabsContent value="settings">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Settings size={20} />
                  System Configuration
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">System Name</label>
                    <Input defaultValue="School Management System" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Support Email</label>
                    <Input defaultValue="support@schoolmgmt.com" type="email" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Max Schools</label>
                    <Input defaultValue="100000" type="number" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Max Students per School</label>
                    <Input defaultValue="50000" type="number" />
                  </div>
                  <Button className="w-full">Save Configuration</Button>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Globe size={20} />
                  Security Settings
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <p className="font-medium">Two-Factor Authentication</p>
                    <Badge variant="default">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <p className="font-medium">SSL/TLS Encryption</p>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <p className="font-medium">Backup Status</p>
                    <Badge variant="secondary">Last: 2 hours ago</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <p className="font-medium">Data Encryption</p>
                    <Badge variant="default">AES-256</Badge>
                  </div>
                  <Button variant="outline" className="w-full">View Security Logs</Button>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Add School Modal */}
      <Dialog open={showAddSchool} onOpenChange={setShowAddSchool}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New School</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input placeholder="School Name" />
            <Input placeholder="Principal Name" />
            <Input placeholder="Email" type="email" />
            <Input placeholder="Phone" />
            <Input placeholder="Address" />
            <Input placeholder="City" />
            <Input placeholder="Country" />
            <Input placeholder="Registration Number" />
            <div className="flex gap-2 pt-4">
              <Button onClick={handleAddSchool} className="flex-1">
                Add School
              </Button>
              <Button onClick={() => setShowAddSchool(false)} variant="outline" className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
