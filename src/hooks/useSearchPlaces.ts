
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useSearchPlaces = (searchTerms: string[] | string) => {
  const { data: results, isLoading, error } = useQuery({
    queryKey: ["places", searchTerms],
    queryFn: async () => {
      if (!searchTerms) {
        return [];
      }

      let queryBuilder = supabase
        .from("quanturs_places")
        .select("*");

      if (Array.isArray(searchTerms)) {
        const cleanedTokens = searchTerms
          .map(token => String(token || "").trim())
          .filter(token => token !== "");

        if (cleanedTokens.length === 0) {
          return []; // Нет валидных токенов для поиска
        }

        // Apply an OR filter group for each token, and chain them (implicit AND)
        cleanedTokens.forEach(token => {
          const searchPattern = `%${token}%`;
          const orFilterForToken = `or(name.ilike.${searchPattern},type.ilike.${searchPattern},location.ilike.${searchPattern},diet_tags.ilike.${searchPattern})`;
          queryBuilder = queryBuilder.filter(orFilterForToken);
        });
        
        console.log("Search query (array of tokens - AND logic using chained filters):", cleanedTokens);

      } else if (typeof searchTerms === 'string' && searchTerms.trim().length > 0) {
        const cleanedSearchTerm = searchTerms.trim();
        // Для одной строки применяем ИЛИ по полям
        const searchPattern = `%${cleanedSearchTerm}%`;
        queryBuilder = queryBuilder
          .or(`name.ilike.${searchPattern},type.ilike.${searchPattern},location.ilike.${searchPattern},diet_tags.ilike.${searchPattern}`);
        
        console.log("Search query (single string - OR logic):", cleanedSearchTerm);
      } else {
        // Если searchTerms - пустая строка (после Array.isArray) или невалидный тип
        return [];
      }
      
      // Применяем лимит и выполняем запрос
      const { data, error: queryError } = await queryBuilder.limit(50);
      
      if (queryError) {
        console.error("Supabase search error:", queryError);
        throw queryError;
      }
      
      console.log("Search results:", data?.length || 0, "items found");
      return data || [];
    },
    enabled: !!searchTerms && (
      (typeof searchTerms === 'string' && searchTerms.trim().length > 0) ||
      (Array.isArray(searchTerms) && searchTerms.filter(t => String(t || "").trim() !== "").length > 0)
    ),
    staleTime: 1000 * 60 * 5, // Кешировать результаты на 5 минут
  });

  return { results, isLoading, error };
};

