import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Calendar, TrendingUp, Shield } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const typeColors: Record<string, string> = {
  quarterly: "bg-primary/10 text-primary border-primary/20",
  diagnostic: "bg-chart-1/10 text-chart-1 border-chart-1/20",
  program: "bg-chart-2/10 text-chart-2 border-chart-2/20",
  annual: "bg-accent/10 text-accent border-accent/20",
};

const OrgReportsTab = () => {
  const [typeFilter, setTypeFilter] = useState("all");

  const filtered = typeFilter === "all" ? mockReports : mockReports.filter(r => r.type === typeFilter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">Reports & Insights</h3>
          <p className="text-sm text-muted-foreground">Download aggregated mental health reports for your organization</p>
        </div>
        <div className="flex gap-3">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reports</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="diagnostic">Diagnostic</SelectItem>
              <SelectItem value="program">Program</SelectItem>
              <SelectItem value="annual">Annual</SelectItem>
            </SelectContent>
          </Select>
          <Button className="gap-2">
            <FileText className="h-4 w-4" />
            Request Report
          </Button>
        </div>
      </div>

      {/* Report summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4 text-center">
            <FileText className="h-5 w-5 mx-auto mb-1 text-primary" />
            <p className="text-2xl font-bold">{mockReports.length}</p>
            <p className="text-xs text-muted-foreground">Total Reports</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <TrendingUp className="h-5 w-5 mx-auto mb-1 text-chart-2" />
            <p className="text-2xl font-bold">{mockReports.filter(r => r.type === "quarterly").length}</p>
            <p className="text-xs text-muted-foreground">Quarterly</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <Shield className="h-5 w-5 mx-auto mb-1 text-chart-1" />
            <p className="text-2xl font-bold">{mockReports.filter(r => r.type === "diagnostic").length}</p>
            <p className="text-xs text-muted-foreground">Diagnostics</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <Calendar className="h-5 w-5 mx-auto mb-1 text-accent" />
            <p className="text-2xl font-bold">{mockReports.filter(r => r.type === "annual").length}</p>
            <p className="text-xs text-muted-foreground">Annual</p>
          </CardContent>
        </Card>
      </div>

      {/* Reports list */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Report History</CardTitle>
          <CardDescription>{filtered.length} reports available</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filtered.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:bg-muted/20 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{report.title}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <Badge variant="outline" className={typeColors[report.type]}>
                        {report.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{new Date(report.date).toLocaleDateString()}</span>
                      <span className="text-xs text-muted-foreground">{report.pages} pages</span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="gap-1.5" disabled={report.status === "processing"}>
                  {report.status === "processing" ? (
                    <span className="text-xs text-muted-foreground">Processing...</span>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      Download
                    </>
                  )}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Privacy Note */}
      <div className="p-4 rounded-lg border border-border bg-muted/20">
        <p className="text-xs text-muted-foreground flex items-start gap-2">
          <Shield className="h-4 w-4 shrink-0 mt-0.5" />
          All reports contain aggregated, anonymized data only. Individual employee data is never exposed. Reports comply with CNDP (Morocco) and GDPR standards.
        </p>
      </div>
    </div>
  );
};

export default OrgReportsTab;
