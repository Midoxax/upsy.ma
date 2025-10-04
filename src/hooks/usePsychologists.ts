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
      // Use database function for server-side filtering
      const { data, error } = await supabase.rpc("search_psychologists", {
        p_specialties: filters.specialties.length > 0 ? filters.specialties : [],
        p_languages: filters.languages.length > 0 ? filters.languages : [],
        p_city: filters.city || null,
        p_online: filters.online || null,
        p_in_person: filters.inPerson || null,
        p_min_price: filters.minPrice,
        p_max_price: filters.maxPrice,
        p_page: page,
        p_page_size: pageSize,
      });

      if (error) throw error;

      // Get total count from first row (all rows have same count)
      const total = data && data.length > 0 ? Number(data[0].total_count) : 0;

      // Now fetch specialties and languages for each profile
      const profileIds = data?.map((p: any) => p.id) || [];
      
      if (profileIds.length === 0) {
        return {
          profiles: [],
          total: 0,
          page,
          pageSize,
        };
      }

      // Fetch junction table data
      const [specialtiesData, languagesData] = await Promise.all([
        supabase
          .from("psychologist_specialties")
          .select(`
            psychologist_id,
            specialty:specialties(id, name)
          `)
          .in("psychologist_id", profileIds),
        supabase
          .from("psychologist_languages")
          .select(`
            psychologist_id,
            language:languages(id, name)
          `)
          .in("psychologist_id", profileIds),
      ]);

      if (specialtiesData.error) throw specialtiesData.error;
      if (languagesData.error) throw languagesData.error;

      // Build lookup maps
      const specialtiesMap = new Map<string, any[]>();
      specialtiesData.data?.forEach((item: any) => {
        if (!specialtiesMap.has(item.psychologist_id)) {
          specialtiesMap.set(item.psychologist_id, []);
        }
        specialtiesMap.get(item.psychologist_id)!.push(item.specialty);
      });

      const languagesMap = new Map<string, any[]>();
      languagesData.data?.forEach((item: any) => {
        if (!languagesMap.has(item.psychologist_id)) {
          languagesMap.set(item.psychologist_id, []);
        }
        languagesMap.get(item.psychologist_id)!.push(item.language);
      });

      // Transform data to match PsychologistProfile interface
      const profiles: PsychologistProfile[] = (data || []).map((profile: any) => {
        const { total_count, ...profileData } = profile;
        return {
          ...profileData,
          specialties: specialtiesMap.get(profile.id) || [],
          languages: languagesMap.get(profile.id) || [],
        };
      });

      return {
        profiles,
        total,
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
