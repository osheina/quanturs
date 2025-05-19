
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useSearchPlaces = (searchTerms: string[] | string) => {
  const { data: results, isLoading, error } = useQuery({
    queryKey: ["places", searchTerms],
    queryFn: async () => {
      if (!searchTerms || (Array.isArray(searchTerms) && searchTerms.length === 0)) {
        return [];
      }
      
      // Start with the base query builder
      let queryBuilder = supabase
        .from("quanturs_places")
        .select("*");
      
      if (Array.isArray(searchTerms) && searchTerms.length > 0) {
        // For array of search terms, we'll process them correctly
        const cleanedTokens = searchTerms
          .map(token => String(token || "").trim())
          .filter(token => token !== "");
          
        if (cleanedTokens.length === 0) {
          return [];
        }
        
        // Apply filters correctly for each search term (AND logic between terms)
        cleanedTokens.forEach(token => {
          // Use proper PostgreSQL syntax for OR conditions within ilike filters
          const searchPattern = `%${token}%`;
          queryBuilder = queryBuilder
            .or(`name.ilike.${searchPattern},type.ilike.${searchPattern},location.ilike.${searchPattern},diet_tags.ilike.${searchPattern}`);
        });
        
        console.log("Search query with token groups (AND logic):", cleanedTokens);
        
      } else if (typeof searchTerms === 'string' && searchTerms.trim().length > 0) {
        const cleanedSearchTerm = searchTerms.trim();
        // Legacy support for single string search, apply OR across fields for this single string
        const searchPattern = `%${cleanedSearchTerm}%`;
        queryBuilder = queryBuilder
          .or(`name.ilike.${searchPattern},type.ilike.${searchPattern},location.ilike.${searchPattern},diet_tags.ilike.${searchPattern}`);
        
        console.log("Search query with single string (OR logic):", cleanedSearchTerm);
      } else {
        // If searchTerms is an empty string or invalid, return empty
        return [];
      }
      
      // Apply limit at the end and then execute the query
      const { data, error: queryError } = await queryBuilder.limit(50);
      
      if (queryError) {
        console.error("Supabase search error:", queryError);
        throw queryError;
      }
      
      console.log("Search results:", data?.length || 0, "items found");
      return data || [];
    },
    enabled: !!searchTerms && (typeof searchTerms === 'string' ? searchTerms.trim().length > 0 : searchTerms.filter(t => String(t || "").trim() !== "").length > 0),
    staleTime: 1000 * 60 * 5, // Cache results for 5 minutes
  });

  return { results, isLoading, error };
};
