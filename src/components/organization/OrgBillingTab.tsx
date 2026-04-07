import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Download, Receipt, TrendingUp } from "lucide-react";

const mockInvoices = [
  { id: "INV-2026-003", date: "2026-03-01", amount: 45000, status: "paid", description: "March 2026 — 30 sessions" },
  { id: "INV-2026-002", date: "2026-02-01", amount: 37500, status: "paid", description: "February 2026 — 25 sessions" },
  { id: "INV-2026-001", date: "2026-01-01", amount: 42000, status: "paid", description: "January 2026 — 28 sessions" },
  { id: "INV-2025-012", date: "2025-12-01", amount: 30000, status: "paid", description: "December 2025 — 20 sessions" },
];

const OrgBillingTab = () => {
  const totalSpent = mockInvoices.reduce((a, inv) => a + inv.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Billing & Invoices</h3>
        <p className="text-sm text-muted-foreground">Manage your organization's subscription and payment history</p>
      </div>

      {/* Billing Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4 text-center">
            <CreditCard className="h-5 w-5 mx-auto mb-1 text-primary" />
            <p className="text-xl font-bold">Enterprise</p>
            <p className="text-xs text-muted-foreground">Current Plan</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <Receipt className="h-5 w-5 mx-auto mb-1 text-chart-2" />
            <p className="text-xl font-bold">{(totalSpent / 100).toLocaleString()} MAD</p>
            <p className="text-xs text-muted-foreground">Total Spent</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <TrendingUp className="h-5 w-5 mx-auto mb-1 text-accent" />
            <p className="text-xl font-bold">103</p>
            <p className="text-xs text-muted-foreground">Total Sessions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <p className="text-xl font-bold text-chart-4">1,500 MAD</p>
            <p className="text-xs text-muted-foreground">Avg per Session</p>
          </CardContent>
        </Card>
      </div>

      {/* Plan Details */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Enterprise Plan</CardTitle>
              <CardDescription>Unlimited employees, dedicated support, custom reporting</CardDescription>
            </div>
            <Button variant="outline">Manage Plan</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-3 gap-4 text-sm">
            <div className="p-3 rounded-lg bg-muted/30">
              <p className="text-muted-foreground">Employees Covered</p>
              <p className="font-semibold mt-1">Unlimited</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/30">
              <p className="text-muted-foreground">Sessions/month</p>
              <p className="font-semibold mt-1">50 included</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/30">
              <p className="text-muted-foreground">Renewal</p>
              <p className="font-semibold mt-1">Apr 1, 2026</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoice History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Invoice History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockInvoices.map((inv) => (
              <div key={inv.id} className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:bg-muted/20 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center">
                    <Receipt className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{inv.id}</p>
                    <p className="text-xs text-muted-foreground">{inv.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-semibold text-sm">{inv.amount.toLocaleString()} MAD</p>
                    <p className="text-xs text-muted-foreground">{new Date(inv.date).toLocaleDateString()}</p>
                  </div>
                  <Badge variant="outline" className="bg-chart-2/10 text-chart-2 border-chart-2/20">
                    {inv.status}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrgBillingTab;
