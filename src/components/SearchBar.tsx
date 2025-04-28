import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import RestaurantCard from "@/components/RestaurantCard";
import { useSearchPlaces } from "@/hooks/useSearchPlaces";

import { useState, useRef, useEffect } from "react";

const getImageUrl = (type: string) => {
  const randomId = Math.floor(Math.random() * 1000);
  switch (type) {
    case 'cafe':
      return `https://source.unsplash.com/random/800x600/?vegan,cafe,brunch&sig=${randomId}`;
    case 'hotel':
      return `https://source.unsplash.com/random/800x600/?eco,hotel,retreat&sig=${randomId}`;
    case 'park':
      return `https://source.unsplash.com/random/800x600/?hidden,trail,park&sig=${randomId}`;
    case 'market':
      return `https://source.unsplash.com/random/800x600/?organic,market,local&sig=${randomId}`;
    default:
      return `https://source.unsplash.com/random/800x600/?travel,nature&sig=${randomId}`;
  }
};

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debounced, setDebounced]   = useState("");
  const inputRef    = useRef<HTMLInputElement>(null);
  const resultsRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(searchTerm.trim()), 400);
    return () => clearTimeout(t);
  }, [searchTerm]);

  const tokens = debounced
    .split(/\s+/)
    .filter(t => t.length >= 2)
    .slice(0, 5);

  const { results, isLoading, error } = useSearchPlaces(tokens);

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
  const showTooMany = tokens.length >= 3 && showNoHits;

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
          className="mt-8 animate-fade-in max-h-[70vh] overflow-y-auto pr-1 scrollbar-thin rounded-xl backdrop-blur-sm bg-black/20"
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
          ) : results && results.length ? (
            <>
              <h2 className="text-xl font-semibold mb-6">
                Found&nbsp;{results.length}&nbsp;spot{results.length > 1 && "s"}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map(p => (
                  <RestaurantCard
                    key={p.id}
                    image={getImageUrl(p.type)}
                    name={p.name ?? ""}
                    cuisine={p.type}
                    rating={4.5}
                    priceRange="$$$"
                    description={p.notes ?? ""}
                    location={p.location ?? ""}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-gray-200">
              {showTooMany
                ? "No matches — try fewer keywords"
                : "No matches found"}
              {error && <p className="mt-2 text-red-400 text-sm">{error.message}</p>}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
