import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import RestaurantCard from "@/components/RestaurantCard";

import { useState, useRef, useEffect } from "react";
import { useSearchPlaces } from "@/hooks/useSearchPlaces";

const SearchBar = () => {
  /* ────────── state ────────── */
  const [term, setTerm]                 = useState("");
  const [debounced, setDebounced]       = useState("");
  const inputRef    = useRef<HTMLInputElement>(null);
  const resultsRef  = useRef<HTMLDivElement>(null);

  /* ───── debounce (400 ms) ───── */
  useEffect(() => {
    const t = setTimeout(() => setDebounced(term.trim()), 400);
    return () => clearTimeout(t);
  }, [term]);

  /* ───── tokenize search ───── */
  const tokens = debounced
    .split(/\s+/)
    .filter(t => t.length >= 2)
    .slice(0, 5);

  const { results, isLoading, error } = useSearchPlaces(tokens);

  /* ───── submit ───── */
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDebounced(term.trim());
    inputRef.current?.blur();

    // прокрутка к итогам
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth" }), 120);
  };

  const clear = () => {
    setTerm("");
    setDebounced("");
  };

  const showNoHits   = debounced && !isLoading && (!results || results.length === 0);
  const showTooMany  = tokens.length >= 3 && showNoHits;

  /* ───── UI ───── */
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* search field */}
      <form onSubmit={onSubmit} className="relative flex gap-2">
        <div className="relative flex-1">
          <Input
            ref={inputRef}
            type="search"
            value={term}
            onChange={e => setTerm(e.target.value)}
            placeholder='Try "vegan brunch LA" or "eco hotel Malibu"...'
            className="pl-10 pr-4 py-6 text-lg rounded-full border-2 border-primary/20 focus:border-primary/40"
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
          onClick={clear}
          aria-label="Clear search"
          className="rounded-full"
        >
          <X className="w-5 h-5" />
        </Button>
      </form>

      {/* results */}
      {debounced && (
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
                <p className="mt-2 text-red-500 text-sm">{error.message}</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
