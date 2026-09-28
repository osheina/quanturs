import { ArrowDownRight } from "lucide-react";
import coast from "@/assets/california-coast-editorial.jpg";

const HeroSection = () => (
  <section className="relative isolate flex min-h-[320px] items-center overflow-hidden md:min-h-[490px]">
    <img src={coast} alt="Sunlit California coastline and a winding coastal path" width={1536} height={1024} className="absolute inset-0 h-full w-full object-cover object-center" />
    <div className="absolute inset-0" style={{ background: "var(--hero-veil)" }} />
    <div className="relative mx-auto w-full max-w-7xl px-6 py-9 text-primary-foreground md:px-10 md:py-12">
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] md:mb-6">THE TRAVEL JOURNAL · CALIFORNIA EDITION</p>
      <h1 className="max-w-3xl text-5xl font-bold leading-[1.08] sm:text-6xl md:text-7xl">Quanturs<span className="text-accent">.</span><br /><span className="text-3xl font-medium sm:text-5xl md:text-6xl">Go your own way.</span></h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed md:mt-7 md:text-lg">An itinerary shaped by your interests, your pace, and real places from our travel catalog.</p>
      <a href="#create-guide" className="mt-5 inline-flex items-center gap-3 border-b border-primary-foreground pb-2 text-sm font-semibold transition-colors hover:text-accent focus-visible:ring-2 focus-visible:ring-ring md:mt-8">Create your itinerary <ArrowDownRight className="h-4 w-4" /></a>
    </div>
    <span className="absolute bottom-4 right-6 hidden text-xs uppercase tracking-[0.16em] text-primary-foreground md:block">California coast · A place to begin</span>
  </section>
);
export default HeroSection;
