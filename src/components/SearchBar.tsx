import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const SearchBar = () => {
  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <Input
        type="text"
        placeholder="Search eco-friendly destinations..."
        className="pl-10 pr-4 py-6 text-lg rounded-full border-2 border-primary/20 focus:border-primary/40 transition-colors"
      />
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/60 w-5 h-5" />
    </div>
  );
};

export default SearchBar;