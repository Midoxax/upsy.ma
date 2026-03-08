import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Navigate } from "react-router-dom";
import { useUserRole } from "@/hooks/useUserRole";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

// Lazy-load dashboards to avoid importing everything upfront
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Calendar, DollarSign, Users, CreditCard, Video, Award } from "lucide-react";
import { ProfileTab } from "@/components/dashboard/ProfileTab";
import { AvailabilityTab } from "@/components/dashboard/AvailabilityTab";
import { PricingTab } from "@/components/dashboard/PricingTab";
import { LeadsTab } from "@/components/dashboard/LeadsTab";
import { BillingTab } from "@/components/dashboard/BillingTab";
import { SessionsTab } from "@/components/dashboard/SessionsTab";
import CertificatesTab from "@/components/dashboard/CertificatesTab";
import PatientDashboard from "@/pages/PatientDashboard";
import AthleteHub from "@/pages/AthleteHub";

const PsychologistDashboard = () => (
  <section className="section-spacing">
    <div className="container-custom">
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-7 lg:w-auto lg:inline-grid">
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="sessions" className="gap-2">
            <Video className="h-4 w-4" />
            <span className="hidden sm:inline">Sessions</span>
          </TabsTrigger>
          <TabsTrigger value="availability" className="gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Availability</span>
          </TabsTrigger>
          <TabsTrigger value="pricing" className="gap-2">
            <DollarSign className="h-4 w-4" />
            <span className="hidden sm:inline">Pricing</span>
          </TabsTrigger>
          <TabsTrigger value="leads" className="gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Leads</span>
          </TabsTrigger>
          <TabsTrigger value="certificates" className="gap-2">
            <Award className="h-4 w-4" />
            <span className="hidden sm:inline">Certificates</span>
          </TabsTrigger>
          <TabsTrigger value="billing" className="gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Billing</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile"><ProfileTab /></TabsContent>
        <TabsContent value="sessions"><SessionsTab /></TabsContent>
        <TabsContent value="availability"><AvailabilityTab /></TabsContent>
        <TabsContent value="pricing"><PricingTab /></TabsContent>
        <TabsContent value="leads"><LeadsTab /></TabsContent>
        <TabsContent value="certificates"><CertificatesTab /></TabsContent>
        <TabsContent value="billing"><BillingTab /></TabsContent>
      </Tabs>
    </div>
  </section>
);

const ROLE_LABELS: Record<string, string> = {
  admin: "Administrator",
  psychologist: "Psychologist",
  athlete: "Athlete",
  coach: "Coach",
  organization: "Organization",
  user: "Member",
};

const MySpace = () => {
  const { signOut, user } = useAuth();
  const { primaryRole, loading } = useUserRole();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const renderDashboard = () => {
    switch (primaryRole) {
      case "admin":
        return <Navigate to="/admin" replace />;
      case "psychologist":
        return <PsychologistDashboard />;
      case "athlete":
      case "coach":
        return <AthleteHub />;
      case "organization":
        // Organization dashboard — for now show patient dashboard with certificates
        return <PatientDashboard />;
      case "user":
      default:
        return <PatientDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-surface border-b border-border">
        <div className="container-custom py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-h1 font-bold">My Space</h1>
              <div className="flex items-center gap-3 mt-1">
                <p className="text-muted-foreground">{user?.email}</p>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                  {ROLE_LABELS[primaryRole] || "Member"}
                </span>
              </div>
            </div>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Role-based Dashboard */}
      {renderDashboard()}
    </div>
  );
};

export default MySpace;
