import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { CreditCard, Info, Loader2, CheckCircle2, FileText, Receipt } from "lucide-react";
import { format } from "date-fns";
import { useSpecialistPlan, useAllPlans, type SpecialistPlan } from "@/hooks/useSpecialistPlan";
import {
  useSubscriptionInvoices,
  useChangePlanMock,
} from "@/hooks/useSubscriptionBilling";
import { PlanComparisonGrid } from "./PlanComparisonGrid";
import { useToast } from "@/hooks/use-toast";

export const SpecialistPlansTab = () => {
  const { data: currentPlan, isLoading } = useSpecialistPlan();
  const { data: invoices = [] } = useSubscriptionInvoices();
  const { data: allPlans = [] } = useAllPlans();
  const changePlan = useChangePlanMock();
  const { toast } = useToast();
  const [pending, setPending] = useState<SpecialistPlan | null>(null);

  if (isLoading) {
    return (
      <Card className="bg-surface border-border">
        <CardContent className="py-12 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  const handleConfirm = async () => {
    if (!pending) return;
    try {
      await changePlan.mutateAsync({
        planId: pending.id,
        amountMad: pending.monthly_price_mad,
      });
      toast({
        title: pending.id === "free" ? "Downgraded to Free" : `Upgraded to ${pending.name}`,
        description:
          pending.id === "free"
            ? "Your premium features will remain until the end of the current period."
            : `Test payment of ${pending.monthly_price_mad} MAD recorded. Premium features are now active.`,
      });
      setPending(null);
    } catch (e: any) {
      toast({
        title: "Could not update plan",
        description: e.message || "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Test mode banner */}
      <Alert className="border-amber-500/30 bg-amber-500/5">
        <Info className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-xs">
          Subscriptions are in <strong>test mode</strong> — no real money is charged. Admins can also
          upgrade you manually. Real card payments will be enabled in a future release.
        </AlertDescription>
      </Alert>

      {/* Current plan summary */}
      <Card className="bg-surface border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Your plan
          </CardTitle>
          <CardDescription>
            You're on the <strong className="capitalize">{currentPlan?.name}</strong> plan
            {currentPlan && currentPlan.monthly_price_mad > 0
              ? ` — ${currentPlan.monthly_price_mad} MAD / month`
              : ""}
            . Platform commission: {((currentPlan?.commission_rate ?? 0.2) * 100).toFixed(0)}% per
            session.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Comparison grid */}
      <PlanComparisonGrid
        currentPlanId={currentPlan?.id}
        onSelectPlan={(p) => setPending(p)}
        ctaLabel={(p) => {
          if (!currentPlan) return `Upgrade to ${p.name}`;
          if (p.sort_order > currentPlan.sort_order) return `Upgrade to ${p.name}`;
          return p.id === "free" ? "Downgrade to Free" : `Switch to ${p.name}`;
        }}
      />

      {/* Invoice history */}
      <Card className="bg-surface border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Receipt className="h-4 w-4 text-primary" />
            Invoice history
          </CardTitle>
          <CardDescription>Your past subscription invoices</CardDescription>
        </CardHeader>
        <CardContent>
          {invoices.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              No invoices yet — you're on the Free plan.
            </p>
          ) : (
            <div className="space-y-2">
              {invoices.map((inv) => (
                <div
                  key={inv.id}
                  className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{inv.invoice_number ?? "—"}</p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {inv.plan_type} · {format(new Date(inv.period_start), "MMM yyyy")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold">{inv.amount_mad.toFixed(2)} MAD</span>
                    <Badge
                      variant="secondary"
                      className={
                        inv.status === "paid"
                          ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                          : "bg-amber-500/10 text-amber-700 dark:text-amber-400"
                      }
                    >
                      {inv.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Confirm dialog */}
      <Dialog open={!!pending} onOpenChange={(open) => !open && setPending(null)}>
        <DialogContent className="bg-surface border-border">
          <DialogHeader>
            <DialogTitle>
              {pending?.id === "free" ? "Downgrade to Free" : `Upgrade to ${pending?.name}`}
            </DialogTitle>
            <DialogDescription>
              {pending?.id === "free"
                ? "You'll keep your premium features until the end of the current billing period."
                : `Test payment of ${pending?.monthly_price_mad} MAD will be recorded. No real card will be charged.`}
            </DialogDescription>
          </DialogHeader>
          <Alert className="border-primary/30 bg-primary/5 my-2">
            <Info className="h-4 w-4 text-primary" />
            <AlertDescription className="text-xs">
              Test mode — this records a paid invoice and updates your plan immediately.
            </AlertDescription>
          </Alert>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPending(null)}>
              Cancel
            </Button>
            <Button onClick={handleConfirm} disabled={changePlan.isPending} className="gap-2">
              {changePlan.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )}
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
