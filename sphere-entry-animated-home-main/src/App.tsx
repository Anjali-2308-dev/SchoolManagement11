import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import PrincipalDashboard from "./pages/PrincipalDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import NotFound from "./pages/NotFound";


// Teacher module imports
import Attendance from "./pages/teacher/Attendance";
import Timetable from "./pages/teacher/Timetable";
import Subjects from "./pages/teacher/Subjects";
import Diary from "./pages/teacher/Diary";
import Projects from "./pages/teacher/Projects";
import Videos from "./pages/teacher/Videos";
import Tests from "./pages/teacher/Tests";
import Reports from "./pages/teacher/Reports";
import EBooks from "./pages/teacher/EBooks";
import Achievements from "./pages/teacher/Achievements";
import Notifications from "./pages/teacher/Notifications";
import Bus from "./pages/teacher/Bus";
import Feedback from "./pages/teacher/Feedback";

// Principal module imports
import AttendanceAnalytics from "./pages/principal/Attendance";
import TimetableView from "./pages/principal/Timetable";
import StaffManagement from "./pages/principal/StaffManagement";
import Payroll from "./pages/principal/Payroll";
import AcademicReports from "./pages/principal/AcademicReports";
import FeeReports from "./pages/principal/FeeReports";
import Inventory from "./pages/principal/Inventory";
import PrincipalNotifications from "./pages/principal/Notifications";
import PrincipalAchievements from "./pages/principal/Achievements";
import PrincipalFeedback from "./pages/principal/Feedback";
import AddBus from './pages/principal/BusTracking'

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard/principal" element={<PrincipalDashboard />} />
          <Route path="/dashboard/teacher" element={<TeacherDashboard />} />
          
          {/* Teacher Module Routes */}
          <Route path="/dashboard/teacher/attendance" element={<Attendance />} />
          <Route path="/dashboard/teacher/timetable" element={<Timetable />} />
          <Route path="/dashboard/teacher/subjects" element={<Subjects />} />
          <Route path="/dashboard/teacher/diary" element={<Diary />} />
          <Route path="/dashboard/teacher/projects" element={<Projects />} />
          <Route path="/dashboard/teacher/videos" element={<Videos />} />
          <Route path="/dashboard/teacher/tests" element={<Tests />} />
          <Route path="/dashboard/teacher/reports" element={<Reports />} />
          <Route path="/dashboard/teacher/ebooks" element={<EBooks />} />
          <Route path="/dashboard/teacher/achievements" element={<Achievements />} />
          <Route path="/dashboard/teacher/notifications" element={<Notifications />} />
          <Route path="/dashboard/teacher/bus" element={<Bus />} />
          <Route path="/dashboard/teacher/feedback" element={<Feedback />} />
          
          {/* Principal Module Routes */}
          <Route path="/dashboard/principal/attendance" element={<AttendanceAnalytics />} />
          <Route path="/dashboard/principal/timetable" element={<TimetableView />} />
          <Route path="/dashboard/principal/staff" element={<StaffManagement />} />
          <Route path="/dashboard/principal/payroll" element={<Payroll />} />
          <Route path="/dashboard/principal/reports" element={<AcademicReports />} />
          <Route path="/dashboard/principal/fees" element={<FeeReports />} />
          <Route path="/dashboard/principal/inventory" element={<Inventory />} />
          <Route path="/dashboard/principal/notifications" element={<PrincipalNotifications />} />
          <Route path="/dashboard/principal/achievements" element={<PrincipalAchievements />} />
          <Route path="/dashboard/principal/feedback" element={<PrincipalFeedback />} />
          <Route path="/dashboard/principal/bus" element={<AddBus />} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
