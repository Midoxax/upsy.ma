export interface Specialty {
  id: string;
  name: string;
}

export interface Language {
  id: string;
  name: string;
}

export interface PsychologistProfile {
  id: string;
  full_name: string;
  bio: string | null;
  photo_url: string | null;
  city: string | null;
  is_accredited: boolean;
  offers_online: boolean;
  offers_in_person: boolean;
  hourly_rate_mad: number | null;
  calendly_url: string | null;
  is_published: boolean;
  specialties: Specialty[];
  languages: Language[];
}

export interface FilterState {
  specialties: string[];
  languages: string[];
  city: string;
  online: boolean;
  inPerson: boolean;
  minPrice: number;
  maxPrice: number;
}
