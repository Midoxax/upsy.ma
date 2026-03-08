import { Navigate } from "react-router-dom";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import Header from "@/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ApplicationsTable from "@/components/admin/ApplicationsTable";
import PsychologistDirectory from "@/components/admin/PsychologistDirectory";
import MatchingRequestsManager from "@/components/admin/MatchingRequestsManager";
import SubscriptionsOverview from "@/components/admin/SubscriptionsOverview";
import AdminStats from "@/components/admin/AdminStats";
import TranslationManager from "@/components/admin/TranslationManager";
import { useApplications } from "@/hooks/useApplications";

const AdminDashboard = () => {
  const { isAdmin, loading: authLoading, user } = useAdminAuth();
  const { applications, isLoading, approveApplication, rejectApplication } = useApplications();

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
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="applications">Pending Accreditation</TabsTrigger>
            <TabsTrigger value="directory">Psychologist Directory</TabsTrigger>
            <TabsTrigger value="matching">Matching Requests</TabsTrigger>
            <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
            <TabsTrigger value="translations">Translations</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <AdminStats />
          </TabsContent>

          <TabsContent value="applications">
            <Card>
              <CardHeader>
                <CardTitle>Pending Accreditation</CardTitle>
                <CardDescription>Review and approve psychologist applications</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <ApplicationsTable
                    applications={applications}
                    onApprove={approveApplication.mutate}
                    onReject={rejectApplication.mutate}
                  />
                )}
              </CardContent>
            </Card>
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
