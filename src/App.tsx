
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import VRExperiences from "./pages/VRExperiences";

// Create a client for React Query
const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
          <div className="min-h-screen flex flex-col">
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/vr-experiences" element={<VRExperiences />} />
              </Routes>
            </main>

            <footer className="bg-gray-800 text-white py-4">
              <div className="container mx-auto px-4 text-center">
                &copy; {new Date().getFullYear()} EcoTravel. All rights reserved.
              </div>
            </footer>
          </div>
          
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
