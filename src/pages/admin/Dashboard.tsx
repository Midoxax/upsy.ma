import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navigate } from "react-router-dom";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { format } from "date-fns";
import {
  Users, Activity, TrendingUp, Calendar, DollarSign, CheckCircle,
  Clock, AlertCircle, Search, ChevronDown, MoreVertical,
  UserCheck, UserX, Eye, Zap, Globe, BookOpen, Award, BarChart3,
  ArrowUpRight, ArrowDownRight, Loader2, Bell, Settings, Database,
  Shield, MessageSquare, RefreshCw, Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import AccreditationManager from "@/components/admin/AccreditationManager";
import TranslationManager from "@/components/admin/TranslationManager";
import AnamnesisCopyEditor from "@/components/admin/AnamnesisCopyEditor";
import PricingControl from "@/components/admin/PricingControl";
import TransactionsTab from "@/components/admin/TransactionsTab";
import OrgApplicationsManager from "@/components/admin/OrgApplicationsManager";

// ── Data hooks ──────────────────────────────────────────────────────────────

const usePlatformStats = () =>
  useQuery({
    queryKey: ["admin-platform-stats"],
    queryFn: async () => {
      const { data, error } = await supabase.from("admin_platform_stats").select("*").single();
      if (error) throw error;
      return data as {
        total_users: number;
        active_psychologists: number;
        accredited_psychologists: number;
        total_bookings: number;
        completed_sessions: number;
        pending_bookings: number;
        upcoming_sessions: number;
        total_gross_revenue_mad: number;
        total_platform_revenue_mad: number;
        bookings_last_30d: number;
        new_users_last_30d: number;
      };
    },
    refetchInterval: 30_000,
  });

const useAllPsychologists = () =>
  useQuery({
    queryKey: ["admin-psychologists"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("psychologist_profiles")
        .select(`*, psychologist_specialties(specialty:specialties(name))`)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

const useAllBookings = () =>
  useQuery({
    queryKey: ["admin-bookings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings_with_details")
        .select("*")
        .order("scheduled_at", { ascending: false })
        .limit(200);
      if (error) throw error;
      return data ?? [];
    },
  });

const useAllUsers = () =>
  useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) throw error;
      return data ?? [];
    },
  });

