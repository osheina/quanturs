import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import RestaurantCard from "@/components/RestaurantCard";
import { useSearchPlaces } from "@/hooks/useSearchPlaces";
import { Database } from "@/integrations/supabase/types"; // Import Database types
import { useState, useRef, useEffect } from "react";

type Place = Database['public']['Tables']['quanturs_places']['Row'];

interface GroupedResults {
  [type: string]: Place[];
}

const groupResultsByType = (results: Place[]): GroupedResults => {
  if (!results) return {};
  return results.reduce((acc, place) => {
    const type = place.type || "Other"; // Default to "Other" if type is null/undefined
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(place);
    return acc;
  }, {} as GroupedResults);
};

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debounced, setDebounced] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(searchTerm.trim()), 400);
    return () => clearTimeout(t);
  }, [searchTerm]);

  const { results, isLoading, error } = useSearchPlaces(debounced);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDebounced(searchTerm.trim());
    inputRef.current?.blur();
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 120);
  };

  const clear = () => {
    setSearchTerm("");
    setDebounced("");
  };

  const showNoHits = debounced && !isLoading && (!results || results.length === 0);
  const groupedResults = results ? groupResultsByType(results) : {};
  const groupKeys = Object.keys(groupedResults);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <form onSubmit={onSubmit} className="relative flex gap-2">
        <div className="relative flex-1">
          <Input
            ref={inputRef}
            type="search"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder='Try "vegan brunch LA" or "eco hotel Malibu"...'
            className="pl-10 pr-4 py-6 text-lg rounded-full border-2 border-primary/20 focus:border-primary/40"
            autoComplete="off"
            spellCheck={false}
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/60 w-5 h-5 pointer-events-none" />
        </div>

        <Button type="submit" className="rounded-full px-6">Search</Button>
        <Button variant="ghost" size="icon" onClick={clear} className="rounded-full" aria-label="Clear">
          <X className="w-5 h-5" />
        </Button>
      </form>

      {debounced && (
        <div
          ref={resultsRef}
          className="mt-8 animate-fade-in max-h-[70vh] overflow-y-auto pr-1 scrollbar-thin rounded-xl backdrop-blur-sm bg-black/20 p-4 md:p-6" // Added padding
        >
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-48 w-full rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : groupKeys.length > 0 ? (
            <>
              <h2 className="text-xl font-semibold mb-6">
                Found&nbsp;{results?.length}&nbsp;spot{results && results.length > 1 ? "s" : ""}
              </h2>
              {groupKeys.map(type => (
                <div key={type} className="mb-8">
                  <h3 className="text-lg font-medium capitalize mb-4 pb-2 border-b border-primary/20">{type} ({groupedResults[type].length})</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groupedResults[type].map(p => (
                      <RestaurantCard
                        key={p.id}
                        image={p.image_url}
                        name={p.name ?? ""}
                        cuisine={p.type ?? "Unknown Type"} // Use type as cuisine
                        rating={4.5} // Placeholder
                        priceRange="$$$" // Placeholder
                        description={p.notes ?? ""}
                        location={p.location ?? ""}
                        co2_kg={p.co2_kg ?? undefined}
                        co2_rating={p.co2_rating ?? undefined}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="text-center py-12 text-gray-200">
              No matches found
              {error && <p className="mt-2 text-red-400 text-sm">{error.message}</p>}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
