import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PsychologistProfile } from "@/types/psychologist";

export const usePsychologistProfile = (id: string) => {
  return useQuery({
    queryKey: ["psychologist", id],
    queryFn: async () => {
      const { data, error } = await supabase
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
        .eq("id", id)
        .eq("is_published", true)
        .single();

      if (error) throw error;
      if (!data) throw new Error("Psychologist not found");

      // Transform data to match PsychologistProfile interface
      const profile: PsychologistProfile = {
        ...data,
        specialties: data.psychologist_specialties?.map((ps: any) => ps.specialty) || [],
        languages: data.psychologist_languages?.map((pl: any) => pl.language) || [],
      };

      return profile;
    },
  });
};
