
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
        // Build an AND query where each token must find a match in at least one of its OR conditions
        const andFilterConditions = searchTerms
          .map(token => {
            // For each token, create an OR group for different fields
            // Ensure token is not empty and is a string before using ilike
            const cleanedToken = String(token || "").trim();
            if (cleanedToken === "") return null; // Skip empty tokens
            return `or(name.ilike.%${cleanedToken}%,type.ilike.%${cleanedToken}%,location.ilike.%${cleanedToken}%,diet_tags.ilike.%${cleanedToken}%)`;
          })
          .filter(condition => condition !== null) // Remove nulls from empty tokens
          .join(','); // Joins the OR groups with AND when passed to .and()

        if (andFilterConditions.length > 0) {
          queryBuilder = queryBuilder.and(andFilterConditions); // Apply .and() to the builder
          console.log("Search query with token groups (AND logic):", andFilterConditions);
        } else {
          // If all tokens were empty after cleaning, return empty results
          return [];
        }
        
      } else if (typeof searchTerms === 'string' && searchTerms.trim().length > 0) {
        const cleanedSearchTerm = searchTerms.trim();
        // Legacy support for single string search, apply OR across fields for this single string
        queryBuilder = queryBuilder.or(`name.ilike.%${cleanedSearchTerm}%,type.ilike.%${cleanedSearchTerm}%,location.ilike.%${cleanedSearchTerm}%,diet_tags.ilike.%${cleanedSearchTerm}%`); // Apply .or() to the builder
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
