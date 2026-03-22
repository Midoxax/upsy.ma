import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Outlet } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import PageTransition from "@/components/PageTransition";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AdminRoute } from "@/components/AdminRoute";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LocaleProvider } from "@/contexts/LocaleContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { stripLocalePrefix } from "@/lib/i18n/utils";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { BreadcrumbWrapper } from "@/components/BreadcrumbWrapper";
import SEOHead from "@/components/SEOHead";
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import ConsultingForOrganizations from "./pages/services/ConsultingForOrganizations";
import Skool from "./pages/Skool";
import Resources from "./pages/Resources";
import Contact from "./pages/Contact";
import Legal from "./pages/Legal";
import TalentInnovationHub from "./pages/TalentInnovationHub";
import MoroccanUmbrella from "./pages/MoroccanUmbrella";
import PsychologuesSansFrontieres from "./pages/PsychologuesSansFrontieres";
import Psychologists from "./pages/Psychologists";
import PsychologistProfile from "./pages/PsychologistProfile";
import Auth from "./pages/Auth";
import MySpace from "./pages/MySpace";
import Apply from "./pages/Apply";
import GetMatched from "./pages/GetMatched";
import PatientDashboard from "./pages/PatientDashboard";
import AthleteHub from "./pages/AthleteHub";
import AssessmentLab from "./pages/AssessmentLab";
import AIAssistant from "./pages/AIAssistant";
import Applications from "./pages/admin/Applications";
import AdminDashboard from "./pages/admin/Dashboard";
import VideoCall from "./pages/VideoCall";
import BrandGuidelines from "./pages/BrandGuidelines";
import BlogIndex from "./pages/blog/BlogIndex";
import FindRightPsychologist from "./pages/blog/FindRightPsychologist";
import DoINeedTherapy from "./pages/blog/DoINeedTherapy";
import UnderstandingAnxiety from "./pages/blog/UnderstandingAnxiety";
import BenefitsOnlineTherapy from "./pages/blog/BenefitsOnlineTherapy";
import MentalHealthAtWork from "./pages/blog/MentalHealthAtWork";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Theme mapper based on route patterns
const getThemeForRoute = (pathname: string): string => {
  const cleanPath = stripLocalePrefix(pathname);
  if (cleanPath === '/services/sport-psychology') return 'performance';
  if (cleanPath === '/services/consulting-for-organizations') return 'institutions';
  if (cleanPath === '/talent-innovation-hub') return 'innovation';
  if (cleanPath === '/skool') return 'skool';
  if (['/apply', '/my-space'].includes(cleanPath)) return 'accreditation';
  if (['/services', '/psychologists', '/get-matched'].some(route => cleanPath.startsWith(route))) return 'clinic';
  return 'default';
};

// Shared route definitions to avoid triplication
const AppRoutes = () => (
  <>
    <Route index element={<PageTransition><Index /></PageTransition>} />
    <Route path="about" element={<PageTransition><About /></PageTransition>} />
    <Route path="services" element={<PageTransition><Services /></PageTransition>} />
    <Route path="services/consulting-for-organizations" element={<PageTransition><ConsultingForOrganizations /></PageTransition>} />
    <Route path="skool" element={<PageTransition><Skool /></PageTransition>} />
    <Route path="resources" element={<PageTransition><Resources /></PageTransition>} />
    <Route path="contact" element={<PageTransition><Contact /></PageTransition>} />
    <Route path="legal" element={<PageTransition><Legal /></PageTransition>} />
    <Route path="talent-innovation-hub" element={<PageTransition><TalentInnovationHub /></PageTransition>} />
    <Route path="moroccan-umbrella" element={<PageTransition><MoroccanUmbrella /></PageTransition>} />
    <Route path="psf" element={<PageTransition><PsychologuesSansFrontieres /></PageTransition>} />
    <Route path="psychologists" element={<PageTransition><Psychologists /></PageTransition>} />
    <Route path="psychologists/:id" element={<PageTransition><PsychologistProfile /></PageTransition>} />
    <Route path="auth" element={<PageTransition><Auth /></PageTransition>} />
    <Route path="apply" element={<PageTransition><Apply /></PageTransition>} />
    <Route path="get-matched" element={<PageTransition><GetMatched /></PageTransition>} />
    <Route path="dashboard" element={<ProtectedRoute><PageTransition><PatientDashboard /></PageTransition></ProtectedRoute>} />
    <Route path="athlete-hub" element={<ProtectedRoute><PageTransition><AthleteHub /></PageTransition></ProtectedRoute>} />
    <Route path="assessments" element={<PageTransition><AssessmentLab /></PageTransition>} />
    <Route path="ai-assistant" element={<ProtectedRoute><PageTransition><AIAssistant /></PageTransition></ProtectedRoute>} />
    <Route path="my-space" element={<ProtectedRoute><PageTransition><MySpace /></PageTransition></ProtectedRoute>} />
    <Route path="admin" element={<AdminRoute><PageTransition><AdminDashboard /></PageTransition></AdminRoute>} />
    <Route path="admin/applications" element={<AdminRoute><PageTransition><Applications /></PageTransition></AdminRoute>} />
    <Route path="session/:sessionId" element={<ProtectedRoute><VideoCall /></ProtectedRoute>} />
    <Route path="brand" element={<PageTransition><BrandGuidelines /></PageTransition>} />
    <Route path="blog" element={<PageTransition><BlogIndex /></PageTransition>} />
    <Route path="blog/find-right-psychologist" element={<PageTransition><FindRightPsychologist /></PageTransition>} />
    <Route path="blog/do-i-need-therapy" element={<PageTransition><DoINeedTherapy /></PageTransition>} />
  </>
);

const AnimatedRoutes = () => {
  const location = useLocation();

  // Update body data-theme attribute based on current route
  useEffect(() => {
    const theme = getThemeForRoute(location.pathname);
    document.body.setAttribute('data-theme', theme);
  }, [location.pathname]);

  return (
    <>
      <SEOHead path={location.pathname} />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Root locale (English / default) */}
          <Route path="/" element={<Outlet />}>
            {AppRoutes()}
          </Route>

          {/* Locale-prefixed routes */}
          <Route path="/:locale" element={<Outlet />}>
            {AppRoutes()}
          </Route>

          <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
        </Routes>
      </AnimatePresence>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <LocaleProvider>
              <ErrorBoundary>
                <div className="min-h-screen flex flex-col bg-background">
                  <Header />
                  <BreadcrumbWrapper />
                  <AnimatedRoutes />
                  <Footer />
                </div>
              </ErrorBoundary>
            </LocaleProvider>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
