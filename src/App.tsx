import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import ClinicalPsychology from "./pages/services/ClinicalPsychology";
import SportPsychology from "./pages/services/SportPsychology";
import TrainingAndTalks from "./pages/services/TrainingAndTalks";
import ConsultingForOrganizations from "./pages/services/ConsultingForOrganizations";
import Skool from "./pages/Skool";
import Resources from "./pages/Resources";
import BookACall from "./pages/BookACall";
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
              <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services/clinical-psychology" element={<ClinicalPsychology />} />
              <Route path="/services/sport-psychology" element={<SportPsychology />} />
              <Route path="/services/training-and-talks" element={<TrainingAndTalks />} />
              <Route path="/services/consulting-for-organizations" element={<ConsultingForOrganizations />} />
              <Route path="/skool" element={<Skool />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/book-a-call" element={<BookACall />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/legal" element={<Legal />} />
              <Route path="/talent-innovation-hub" element={<TalentInnovationHub />} />
              <Route path="/psychologists" element={<Psychologists />} />
              <Route path="/psychologists/:id" element={<PsychologistProfile />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/apply" element={<Apply />} />
              <Route path="/get-matched" element={<GetMatched />} />
              <Route
                path="/my-space"
                element={
                  <ProtectedRoute>
                    <MySpace />
                  </ProtectedRoute>
                }
              />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/applications"
            element={
              <ProtectedRoute>
                <Applications />
              </ProtectedRoute>
            }
          />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
              </Routes>
              <Footer />
            </div>
          </ErrorBoundary>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
