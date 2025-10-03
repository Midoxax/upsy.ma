import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { usePsychologistProfile, useUpdateProfile } from "@/hooks/usePsychologistDashboard";
import { Loader2, Save, DollarSign } from "lucide-react";

export const PricingTab = () => {
  const { toast } = useToast();
  const { data: profile, isLoading } = usePsychologistProfile();
  const updateProfile = useUpdateProfile();

  const [hourlyRate, setHourlyRate] = useState("");

  // Sync with profile data
  useEffect(() => {
    if (profile?.hourly_rate_mad) {
      setHourlyRate(profile.hourly_rate_mad.toString());
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const rate = parseFloat(hourlyRate);
      if (isNaN(rate) || rate < 0) {
        throw new Error("Please enter a valid hourly rate");
      }

      await updateProfile.mutateAsync({ hourly_rate_mad: rate });

      toast({
        title: "Pricing Updated",
        description: "Your session fees have been saved.",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "Failed to update pricing",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-surface border-border">
        <CardContent className="py-12 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  const calculatedRates = {
    thirtyMin: hourlyRate ? Math.round(parseFloat(hourlyRate) * 0.5) : 0,
    sixtyMin: hourlyRate ? parseFloat(hourlyRate) : 0,
    ninetyMin: hourlyRate ? Math.round(parseFloat(hourlyRate) * 1.5) : 0,
  };

  return (
    <Card className="bg-surface border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-primary" />
          Session Pricing
        </CardTitle>
        <CardDescription>Set your hourly rate for therapy sessions</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="hourly_rate">Hourly Rate (MAD)</Label>
            <Input
              id="hourly_rate"
              type="number"
              min="0"
              step="50"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(e.target.value)}
              placeholder="700"
              className="bg-background"
            />
            <p className="text-sm text-muted-foreground">
              Your base rate for a 60-minute session in Moroccan Dirhams
            </p>
          </div>

          {hourlyRate && (
            <div className="p-4 bg-background rounded-lg space-y-3">
              <p className="text-sm font-medium">Calculated Session Rates:</p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-3 bg-surface rounded border border-border">
                  <p className="text-xs text-muted-foreground">30 minutes</p>
                  <p className="text-lg font-semibold text-primary">{calculatedRates.thirtyMin} MAD</p>
                </div>
                <div className="p-3 bg-surface rounded border border-primary">
                  <p className="text-xs text-muted-foreground">60 minutes</p>
                  <p className="text-lg font-semibold text-primary">{calculatedRates.sixtyMin} MAD</p>
                </div>
                <div className="p-3 bg-surface rounded border border-border">
                  <p className="text-xs text-muted-foreground">90 minutes</p>
                  <p className="text-lg font-semibold text-primary">{calculatedRates.ninetyMin} MAD</p>
                </div>
              </div>
            </div>
          )}

          <Button type="submit" variant="primary" disabled={updateProfile.isPending}>
            {updateProfile.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Pricing
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
