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
      const { data, error } = await supabase.rpc("search_psychologists", {
        p_specialties: filters.specialties.length > 0 ? filters.specialties : [],
        p_languages: filters.languages.length > 0 ? filters.languages : [],
        p_therapy_approaches: filters.therapyApproaches.length > 0 ? filters.therapyApproaches : [],
        p_city: filters.city || null,
        p_online: filters.online || null,
        p_in_person: filters.inPerson || null,
        p_gender: filters.gender || null,
        p_availability: filters.availability || null,
        p_min_price: filters.minPrice,
        p_max_price: filters.maxPrice,
        p_page: page,
        p_page_size: pageSize,
      });

      if (error) throw error;

      const total = data && data.length > 0 ? Number(data[0].total_count) : 0;
      const profileIds = data?.map((p: any) => p.id) || [];

      if (profileIds.length === 0) {
        return { profiles: [], total: 0, page, pageSize };
      }

      // Fetch junction table data
      const [specialtiesData, languagesData, approachesData] = await Promise.all([
        supabase
          .from("psychologist_specialties")
          .select("psychologist_id, specialty:specialties(id, name)")
          .in("psychologist_id", profileIds),
        supabase
          .from("psychologist_languages")
          .select("psychologist_id, language:languages(id, name)")
          .in("psychologist_id", profileIds),
        supabase
          .from("psychologist_therapy_approaches")
          .select("psychologist_id, therapy_approach:therapy_approaches(id, name)")
          .in("psychologist_id", profileIds),
      ]);

      if (specialtiesData.error) throw specialtiesData.error;
      if (languagesData.error) throw languagesData.error;
      if (approachesData.error) throw approachesData.error;

      const specialtiesMap = new Map<string, any[]>();
      specialtiesData.data?.forEach((item: any) => {
        if (!specialtiesMap.has(item.psychologist_id)) specialtiesMap.set(item.psychologist_id, []);
        specialtiesMap.get(item.psychologist_id)!.push(item.specialty);
      });

      const languagesMap = new Map<string, any[]>();
      languagesData.data?.forEach((item: any) => {
        if (!languagesMap.has(item.psychologist_id)) languagesMap.set(item.psychologist_id, []);
        languagesMap.get(item.psychologist_id)!.push(item.language);
      });

      const approachesMap = new Map<string, any[]>();
      approachesData.data?.forEach((item: any) => {
        if (!approachesMap.has(item.psychologist_id)) approachesMap.set(item.psychologist_id, []);
        approachesMap.get(item.psychologist_id)!.push(item.therapy_approach);
      });

      const profiles: PsychologistProfile[] = (data || []).map((profile: any) => {
        const { total_count, ...profileData } = profile;
        return {
          ...profileData,
          specialties: specialtiesMap.get(profile.id) || [],
          languages: languagesMap.get(profile.id) || [],
          therapy_approaches: approachesMap.get(profile.id) || [],
        };
      });

      return { profiles, total, page, pageSize };
    },
  });
};

export const useSpecialties = () => {
  return useQuery({
    queryKey: ["specialties"],
    queryFn: async () => {
      const { data, error } = await supabase.from("specialties").select("*").order("name");
      if (error) throw error;
      return data;
    },
  });
};

export const useLanguages = () => {
  return useQuery({
    queryKey: ["languages"],
    queryFn: async () => {
      const { data, error } = await supabase.from("languages").select("*").order("name");
      if (error) throw error;
      return data;
    },
  });
};

export const useTherapyApproaches = () => {
  return useQuery({
    queryKey: ["therapy_approaches"],
    queryFn: async () => {
      const { data, error } = await supabase.from("therapy_approaches").select("*").order("name");
      if (error) throw error;
      return data;
    },
  });
};
