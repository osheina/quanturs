
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useSearchPlaces = (searchTerm: string) => {
  const { data: results, isLoading, error } = useQuery({
    queryKey: ["places", searchTerm],
    queryFn: async () => {
      if (!searchTerm) return [];
      
      const { data, error } = await supabase
        .from("quanturs_places")
        .select("*")
        .or(`name.ilike.%${searchTerm}%,type.ilike.%${searchTerm}%,diet_tags.ilike.%${searchTerm}%`)
        .limit(50);

      if (error) throw error;
      return data || [];
    },
    enabled: !!searchTerm,
  });

  return { results, isLoading, error };
};
