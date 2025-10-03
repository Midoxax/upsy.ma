import { PsychologistProfile } from "@/types/psychologist";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, DollarSign, Award, Globe, User } from "lucide-react";
import { Link } from "react-router-dom";

interface PsychologistCardProps {
  psychologist: PsychologistProfile;
}

export const PsychologistCard = ({ psychologist }: PsychologistCardProps) => {
  return (
    <Card className="bg-surface border-border hover:border-primary/50 transition-all duration-300 hover:shadow-elegant group">
      <CardContent className="p-6 space-y-4">
        {/* Photo and Name */}
        <div className="flex items-start gap-4">
          <div className="relative">
            {psychologist.photo_url ? (
              <img
                src={psychologist.photo_url}
                alt={`${psychologist.full_name} - Psychologist profile photo`}
                className="w-16 h-16 rounded-full object-cover"
                loading="lazy"
                decoding="async"
              />
            ) : (
              <div 
                className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center"
                role="img"
                aria-label={`${psychologist.full_name} - No photo available`}
              >
                <User className="w-8 h-8 text-primary" aria-hidden="true" />
              </div>
            )}
            {psychologist.is_accredited && (
              <div 
                className="absolute -top-1 -right-1 bg-primary rounded-full p-1"
                role="img"
                aria-label="Accredited psychologist"
              >
                <Award className="w-4 h-4 text-background" aria-hidden="true" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate">{psychologist.full_name}</h3>
            {psychologist.is_accredited && (
              <Badge variant="secondary" className="mt-1 bg-primary/20 text-primary border-primary/30">
                Accredited
              </Badge>
            )}
          </div>
        </div>

        {/* Specialties */}
        {psychologist.specialties.length > 0 && (
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Specialties</p>
            <div className="flex flex-wrap gap-1">
              {psychologist.specialties.slice(0, 3).map((specialty) => (
                <Badge key={specialty.id} variant="outline" className="text-xs">
                  {specialty.name}
                </Badge>
              ))}
              {psychologist.specialties.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{psychologist.specialties.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Languages */}
        {psychologist.languages.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Globe className="w-4 h-4" />
            <span>{psychologist.languages.map((lang) => lang.name).join(", ")}</span>
          </div>
        )}

        {/* Location */}
        {psychologist.city && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{psychologist.city}</span>
            {psychologist.offers_online && <span>• Online Available</span>}
          </div>
        )}

        {/* Price */}
        {psychologist.hourly_rate_mad && (
          <div className="flex items-center gap-2 text-sm font-medium text-primary">
            <DollarSign className="w-4 h-4" />
            <span>{psychologist.hourly_rate_mad} MAD/hour</span>
          </div>
        )}
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Button
          asChild
          variant="primary"
          className="w-full group-hover:shadow-glow transition-all"
        >
          <Link to={`/psychologists/${psychologist.id}`}>View Profile →</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
