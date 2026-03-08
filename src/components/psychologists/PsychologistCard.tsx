import { PsychologistProfile } from "@/types/psychologist";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Globe, User, Award } from "lucide-react";
import { Link } from "react-router-dom";

interface PsychologistCardProps {
  psychologist: PsychologistProfile;
}

export const PsychologistCard = ({ psychologist }: PsychologistCardProps) => {
  return (
    <div className="glass-card p-6 h-full flex flex-col group">
      {/* Photo and Name */}
      <div className="flex items-start gap-4 mb-4">
        <div className="relative shrink-0">
          {psychologist.photo_url ? (
            <img
              src={psychologist.photo_url}
              alt={`${psychologist.full_name}`}
              className="w-16 h-16 rounded-full object-cover"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(255,179,0,0.1)', border: '2px solid rgba(255,179,0,0.3)' }}
            >
              <User className="w-8 h-8 text-u-gold" />
            </div>
          )}
          {psychologist.is_accredited && (
            <div className="absolute -top-1 -right-1 bg-u-burgundy rounded-full p-1">
              <Award className="w-3.5 h-3.5 text-u-white" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg text-u-white truncate">{psychologist.full_name}</h3>
          {psychologist.is_accredited && (
            <Badge className="mt-1 text-xs bg-u-burgundy/20 text-u-burgundy border-u-burgundy/30 hover:bg-u-burgundy/30">
              Accredited
            </Badge>
          )}
        </div>
      </div>

      {/* Specialties */}
      {psychologist.specialties.length > 0 && (
        <div className="mb-3">
          <div className="flex flex-wrap gap-1.5">
            {psychologist.specialties.slice(0, 3).map((specialty) => (
              <Badge key={specialty.id} variant="outline" className="text-xs text-u-gray-300 border-white/10">
                {specialty.name}
              </Badge>
            ))}
            {psychologist.specialties.length > 3 && (
              <Badge variant="outline" className="text-xs text-u-gray-400 border-white/10">
                +{psychologist.specialties.length - 3}
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Languages */}
      {psychologist.languages.length > 0 && (
        <div className="flex items-center gap-2 text-sm text-u-gray-300 mb-2">
          <Globe className="w-4 h-4 text-u-gold/60" />
          <span>{psychologist.languages.map((lang) => lang.name).join(" · ")}</span>
        </div>
      )}

      {/* Location */}
      {psychologist.city && (
        <div className="flex items-center gap-2 text-sm text-u-gray-300 mb-3">
          <MapPin className="w-4 h-4 text-u-gold/60" />
          <span>{psychologist.city}</span>
          {psychologist.offers_online && <span className="text-u-gold/60">• Online</span>}
        </div>
      )}

      {/* Price */}
      {psychologist.hourly_rate_mad && (
        <p className="text-u-gold font-semibold mb-4">{psychologist.hourly_rate_mad} MAD / session</p>
      )}

      {/* Spacer + CTA */}
      <div className="mt-auto pt-2">
        <Button asChild variant="primary" className="w-full">
          <Link to={`/psychologists/${psychologist.slug}`}>View Profile →</Link>
        </Button>
      </div>
    </div>
  );
};
