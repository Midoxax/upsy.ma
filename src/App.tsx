import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import PageTransition from "@/components/PageTransition";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { BreadcrumbWrapper } from "@/components/BreadcrumbWrapper";
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import ConsultingForOrganizations from "./pages/services/ConsultingForOrganizations";
import Skool from "./pages/Skool";
import Resources from "./pages/Resources";
import Contact from "./pages/Contact";
import Legal from "./pages/Legal";
import TalentInnovationHub from "./pages/TalentInnovationHub";
import Psychologists from "./pages/Psychologists";
import PsychologistProfile from "./pages/PsychologistProfile";
import Auth from "./pages/Auth";
import MySpace from "./pages/MySpace";
import Apply from "./pages/Apply";
import GetMatched from "./pages/GetMatched";
import Applications from "./pages/admin/Applications";
import AdminDashboard from "./pages/admin/Dashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Theme mapper based on route patterns
const getThemeForRoute = (pathname: string): string => {
  if (pathname === '/services/sport-psychology') return 'performance';
  if (pathname === '/services/consulting-for-organizations') return 'institutions';
  if (pathname === '/talent-innovation-hub') return 'innovation';
  if (pathname === '/skool') return 'skool';
  if (['/apply', '/my-space'].includes(pathname)) return 'accreditation';
  if (['/services', '/psychologists', '/get-matched'].some(route => pathname.startsWith(route))) return 'clinic';
  return 'default';
};

const AnimatedRoutes = () => {
  const location = useLocation();

  // Update body data-theme attribute based on current route
  useEffect(() => {
    const theme = getThemeForRoute(location.pathname);
    document.body.setAttribute('data-theme', theme);
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Index /></PageTransition>} />
        <Route path="/about" element={<PageTransition><About /></PageTransition>} />
        <Route path="/services" element={<PageTransition><Services /></PageTransition>} />
        <Route path="/services/consulting-for-organizations" element={<PageTransition><ConsultingForOrganizations /></PageTransition>} />
        <Route path="/skool" element={<PageTransition><Skool /></PageTransition>} />
        <Route path="/resources" element={<PageTransition><Resources /></PageTransition>} />
        <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
        <Route path="/legal" element={<PageTransition><Legal /></PageTransition>} />
        <Route path="/talent-innovation-hub" element={<PageTransition><TalentInnovationHub /></PageTransition>} />
        <Route path="/psychologists" element={<PageTransition><Psychologists /></PageTransition>} />
        <Route path="/psychologists/:id" element={<PageTransition><PsychologistProfile /></PageTransition>} />
        <Route path="/auth" element={<PageTransition><Auth /></PageTransition>} />
        <Route path="/apply" element={<PageTransition><Apply /></PageTransition>} />
        <Route path="/get-matched" element={<PageTransition><GetMatched /></PageTransition>} />
        <Route path="/my-space" element={<ProtectedRoute><PageTransition><MySpace /></PageTransition></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><PageTransition><AdminDashboard /></PageTransition></ProtectedRoute>} />
        <Route path="/admin/applications" element={<ProtectedRoute><PageTransition><Applications /></PageTransition></ProtectedRoute>} />
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ErrorBoundary>
            <div className="min-h-screen flex flex-col bg-background">
              <Header />
              <BreadcrumbWrapper />
              <AnimatedRoutes />
              <Footer />
            </div>
          </ErrorBoundary>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
