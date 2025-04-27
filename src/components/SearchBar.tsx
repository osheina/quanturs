import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import { useSearchPlaces } from "@/hooks/useSearchPlaces";
import { Skeleton } from "@/components/ui/skeleton";
import RestaurantCard from "@/components/RestaurantCard";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const inputRef    = useRef<HTMLInputElement>(null);
  const resultsRef  = useRef<HTMLDivElement>(null);

  /* 1. ───────────────   Debounce & Tokenize   ─────────────── */
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearchTerm(searchTerm.trim()), 400);
    return () => clearTimeout(t);
  }, [searchTerm]);

  const tokens = debouncedSearchTerm
    .split(/\s+/)
    .filter(t => t.length >= 2)
    .slice(0, 5);

  const { results, isLoading, error } = useSearchPlaces(tokens);

  /* 2. ──────────────   Submit handler   ───────────────────── */
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDebouncedSearchTerm(searchTerm.trim());
    inputRef.current?.blur();
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth" }), 120);
  };

  /* 3. ────────────   Helpers   ────────────────────────────── */
  const clearSearch = () => {
    setSearchTerm("");
    setDebouncedSearchTerm("");
  };

  const showNoHits = debouncedSearchTerm && !isLoading && (!results || results.length === 0);
  const showTooMany = tokens.length >= 3 && showNoHits;

  /* 4. ────────────   UI   ─────────────────────────────────── */
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Search field */}
      <form onSubmit={onSubmit} className="relative flex gap-2">
        <div className="relative flex-1">
          <Input
            ref={inputRef}
            type="search"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder='Try "vegan brunch LA" or "eco hotel Malibu"...'
            className="pl-10 pr-4 py-6 text-lg rounded-full border-2 border-primary/20 focus:border-primary/40 transition-colors"
            autoComplete="off"
            spellCheck={false}
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/60 w-5 h-5 pointer-events-none" />
        </div>

        <Button type="submit" className="rounded-full px-6">Search</Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={clearSearch}
          aria-label="Clear search"
          className="rounded-full"
        >
          <X className="w-5 h-5" />
        </Button>
      </form>

      {/* Results */}
      {debouncedSearchTerm && (
        <div ref={resultsRef} className="mt-8 animate-fade-in">
          {isLoading ? (
            /* skeletons */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-48 w-full rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : results && results.length > 0 ? (
            <>
              <h2 className="text-xl font-semibold mb-6">
                Found&nbsp;{results.length}&nbsp;spot{results.length > 1 && "s"}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map(p => (
                  <RestaurantCard
                    key={p.id}
                    image="https://images.unsplash.com/photo-1554679665-f5537f187268"
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
            <div className="text-center py-12 text-gray-600">
              {showTooMany
                ? "No matches — try fewer keywords"
                : "No matches found"}
              {error && (
                <p className="mt-2 text-red-500 text-sm">
                  {error.message}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
