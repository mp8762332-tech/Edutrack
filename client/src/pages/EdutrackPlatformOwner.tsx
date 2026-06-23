import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { demoSchools, demoSubscriptionTiers } from "@/lib/edutrackData";
import {
  Building2,
  Users,
  DollarSign,
  Plus,
  Trash2,
  Download,
  Search,
  Eye,
  LogOut,
  Settings,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";

export default function EdutrackPlatformOwner() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddSchool, setShowAddSchool] = useState(false);
  const [schools, setSchools] = useState(demoSchools);
  const [selectedSchool, setSelectedSchool] = useState<any>(null);

  const filteredSchools = schools.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.adminUsername.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLogout = () => {
    localStorage.removeItem("edutrackUser");
    setLocation("/edutrack-login");
  };

  const handleAddSchool = () => {
    toast.success("New school registered successfully!");
    setShowAddSchool(false);
  };

  const handleExtendSubscription = (schoolId: string) => {
    toast.success("Subscription extended for 12 months");
  };

  const handleDeleteSchool = (schoolId: string) => {
    setSchools(schools.filter((s) => s.id !== schoolId));
    toast.success("School removed from platform");
  };

  const handleAccessSchool = (school: any) => {
    setSelectedSchool(school);
    toast.success(`Accessing ${school.name} as admin`);
  };

  const totalRevenue = schools.length * 100000; // Average revenue per school

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">EduTrack Platform Owner</h1>
            <p className="text-sm text-gray-600">Global School Management System</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="default" className="bg-blue-600">
              Mark (Owner)
            </Badge>
            <Button onClick={handleLogout} variant="outline" size="sm" className="gap-2">
              <LogOut size={18} />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* KPI Cards */}
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
                <p className="text-gray-600 text-sm font-medium">Monthly Revenue</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">KES {(totalRevenue / 1000000).toFixed(1)}M</p>
              </div>
              <DollarSign className="text-green-600" size={32} />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Active Subscriptions</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{schools.filter((s) => new Date(s.subscriptionExpiry) > new Date()).length}</p>
              </div>
              <TrendingUp className="text-purple-600" size={32} />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Expiring Soon</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{schools.filter((s) => {
                  const expiry = new Date(s.subscriptionExpiry);
                  const thirtyDaysFromNow = new Date();
                  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
                  return expiry <= thirtyDaysFromNow && expiry > new Date();
                }).length}</p>
              </div>
              <Calendar className="text-orange-600" size={32} />
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="schools" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="schools">Schools</TabsTrigger>
            <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
            <TabsTrigger value="tiers">Pricing Tiers</TabsTrigger>
          </TabsList>

          {/* Schools Tab */}
          <TabsContent value="schools">
            <Card className="p-6">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                  <Input
                    placeholder="Search schools by name or admin..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button onClick={() => setShowAddSchool(true)} className="gap-2">
                  <Plus size={18} /> Register School
                </Button>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>School Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Admin</TableHead>
                      <TableHead>Current Term</TableHead>
                      <TableHead>Subscription</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSchools.map((school) => {
                      const isExpired = new Date(school.subscriptionExpiry) < new Date();
                      const isExpiringSoon = new Date(school.subscriptionExpiry) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

                      return (
                        <TableRow key={school.id}>
                          <TableCell className="font-medium">{school.name}</TableCell>
                          <TableCell>
                            <Badge variant={school.type === "secondary" ? "default" : "secondary"}>
                              {school.type === "secondary" ? "Secondary" : "Primary"}
                            </Badge>
                          </TableCell>
                          <TableCell>{school.adminUsername}</TableCell>
                          <TableCell>{school.currentTerm}</TableCell>
                          <TableCell>{school.subscriptionExpiry}</TableCell>
                          <TableCell>
                            {isExpired ? (
                              <Badge variant="destructive">Expired</Badge>
                            ) : isExpiringSoon ? (
                              <Badge variant="outline" className="text-orange-600">
                                Expiring Soon
                              </Badge>
                            ) : (
                              <Badge variant="default">Active</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleAccessSchool(school)}
                                title="Access this school as admin"
                              >
                                <Eye size={14} />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleExtendSubscription(school.id)}
                                title="Extend subscription"
                              >
                                <Calendar size={14} />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600"
                                onClick={() => handleDeleteSchool(school.id)}
                              >
                                <Trash2 size={14} />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>

          {/* Subscriptions Tab */}
          <TabsContent value="subscriptions">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-bold mb-4">Subscription Status</h3>
                <div className="space-y-3">
                  {schools.map((school) => {
                    const isExpired = new Date(school.subscriptionExpiry) < new Date();
                    return (
                      <div key={school.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <div>
                          <p className="font-medium">{school.name}</p>
                          <p className="text-xs text-gray-500">Expires: {school.subscriptionExpiry}</p>
                        </div>
                        <Badge variant={isExpired ? "destructive" : "default"}>
                          {isExpired ? "Expired" : "Active"}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-bold mb-4">Revenue Summary</h3>
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50 rounded">
                    <p className="text-sm text-gray-600">Monthly Revenue</p>
                    <p className="text-2xl font-bold text-blue-600">KES {(totalRevenue / 1000000).toFixed(1)}M</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded">
                    <p className="text-sm text-gray-600">Annual Projected</p>
                    <p className="text-2xl font-bold text-green-600">KES {(totalRevenue * 12 / 1000000).toFixed(1)}M</p>
                  </div>
                  <Button className="w-full" variant="outline">
                    <Download size={18} className="mr-2" /> Download Revenue Report
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Pricing Tiers Tab */}
          <TabsContent value="tiers">
            <div className="grid md:grid-cols-3 gap-6">
              {demoSubscriptionTiers.map((tier, idx) => (
                <Card key={idx} className={`p-6 ${idx === 1 ? "ring-2 ring-blue-500" : ""}`}>
                  <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
                  <p className="text-3xl font-bold text-blue-600 mb-4">
                    KES {tier.price.toLocaleString()}<span className="text-sm text-gray-600">/{tier.period}</span>
                  </p>
                  <ul className="space-y-2 mb-6">
                    {tier.features.map((feature, fidx) => (
                      <li key={fidx} className="text-sm text-gray-600 flex items-center gap-2">
                        <span className="text-green-600">✓</span> {feature}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full" variant={idx === 1 ? "default" : "outline"}>
                    {idx === 1 ? "Most Popular" : "Select Plan"}
                  </Button>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Add School Modal */}
      <Dialog open={showAddSchool} onOpenChange={setShowAddSchool}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Register New School</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input placeholder="School Name" />
            <select className="w-full border border-gray-300 rounded px-3 py-2">
              <option>School Type</option>
              <option>Secondary (New Curriculum)</option>
              <option>Primary (Old Curriculum)</option>
            </select>
            <Input placeholder="Admin Username" />
            <Input placeholder="Admin Password" type="password" />
            <select className="w-full border border-gray-300 rounded px-3 py-2">
              <option>Current Term</option>
              <option>Term 1 2026</option>
              <option>Term 2 2026</option>
              <option>Term 3 2026</option>
            </select>
            <Input placeholder="Payment Account (MTN/Bank)" />
            <Input placeholder="Subscription Expiry Date" type="date" />
            <select className="w-full border border-gray-300 rounded px-3 py-2">
              <option>Theme Color</option>
              <option>#132F52 (Navy)</option>
              <option>#1A6E47 (Green)</option>
              <option>#C97E0A (Gold)</option>
            </select>
            <div className="flex gap-2 pt-4">
              <Button onClick={handleAddSchool} className="flex-1">
                Register School
              </Button>
              <Button onClick={() => setShowAddSchool(false)} variant="outline" className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* School Access Modal */}
      {selectedSchool && (
        <Dialog open={!!selectedSchool} onOpenChange={() => setSelectedSchool(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Accessing: {selectedSchool.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-sm font-medium text-yellow-800">
                  ⚠️ You are now operating as admin for {selectedSchool.name}. A yellow banner will appear to remind you of this mode.
                </p>
              </div>
              <div className="space-y-2 text-sm">
                <p>
                  <strong>School:</strong> {selectedSchool.name}
                </p>
                <p>
                  <strong>Type:</strong> {selectedSchool.type === "secondary" ? "Secondary" : "Primary"}
                </p>
                <p>
                  <strong>Current Term:</strong> {selectedSchool.currentTerm}
                </p>
                <p>
                  <strong>Subscription:</strong> {selectedSchool.subscriptionExpiry}
                </p>
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={() => setSelectedSchool(null)} className="flex-1">
                  Access School Dashboard
                </Button>
                <Button onClick={() => setSelectedSchool(null)} variant="outline" className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
