import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";

// Pages
import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/auth/LoginPage";
import SignupPage from "@/pages/auth/SignupPage";
import PasswordResetPage from "@/pages/auth/PasswordResetPage";
import EmailVerificationPage from "@/pages/auth/EmailVerificationPage";
import DashboardLayout from "@/pages/dashboard/DashboardLayout";
import DashboardHome from "@/pages/dashboard/DashboardHome";
import ContentLibrary from "@/pages/dashboard/ContentLibrary";
import ClipViewer from "@/pages/dashboard/ClipViewer";
import UploadContent from "@/pages/dashboard/UploadContent";
import CourseBuilder from "@/pages/dashboard/CourseBuilder";
import LearningPlayer from "@/pages/dashboard/LearningPlayer";
import QuizPage from "@/pages/dashboard/QuizPage";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import UserManagement from "@/pages/admin/UserManagement";
import SettingsPage from "@/pages/dashboard/SettingsPage";
import CheckoutPage from "@/pages/billing/CheckoutPage";
import OrderHistory from "@/pages/billing/OrderHistory";
import AnalyticsPage from "@/pages/analytics/AnalyticsPage";
import HelpPage from "@/pages/help/HelpPage";
import NotFoundPage from "@/pages/NotFoundPage";

// React Query client with optimal defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/password-reset" element={<PasswordResetPage />} />
              <Route path="/email-verification" element={<EmailVerificationPage />} />
              
              {/* Dashboard routes */}
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<DashboardHome />} />
                <Route path="library" element={<ContentLibrary />} />
                <Route path="clip/:id" element={<ClipViewer />} />
                <Route path="upload" element={<UploadContent />} />
                <Route path="course-builder" element={<CourseBuilder />} />
                <Route path="course/:id" element={<LearningPlayer />} />
                <Route path="quiz/:id" element={<QuizPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>
              
              {/* Admin routes */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<UserManagement />} />
              
              {/* Billing routes */}
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/orders" element={<OrderHistory />} />
              
              {/* Analytics routes */}
              <Route path="/analytics" element={<AnalyticsPage />} />
              
              {/* Help routes */}
              <Route path="/help" element={<HelpPage />} />
              
              {/* 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </div>
          <Toaster />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
