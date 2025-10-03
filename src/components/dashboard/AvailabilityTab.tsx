import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { usePsychologistProfile, useUpdateProfile } from "@/hooks/usePsychologistDashboard";
import { Loader2, Save, Calendar } from "lucide-react";

export const AvailabilityTab = () => {
  const { toast } = useToast();
  const { data: profile, isLoading } = usePsychologistProfile();
  const updateProfile = useUpdateProfile();

  const [bookingLink, setBookingLink] = useState("");

  // Sync with profile data
  useEffect(() => {
    if (profile?.calendly_url) {
      setBookingLink(profile.calendly_url);
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateProfile.mutateAsync({ calendly_url: bookingLink });

      toast({
        title: "Booking Link Updated",
        description: "Your availability settings have been saved.",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "Failed to update booking link",
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

  return (
    <Card className="bg-surface border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Availability & Booking
        </CardTitle>
        <CardDescription>
          Connect your Calendly or Cal.com link to let clients book sessions directly
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="booking_link">Booking Link (Calendly/Cal.com)</Label>
            <Input
              id="booking_link"
              type="url"
              value={bookingLink}
              onChange={(e) => setBookingLink(e.target.value)}
              placeholder="https://calendly.com/your-link"
              className="bg-background"
            />
            <p className="text-sm text-muted-foreground">
              This link will be embedded on your profile page for easy booking.
            </p>
          </div>

          {bookingLink && (
            <div className="p-4 bg-background rounded-lg">
              <p className="text-sm font-medium mb-2">Preview:</p>
              <div className="w-full h-[400px] rounded overflow-hidden border border-border">
                <iframe
                  src={bookingLink}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  title="Booking preview"
                />
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
                Save Booking Link
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
