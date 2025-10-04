import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileCheck, MessageSquare, CreditCard } from "lucide-react";

const AdminStats = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [psychologists, applications, requests, subscriptions] = await Promise.all([
        supabase.from("psychologist_profiles").select("id", { count: "exact", head: true }),
        supabase.from("psychologist_applications").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("client_matching_requests").select("id", { count: "exact", head: true }),
        supabase.from("subscriptions").select("id, plan_type", { count: "exact" }),
      ]);

      return {
        totalPsychologists: psychologists.count || 0,
        pendingApplications: applications.count || 0,
        matchingRequests: requests.count || 0,
        activeSubscriptions: subscriptions.data?.filter(s => s.plan_type !== "free").length || 0,
      };
    },
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-muted animate-pulse rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Psychologists",
      value: stats?.totalPsychologists || 0,
      icon: Users,
    },
    {
      title: "Pending Applications",
      value: stats?.pendingApplications || 0,
      icon: FileCheck,
    },
    {
      title: "Matching Requests",
      value: stats?.matchingRequests || 0,
      icon: MessageSquare,
    },
    {
      title: "Active Subscriptions",
      value: stats?.activeSubscriptions || 0,
      icon: CreditCard,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default AdminStats;
