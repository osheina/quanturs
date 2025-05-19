
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// The argument will now be the raw debounced search string
export const useSearchPlaces = (debouncedSearchTerm: string) => {
  const { data: results, isLoading, error } = useQuery({
    queryKey: ["places", "gpt-search", debouncedSearchTerm], // Changed queryKey
    queryFn: async () => {
      if (!debouncedSearchTerm || debouncedSearchTerm.trim().length === 0) {
        console.log("useSearchPlaces: debouncedSearchTerm is empty, returning empty array.");
        return [];
      }

      console.log("useSearchPlaces: Calling gpt-search-places with query:", debouncedSearchTerm);
      const { data, error: functionError } = await supabase.functions.invoke(
        "gpt-search-places",
        { body: { query: debouncedSearchTerm } }
      );

      if (functionError) {
        console.error("useSearchPlaces: Error invoking gpt-search-places:", functionError);
        throw functionError;
      }
      
      console.log("useSearchPlaces: Received data from gpt-search-places:", data);
      // The function should return an array of places or an object with an error property
      if (data && Array.isArray(data)) {
        return data;
      } else if (data && data.error) {
         console.error("useSearchPlaces: Error from gpt-search-places function:", data.error);
         throw new Error(data.error);
      }
      
      return []; // Fallback if data is not in expected format
    },
    // Enable the query only if debouncedSearchTerm is a non-empty string
    enabled: typeof debouncedSearchTerm === 'string' && debouncedSearchTerm.trim().length > 0,
    staleTime: 1000 * 60 * 5, // Кешировать результаты на 5 минут
  });

  return { results, isLoading, error };
};
