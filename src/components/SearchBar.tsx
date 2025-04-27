
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useSearchPlaces } from "@/hooks/useSearchPlaces";
import { Skeleton } from "@/components/ui/skeleton";
import RestaurantCard from "@/components/RestaurantCard";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const { results, isLoading, error } = useSearchPlaces(debouncedSearchTerm);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setDebouncedSearchTerm(searchTerm);
  };

  const handleClear = () => {
    setSearchTerm("");
    setDebouncedSearchTerm("");
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <form onSubmit={handleSubmit} className="relative flex gap-2">
        <div className="relative flex-1">
          <Input
            type="search"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search vegan brunch, hikes, eco hotels..."
            className="pl-10 pr-4 py-6 text-lg rounded-full border-2 border-primary/20 focus:border-primary/40 transition-colors"
            autoComplete="off"
            spellCheck="false"
            lang="en"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/60 w-5 h-5 pointer-events-none" />
        </div>
        <Button 
          type="submit" 
          variant="default" 
          className="rounded-full px-6"
        >
          Search
        </Button>
        <Button 
          variant="ghost"
          size="icon"
          onClick={handleClear}
          className="rounded-full"
          type="button"
          aria-label="Clear search"
        >
          <X className="w-5 h-5" />
        </Button>
      </form>

      {debouncedSearchTerm && (
        <div className="relative z-20 mt-8 fade-in">
          {isLoading && debouncedSearchTerm ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-48 w-full rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : results && results.length > 0 ? (
            <>
              <h2 className="text-xl font-semibold mb-6">Found {results.length} spots</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((place) => (
                  <RestaurantCard
                    key={place.id}
                    image="https://images.unsplash.com/photo-1554679665-f5537f187268"
                    name={place.name || ""}
                    cuisine={place.type}
                    rating={4.5}
                    priceRange="$$$"
                    description={place.notes || ""}
                    location={place.location || ""}
                  />
                ))}
              </div>
            </>
          ) : debouncedSearchTerm ? (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600">No matches found</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
