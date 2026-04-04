import { Navigate } from "react-router-dom";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import Header from "@/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PsychologistDirectory from "@/components/admin/PsychologistDirectory";
import MatchingRequestsManager from "@/components/admin/MatchingRequestsManager";
import SubscriptionsOverview from "@/components/admin/SubscriptionsOverview";
import AdminStats from "@/components/admin/AdminStats";
import TranslationManager from "@/components/admin/TranslationManager";
import UserManagement from "@/components/admin/UserManagement";
import AccreditationManager from "@/components/admin/AccreditationManager";

const AdminDashboard = () => {
  const { isAdmin, loading: authLoading } = useAdminAuth();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your platform</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="flex flex-wrap h-auto gap-1">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users & Roles</TabsTrigger>
            <TabsTrigger value="accreditation">Accreditation</TabsTrigger>
            <TabsTrigger value="directory">Directory</TabsTrigger>
            <TabsTrigger value="matching">Matching</TabsTrigger>
            <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
            <TabsTrigger value="translations">Translations</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <AdminStats />
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="accreditation">
            <AccreditationManager />
          </TabsContent>

          <TabsContent value="directory">
            <PsychologistDirectory />
          </TabsContent>

          <TabsContent value="matching">
            <MatchingRequestsManager />
          </TabsContent>

          <TabsContent value="subscriptions">
            <SubscriptionsOverview />
          </TabsContent>

          <TabsContent value="translations">
            <TranslationManager />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
