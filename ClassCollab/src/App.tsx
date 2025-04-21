
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { RequireAuth, RedirectIfAuthenticated } from "@/components/AuthGuard";
import DashboardLayout from "@/components/DashboardLayout";

// Pages
import Index from "./pages/index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import GroupsList from "./pages/GroupsList";
import GroupDetail from "./pages/GroupDetail";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={
              <DashboardLayout>
                <Index />
              </DashboardLayout>
            } />
            
            {/* Auth routes - redirect if already logged in */}
            <Route path="/login" element={
              <RedirectIfAuthenticated>
                <Login />
              </RedirectIfAuthenticated>
            } />
            <Route path="/signup" element={
              <RedirectIfAuthenticated>
                <Signup />
              </RedirectIfAuthenticated>
            } />
            
            {/* Protected routes - require authentication */}
            <Route path="/dashboard" element={
              <RequireAuth>
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              </RequireAuth>
            } />
            <Route path="/groups" element={
              <RequireAuth>
                <DashboardLayout>
                  <GroupsList />
                </DashboardLayout>
              </RequireAuth>
            } />
            <Route path="/groups/:groupId" element={
              <RequireAuth>
                <DashboardLayout>
                  <GroupDetail />
                </DashboardLayout>
              </RequireAuth>
            } />
            <Route path="/profile" element={
              <RequireAuth>
                <DashboardLayout>
                  <Profile />
                </DashboardLayout>
              </RequireAuth>
            } />
            
            {/* Catch all for 404s */}
            <Route path="*" element={
              <DashboardLayout>
                <NotFound />
              </DashboardLayout>
            } />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
