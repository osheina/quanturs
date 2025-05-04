
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
          <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#F2FCE2] to-[#E5DEFF]">
            <header className="bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] py-4 shadow-md">
              <div className="container mx-auto px-4 flex justify-between items-center">
                <h1 className="text-white text-2xl font-bold">EcoTravel</h1>
                <nav>
                  <ul className="flex space-x-6">
                    <li><a href="/" className="text-white hover:text-[#FDE1D3] transition-colors">Home</a></li>
                    <li><a href="/vr-experiences" className="text-white hover:text-[#FDE1D3] transition-colors">VR Experiences</a></li>
                  </ul>
                </nav>
              </div>
            </header>
            
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/vr-experiences" element={<VRExperiences />} />
              </Routes>
            </main>

            <footer className="bg-[#1A1F2C] text-white py-6">
              <div className="container mx-auto px-4 text-center">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3">EcoTravel</h3>
                    <p className="text-[#C8C8C9]">Sustainable, AI-powered travel experiences tailored to your values.</p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Quick Links</h3>
                    <ul className="space-y-2">
                      <li><a href="/" className="text-[#C8C8C9] hover:text-white">Home</a></li>
                      <li><a href="/vr-experiences" className="text-[#C8C8C9] hover:text-white">VR Experiences</a></li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Contact</h3>
                    <p className="text-[#C8C8C9]">info@ecotravel.com</p>
                    <p className="text-[#C8C8C9]">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="border-t border-gray-700 pt-4">
                  &copy; {new Date().getFullYear()} EcoTravel. All rights reserved.
                </div>
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
