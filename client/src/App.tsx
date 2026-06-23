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
import EdutrackLogin from "./pages/EdutrackLogin";
import EdutrackPlatformOwner from "./pages/EdutrackPlatformOwner";
import EdutrackSchoolAdmin from "./pages/EdutrackSchoolAdmin";
import EdutrackTeacher from "./pages/EdutrackTeacher";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/demo-login" component={DemoLogin} />
      <Route path="/demo-author-dashboard" component={DemoAuthorDashboard} />
      <Route path="/admin-dashboard" component={DemoAdminDashboard} />
      <Route path="/teacher-dashboard" component={DemoTeacherDashboard} />
      <Route path="/student-profile" component={DemoStudentProfile} />
      <Route path="/edutrack-login" component={EdutrackLogin} />
      <Route path="/edutrack-platform-owner" component={EdutrackPlatformOwner} />
      <Route path="/edutrack-school-admin" component={EdutrackSchoolAdmin} />
      <Route path="/edutrack-teacher" component={EdutrackTeacher} />
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
