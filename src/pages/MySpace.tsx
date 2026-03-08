import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { LogOut, User, Calendar, DollarSign, Users, CreditCard, Video, Award } from "lucide-react";
import { ProfileTab } from "@/components/dashboard/ProfileTab";
import { AvailabilityTab } from "@/components/dashboard/AvailabilityTab";
import { PricingTab } from "@/components/dashboard/PricingTab";
import { LeadsTab } from "@/components/dashboard/LeadsTab";
import { BillingTab } from "@/components/dashboard/BillingTab";
import { SessionsTab } from "@/components/dashboard/SessionsTab";
import CertificatesTab from "@/components/dashboard/CertificatesTab";

const MySpace = () => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-surface border-b border-border">
        <div className="container-custom py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-h1 font-bold">My Space</h1>
              <p className="text-muted-foreground">{user?.email}</p>
            </div>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <section className="section-spacing">
        <div className="container-custom">
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:inline-grid">
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
              <TabsTrigger value="billing" className="gap-2">
                <CreditCard className="h-4 w-4" />
                <span className="hidden sm:inline">Billing</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <ProfileTab />
            </TabsContent>

            <TabsContent value="sessions">
              <SessionsTab />
            </TabsContent>

            <TabsContent value="availability">
              <AvailabilityTab />
            </TabsContent>

            <TabsContent value="pricing">
              <PricingTab />
            </TabsContent>

            <TabsContent value="leads">
              <LeadsTab />
            </TabsContent>

            <TabsContent value="billing">
              <BillingTab />
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default MySpace;
