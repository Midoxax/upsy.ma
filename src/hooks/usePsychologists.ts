import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PsychologistProfile, FilterState } from "@/types/psychologist";

interface UsePsychologistsParams {
  filters: FilterState;
  page?: number;
  pageSize?: number;
}

export const usePsychologists = ({ filters, page = 1, pageSize = 12 }: UsePsychologistsParams) => {
  return useQuery({
    queryKey: ["psychologists", filters, page],
    queryFn: async () => {
      // Start with base query
      let query = supabase
        .from("psychologist_profiles")
        .select(`
          *,
          psychologist_specialties(
            specialty:specialties(id, name)
          ),
          psychologist_languages(
            language:languages(id, name)
          )
        `)
        .eq("is_published", true);

      // Apply city filter
      if (filters.city) {
        query = query.ilike("city", `%${filters.city}%`);
      }

      // Apply online/in-person filters
      if (filters.online && !filters.inPerson) {
        query = query.eq("offers_online", true);
      } else if (filters.inPerson && !filters.online) {
        query = query.eq("offers_in_person", true);
      }

      // Apply price range filter
      if (filters.minPrice > 0 || filters.maxPrice < 2000) {
        query = query
          .gte("hourly_rate_mad", filters.minPrice)
          .lte("hourly_rate_mad", filters.maxPrice);
      }

      // Execute query with pagination
      const { data, error, count } = await query
        .order("created_at", { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1);

      if (error) throw error;

      // Transform data to match PsychologistProfile interface
      const profiles: PsychologistProfile[] = (data || []).map((profile: any) => ({
        ...profile,
        specialties: profile.psychologist_specialties?.map((ps: any) => ps.specialty) || [],
        languages: profile.psychologist_languages?.map((pl: any) => pl.language) || [],
      }));

      // Filter by specialties and languages on client side (due to junction tables)
      let filteredProfiles = profiles;

      if (filters.specialties.length > 0) {
        filteredProfiles = filteredProfiles.filter((profile) =>
          profile.specialties.some((spec) => filters.specialties.includes(spec.id))
        );
      }

      if (filters.languages.length > 0) {
        filteredProfiles = filteredProfiles.filter((profile) =>
          profile.languages.some((lang) => filters.languages.includes(lang.id))
        );
      }

      return {
        profiles: filteredProfiles,
        total: filteredProfiles.length,
        page,
        pageSize,
      };
    },
  });
};

export const useSpecialties = () => {
  return useQuery({
    queryKey: ["specialties"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("specialties")
        .select("*")
        .order("name");

      if (error) throw error;
      return data;
    },
  });
};

export const useLanguages = () => {
  return useQuery({
    queryKey: ["languages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("languages")
        .select("*")
        .order("name");

      if (error) throw error;
      return data;
    },
  });
};
