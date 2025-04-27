
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useSearchPlaces = (searchTerms: string[] | string) => {
  const { data: results, isLoading, error } = useQuery({
    queryKey: ["places", searchTerms],
    queryFn: async () => {
      if (!searchTerms || (Array.isArray(searchTerms) && searchTerms.length === 0)) {
        return [];
      }
      
      let query = supabase
        .from("quanturs_places")
        .select("*")
        .limit(50);
      
      // Handle tokenized search
      if (Array.isArray(searchTerms) && searchTerms.length > 0) {
        // Build a complex OR query for all tokens
        const orConditions = searchTerms.map(token => {
          return `name.ilike.%${token}%,type.ilike.%${token}%,location.ilike.%${token}%,diet_tags.ilike.%${token}%`
        }).join(',');
        
        query = query.or(orConditions);
        console.log("Search query with tokens:", orConditions);
      } else if (typeof searchTerms === 'string') {
        // Legacy support for single string search
        query = query.or(`name.ilike.%${searchTerms}%,type.ilike.%${searchTerms}%,diet_tags.ilike.%${searchTerms}%`);
        console.log("Search query with string:", searchTerms);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error("Supabase search error:", error);
        throw error;
      }
      
      console.log("Search results:", data?.length || 0, "items found");
      return data || [];
    },
    enabled: !!searchTerms && (typeof searchTerms === 'string' ? searchTerms.length > 0 : searchTerms.length > 0),
    staleTime: 1000 * 60 * 5, // Cache results for 5 minutes
  });

  return { results, isLoading, error };
};