const usePendingApplications = () =>
  useQuery({
    queryKey: ["admin-pending-apps"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("psychologist_applications")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

// ── Stat card ────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  icon: React.ElementType;
  accent?: string;
}

const StatCard = ({ label, value, sub, trend, trendValue, icon: Icon, accent = "text-primary" }: StatCardProps) => (
  <div className="bg-surface border border-border rounded-2xl p-5 space-y-3">
    <div className="flex items-center justify-between">
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</span>
      <div className={cn("p-2 rounded-lg bg-primary/8")}>
        <Icon className={cn("h-4 w-4", accent)} />
      </div>
    </div>
    <div>
      <p className="text-3xl font-bold tracking-tight">{value}</p>
      {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
    </div>
    {trendValue && (
      <div className={cn("flex items-center gap-1 text-xs font-medium",
        trend === "up" ? "text-green-500" : trend === "down" ? "text-red-500" : "text-muted-foreground"
      )}>
        {trend === "up" ? <ArrowUpRight className="h-3 w-3" /> : trend === "down" ? <ArrowDownRight className="h-3 w-3" /> : null}
        {trendValue}
      </div>
    )}
  </div>
);

// ── Overview tab ──────────────────────────────────────────────────────────────

const OverviewTab = () => {
  const { data: stats, isLoading } = usePlatformStats();
  const { data: pending = [] } = usePendingApplications();

  if (isLoading) return (
    <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
  );
  if (!stats) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Total users"
          value={stats.total_users.toLocaleString()}
          sub={`+${stats.new_users_last_30d} this month`}
          icon={Users}
          trend="up"
          trendValue={`${stats.new_users_last_30d} new`}
        />
        <StatCard
          label="Active psychologists"
          value={stats.active_psychologists}
          sub={`${stats.accredited_psychologists} accredited`}
          icon={Award}
          accent="text-purple-500"
        />
        <StatCard
          label="Sessions booked"
          value={stats.total_bookings.toLocaleString()}
          sub={`${stats.completed_sessions} completed`}
          icon={Calendar}
          trend="up"
          trendValue={`${stats.bookings_last_30d} last 30d`}
          accent="text-blue-500"
        />
        <StatCard
          label="Platform revenue"
          value={`${Math.round(stats.total_platform_revenue_mad).toLocaleString()} MAD`}
          sub={`${Math.round(stats.total_gross_revenue_mad).toLocaleString()} MAD gross`}
          icon={DollarSign}
          accent="text-green-500"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Pending bookings" value={stats.pending_bookings} icon={Clock} accent="text-amber-500" />
        <StatCard label="Upcoming sessions" value={stats.upcoming_sessions} icon={Activity} accent="text-teal-500" />
        <StatCard label="Pending applications" value={pending.length} icon={AlertCircle} accent="text-red-500" />
        <StatCard
          label="Completion rate"
          value={stats.total_bookings > 0
            ? `${Math.round((stats.completed_sessions / stats.total_bookings) * 100)}%`
            : "–"}
          icon={CheckCircle}
          accent="text-green-500"
        />
      </div>

      {pending.length > 0 && (
        <div className="flex items-start gap-4 p-4 rounded-2xl border border-amber-500/30 bg-amber-500/5">
          <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-600">
              {pending.length} psychologist application{pending.length > 1 ? "s" : ""} awaiting review
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Review and approve applications in the Accreditation tab.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Psychologists tab ──────────────────────────────────────────────────────

const PSY_STATUS_STYLES: Record<string, string> = {
  published:    "bg-green-500/10 text-green-600 border-green-500/20",
  unpublished:  "bg-gray-500/10 text-gray-500 border-gray-500/20",
  accredited:   "bg-purple-500/10 text-purple-600 border-purple-500/20",
};

const PsychologistsTab = () => {
  const [search, setSearch] = useState("");
  const { data: psychologists = [], isLoading } = useAllPsychologists();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const togglePublish = useMutation({
    mutationFn: async ({ id, published }: { id: string; published: boolean }) => {
      const { error } = await supabase
        .from("psychologist_profiles")
        .update({ is_published: published })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-psychologists"] });
      toast({ title: "Profile updated" });
    },
  });

  const filtered = psychologists.filter((p: any) =>
    !search || p.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    p.city?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-surface"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      ) : (
        <div className="rounded-2xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Name</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide hidden md:table-cell">City</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide hidden md:table-cell">Rate</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-background">
              {filtered.map((p: any) => (
                <tr key={p.id} className="hover:bg-surface/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {p.photo_url ? (
                        <img src={p.photo_url} alt="" className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                          {p.full_name?.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{p.full_name}</p>
                        {p.is_accredited && (
                          <p className="text-xs text-purple-600">{p.accreditation_level ?? "Accredited"}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{p.city ?? "–"}</td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                    {p.hourly_rate_mad ? `${p.hourly_rate_mad} MAD` : "–"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5 flex-wrap">
                      <Badge className={cn("text-xs border", p.is_published ? PSY_STATUS_STYLES.published : PSY_STATUS_STYLES.unpublished)}>
                        {p.is_published ? "Published" : "Hidden"}
                      </Badge>
                      {p.is_accredited && (
                        <Badge className={cn("text-xs border", PSY_STATUS_STYLES.accredited)}>Accredited</Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => togglePublish.mutate({ id: p.id, published: !p.is_published })}
                      className="text-xs"
                    >
                      {p.is_published ? <UserX className="h-3.5 w-3.5" /> : <UserCheck className="h-3.5 w-3.5" />}
                    </Button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-muted-foreground text-sm">
                    No psychologists found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// ── Bookings tab ──────────────────────────────────────────────────────────────

const BOOKING_STATUS_STYLES: Record<string, string> = {
  pending:   "bg-amber-500/10 text-amber-600 border-amber-500/20",
  confirmed: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  completed: "bg-green-500/10 text-green-600 border-green-500/20",
  cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
  no_show:   "bg-gray-500/10 text-gray-500 border-gray-500/20",
};

const BookingsTab = () => {
  const [filter, setFilter] = useState("all");
  const { data: bookings = [], isLoading } = useAllBookings();

  const filtered = bookings.filter((b: any) =>
    filter === "all" || b.status === filter
  );

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {["all", "pending", "confirmed", "completed", "cancelled"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={cn(
              "text-xs px-3 py-1.5 rounded-full border transition-all capitalize",
              filter === s
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-muted-foreground hover:border-primary/40"
            )}
          >
            {s}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      ) : (
        <div className="rounded-2xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Patient</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide hidden md:table-cell">Psychologist</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">When</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide hidden md:table-cell">Amount</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-background">
              {filtered.map((b: any) => (
                <tr key={b.id} className="hover:bg-surface/50 transition-colors">
                  <td className="px-4 py-3 font-medium">{b.patient_name ?? "–"}</td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{b.psychologist_name ?? "–"}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    <p>{format(new Date(b.scheduled_at), "MMM d")}</p>
                    <p className="text-xs">{format(new Date(b.scheduled_at), "HH:mm")}</p>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                    {b.amount_mad ? `${b.amount_mad} MAD` : "–"}
                  </td>
                  <td className="px-4 py-3">
                    <Badge className={cn("text-xs border", BOOKING_STATUS_STYLES[b.status])}>
                      {b.status}
                    </Badge>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-muted-foreground text-sm">No bookings found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// ── Users tab ─────────────────────────────────────────────────────────────────

const UsersTab = () => {
  const [search, setSearch] = useState("");
  const { data: users = [], isLoading } = useAllUsers();

  const filtered = users.filter((u: any) =>
    !search || u.full_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-surface"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      ) : (
        <div className="rounded-2xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">User</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide hidden md:table-cell">City</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-background">
              {filtered.map((u: any) => (
                <tr key={u.id} className="hover:bg-surface/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {u.avatar_url ? (
                        <img src={u.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
                          {u.full_name?.slice(0, 2).toUpperCase() ?? "?"}
                        </div>
                      )}
                      <span className="font-medium">{u.full_name ?? "Anonymous"}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{u.city ?? "–"}</td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">
                    {format(new Date(u.created_at), "MMM d, yyyy")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// ── Main dashboard ────────────────────────────────────────────────────────────

const AdminDashboard = () => {
  const { isAdmin, loading: authLoading } = useAdminAuth();
  const { data: pending = [] } = usePendingApplications();
  const queryClient = useQueryClient();

  if (authLoading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
    </div>
  );

  if (!isAdmin) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-16 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container-custom">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <h1 className="text-sm font-semibold">Admin Dashboard</h1>
              {pending.length > 0 && (
                <Badge className="bg-red-500/10 text-red-500 border-red-500/20 text-xs">
                  {pending.length} pending
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => queryClient.invalidateQueries()}
                className="text-xs gap-1.5"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      <main className="container-custom py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="flex flex-wrap h-auto gap-1 bg-surface border border-border p-1 rounded-xl">
            {[
              { value: "overview", label: "Overview", icon: BarChart3 },
              { value: "psychologists", label: "Psychologists", icon: Users },
              { value: "bookings", label: "Bookings", icon: Calendar },
              { value: "users", label: "Users", icon: Shield },
              { value: "accreditation", label: "Accreditation", icon: Award },
              { value: "org-applications", label: "Org. Apps", icon: Building2 as any },
              { value: "pricing", label: "Pricing", icon: DollarSign },
            { value: "transactions", label: "Transactions", icon: Database },
              { value: "translations", label: "Translations", icon: Globe },
            ].map(({ value, label, icon: Icon }) => (
              <TabsTrigger key={value} value={value} className="gap-1.5 text-xs">
                <Icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="overview"><OverviewTab /></TabsContent>
          <TabsContent value="psychologists"><PsychologistsTab /></TabsContent>
          <TabsContent value="bookings"><BookingsTab /></TabsContent>
          <TabsContent value="users"><UsersTab /></TabsContent>
          <TabsContent value="accreditation"><AccreditationManager /></TabsContent>
          <TabsContent value="org-applications"><OrgApplicationsManager /></TabsContent>
          <TabsContent value="pricing"><PricingControl /></TabsContent>
          <TabsContent value="transactions"><TransactionsTab /></TabsContent>
          <TabsContent value="translations">
            <div className="space-y-6">
              <AnamnesisCopyEditor />
              <TranslationManager />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
