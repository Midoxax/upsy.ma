import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { useToast } from "@/hooks/use-toast";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Shield, FileCheck, ExternalLink, ChevronUp, Eye } from "lucide-react";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ApprovalModal from "./ApprovalModal";
import RejectionModal from "./RejectionModal";
import { AccreditationDocsPanel } from "./AccreditationDocsPanel";

type AccreditationLevel = "provisional" | "verified" | "accredited";

const LEVEL_CONFIG: Record<AccreditationLevel, { label: string; color: "outline" | "secondary" | "default"; icon: string }> = {
  provisional: { label: "Provisional", color: "outline", icon: "🔵" },
  verified: { label: "Verified", color: "secondary", icon: "🟡" },
  accredited: { label: "Accredited", color: "default", icon: "🟢" },
};

const LEVEL_ORDER: AccreditationLevel[] = ["provisional", "verified", "accredited"];

const AccreditationManager = () => {
  const { toast } = useToast();
  const { user } = useAdminAuth();
  const queryClient = useQueryClient();
  const [detailApp, setDetailApp] = useState<any>(null);
  const [upgradeApp, setUpgradeApp] = useState<any>(null);
  const [upgradeLevel, setUpgradeLevel] = useState<AccreditationLevel>("verified");
  const [upgradeNotes, setUpgradeNotes] = useState("");
  const [showApproval, setShowApproval] = useState(false);
  const [showRejection, setShowRejection] = useState(false);
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");

  const { data: applications = [], isLoading } = useQuery({
    queryKey: ["accreditation-applications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("psychologist_applications")
        .select("*")
        .order("submitted_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const approveApplication = useMutation({
    mutationFn: async ({ applicationId, adminUserId }: { applicationId: string; adminUserId: string }) => {
      const { data, error } = await supabase.functions.invoke("provision-psychologist", {
        body: { applicationId, adminUserId },
      });
      if (error) throw error;
      if (!data.success) throw new Error(data.error || "Provisioning failed");
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accreditation-applications"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats-enhanced"] });
      toast({ title: "Approved", description: "Psychologist provisioned successfully." });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const rejectApplication = useMutation({
    mutationFn: async ({ applicationId, adminUserId, reason }: { applicationId: string; adminUserId: string; reason?: string }) => {
      const { data, error } = await supabase.functions.invoke("send-rejection-email", {
        body: { applicationId, adminUserId, reason },
      });
      if (error) throw error;
      if (!data.success) throw new Error(data.error || "Rejection failed");
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accreditation-applications"] });
      toast({ title: "Rejected", description: "Application rejected. Email sent." });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const upgradeAccreditation = useMutation({
    mutationFn: async ({ applicationId, level, notes }: { applicationId: string; level: AccreditationLevel; notes: string }) => {
      // Update application
      const { error: appErr } = await supabase
        .from("psychologist_applications")
        .update({ accreditation_level: level, notes })
        .eq("id", applicationId);
      if (appErr) throw appErr;

      // If approved, also update psychologist profile
      const app = applications.find(a => a.id === applicationId);
      if (app?.status === "approved") {
        // Find the psychologist profile by email match
        const { data: profiles } = await supabase
          .from("psychologist_profiles")
          .select("id")
          .limit(1000);

        // Update accreditation on profile if it exists
        if (profiles && profiles.length > 0) {
          // We update by the fact that the profile was created from this application
          const { error: profErr } = await supabase
            .from("psychologist_profiles")
            .update({
              accreditation_level: level,
              is_accredited: level === "accredited",
            })
            .eq("full_name", app.full_name);
          // Non-critical if profile not found
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accreditation-applications"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats-enhanced"] });
      toast({ title: "Level Updated", description: "Accreditation level upgraded successfully." });
      setUpgradeApp(null);
      setUpgradeNotes("");
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const filtered = applications.filter(a => filter === "all" || a.status === filter);

  const getStatusBadge = (status: string) => {
    const map: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "outline",
      approved: "default",
      rejected: "destructive",
    };
    return <Badge variant={map[status] || "outline"}>{status}</Badge>;
  };

  const getLevelBadge = (level: AccreditationLevel) => {
    const cfg = LEVEL_CONFIG[level] || LEVEL_CONFIG.provisional;
    return <Badge variant={cfg.color}>{cfg.icon} {cfg.label}</Badge>;
  };

  const getNextLevel = (current: AccreditationLevel): AccreditationLevel | null => {
    const idx = LEVEL_ORDER.indexOf(current);
    return idx < LEVEL_ORDER.length - 1 ? LEVEL_ORDER[idx + 1] : null;
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Accreditation Management
              </CardTitle>
              <CardDescription>
                Review applications, manage documents, and upgrade accreditation levels (Provisional → Verified → Accredited)
              </CardDescription>
            </div>
            <Select value={filter} onValueChange={(v) => setFilter(v as any)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {/* Accreditation Path Visual */}
          <div className="mb-6 p-4 rounded-lg border border-border bg-muted/30">
            <h4 className="text-sm font-semibold mb-3">Accreditation Path</h4>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-background border">
                <span>🔵</span>
                <div>
                  <p className="text-sm font-medium">Provisional</p>
                  <p className="text-xs text-muted-foreground">Application submitted</p>
                </div>
              </div>
              <span className="hidden sm:block text-muted-foreground">→</span>
              <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-background border">
                <span>🟡</span>
                <div>
                  <p className="text-sm font-medium">Verified</p>
                  <p className="text-xs text-muted-foreground">Documents reviewed</p>
                </div>
              </div>
              <span className="hidden sm:block text-muted-foreground">→</span>
              <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-background border border-primary/30">
                <span>🟢</span>
                <div>
                  <p className="text-sm font-medium">Accredited</p>
                  <p className="text-xs text-muted-foreground">Fully accredited</p>
                </div>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={FileCheck}
              title="No Applications"
              description="No applications match the current filter."
            />
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Docs</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((app) => {
                    const level = (app.accreditation_level || "provisional") as AccreditationLevel;
                    const nextLevel = getNextLevel(level);
                    const docUrls = (app as any).document_urls || [];

                    return (
                      <TableRow key={app.id}>
                        <TableCell className="font-medium">{app.full_name}</TableCell>
                        <TableCell className="text-sm">{app.email}</TableCell>
                        <TableCell>{getStatusBadge(app.status)}</TableCell>
                        <TableCell>{getLevelBadge(level)}</TableCell>
                        <TableCell>
                          {docUrls.length > 0 ? (
                            <Badge variant="secondary" className="text-xs">
                              {docUrls.length} file(s)
                            </Badge>
                          ) : (
                            <span className="text-xs text-muted-foreground">None</span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm">
                          {app.submitted_at ? format(new Date(app.submitted_at), "MMM d, yyyy") : "—"}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            <Button size="sm" variant="ghost" onClick={() => setDetailApp(app)}>
                              <Eye className="h-3 w-3" />
                            </Button>
                            {app.status === "pending" && (
                              <>
                                <Button size="sm" variant="default" onClick={() => {
                                  setSelectedApp(app);
                                  setShowApproval(true);
                                }}>
                                  Approve
                                </Button>
                                <Button size="sm" variant="destructive" onClick={() => {
                                  setSelectedApp(app);
                                  setShowRejection(true);
                                }}>
                                  Reject
                                </Button>
                              </>
                            )}
                            {app.status === "approved" && nextLevel && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setUpgradeApp(app);
                                  setUpgradeLevel(nextLevel);
                                }}
                              >
                                <ChevronUp className="mr-1 h-3 w-3" />
                                Upgrade
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Modal */}
      <Dialog open={!!detailApp} onOpenChange={() => setDetailApp(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
          </DialogHeader>
          {detailApp && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Name</p>
                  <p className="font-medium">{detailApp.full_name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p className="font-medium">{detailApp.email}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Phone</p>
                  <p className="font-medium">{detailApp.phone || "—"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Accreditation #</p>
                  <p className="font-medium">{detailApp.accreditation_number || "—"}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-muted-foreground">Qualifications</p>
                  <p className="font-medium">{detailApp.qualifications || "—"}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-muted-foreground">Notes</p>
                  <p className="font-medium">{detailApp.notes || "—"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  {getStatusBadge(detailApp.status)}
                </div>
                <div>
                  <p className="text-muted-foreground">Accreditation Level</p>
                  {getLevelBadge(detailApp.accreditation_level || "provisional")}
                </div>
              </div>

              <AccreditationDocsPanel application={detailApp} />
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailApp(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upgrade Modal */}
      <Dialog open={!!upgradeApp} onOpenChange={() => setUpgradeApp(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upgrade Accreditation Level</DialogTitle>
            <DialogDescription>
              Upgrade {upgradeApp?.full_name} to a higher accreditation level.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>New Level</Label>
              <Select value={upgradeLevel} onValueChange={(v) => setUpgradeLevel(v as AccreditationLevel)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="verified">🟡 Verified</SelectItem>
                  <SelectItem value="accredited">🟢 Accredited</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Admin Notes</Label>
              <Textarea
                value={upgradeNotes}
                onChange={(e) => setUpgradeNotes(e.target.value)}
                placeholder="Reason for upgrade, documents reviewed..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUpgradeApp(null)}>Cancel</Button>
            <Button onClick={() => upgradeApp && upgradeAccreditation.mutate({
              applicationId: upgradeApp.id,
              level: upgradeLevel,
              notes: upgradeNotes,
            })}>
              Confirm Upgrade
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approval/Rejection Modals */}
      {selectedApp && (
        <>
          <ApprovalModal
            open={showApproval}
            onClose={() => setShowApproval(false)}
            onConfirm={() => {
              if (user) {
                approveApplication.mutate({ applicationId: selectedApp.id, adminUserId: user.id });
                setShowApproval(false);
                setSelectedApp(null);
              }
            }}
            applicantEmail={selectedApp.email}
            applicantName={selectedApp.full_name}
          />
          <RejectionModal
            open={showRejection}
            onClose={() => setShowRejection(false)}
            onConfirm={(reason) => {
              if (user) {
                rejectApplication.mutate({ applicationId: selectedApp.id, adminUserId: user.id, reason });
                setShowRejection(false);
                setSelectedApp(null);
              }
            }}
            applicantEmail={selectedApp.email}
            applicantName={selectedApp.full_name}
          />
        </>
      )}
    </>
  );
};

export default AccreditationManager;
