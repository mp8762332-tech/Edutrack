import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import DemoLogin from "./pages/DemoLogin";
import DemoAuthorDashboard from "./pages/DemoAuthorDashboard";
import DemoAdminDashboard from "./pages/DemoAdminDashboard";
import DemoTeacherDashboard from "./pages/DemoTeacherDashboard";
import DemoStudentProfile from "./pages/DemoStudentProfile";
import Reports from "./pages/Reports";
import ReportCard from "./pages/ReportCard";
import EnterpriseLogin from "./pages/EnterpriseLogin";
import EnterprisePlatformOwner from "./pages/EnterprisePlatformOwner";
import EnterpriseAdminDashboard from "./pages/EnterpriseAdminDashboard";
import EnterpriseTeacherDashboard from "./pages/EnterpriseTeacherDashboard";
import TeacherRegistration from "./pages/TeacherRegistration";
import MultiSchoolTeacherLogin from "./pages/MultiSchoolTeacherLogin";
import AttendanceTracking from "./pages/AttendanceTracking";
import SchoolOnboarding from "./pages/SchoolOnboarding";
import BulkCSVImport from "./pages/BulkCSVImport";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/demo-login" component={DemoLogin} />
      <Route path="/demo-author-dashboard" component={DemoAuthorDashboard} />
      <Route path="/admin-dashboard" component={DemoAdminDashboard} />
      <Route path="/teacher-dashboard" component={DemoTeacherDashboard} />
      <Route path="/student-profile" component={DemoStudentProfile} />
      <Route path="/reports" component={Reports} />
      <Route path="/report-card" component={ReportCard} />
      <Route path="/enterprise-login" component={EnterpriseLogin} />
      <Route path="/enterprise-platform-owner" component={EnterprisePlatformOwner} />
      <Route path="/enterprise-admin" component={EnterpriseAdminDashboard} />
      <Route path="/enterprise-teacher" component={EnterpriseTeacherDashboard} />
      <Route path="/teacher-registration" component={TeacherRegistration} />
      <Route path="/multi-school-teacher-login" component={MultiSchoolTeacherLogin} />
      <Route path="/attendance" component={AttendanceTracking} />
      <Route path="/school-onboarding/:code" component={SchoolOnboarding} />
      <Route path="/school-onboarding" component={SchoolOnboarding} />
      <Route path="/bulk-csv-import" component={BulkCSVImport} />
      <Route path="/404" component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
