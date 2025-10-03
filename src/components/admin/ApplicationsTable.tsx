import { useState } from "react";
import { Application } from "@/hooks/useApplications";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ApprovalModal from "./ApprovalModal";
import RejectionModal from "./RejectionModal";
import { format } from "date-fns";

interface ApplicationsTableProps {
  applications: Application[];
  onApprove: (params: { applicationId: string; adminUserId: string }) => void;
  onReject: (params: { applicationId: string; adminUserId: string; reason?: string }) => void;
}

const ApplicationsTable = ({ applications, onApprove, onReject }: ApplicationsTableProps) => {
  const { user } = useAuth();
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);

  const handleApprove = (app: Application) => {
    setSelectedApp(app);
    setShowApprovalModal(true);
  };

  const handleReject = (app: Application) => {
    setSelectedApp(app);
    setShowRejectionModal(true);
  };

  const confirmApproval = () => {
    if (selectedApp && user) {
      onApprove({ applicationId: selectedApp.id, adminUserId: user.id });
      setShowApprovalModal(false);
      setSelectedApp(null);
    }
  };

  const confirmRejection = (reason?: string) => {
    if (selectedApp && user) {
      onReject({ applicationId: selectedApp.id, adminUserId: user.id, reason });
      setShowRejectionModal(false);
      setSelectedApp(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      pending: "default",
      approved: "secondary",
      rejected: "destructive",
    };
    return <Badge variant={variants[status] || "default"}>{status}</Badge>;
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Accredited</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No applications found
                </TableCell>
              </TableRow>
            ) : (
              applications.map((app) => (
                <TableRow key={app.id}>
                  <TableCell className="font-medium">{app.full_name}</TableCell>
                  <TableCell>{app.email}</TableCell>
                  <TableCell>{app.phone || "—"}</TableCell>
                  <TableCell>{app.accreditation_number ? "Yes" : "No"}</TableCell>
                  <TableCell>{getStatusBadge(app.status)}</TableCell>
                  <TableCell>{format(new Date(app.submitted_at), "MMM d, yyyy")}</TableCell>
                  <TableCell>
                    {app.status === "pending" && (
                      <div className="flex gap-2">
                        <Button size="sm" variant="default" onClick={() => handleApprove(app)}>
                          Approve
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleReject(app)}>
                          Reject
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {selectedApp && (
        <>
          <ApprovalModal
            open={showApprovalModal}
            onClose={() => setShowApprovalModal(false)}
            onConfirm={confirmApproval}
            applicantEmail={selectedApp.email}
            applicantName={selectedApp.full_name}
          />
          <RejectionModal
            open={showRejectionModal}
            onClose={() => setShowRejectionModal(false)}
            onConfirm={confirmRejection}
            applicantEmail={selectedApp.email}
            applicantName={selectedApp.full_name}
          />
        </>
      )}
    </>
  );
};

export default ApplicationsTable;
