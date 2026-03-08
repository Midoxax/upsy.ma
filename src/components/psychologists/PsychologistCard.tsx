import { PsychologistProfile } from "@/types/psychologist";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Globe, User, Award, Star, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

interface PsychologistCardProps {
  psychologist: PsychologistProfile;
}

export const PsychologistCard = ({ psychologist }: PsychologistCardProps) => {
  // Mock rating — in production this would come from reviews
  const rating = 4.8 + Math.random() * 0.2;

  return (
    <div className="glass-card p-0 h-full flex flex-col group overflow-hidden">
      {/* Photo Header */}
      <div className="relative h-44 overflow-hidden" style={{ background: 'rgba(255,179,0,0.03)' }}>
        {psychologist.photo_url ? (
          <img
            src={psychologist.photo_url}
            alt={psychologist.full_name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <User className="w-16 h-16 text-u-gold/30" />
          </div>
        )}
        {/* Accreditation badge */}
        {psychologist.is_accredited && (
          <div className="absolute top-3 right-3 bg-u-burgundy rounded-full px-3 py-1 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-u-white" />
            <span className="text-xs text-u-white font-medium">Accredited</span>
          </div>
        )}
        {/* Session type badges */}
        <div className="absolute bottom-3 left-3 flex gap-1.5">
          {psychologist.offers_online && (
            <span className="text-[10px] text-u-white font-medium px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(0,0,0,0.5)' }}>Online</span>
          )}
          {psychologist.offers_in_person && (
            <span className="text-[10px] text-u-white font-medium px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(0,0,0,0.5)' }}>In-Person</span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Name & Rating */}
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg text-u-white leading-tight">{psychologist.full_name}</h3>
          <div className="flex items-center gap-1 shrink-0 ml-2">
            <Star className="w-3.5 h-3.5 fill-u-gold text-u-gold" />
            <span className="text-sm font-semibold text-u-gold">{rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Specialties */}
        {psychologist.specialties.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {psychologist.specialties.slice(0, 3).map((s) => (
              <Badge key={s.id} variant="outline" className="text-[11px] text-u-gray-300 border-white/10 py-0.5">
                {s.name}
              </Badge>
            ))}
            {psychologist.specialties.length > 3 && (
              <Badge variant="outline" className="text-[11px] text-u-gray-400 border-white/10 py-0.5">
                +{psychologist.specialties.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Languages */}
        {psychologist.languages.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-u-gray-300 mb-1.5">
            <Globe className="w-3.5 h-3.5 text-u-gold/50" />
            <span className="text-xs">{psychologist.languages.map((l) => l.name).join(" · ")}</span>
          </div>
        )}

        {/* Location */}
        {psychologist.city && (
          <div className="flex items-center gap-2 text-sm text-u-gray-300 mb-3">
            <MapPin className="w-3.5 h-3.5 text-u-gold/50" />
            <span className="text-xs">{psychologist.city}</span>
          </div>
        )}

        {/* Price */}
        {psychologist.hourly_rate_mad && (
          <p className="text-u-gold font-bold text-lg mb-4">{psychologist.hourly_rate_mad} MAD <span className="text-xs font-normal text-u-gray-400">/ session</span></p>
        )}

        {/* Dual CTAs */}
        <div className="mt-auto flex gap-2">
          <Button asChild variant="secondary" size="sm" className="flex-1">
            <Link to={`/psychologists/${psychologist.slug}`}>View Profile</Link>
          </Button>
          <Button asChild variant="primary" size="sm" className="flex-1">
            <Link to={`/psychologists/${psychologist.slug}#booking`}>
              <Calendar className="mr-1.5 h-3.5 w-3.5" />
              Book
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
